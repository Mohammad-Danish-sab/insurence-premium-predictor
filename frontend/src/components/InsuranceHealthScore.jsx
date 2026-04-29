import { useState, useEffect } from "react";
import { Shield, TrendingUp, Activity, Heart, Award } from "lucide-react";

export default function InsuranceHealthScore({ input, result }) {
  const [score, setScore] = useState(0);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (!input || !result) return;

    let totalScore = 0;

    const bmi = parseFloat(input.bmi);
    let bmiScore = 0;
    if (bmi < 18.5)
      bmiScore = 15; 
    else if (bmi < 25)
      bmiScore = 25; 
    else if (bmi < 30)
      bmiScore = 18; 
    else bmiScore = 10; 

    const lifestyleScore = input.smoker ? 5 : 25; 

    const age = parseInt(input.age);
    let ageScore = 0;
    if (age < 30)
      ageScore = 25; // Young - Best
    else if (age < 40) ageScore = 22;
    else if (age < 50) ageScore = 18;
    else if (age < 60) ageScore = 13;
    else ageScore = 8;

    const riskScore = Math.max(0, 25 - result.risk_score * 0.25);

    totalScore = Math.round(bmiScore + lifestyleScore + ageScore + riskScore);
    setScore(totalScore);

    let current = 0;
    const increment = totalScore / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= totalScore) {
        setAnimatedScore(totalScore);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [input, result]);

  if (!input || !result) return null;

  const getScoreInfo = (s) => {
    if (s >= 80)
      return {
        level: "Excellent",
        color: "text-green-600",
        bgColor: "bg-green-500",
        lightBg: "bg-green-50",
        borderColor: "border-green-200",
        emoji: "🎉",
        message: "Outstanding! You're in great health for insurance.",
      };
    if (s >= 60)
      return {
        level: "Good",
        color: "text-blue-600",
        bgColor: "bg-blue-500",
        lightBg: "bg-blue-50",
        borderColor: "border-blue-200",
        emoji: "👍",
        message: "Good health profile. Small improvements can save more.",
      };
    if (s >= 40)
      return {
        level: "Fair",
        color: "text-yellow-600",
        bgColor: "bg-yellow-500",
        lightBg: "bg-yellow-50",
        borderColor: "border-yellow-200",
        emoji: "⚠️",
        message: "Fair health. Consider lifestyle changes to reduce premium.",
      };
    return {
      level: "Needs Improvement",
      color: "text-red-600",
      bgColor: "bg-red-500",
      lightBg: "bg-red-50",
      borderColor: "border-red-200",
      emoji: "🚨",
      message: "High risk profile. Focus on health improvements urgently.",
    };
  };

  const scoreInfo = getScoreInfo(score);

  const bmi = parseFloat(input.bmi);
  const bmiStatus =
    bmi < 18.5
      ? "Underweight"
      : bmi < 25
        ? "Normal"
        : bmi < 30
          ? "Overweight"
          : "Obese";
  const bmiPoints = bmi < 18.5 ? 60 : bmi < 25 ? 100 : bmi < 30 ? 72 : 40;

  const components = [
    {
      label: "BMI Health",
      value: bmiPoints,
      status: bmiStatus,
      icon: <Activity className="w-4 h-4" />,
      tip: bmi < 25 ? "Maintain your healthy BMI" : "Reduce BMI to save 20-30%",
    },
    {
      label: "Lifestyle",
      value: input.smoker ? 20 : 100,
      status: input.smoker ? "Smoker" : "Non-Smoker",
      icon: <Heart className="w-4 h-4" />,
      tip: input.smoker
        ? "Quit smoking to save up to 50%"
        : "Great! Keep it up",
    },
    {
      label: "Age Factor",
      value:
        input.age < 30
          ? 100
          : input.age < 40
            ? 88
            : input.age < 50
              ? 72
              : input.age < 60
                ? 52
                : 32,
      status: `${input.age} years`,
      icon: <TrendingUp className="w-4 h-4" />,
      tip: input.age < 30 ? "Lock rates now" : "Earlier policy = lower premium",
    },
    {
      label: "Overall Risk",
      value: Math.max(0, 100 - result.risk_score),
      status: result.risk_level,
      icon: <Shield className="w-4 h-4" />,
      tip: "Lower risk = lower premium",
    },
  ];

  const recommendations = [];
  if (input.smoker)
    recommendations.push({
      emoji: "🚭",
      title: "Quit Smoking",
      impact: "Save up to 50% on premium",
      priority: "High",
    });
  if (bmi >= 25)
    recommendations.push({
      emoji: "🏃",
      title: "Reduce BMI",
      impact:
        bmi >= 30
          ? "Save 30% by reaching normal BMI"
          : "Save 15% by reaching normal BMI",
      priority: bmi >= 30 ? "High" : "Medium",
    });
  if (result.risk_score > 60)
    recommendations.push({
      emoji: "🩺",
      title: "Health Checkup",
      impact: "Identify and manage health risks early",
      priority: "High",
    });
  if (input.age < 30)
    recommendations.push({
      emoji: "💰",
      title: "Lock Rates Now",
      impact: "Premium increases 10-20% every 5 years",
      priority: "Medium",
    });
  if (recommendations.length === 0)
    recommendations.push({
      emoji: "✅",
      title: "Maintain Your Health",
      impact: "Keep up the great work!",
      priority: "Low",
    });

  return (
    <div
      className="bg-white rounded-3xl border border-gray-100
                    shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Award className="w-5 h-5 text-[#2E86AB]" />
            <h2 className="font-bold text-[#1E3A5F] text-xl">
              Insurance Health Score
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            Your overall insurability rating
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div
          className={`rounded-3xl border-2 p-6 flex flex-col
                        items-center justify-center
                        ${scoreInfo.lightBg} ${scoreInfo.borderColor}`}
        >
          <div className="relative w-40 h-40 mb-4">
            <svg className="transform -rotate-90 w-40 h-40">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-gray-200"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - animatedScore / 100)}`}
                className={scoreInfo.color}
                strokeLinecap="round"
              />
            </svg>
            <div
              className="absolute inset-0 flex flex-col items-center
                            justify-center"
            >
              <span className={`text-5xl font-bold ${scoreInfo.color}`}>
                {animatedScore}
              </span>
              <span className="text-sm text-gray-500 font-medium">/ 100</span>
            </div>
          </div>

          <div
            className={`px-4 py-2 rounded-full mb-2
                          ${scoreInfo.bgColor} bg-opacity-10`}
          >
            <span className={`text-sm font-bold ${scoreInfo.color}`}>
              {scoreInfo.emoji} {scoreInfo.level}
            </span>
          </div>

          <p
            className={`text-xs text-center ${scoreInfo.color}
                        font-medium px-4`}
          >
            {scoreInfo.message}
          </p>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {components.map((c, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-2xl border border-gray-100
                         p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 bg-[#2E86AB]/10 rounded-lg
                                  flex items-center justify-center"
                  >
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{c.label}</p>
                    <p className="text-sm font-bold text-gray-700">
                      {c.status}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-lg font-bold
                  ${
                    c.value >= 80
                      ? "text-green-600"
                      : c.value >= 60
                        ? "text-blue-600"
                        : c.value >= 40
                          ? "text-yellow-600"
                          : "text-red-600"
                  }`}
                >
                  {c.value}
                </span>
              </div>

              <div
                className="w-full h-2 bg-gray-200 rounded-full
                              overflow-hidden mb-2"
              >
                <div
                  className={`h-2 rounded-full transition-all duration-1000
                    ${
                      c.value >= 80
                        ? "bg-green-500"
                        : c.value >= 60
                          ? "bg-blue-500"
                          : c.value >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                    }`}
                  style={{ width: `${c.value}%` }}
                />
              </div>

              <p className="text-xs text-gray-400">💡 {c.tip}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <h3 className="font-bold text-[#1E3A5F] mb-4">
          🎯 How to Improve Your Score
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {recommendations.map((r, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-4
                ${
                  r.priority === "High"
                    ? "bg-red-50 border-red-100"
                    : r.priority === "Medium"
                      ? "bg-yellow-50 border-yellow-100"
                      : "bg-green-50 border-green-100"
                }`}
            >
              <div className="text-2xl mb-2">{r.emoji}</div>
              <p className="text-sm font-bold text-gray-700 mb-1">{r.title}</p>
              <p className="text-xs text-gray-500 mb-2">{r.impact}</p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full
                              font-medium
                ${
                  r.priority === "High"
                    ? "bg-red-100 text-red-700"
                    : r.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {r.priority} Priority
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
