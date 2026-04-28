import { useState } from "react";
import { X, MessageCircle, Phone, Clock, Shield } from "lucide-react";

export default function WhatsAppSupport() {
  const [open, setOpen] = useState(false);

  const PHONE = "919876543210";
  const messages = [
    "Hi! I need help with my insurance premium.",
    "I want to know more about health insurance.",
    "Can you help me choose the best plan?",
    "I have a question about my quote.",
  ];

  const openWhatsApp = (msg) => {
    window.open(
      `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
    setOpen(false);
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col
                    items-end gap-3"
    >
      {open && (
        <div
          className="bg-white rounded-3xl shadow-2xl border
                        border-gray-100 w-80 overflow-hidden
                        animate-in slide-in-from-bottom-4"
        >
          {/* Header */}
          <div
            className="bg-linear-to-r from-green-400 to-green-500
                          p-4 text-white"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-10 h-10 bg-white/20 rounded-full
                                flex items-center justify-center"
                >
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-sm">InsurePredict Support</p>
                  <div className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 bg-green-300 rounded-full
                                    animate-pulse"
                    />
                    <p className="text-xs text-green-100">
                      Online — typically replies instantly
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 bg-white/20 rounded-full flex
                           items-center justify-center hover:bg-white/30
                           transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Info badges */}
            <div className="flex gap-2">
              {[
                { icon: <Clock className="w-3 h-3" />, text: "24/7" },
                { icon: <Shield className="w-3 h-3" />, text: "Secure" },
                { icon: <Phone className="w-3 h-3" />, text: "Free" },
              ].map((b, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1 bg-white/20
                             px-2 py-0.5 rounded-full text-xs"
                >
                  {b.icon} {b.text}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-50">
            <div
              className="bg-white rounded-2xl rounded-tl-none p-3
                            shadow-sm border border-gray-100 mb-3"
            >
              <p className="text-sm text-gray-700 leading-relaxed">
                👋 Hi there! How can I help you with your insurance today?
                Choose a topic below or type your own message.
              </p>
              <p className="text-xs text-gray-400 mt-1 text-right">
                12:00 PM ✓✓
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {messages.map((msg, i) => (
                <button
                  key={i}
                  onClick={() => openWhatsApp(msg)}
                  className="text-left text-sm text-green-700
                             bg-white border border-green-200
                             hover:bg-green-50 px-4 py-2.5 rounded-full
                             transition font-medium shadow-sm"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-gray-100 bg-white">
            <button
              onClick={() =>
                openWhatsApp("Hi! I need help with InsurePredict.")
              }
              className="w-full flex items-center justify-center gap-2
                         bg-green-500 hover:bg-green-600 text-white
                         font-semibold py-3 rounded-2xl transition
                         shadow-lg"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Open WhatsApp Chat
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center
                    justify-center transition-all duration-300
                    ${
                      open
                        ? "bg-gray-700 rotate-0"
                        : "bg-green-500 hover:bg-green-600 hover:scale-110"
                    }`}
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <svg
            className="w-8 h-8 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        )}

        {!open && (
          <span
            className="absolute top-0 right-0 w-4 h-4 bg-red-500
                           rounded-full border-2 border-white
                           animate-bounce"
          />
        )}
      </button>
    </div>
  );
}
