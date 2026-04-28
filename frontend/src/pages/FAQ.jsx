import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  ChevronDown,
  ChevronUp,
  Search,
  Shield,
  HelpCircle,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

const categories = [
  {
    id: "general",
    label: "General",
    icon: "🏠",
    faqs: [
      {
        q: "What is InsurePredict?",
        a: "InsurePredict is a free, smart insurance premium calculator that helps you estimate your insurance premium for Health, Life, Auto, and Home insurance based on your personal profile.",
      },
      {
        q: "Is InsurePredict free to use?",
        a: "Yes! InsurePredict is completely free. You can get unlimited insurance quotes, download PDF reports, and use all features without any cost or credit card.",
      },
      {
        q: "Is my personal data safe?",
        a: "Absolutely. We use JWT authentication and bcrypt encryption to protect your data. We never sell your personal information to third parties.",
      },
      {
        q: "Do I need to create an account?",
        a: "No! You can use the Guest mode to get an instant quote without signing up. However, creating a free account lets you save history, download reports, and track your predictions.",
      },
    ],
  },

  {
    id: "premium",
    label: "Premium",
    icon: "💰",
    faqs: [
      {
        q: "How is my insurance premium calculated?",
        a: "We use a rule-based engine that considers your age, BMI, smoking status, number of children, region, and insurance type.",
      },
      {
        q: "Why is my premium so high?",
        a: "Common reasons include smoking, high BMI, older age, or living in a high-cost region.",
      },
      {
        q: "How can I reduce my premium?",
        a: "Quit smoking, maintain a healthy BMI, choose higher deductibles, and buy insurance early.",
      },
      {
        q: "What is a confidence range?",
        a: "It shows the estimated minimum and maximum premium range depending on insurer and coverage.",
      },
    ],
  },

  {
    id: "reports",
    label: "Reports",
    icon: "📄",
    faqs: [
      {
        q: "How do I download my report?",
        a: "Go to History page and click the PDF button next to any prediction.",
      },
      {
        q: "Can I share reports on WhatsApp?",
        a: "Yes. Use the WhatsApp share button after prediction.",
      },
      {
        q: "What does the PDF contain?",
        a: "It contains premium details, recommendations, risk score, and plan comparison.",
      },
    ],
  },

  {
    id: "account",
    label: "Account",
    icon: "👤",
    faqs: [
      {
        q: "How do I change my password?",
        a: "Go to Profile page and update your password securely.",
      },
      {
        q: "Can I update my profile?",
        a: "Yes. You can edit your profile details anytime.",
      },
      {
        q: "How do I contact support?",
        a: "Use WhatsApp, email, or the contact form.",
      },
    ],
  },
];

function AccordionItem({ faq, isOpen, onToggle }) {
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
        isOpen
          ? "border-[#2E86AB] shadow-md"
          : "border-gray-100 hover:border-gray-200"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-gray-50 transition"
      >
        <span
          className={`text-sm font-semibold pr-4 ${
            isOpen ? "text-[#2E86AB]" : "text-[#1E3A5F]"
          }`}
        >
          {faq.q}
        </span>

        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition ${
            isOpen ? "bg-[#2E86AB] text-white" : "bg-gray-100 text-gray-400"
          }`}
        >
          {isOpen ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-5 pb-4 bg-white border-t border-gray-50">
          <p className="text-sm text-gray-600 leading-relaxed pt-3">{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openIndex, setOpenIndex] = useState(0);
  const [search, setSearch] = useState("");

  const currentCategory = categories.find((c) => c.id === activeCategory);

  const filteredFaqs = search.trim()
    ? categories
        .flatMap((c) => c.faqs)
        .filter(
          (f) =>
            f.q.toLowerCase().includes(search.toLowerCase()) ||
            f.a.toLowerCase().includes(search.toLowerCase()),
        )
    : currentCategory.faqs;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <section className="bg-linear-to-br from-[#1E3A5F] via-[#2E86AB] to-[#1E3A5F] py-16 px-4 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur">
            <HelpCircle className="w-7 h-7 text-white" />
          </div>

          <h1 className="text-4xl font-bold mb-3">
            Frequently Asked Questions
          </h1>

          <p className="text-blue-200 mb-8">
            Find quick answers to common insurance questions
          </p>

          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setOpenIndex(null);
              }}
              placeholder="Search questions..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-gray-700 text-sm outline-none shadow-lg focus:ring-2 focus:ring-[#F4A261]"
            />
          </div>
        </div>
      </section>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        {!search && (
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveCategory(c.id);
                  setOpenIndex(0);
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                  activeCategory === c.id
                    ? "bg-[#2E86AB] text-white shadow-lg shadow-blue-100"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#2E86AB] hover:text-[#2E86AB]"
                }`}
              >
                <span>{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {search && (
              <p className="text-sm text-gray-500 mb-4">
                {filteredFaqs.length} result(s) for "{search}"
              </p>
            )}

            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-gray-100">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />

                <p className="text-gray-500 font-medium">No results found</p>

                <p className="text-gray-400 text-sm mt-1">
                  Try a different search term
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredFaqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    faq={faq}
                    isOpen={openIndex === i}
                    onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-linear-to-br from-[#1E3A5F] to-[#2E86AB] rounded-3xl p-6 text-white">
              <MessageSquare className="w-8 h-8 mb-3 text-[#F4A261]" />

              <h3 className="font-bold text-lg mb-2">Still have questions?</h3>

              <p className="text-blue-200 text-sm mb-4">
                Our support team is available 24/7.
              </p>

              <Link
                to="/contact"
                className="flex items-center gap-2 bg-[#F4A261] hover:bg-orange-500 text-white font-semibold px-4 py-2.5 rounded-xl transition text-sm"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
              <h3 className="font-bold text-[#1E3A5F] mb-4">Quick Links</h3>

              {[
                { label: "Get a Free Quote", to: "/predict" },
                { label: "View My History", to: "/history" },
                { label: "Contact Support", to: "/contact" },
                { label: "My Profile", to: "/profile" },
              ].map((l, i) => (
                <Link
                  key={i}
                  to={l.to}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 text-sm text-gray-600 hover:text-[#2E86AB] transition group"
                >
                  {l.label}

                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#2E86AB] transition" />
                </Link>
              ))}
            </div>

            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-[#2E86AB]" />

                <p className="text-sm font-semibold text-[#1E3A5F]">
                  Trusted Platform
                </p>
              </div>

              <p className="text-xs text-gray-500">
                InsurePredict follows real insurance industry standards for
                premium calculation.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
