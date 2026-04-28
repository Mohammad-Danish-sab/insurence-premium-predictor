import { useState } from "react";
import { formatINR } from "../utils/formatCurrency";
import {
  Star,
  ExternalLink,
  Shield,
  Award,
  CheckCircle,
  TrendingUp,
  Phone,
  ChevronDown,
} from "lucide-react";

const ALL_COMPANIES = [
  {
    id: 1,
    name: "Star Health Insurance",
    logo: "⭐",
    color: "from-red-500 to-red-600",
    bg: "bg-red-50",
    border: "border-red-100",
    rating: 4.5,
    csr: 98.2,
    founded: 2006,
    types: ["health"],
    baseRate: 1.0,
    tagline: "India's Largest Health Insurer",
    features: [
      "6500+ network hospitals",
      "Cashless treatment",
      "No room rent limit",
      "Day care procedures",
    ],
    website: "https://www.starhealth.in",
    phone: "1800-425-2255",
    pros: ["Highest CSR", "Large network", "Quick claims"],
    cons: ["Slightly higher premium", "Limited OPD cover"],
    badge: "Most Trusted",
    badgeBg: "bg-red-100 text-red-700",
  },
  {
    id: 2,
    name: "HDFC Ergo Health",
    logo: "🏦",
    color: "from-blue-500 to-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    rating: 4.4,
    csr: 97.8,
    founded: 2002,
    types: ["health", "auto", "home"],
    baseRate: 0.95,
    tagline: "Complete Insurance Solutions",
    features: [
      "10000+ cashless hospitals",
      "Mental health coverage",
      "Global coverage available",
      "Zero waiting period add-on",
    ],
    website: "https://www.hdfcergo.com",
    phone: "1800-2700-700",
    pros: ["Large hospital network", "Digital claims", "24/7 support"],
    cons: ["Higher premium for seniors", "Complex policy terms"],
    badge: "Best Network",
    badgeBg: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    name: "Bajaj Allianz General",
    logo: "🦅",
    color: "from-orange-500 to-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100",
    rating: 4.3,
    csr: 96.5,
    founded: 2001,
    types: ["health", "auto", "home", "life"],
    baseRate: 0.92,
    tagline: "Trusted for 20+ Years",
    features: [
      "Health & wellness benefits",
      "Restoration benefit",
      "Critical illness cover",
      "OPD benefit available",
    ],
    website: "https://www.bajajallianz.com",
    phone: "1800-209-0144",
    pros: ["Affordable premium", "Good for families", "Wide coverage"],
    cons: ["Average claim speed", "Limited rural network"],
    badge: "Best Value",
    badgeBg: "bg-orange-100 text-orange-700",
  },
];

const getCompanyPremium = (company, basePremium) => {
  const variation = Math.random() * 0.1 - 0.05;
  return Math.round(basePremium * company.baseRate * (1 + variation));
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= Math.floor(rating)
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
      <span className="text-xs text-gray-500 ml-1">{rating}</span>
    </div>
  );
}

function CompanyCard({ company, premium, rank, input }) {
  const [expanded, setExpanded] = useState(false);

  const whatsappMsg = `Hi! I got a quote of ${formatINR(premium)}/year for ${
    input?.insurance_type
  } insurance from InsurePredict. I'm interested in ${
    company.name
  }. Can you help me?`;

  return (
    <div
      className={`bg-white rounded-3xl border-2 transition-all duration-200 overflow-hidden ${
        rank === 1
          ? "border-[#2E86AB] shadow-xl shadow-blue-50"
          : "border-gray-100 hover:border-gray-200 hover:shadow-md"
      }`}
    >
      {rank <= 3 && (
        <div
          className={`px-4 py-1.5 text-xs font-bold text-center ${
            rank === 1
              ? "bg-linear-to-r from-[#2E86AB] to-[#1E3A5F] text-white"
              : rank === 2
                ? "bg-linear-to-r from-gray-600 to-gray-700 text-white"
                : "bg-linear-to-r from-orange-500 to-orange-600 text-white"
          }`}
        >
          {rank === 1
            ? "🥇 BEST MATCH FOR YOU"
            : rank === 2
              ? "🥈 RUNNER UP"
              : "🥉 3RD BEST OPTION"}
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-2xl bg-linear-to-br ${company.color} flex items-center justify-center text-2xl shadow-lg`}
            >
              {company.logo}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#1E3A5F] text-sm">
                  {company.name}
                </h3>

                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${company.badgeBg}`}
                >
                  {company.badge}
                </span>
              </div>

              <p className="text-xs text-gray-400 mt-0.5">{company.tagline}</p>

              <StarRating rating={company.rating} />
            </div>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
              <span className="text-xs font-bold text-green-700">
                {company.csr}%
              </span>
            </div>

            <p className="text-xs text-gray-400 mt-1">CSR</p>
          </div>
        </div>

        <div
          className={`rounded-2xl p-4 mb-4 ${company.bg} ${company.border} border`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Estimated Annual Premium
              </p>

              <p className="text-2xl font-bold text-[#1E3A5F]">
                {formatINR(premium)}
              </p>

              <p className="text-xs text-gray-400">
                ≈ {formatINR(Math.round(premium / 12))}/month
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Founded</p>

              <p className="text-sm font-bold text-gray-700">
                {company.founded}
              </p>

              <p className="text-xs text-gray-400">
                {new Date().getFullYear() - company.founded}+ years
              </p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">
            KEY FEATURES
          </p>

          <div className="grid grid-cols-2 gap-1.5">
            {company.features.map((f, i) => (
              <div
                key={i}
                className="flex items-start gap-1.5 text-xs text-gray-600"
              >
                <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                {f}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-xs text-gray-500 hover:text-gray-700 transition mb-3"
        >
          <span>View Pros & Cons</span>

          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </button>

        {expanded && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-green-700 mb-2">
                ✅ Pros
              </p>

              {company.pros.map((p, i) => (
                <p key={i} className="text-xs text-green-600 mb-1">
                  • {p}
                </p>
              ))}
            </div>

            <div className="bg-red-50 rounded-xl p-3">
              <p className="text-xs font-semibold text-red-700 mb-2">❌ Cons</p>

              {company.cons.map((c, i) => (
                <p key={i} className="text-xs text-red-600 mb-1">
                  • {c}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <a
            href={company.website}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#2E86AB] hover:bg-[#1E3A5F] text-white text-xs font-semibold py-2.5 rounded-xl transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Visit Website
          </a>

          <a
            href={`https://wa.me/${company.phone.replace(
              /\D/g,
              "",
            )}?text=${encodeURIComponent(whatsappMsg)}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold py-2.5 rounded-xl transition"
          >
            WhatsApp Agent
          </a>

          <a
            href={`tel:${company.phone}`}
            className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-xl transition shrink-0"
            title={company.phone}
          >
            <Phone className="w-4 h-4 text-gray-600" />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function InsuranceCompanies({ result, input }) {
  const [showAll, setShowAll] = useState(false);

  if (!result) return null;

  const insuranceType = input?.insurance_type || "health";
  const basePremium = result.predicted_premium;

  const filtered = ALL_COMPANIES.filter((c) => c.types.includes(insuranceType))
    .map((c) => ({
      ...c,
      calculatedPremium: getCompanyPremium(c, basePremium),
    }))
    .sort((a, b) => {
      if (b.csr !== a.csr) return b.csr - a.csr;
      return b.rating - a.rating;
    });

  const displayed = showAll ? filtered : filtered.slice(0, 3);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-[#2E86AB]" />

            <h2 className="font-bold text-[#1E3A5F] text-xl">
              Recommended Insurance Companies
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            Top {filtered.length} companies for your{" "}
            <span className="font-semibold capitalize text-[#2E86AB]">
              {insuranceType}
            </span>{" "}
            insurance
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-xl">
          <Shield className="w-3.5 h-3.5" />
          IRDAI Approved
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {displayed.map((company, i) => (
          <CompanyCard
            key={company.id}
            company={company}
            premium={company.calculatedPremium}
            rank={i + 1}
            input={input}
          />
        ))}
      </div>

      {filtered.length > 3 && (
        <div className="text-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="inline-flex items-center gap-2 bg-white border-2 border-[#2E86AB] text-[#2E86AB] font-semibold px-6 py-3 rounded-2xl hover:bg-blue-50 transition"
          >
            {showAll
              ? "Show Less ↑"
              : `View All ${filtered.length} Companies ↓`}
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center mt-4">
        * Premiums are estimates. Final premium may vary based on underwriting.
      </p>
    </div>
  );
}
