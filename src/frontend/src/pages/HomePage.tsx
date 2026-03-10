import { Link } from "@tanstack/react-router";

const SCHEDULE = [
  {
    id: "s1",
    time: "11:00 AM",
    type: "2 vs 2",
    entry: "₹30",
    prize: "₹50",
    icon: "⚔️",
  },
  {
    id: "s2",
    time: "1:00 PM",
    type: "4 vs 4",
    entry: "₹40",
    prize: "₹65",
    icon: "🔥",
  },
  {
    id: "s3",
    time: "4:00 PM",
    type: "2 vs 2",
    entry: "₹30",
    prize: "₹50",
    icon: "⚔️",
  },
  {
    id: "s4",
    time: "8:00 PM",
    type: "4 vs 4",
    entry: "₹40",
    prize: "₹65",
    icon: "🔥",
  },
];

const CONTACTS = [
  { handle: "@a0arsh", url: "https://instagram.com/a0arsh" },
  { handle: "@rahul373", url: "https://instagram.com/rahul373" },
  { handle: "@arpita_gaming27", url: "https://instagram.com/arpita_gaming27" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="hero-gradient relative overflow-hidden py-20 px-4 text-center"
        data-ocid="home.hero.section"
      >
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="mb-2">
            <span
              className="text-xs uppercase tracking-widest px-3 py-1 rounded-full border"
              style={{
                color: "oklch(0.65 0.22 195)",
                borderColor: "oklch(0.65 0.22 195 / 0.4)",
                background: "oklch(0.65 0.22 195 / 0.05)",
              }}
            >
              Free Fire MAX Official Tournaments
            </span>
          </div>
          <h1
            className="text-6xl sm:text-8xl font-gaming animate-pulse-glow mb-4"
            style={{
              color: "oklch(0.72 0.19 45)",
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 900,
              letterSpacing: "0.08em",
            }}
          >
            AR ESPORTS
          </h1>
          <p
            className="text-xl sm:text-2xl mb-2"
            style={{
              color: "oklch(0.75 0.03 260)",
              fontFamily: "Exo 2, sans-serif",
            }}
          >
            Compete. Dominate. Win Big.
          </p>
          <p
            className="text-base mb-8"
            style={{ color: "oklch(0.55 0.03 260)" }}
          >
            Daily Free Fire MAX tournaments — register today and claim your
            glory.
          </p>
          <Link to="/register">
            <button
              type="button"
              className="btn-neon-orange px-8 py-3 rounded-lg text-lg font-gaming"
              data-ocid="home.register.primary_button"
            >
              Join Tournament
            </button>
          </Link>
        </div>

        {/* Decorative lines */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, oklch(0.72 0.19 45 / 0.03) 40px)",
          }}
        />
      </section>

      {/* Schedule */}
      <section className="py-16 px-4" data-ocid="home.schedule.section">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-gaming mb-2"
              style={{ color: "oklch(0.72 0.19 45)" }}
            >
              Daily Tournament Schedule
            </h2>
            <p style={{ color: "oklch(0.55 0.03 260)" }}>
              Fresh battles every day — pick your slot and show up ready
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCHEDULE.map((slot) => (
              <div
                key={slot.id}
                className="card-gaming rounded-xl p-5 border flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{slot.icon}</span>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-medium"
                    style={{
                      background: "oklch(0.72 0.19 45 / 0.15)",
                      color: "oklch(0.72 0.19 45)",
                    }}
                  >
                    {slot.type}
                  </span>
                </div>
                <div>
                  <div
                    className="text-2xl font-gaming"
                    style={{ color: "oklch(0.95 0.02 80)" }}
                  >
                    {slot.time}
                  </div>
                  <div
                    className="text-sm mt-1"
                    style={{ color: "oklch(0.55 0.03 260)" }}
                  >
                    Today's Match
                  </div>
                </div>
                <div
                  className="flex justify-between text-sm border-t pt-3"
                  style={{ borderColor: "oklch(0.22 0.03 260)" }}
                >
                  <div>
                    <div style={{ color: "oklch(0.55 0.03 260)" }}>Entry</div>
                    <div
                      className="font-semibold"
                      style={{ color: "oklch(0.72 0.19 45)" }}
                    >
                      {slot.entry}
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ color: "oklch(0.55 0.03 260)" }}>Prize</div>
                    <div
                      className="font-semibold"
                      style={{ color: "oklch(0.65 0.22 195)" }}
                    >
                      {slot.prize}
                    </div>
                  </div>
                </div>
                <Link to="/register">
                  <button
                    type="button"
                    className="btn-neon-orange w-full py-2 rounded text-sm font-gaming"
                    data-ocid="home.register.primary_button"
                  >
                    Register Now
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Entry Fee & Prize Info */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="card-gaming border rounded-xl p-6 neon-glow-orange">
            <h3
              className="text-xl font-gaming mb-4"
              style={{ color: "oklch(0.72 0.19 45)" }}
            >
              Entry Fees
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: "oklch(0.75 0.03 260)" }}>
                  2 vs 2 Match
                </span>
                <span
                  className="font-gaming text-lg"
                  style={{ color: "oklch(0.72 0.19 45)" }}
                >
                  ₹30
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "oklch(0.75 0.03 260)" }}>
                  4 vs 4 Match
                </span>
                <span
                  className="font-gaming text-lg"
                  style={{ color: "oklch(0.72 0.19 45)" }}
                >
                  ₹40
                </span>
              </div>
            </div>
          </div>
          <div className="card-gaming border rounded-xl p-6 neon-glow-cyan">
            <h3
              className="text-xl font-gaming mb-4"
              style={{ color: "oklch(0.65 0.22 195)" }}
            >
              Prize Pool
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span style={{ color: "oklch(0.75 0.03 260)" }}>
                  2 vs 2 Winner
                </span>
                <span
                  className="font-gaming text-lg"
                  style={{ color: "oklch(0.65 0.22 195)" }}
                >
                  ₹50
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: "oklch(0.75 0.03 260)" }}>
                  4 vs 4 Winner
                </span>
                <span
                  className="font-gaming text-lg"
                  style={{ color: "oklch(0.65 0.22 195)" }}
                >
                  ₹65
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3
            className="text-2xl font-gaming mb-2"
            style={{ color: "oklch(0.72 0.19 45)" }}
          >
            Support & Contact
          </h3>
          <p className="text-sm mb-6" style={{ color: "oklch(0.55 0.03 260)" }}>
            Reach us on Instagram
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {CONTACTS.map((c) => (
              <a
                key={c.handle}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full border text-sm font-medium transition-all hover:scale-105"
                style={{
                  color: "oklch(0.65 0.22 195)",
                  borderColor: "oklch(0.65 0.22 195 / 0.4)",
                  background: "oklch(0.65 0.22 195 / 0.05)",
                }}
              >
                📸 {c.handle}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-8 px-4 text-center"
        style={{ borderColor: "oklch(0.18 0.02 260)" }}
      >
        <p className="text-sm mb-1" style={{ color: "oklch(0.45 0.02 260)" }}>
          All rights reserved by Arpita, Adarsh, Rahul
        </p>
        <p className="text-xs" style={{ color: "oklch(0.35 0.02 260)" }}>
          Credit: Adarsh
        </p>
      </footer>
    </div>
  );
}
