import InsuranceHealthScore from "../components/InsuranceHealthScore";

export default function InsuranceScore() {
  const sampleInput = {
    age: 28,
    bmi: 24,
    smoker: false,
  };

  const sampleResult = {
    risk_score: 35,
    risk_level: "Low",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <InsuranceHealthScore input={sampleInput} result={sampleResult} />
    </div>
  );
}
