import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { TournamentSlot } from "../backend.d";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useNavigate } from "../lib/router-shim";

const SLOT_OCIDS = [
  "register.slot.item.1",
  "register.slot.item.2",
  "register.slot.item.3",
  "register.slot.item.4",
];

export default function RegisterPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { actor } = useActor();
  const navigate = useNavigate();

  const [step, setStep] = useState<"slot" | "form" | "payment" | "done">(
    "slot",
  );
  const [slots, setSlots] = useState<TournamentSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TournamentSlot | null>(null);
  const [registrationId, setRegistrationId] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [ffUID, setFfUID] = useState("");
  const [gameName, setGameName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [upiOrInsta, setUpiOrInsta] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    if (actor) {
      actor
        .getTournamentSlots()
        .then(setSlots)
        .catch(() => {});
      actor
        .getCallerUserProfile()
        .then((p) => {
          if (p) setEmail(p.email);
        })
        .catch(() => {});
    }
  }, [isAuthenticated, actor, navigate]);

  const handleRegister = async () => {
    if (!actor || !selectedSlot) return;
    if (
      !ffUID.trim() ||
      !gameName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !upiOrInsta.trim()
    ) {
      toast.error("Please fill all required fields");
      return;
    }
    setLoading(true);
    try {
      const result = await actor.registerForTournament(
        selectedSlot.id,
        ffUID.trim(),
        gameName.trim(),
        phone.trim(),
        email.trim(),
        teamMembers.trim(),
        upiOrInsta.trim(),
      );
      if (result.__kind__ === "err") {
        toast.error(
          (result as { __kind__: "err"; err: string }).err ||
            "You are already registered for this match.",
        );
      } else {
        setRegistrationId((result as { __kind__: "ok"; ok: string }).ok);
        setStep("payment");
      }
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentClaim = async () => {
    if (!actor) return;
    setLoading(true);
    try {
      await actor.submitPaymentClaim(registrationId);
      setStep("done");
    } catch {
      toast.error("Failed to submit payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyUPI = () => {
    navigator.clipboard.writeText("8317701193@ybl").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const inputStyle = {
    background: "oklch(0.14 0.02 260)",
    borderColor: "oklch(0.25 0.03 260)",
    color: "oklch(0.95 0.02 80)",
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <h1
          className="text-4xl font-gaming text-center mb-2"
          style={{ color: "oklch(0.72 0.19 45)" }}
        >
          Tournament Registration
        </h1>
        <p
          className="text-center text-sm mb-8"
          style={{ color: "oklch(0.55 0.03 260)" }}
        >
          Register your team for today's match
        </p>

        {/* Step: Slot Selection */}
        {step === "slot" && (
          <div className="space-y-4">
            <h2
              className="text-lg font-gaming"
              style={{ color: "oklch(0.75 0.03 260)" }}
            >
              Select a Tournament Slot
            </h2>
            {slots.length === 0 ? (
              <div
                className="text-center py-10"
                style={{ color: "oklch(0.45 0.02 260)" }}
              >
                Loading slots...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {slots.map((slot, i) => (
                  <button
                    type="button"
                    key={slot.id.toString()}
                    data-ocid={SLOT_OCIDS[i] ?? `register.slot.item.${i + 1}`}
                    onClick={() => {
                      setSelectedSlot(slot);
                      setStep("form");
                    }}
                    className={`card-gaming border rounded-xl p-5 text-left transition-all ${
                      selectedSlot?.id === slot.id ? "slot-card-selected" : ""
                    }`}
                  >
                    <div
                      className="font-gaming text-xl mb-1"
                      style={{ color: "oklch(0.95 0.02 80)" }}
                    >
                      {slot.time}
                    </div>
                    <div
                      className="text-sm mb-3"
                      style={{ color: "oklch(0.72 0.19 45)" }}
                    >
                      {slot.name}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "oklch(0.55 0.03 260)" }}>
                        Entry:{" "}
                        <span style={{ color: "oklch(0.72 0.19 45)" }}>
                          ₹{slot.entryFee.toString()}
                        </span>
                      </span>
                      <span style={{ color: "oklch(0.55 0.03 260)" }}>
                        Prize:{" "}
                        <span style={{ color: "oklch(0.65 0.22 195)" }}>
                          ₹{slot.prizePool.toString()}
                        </span>
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step: Form */}
        {step === "form" && selectedSlot && (
          <div className="card-gaming border rounded-xl p-6 neon-glow-orange space-y-5">
            <div className="flex items-center justify-between mb-2">
              <h2
                className="text-xl font-gaming"
                style={{ color: "oklch(0.72 0.19 45)" }}
              >
                Player Details
              </h2>
              <button
                type="button"
                onClick={() => setStep("slot")}
                className="text-sm"
                style={{ color: "oklch(0.55 0.03 260)" }}
              >
                ← Change slot
              </button>
            </div>
            <div
              className="px-3 py-2 rounded border text-sm"
              style={{
                background: "oklch(0.72 0.19 45 / 0.08)",
                borderColor: "oklch(0.72 0.19 45 / 0.3)",
                color: "oklch(0.72 0.19 45)",
              }}
            >
              {selectedSlot.time} — {selectedSlot.name} | Entry: ₹
              {selectedSlot.entryFee.toString()}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="reg-ffuid"
                style={{ color: "oklch(0.75 0.03 260)" }}
              >
                Free Fire MAX UID *
              </Label>
              <Input
                id="reg-ffuid"
                value={ffUID}
                onChange={(e) => setFfUID(e.target.value)}
                placeholder="e.g. 123456789"
                data-ocid="register.ffuid_input"
                style={inputStyle}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="reg-gamename"
                style={{ color: "oklch(0.75 0.03 260)" }}
              >
                Game Name *
              </Label>
              <Input
                id="reg-gamename"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                placeholder="Your in-game name"
                data-ocid="register.gamename_input"
                style={inputStyle}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="reg-phone"
                style={{ color: "oklch(0.75 0.03 260)" }}
              >
                Phone Number *
              </Label>
              <Input
                id="reg-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                data-ocid="register.phone_input"
                style={inputStyle}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="reg-email"
                style={{ color: "oklch(0.75 0.03 260)" }}
              >
                Email *
              </Label>
              <Input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                data-ocid="register.email_input"
                style={inputStyle}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="reg-team"
                style={{ color: "oklch(0.75 0.03 260)" }}
              >
                Team Member Details
              </Label>
              <Textarea
                id="reg-team"
                value={teamMembers}
                onChange={(e) => setTeamMembers(e.target.value)}
                placeholder="List team member names and UIDs, one per line"
                data-ocid="register.team_input"
                style={{ ...inputStyle, minHeight: "80px" }}
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="reg-upi"
                style={{ color: "oklch(0.75 0.03 260)" }}
              >
                UPI ID or Instagram ID{" "}
                <span
                  style={{ color: "oklch(0.55 0.03 260)", fontSize: "0.75rem" }}
                >
                  (one required)
                </span>
              </Label>
              <Input
                id="reg-upi"
                value={upiOrInsta}
                onChange={(e) => setUpiOrInsta(e.target.value)}
                placeholder="UPI ID or @instagram"
                data-ocid="register.upi_input"
                style={inputStyle}
              />
            </div>

            <Button
              onClick={handleRegister}
              disabled={loading}
              className="btn-neon-orange w-full py-3 rounded-lg"
              data-ocid="register.submit_button"
            >
              {loading ? "Registering..." : "Register Team →"}
            </Button>
          </div>
        )}

        {/* Step: Payment */}
        {step === "payment" && selectedSlot && (
          <div
            className="card-gaming border rounded-xl p-6 space-y-6"
            data-ocid="payment.qr.section"
          >
            <h2
              className="text-2xl font-gaming text-center"
              style={{ color: "oklch(0.72 0.19 45)" }}
            >
              Complete Payment
            </h2>

            <div
              className="px-4 py-3 rounded-lg border text-sm"
              style={{
                background: "oklch(0.6 0.18 45 / 0.1)",
                borderColor: "oklch(0.6 0.18 45 / 0.4)",
                color: "oklch(0.85 0.12 65)",
              }}
            >
              ⚠️ <strong>Important:</strong> Only pay if receiver name shows{" "}
              <strong>Purushottam Kumar</strong>
            </div>

            <div className="text-center">
              <div
                className="text-sm mb-2"
                style={{ color: "oklch(0.55 0.03 260)" }}
              >
                Scan to pay via UPI
              </div>
              <img
                src="/assets/uploads/IMG-20260309-WA0008-1.jpg"
                alt="Payment QR Code"
                className="mx-auto rounded-xl border"
                style={{
                  maxWidth: "220px",
                  borderColor: "oklch(0.25 0.03 260)",
                }}
              />
            </div>

            <div className="text-center">
              <div
                className="text-sm mb-2"
                style={{ color: "oklch(0.55 0.03 260)" }}
              >
                UPI ID
              </div>
              <div className="flex items-center justify-center gap-2">
                <span
                  className="font-mono text-lg font-semibold"
                  style={{ color: "oklch(0.72 0.19 45)" }}
                >
                  8317701193@ybl
                </span>
                <button
                  type="button"
                  onClick={copyUPI}
                  className="text-xs px-2 py-1 rounded border"
                  style={{
                    borderColor: "oklch(0.25 0.03 260)",
                    color: "oklch(0.65 0.03 260)",
                  }}
                >
                  {copied ? "✓ Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="text-center">
              <div
                className="text-sm mb-1"
                style={{ color: "oklch(0.55 0.03 260)" }}
              >
                Amount to pay
              </div>
              <div
                className="text-3xl font-gaming"
                style={{ color: "oklch(0.65 0.22 195)" }}
              >
                ₹{selectedSlot.entryFee.toString()}
              </div>
            </div>

            <Button
              onClick={handlePaymentClaim}
              disabled={loading}
              className="btn-neon-orange w-full py-3 rounded-lg text-base"
              data-ocid="payment.paid_button"
            >
              {loading ? "Submitting..." : "✅ I Have Paid / Check Payment"}
            </Button>
          </div>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <div
            className="card-gaming border rounded-xl p-8 text-center neon-glow-cyan"
            data-ocid="payment.success_state"
          >
            <div className="text-5xl mb-4">🎉</div>
            <h2
              className="text-2xl font-gaming mb-2"
              style={{ color: "oklch(0.65 0.22 195)" }}
            >
              Payment Submitted!
            </h2>
            <p
              className="text-sm mb-6"
              style={{ color: "oklch(0.65 0.03 260)" }}
            >
              Your payment claim is awaiting admin approval.
              <br />
              You will be notified once approved.
            </p>
            <Button
              onClick={() => navigate("/history")}
              className="btn-neon-orange px-6 py-2 rounded"
            >
              View My Registrations
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
