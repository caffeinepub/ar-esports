import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Registration } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const SLOT_NAMES: Record<string, string> = {
  "1": "11:00 AM — 2 vs 2",
  "2": "1:00 PM — 4 vs 4",
  "3": "4:00 PM — 2 vs 2",
  "4": "8:00 PM — 4 vs 4",
};

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  size: number;
  duration: number;
  delay: number;
  shape: string;
}

const CONFETTI_COLORS = [
  "oklch(0.72 0.19 45)",
  "oklch(0.65 0.22 195)",
  "oklch(0.72 0.2 145)",
  "oklch(0.82 0.18 75)",
  "oklch(0.7 0.22 310)",
];

function Confetti() {
  const pieces: ConfettiPiece[] = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color:
      CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)] ??
      CONFETTI_COLORS[0],
    size: Math.random() * 8 + 6,
    duration: Math.random() * 2 + 2,
    delay: Math.random() * 2,
    shape: Math.random() > 0.5 ? "circle" : "rect",
  }));

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      data-ocid="success.confetti"
    >
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "approved") {
    return (
      <span
        className="px-2 py-1 rounded text-xs font-semibold status-approved"
        style={{ background: "oklch(0.72 0.2 145 / 0.1)" }}
      >
        ✓ Approved
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span
        className="px-2 py-1 rounded text-xs font-semibold status-rejected"
        style={{ background: "oklch(0.6 0.22 25 / 0.1)" }}
      >
        ✗ Rejected
      </span>
    );
  }
  return (
    <span
      className="px-2 py-1 rounded text-xs font-semibold status-pending"
      style={{ background: "oklch(0.82 0.18 75 / 0.1)" }}
    >
      ⏳ Pending
    </span>
  );
}

export default function HistoryPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { actor } = useActor();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiShown = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (actor) {
      actor
        .getMyRegistrations()
        .then((regs) => {
          setRegistrations(regs);
          const hasApproved = regs.some(
            (r) => r.status.toString() === "approved",
          );
          if (hasApproved && !confettiShown.current) {
            confettiShown.current = true;
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, actor, navigate]);

  const formatDate = (ts: bigint) => {
    if (!ts) return "—";
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen px-4 py-10">
      {showConfetti && <Confetti />}
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-4xl font-gaming text-center mb-2"
          style={{ color: "oklch(0.72 0.19 45)" }}
        >
          My Tournaments
        </h1>
        <p
          className="text-center text-sm mb-8"
          style={{ color: "oklch(0.55 0.03 260)" }}
        >
          Your registration history
        </p>

        {loading ? (
          <div
            className="text-center py-16"
            style={{ color: "oklch(0.45 0.02 260)" }}
          >
            Loading...
          </div>
        ) : registrations.length === 0 ? (
          <div className="card-gaming border rounded-xl p-10 text-center">
            <div className="text-4xl mb-3">🎮</div>
            <p style={{ color: "oklch(0.55 0.03 260)" }}>
              No registrations yet.
            </p>
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="mt-4 btn-neon-orange px-5 py-2 rounded"
            >
              Register Now
            </button>
          </div>
        ) : (
          <div className="space-y-4" data-ocid="history.list">
            {registrations.map((reg, i) => (
              <div
                key={reg.id}
                className="card-gaming border rounded-xl p-5"
                data-ocid={`history.item.${i + 1}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span
                        className="font-gaming text-lg"
                        style={{ color: "oklch(0.95 0.02 80)" }}
                      >
                        {reg.gameName}
                      </span>
                      <StatusBadge status={reg.status.toString()} />
                    </div>
                    <div
                      className="text-sm mb-1"
                      style={{ color: "oklch(0.65 0.22 195)" }}
                    >
                      {SLOT_NAMES[reg.slotId.toString()] ??
                        `Slot ${reg.slotId.toString()}`}
                    </div>
                    <div
                      className="text-xs space-y-1"
                      style={{ color: "oklch(0.55 0.03 260)" }}
                    >
                      <div>
                        UID:{" "}
                        <span style={{ color: "oklch(0.75 0.03 260)" }}>
                          {reg.ffUID}
                        </span>
                      </div>
                      <div>Registered: {formatDate(reg.createdAt)}</div>
                    </div>
                  </div>
                  {reg.status.toString() === "approved" && (
                    <div className="text-2xl" title="Payment Approved">
                      🎉
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
