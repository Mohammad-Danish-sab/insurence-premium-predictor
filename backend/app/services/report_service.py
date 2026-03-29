from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from datetime import datetime
import io


# COLOR PALETTE
PRIMARY    = colors.HexColor("#1E3A5F")   # dark blue
SECONDARY  = colors.HexColor("#2E86AB")  # light blue
ACCENT     = colors.HexColor("#F4A261")  # orange
SUCCESS    = colors.HexColor("#2DC653")  # green
DANGER     = colors.HexColor("#E63946")  # red
LIGHT_GRAY = colors.HexColor("#F5F5F5")
WHITE      = colors.white


# GENERATE PDF REPORT

def generate_pdf_report(user: dict, input_data: dict, result: dict) -> bytes:
    buffer = io.BytesIO()
    doc    = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=0.75 * inch,
        leftMargin=0.75 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.75 * inch
    )

    styles  = getSampleStyleSheet()
    content = []

    #  HEADER 
    content.append(Paragraph(
        "🛡️ Insurance Premium Report",
        ParagraphStyle("title", fontSize=22, textColor=PRIMARY,
                       alignment=TA_CENTER, fontName="Helvetica-Bold")
    ))
    content.append(Spacer(1, 6))
    content.append(Paragraph(
        f"Generated on {datetime.utcnow().strftime('%d %B %Y, %H:%M UTC')}",
        ParagraphStyle("sub", fontSize=9, textColor=colors.gray, alignment=TA_CENTER)
    ))
    content.append(Spacer(1, 10))
    content.append(HRFlowable(width="100%", thickness=2, color=PRIMARY))
    content.append(Spacer(1, 14))

    # USER INFO 
    content.append(Paragraph("👤 Applicant Details",
        ParagraphStyle("h2", fontSize=13, textColor=PRIMARY, fontName="Helvetica-Bold")))
    content.append(Spacer(1, 6))

    user_data = [
        ["Full Name",   user.get("full_name", "—")],
        ["Email",       user.get("email", "—")],
        ["Phone",       user.get("phone", "—")],
        ["Report Date", datetime.utcnow().strftime("%d-%m-%Y")],
    ]
    content.append(_build_table(user_data))
    content.append(Spacer(1, 14))

    # INPUT SUMMARY 
    content.append(Paragraph("📋 Input Summary",
        ParagraphStyle("h2", fontSize=13, textColor=PRIMARY, fontName="Helvetica-Bold")))
    content.append(Spacer(1, 6))

    input_table_data = [
        ["Age",              f"{input_data.get('age')} years"],
        ["Gender",           input_data.get('sex', '—').capitalize()],
        ["BMI",              f"{input_data.get('bmi')}"],
        ["Children",         str(input_data.get('children', 0))],
        ["Smoker",           "Yes" if input_data.get('smoker') else "No"],
        ["Region",           input_data.get('region', '—').capitalize()],
        ["Insurance Type",   input_data.get('insurance_type', '—').capitalize()],
    ]
    content.append(_build_table(input_table_data))
    content.append(Spacer(1, 14))

    # PREDICTION RESULT 
    content.append(Paragraph("💰 Prediction Result",
        ParagraphStyle("h2", fontSize=13, textColor=PRIMARY, fontName="Helvetica-Bold")))
    content.append(Spacer(1, 6))

    premium       = result.get("predicted_premium", 0)
    risk_score    = result.get("risk_score", 0)
    risk_level    = result.get("risk_level", "—")
    conf          = result.get("confidence_range", {})
    risk_color    = _risk_color(risk_level)

    result_data = [
        ["Predicted Premium",  f"₹ {premium:,.2f}"],
        ["Confidence Range",   f"₹ {conf.get('min', 0):,.2f}  —  ₹ {conf.get('max', 0):,.2f}"],
        ["Risk Score",         f"{risk_score} / 100"],
        ["Risk Level",         risk_level],
    ]
    content.append(_build_table(result_data, highlight_col1_color=risk_color))
    content.append(Spacer(1, 14))

    # TOP FACTORS
    content.append(Paragraph("📊 Top Factors Affecting Premium",
        ParagraphStyle("h2", fontSize=13, textColor=PRIMARY, fontName="Helvetica-Bold")))
    content.append(Spacer(1, 6))

    factors = result.get("top_factors", [])
    factor_rows = [["Factor", "Impact", "Effect"]]
    for f in factors:
        factor_rows.append([
            f.get("factor", "—"),
            f.get("impact", "—"),
            f.get("direction", "—").capitalize()
        ])

    content.append(_build_header_table(factor_rows))
    content.append(Spacer(1, 14))

    # PLAN COMPARISON 
    content.append(Paragraph("📦 Plan Comparison",
        ParagraphStyle("h2", fontSize=13, textColor=PRIMARY, fontName="Helvetica-Bold")))
    content.append(Spacer(1, 6))

    plans = result.get("plan_comparison", {})
    plan_rows = [["", "Basic", "Standard", "Premium"]]
    plan_rows.append(["Premium (₹)",
        f"₹ {plans.get('basic', {}).get('premium', 0):,.2f}",
        f"₹ {plans.get('standard', {}).get('premium', 0):,.2f}",
        f"₹ {plans.get('premium', {}).get('premium', 0):,.2f}",
    ])
    plan_rows.append(["Coverage (₹)",
        f"₹ {plans.get('basic', {}).get('coverage_amount', 0):,}",
        f"₹ {plans.get('standard', {}).get('coverage_amount', 0):,}",
        f"₹ {plans.get('premium', {}).get('coverage_amount', 0):,}",
    ])
    plan_rows.append(["Deductible (₹)",
        f"₹ {plans.get('basic', {}).get('deductible', 0):,}",
        f"₹ {plans.get('standard', {}).get('deductible', 0):,}",
        f"₹ {plans.get('premium', {}).get('deductible', 0):,}",
    ])

    content.append(_build_header_table(plan_rows))
    content.append(Spacer(1, 14))

    # RECOMMENDATION
    content.append(Paragraph("💡 Recommendation",
        ParagraphStyle("h2", fontSize=13, textColor=PRIMARY, fontName="Helvetica-Bold")))
    content.append(Spacer(1, 6))
    content.append(Paragraph(
        result.get("recommendation", "—"),
        ParagraphStyle("body", fontSize=10, textColor=colors.black, leading=16)
    ))
    content.append(Spacer(1, 20))

    # FOOTER 
    content.append(HRFlowable(width="100%", thickness=1, color=colors.lightgrey))
    content.append(Spacer(1, 6))
    content.append(Paragraph(
        "This report is auto-generated by InsurePredict. For queries contact support@insurepredict.com",
        ParagraphStyle("footer", fontSize=8, textColor=colors.gray, alignment=TA_CENTER)
    ))

    doc.build(content)
    buffer.seek(0)
    return buffer.read()


# HELPER — Simple 2-col table

def _build_table(data: list, highlight_col1_color=None) -> Table:
    table = Table(data, colWidths=[2.2 * inch, 4.0 * inch])
    style = [
        ("BACKGROUND",  (0, 0), (0, -1), LIGHT_GRAY),
        ("TEXTCOLOR",   (0, 0), (0, -1), PRIMARY),
        ("FONTNAME",    (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE",    (0, 0), (-1, -1), 10),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [WHITE, LIGHT_GRAY]),
        ("GRID",        (0, 0), (-1, -1), 0.4, colors.lightgrey),
        ("PADDING",     (0, 0), (-1, -1), 7),
    ]
    table.setStyle(TableStyle(style))
    return table


# HELPER — Header table (for factors, plans)

def _build_header_table(data: list) -> Table:
    table = Table(data)
    style = [
        ("BACKGROUND",  (0, 0), (-1, 0), PRIMARY),
        ("TEXTCOLOR",   (0, 0), (-1, 0), WHITE),
        ("FONTNAME",    (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",    (0, 0), (-1, -1), 10),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [WHITE, LIGHT_GRAY]),
        ("GRID",        (0, 0), (-1, -1), 0.4, colors.lightgrey),
        ("PADDING",     (0, 0), (-1, -1), 7),
        ("ALIGN",       (1, 0), (-1, -1), "CENTER"),
    ]
    table.setStyle(TableStyle(style))
    return table


# HELPER — Risk level color

def _risk_color(risk_level: str):
    return {
        "Low":       SUCCESS,
        "Medium":    ACCENT,
        "High":      DANGER,
        "Very High": colors.HexColor("#800000")
    }.get(risk_level, colors.black)