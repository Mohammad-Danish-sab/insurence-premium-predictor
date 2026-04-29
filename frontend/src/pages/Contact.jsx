import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader,
  CheckCircle,
  MessageSquare,
  Clock,
  Shield,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";

    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    await new Promise((r) => setTimeout(r, 1500));

    setLoading(false);
    setSuccess(true);

    setForm({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const contacts = [
    {
      icon: <Mail className="w-6 h-6 text-[#2E86AB]" />,
      label: "Email Us",
      value: "support@insurepredict.com",
      sub: "We reply within 24 hours",
      bg: "bg-blue-50",
      href: "mailto:support@insurepredict.com",
    },
    {
      icon: <Phone className="w-6 h-6 text-green-600" />,
      label: "WhatsApp / Call",
      value: "+91 98765 43210",
      sub: "24/7 WhatsApp support",
      bg: "bg-green-50",
      href: "https://wa.me/919876543210",
    },
    {
      icon: <MapPin className="w-6 h-6 text-orange-600" />,
      label: "Visit Us",
      value: "New Delhi, India",
      sub: "Connaught Place, 110001",
      bg: "bg-orange-50",
      href: "#",
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      label: "Support Hours",
      value: "24/7 Available",
      sub: "WhatsApp anytime",
      bg: "bg-purple-50",
      href: "#",
    },
  ];

  const faqs = [
    {
      q: "How is premium calculated?",
      a: "We use real insurance industry factors like age, BMI, smoking status, region, and dependents.",
    },
    {
      q: "Is my data safe?",
      a: "Yes. All data is JWT secured and bcrypt encrypted. We never share your data.",
    },
    {
      q: "Can I download my report?",
      a: "Yes! After getting a quote, download a professional PDF from your History page.",
    },
    {
      q: "Is InsurePredict free?",
      a: "Completely free! No credit card needed. Sign up and start predicting instantly.",
    },
    {
      q: "Which insurance companies are shown?",
      a: "We show real Indian insurers like Star Health, HDFC Ergo, Bajaj Allianz, ICICI Lombard based on your profile.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <section className="bg-linear-to-br from-[#1E3A5F] via-[#2E86AB] to-[#1E3A5F] py-16 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-4xl font-bold mb-3">Get In Touch</h1>

          <p className="text-blue-200 mb-6">
            Have questions? We're here to help 24/7 via WhatsApp or email.
          </p>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-full transition shadow-lg"
          >
             Chat on WhatsApp
          </a>
        </div>
      </section>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {contacts.map((c, i) => (
            <a
              key={i}
              href={c.href}
              target="_blank"
              rel="noreferrer"
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center hover:shadow-md hover:-translate-y-1 transition block"
            >
              <div
                className={`w-12 h-12 ${c.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}
              >
                {c.icon}
              </div>

              <p className="text-xs text-gray-400 mb-1">{c.label}</p>

              <p className="text-sm font-bold text-[#1E3A5F]">{c.value}</p>

              <p className="text-xs text-gray-400 mt-1">{c.sub}</p>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-xl font-bold text-[#1E3A5F] mb-1">
              Send Us a Message
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              We'll get back within 24 hours.
            </p>

            {success && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-6">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />

                <div>
                  <p className="text-green-700 font-semibold text-sm">
                    Message sent! ✅
                  </p>

                  <p className="text-green-600 text-xs">
                    We'll reply within 24 hours.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Your Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#2E86AB] bg-white transition ${
                      errors.name ? "border-red-400" : "border-gray-200"
                    }`}
                  />

                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="rahul@example.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#2E86AB] bg-white transition ${
                      errors.email ? "border-red-400" : "border-gray-200"
                    }`}
                  />

                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Subject
                </label>

                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="e.g. Question about my premium"
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#2E86AB] bg-white transition ${
                    errors.subject ? "border-red-400" : "border-gray-200"
                  }`}
                />

                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Message
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell us how we can help..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#2E86AB] bg-white transition resize-none ${
                    errors.message ? "border-red-400" : "border-gray-200"
                  }`}
                />

                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#2E86AB] to-[#1E3A5F] text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg hover:opacity-90 transition"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>

              <a
                href="https://wa.me/919876543210?text=Hi! I need help with InsurePredict."
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl transition"
              >
                Chat on WhatsApp
              </a>
            </form>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#1E3A5F] mb-2">
              Quick Answers
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              Common questions answered instantly
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {faqs.map((f, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition"
                >
                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-[#2E86AB]/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      <HelpCircle className="w-3.5 h-3.5 text-[#2E86AB]" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-[#1E3A5F] mb-1">
                        {f.q}
                      </p>

                      <p className="text-xs text-gray-500 leading-relaxed">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/faq"
              className="flex items-center justify-center gap-2 bg-white border-2 border-[#2E86AB] text-[#2E86AB] font-semibold py-3 rounded-xl hover:bg-blue-50 transition text-sm"
            >
              View All FAQs
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="mt-4 bg-linear-to-r from-[#1E3A5F] to-[#2E86AB] rounded-2xl p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-[#F4A261]" />

                <p className="font-semibold">Why Trust InsurePredict?</p>
              </div>

              {[
                "🔒 Bank-grade data security",
                "⚡ Instant premium calculation",
                "🏢 Real insurance company data",
                "🆓 Completely free to use",
                "💬 24/7 WhatsApp support",
              ].map((t, i) => (
                <p key={i} className="text-sm text-blue-100 mb-1.5">
                  {t}
                </p>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
