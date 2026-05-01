import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { formatINR } from "../utils/formatCurrency";
import {
  Users,
  Plus,
  X,
  Calculator,
  TrendingDown,
  Shield,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function FamilyFloater() {
  const [members, setMembers] = useState([
    { id: 1, name: "Self", age: 35, bmi: 24, gender: "male", smoker: false },
  ]);
  const [result, setResult] = useState(null);

  const addMember = () => {
    setMembers([
      ...members,
      {
        id: Date.now(),
        name: "",
        age: "",
        bmi: "",
        gender: "male",
        smoker: false,
      },
    ]);
  };

  const removeMember = (id) => {
    if (members.length === 1) return;
    setMembers(members.filter((m) => m.id !== id));
  };

  const updateMember = (id, field, value) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    );
  };

  const calculatePremium = () => {
    const individualPremiums = members.map((m) => {
      let base = 5000;

      if (m.age < 25) base *= 1.1;
      else if (m.age < 35) base *= 1.2;
      else if (m.age < 45) base *= 1.5;
      else if (m.age < 55) base *= 1.8;
      else base *= 2.2;

      if (m.bmi < 18.5) base *= 1.1;
      else if (m.bmi >= 25 && m.bmi < 30) base *= 1.2;
      else if (m.bmi >= 30) base *= 1.5;

      if (m.smoker) base *= 2;

      return {
        name: m.name || "Member",
        premium: Math.round(base),
      };
    });

    const totalIndividual = individualPremiums.reduce(
      (sum, m) => sum + m.premium,
      0,
    );

    const discountPercent =
      members.length === 2
        ? 15
        : members.length === 3
          ? 20
          : members.length === 4
            ? 25
            : 30;

    const floaterPremium = Math.round(
      totalIndividual * (1 - discountPercent / 100),
    );

    setResult({
      individualPremiums,
      totalIndividual,
      floaterPremium,
      savings: totalIndividual - floaterPremium,
      discountPercent,
      memberCount: members.length,
    });
  };

  const getMemberLabel = (index) => {
    if (index === 0) return "Self";
    if (index === 1) return "Spouse";
    return `Child ${index - 1}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center gap-2 bg-[#2E86AB]/10
                          text-[#2E86AB] px-4 py-1.5 rounded-full text-sm
                          font-medium mb-4"
          >
            <Users className="w-4 h-4" /> Family Floater Calculator
          </div>
          <h1 className="text-3xl font-bold text-[#1E3A5F]">
            Family Floater Calculator
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Compare individual vs family floater premiums and save 15-30%
          </p>
        </div>

        <div
          className="bg-blue-50 border border-blue-100 rounded-2xl
                        px-5 py-4 mb-6 flex items-start gap-3"
        >
          <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-800 mb-1">
              What is Family Floater?
            </p>
            <p className="text-sm text-blue-600">
              A single health insurance policy covering your entire family with
              shared sum insured. Typically 15-30% cheaper than individual
              policies for each member.
            </p>
          </div>
        </div>

        <div
          className="bg-white rounded-3xl border border-gray-100
                        shadow-sm p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-[#1E3A5F]">
              Family Members ({members.length})
            </h2>
            <button
              onClick={addMember}
              disabled={members.length >= 6}
              className="flex items-center gap-2 bg-[#2E86AB]
                         hover:bg-[#1E3A5F] text-white text-sm
                         font-semibold px-4 py-2 rounded-xl transition
                         disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Add Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((m, i) => (
              <div
                key={m.id}
                className="bg-gray-50 rounded-2xl border border-gray-100
                           p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    value={m.name}
                    onChange={(e) => updateMember(m.id, "name", e.target.value)}
                    placeholder={getMemberLabel(i)}
                    className="text-sm font-bold text-gray-700 bg-transparent
                               outline-none border-b border-transparent
                               hover:border-gray-300 focus:border-[#2E86AB]
                               transition px-2 py-1"
                  />
                  {members.length > 1 && (
                    <button
                      onClick={() => removeMember(m.id)}
                      className="w-6 h-6 bg-red-100 hover:bg-red-200
                                 text-red-500 rounded-full flex items-center
                                 justify-center transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      Age
                    </label>
                    <input
                      type="number"
                      value={m.age}
                      onChange={(e) =>
                        updateMember(m.id, "age", parseInt(e.target.value))
                      }
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 rounded-lg border
                                 border-gray-200 text-sm outline-none
                                 focus:ring-2 focus:ring-[#2E86AB] bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">
                      BMI
                    </label>
                    <input
                      type="number"
                      value={m.bmi}
                      onChange={(e) =>
                        updateMember(m.id, "bmi", parseFloat(e.target.value))
                      }
                      min="10"
                      max="60"
                      step="0.1"
                      className="w-full px-3 py-2 rounded-lg border
                                 border-gray-200 text-sm outline-none
                                 focus:ring-2 focus:ring-[#2E86AB] bg-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <select
                    value={m.gender}
                    onChange={(e) =>
                      updateMember(m.id, "gender", e.target.value)
                    }
                    className="px-3 py-2 rounded-lg border border-gray-200
                               text-sm outline-none focus:ring-2
                               focus:ring-[#2E86AB] bg-white"
                  >
                    <option value="male">👨 Male</option>
                    <option value="female">👩 Female</option>
                  </select>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={m.smoker}
                      onChange={(e) =>
                        updateMember(m.id, "smoker", e.target.checked)
                      }
                      className="w-4 h-4 rounded border-gray-300
                                 text-[#2E86AB] focus:ring-[#2E86AB]"
                    />
                    <span className="text-sm text-gray-600">Smoker</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={calculatePremium}
            className="w-full mt-6 bg-linear-to-r from-[#2E86AB]
                       to-[#1E3A5F] text-white font-semibold py-3.5
                       rounded-2xl transition flex items-center
                       justify-center gap-2 shadow-lg hover:opacity-90"
          >
            <Calculator className="w-5 h-5" />
            Calculate Family Floater Premium
          </button>
        </div>

        {result && (
          <div className="flex flex-col gap-6">
            {/* Savings highlight */}
            <div
              className="bg-linear-to-r from-green-500 to-green-600
                            rounded-3xl p-8 text-white text-center"
            >
              <TrendingDown
                className="w-12 h-12 mx-auto mb-3
                                       text-green-200"
              />
              <p className="text-green-100 text-sm mb-2">
                Total Savings with Family Floater
              </p>
              <p className="text-5xl font-bold mb-2">
                {formatINR(result.savings)}
              </p>
              <p className="text-green-100 text-sm">
                {result.discountPercent}% discount for {result.memberCount}{" "}
                members
              </p>
            </div>

            {/* Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Individual */}
              <div
                className="bg-white rounded-3xl border border-gray-100
                              shadow-sm p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-10 h-10 bg-red-50 rounded-xl
                                  flex items-center justify-center"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E3A5F]">
                      Individual Policies
                    </h3>
                    <p className="text-xs text-gray-400">
                      Separate policy for each member
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  {result.individualPremiums.map((m, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between
                                 py-2 border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm text-gray-600">{m.name}</span>
                      <span className="text-sm font-bold text-gray-700">
                        {formatINR(m.premium)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">
                      Total Annual Premium
                    </span>
                    <span className="text-2xl font-bold text-red-500">
                      {formatINR(result.totalIndividual)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Floater */}
              <div
                className="bg-white rounded-3xl border-2
                              border-green-200 shadow-lg p-6
                              bg-green-50/30"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-10 h-10 bg-green-100 rounded-xl
                                  flex items-center justify-center"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1E3A5F]">
                      Family Floater Policy
                    </h3>
                    <p className="text-xs text-gray-400">
                      One policy for entire family
                    </p>
                  </div>
                </div>

                <div
                  className="bg-white rounded-2xl border border-green-100
                                p-4 mb-4"
                >
                  <p className="text-xs text-gray-500 mb-2">Coverage Details</p>
                  {[
                    `${result.memberCount} members covered`,
                    "Shared sum insured",
                    `${result.discountPercent}% family discount`,
                    "No individual deductibles",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 mb-1 last:mb-0"
                    >
                      <CheckCircle
                        className="w-3.5 h-3.5 text-green-500
                                              shrink-0"
                      />
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t-2 border-green-300">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">
                      Total Annual Premium
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatINR(result.floaterPremium)}
                    </span>
                  </div>
                  <p className="text-xs text-green-600 text-right mt-1">
                    ✓ Recommended
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div
              className="bg-white rounded-3xl border border-gray-100
                            shadow-sm p-6"
            >
              <h3 className="font-bold text-[#1E3A5F] mb-4">
                ✨ Family Floater Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    emoji: "💰",
                    title: "Save 15-30%",
                    desc: "Significant premium savings vs individual policies",
                  },
                  {
                    emoji: "📝",
                    title: "Single Policy",
                    desc: "One policy, one renewal, less paperwork",
                  },
                  {
                    emoji: "🏥",
                    title: "Shared Coverage",
                    desc: "Entire sum insured available to any member",
                  },
                ].map((b, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 rounded-xl border border-gray-100
                               p-4 text-center"
                  >
                    <div className="text-3xl mb-2">{b.emoji}</div>
                    <p className="text-sm font-bold text-gray-700 mb-1">
                      {b.title}
                    </p>
                    <p className="text-xs text-gray-500">{b.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
