import { Users, Activity, IndianRupee, ShieldAlert } from "lucide-react";

export default function AnalyticsCards() {
  const cards = [
    {
      title: "Total Users",
      value: "12,450",
      icon: <Users className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50",
    },
    {
      title: "Predictions",
      value: "48,200",
      icon: <Activity className="w-6 h-6 text-green-600" />,
      bg: "bg-green-50",
    },
    {
      title: "Revenue",
      value: "₹8.5L",
      icon: <IndianRupee className="w-6 h-6 text-orange-600" />,
      bg: "bg-orange-50",
    },
    {
      title: "High Risks",
      value: "420",
      icon: <ShieldAlert className="w-6 h-6 text-red-600" />,
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">{card.title}</p>

              <h2 className="text-3xl font-bold text-[#1E3A5F] mt-2">
                {card.value}
              </h2>
            </div>

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg}`}
            >
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
