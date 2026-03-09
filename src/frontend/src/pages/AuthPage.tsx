import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function AuthPage() {
  const { identity, login, isLoggingIn, isInitializing } =
    useInternetIdentity();
  const isAuthenticated = !!identity;
  const { actor } = useActor();
  const navigate = useNavigate();

  const [step, setStep] = useState<"login" | "profile">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [saving, setSaving] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(false);

  useEffect(() => {
    if (isAuthenticated && actor) {
      setCheckingProfile(true);
      actor
        .getCallerUserProfile()
        .then((profile) => {
          if (profile) {
            navigate("/register");
          } else {
            setStep("profile");
          }
        })
        .catch(() => {
          setStep("profile");
        })
        .finally(() => {
          setCheckingProfile(false);
        });
    }
  }, [isAuthenticated, actor, navigate]);

  const handleProfileSave = async () => {
    if (!actor) return;
    if (!name.trim() || !email.trim() || !age.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    const ageNum = Number.parseInt(age, 10);
    if (Number.isNaN(ageNum) || ageNum < 10 || ageNum > 100) {
      toast.error("Please enter a valid age");
      return;
    }
    setSaving(true);
    try {
      await actor.saveUserProfile(name.trim(), email.trim(), BigInt(ageNum));
      toast.success("Profile saved!");
      navigate("/register");
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (isInitializing || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⚙️</div>
          <p style={{ color: "oklch(0.55 0.03 260)" }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-gaming mb-2"
            style={{
              color: "oklch(0.72 0.19 45)",
              fontFamily: "Rajdhani, sans-serif",
            }}
          >
            AR ESPORTS
          </h1>
          <p style={{ color: "oklch(0.55 0.03 260)" }}>
            {step === "login"
              ? "Login to join the battle"
              : "Complete your profile"}
          </p>
        </div>

        <div className="card-gaming border rounded-xl p-8 neon-glow-orange">
          {step === "login" && (
            <div className="space-y-4">
              <p
                className="text-center text-sm mb-6"
                style={{ color: "oklch(0.65 0.03 260)" }}
              >
                Use Internet Identity to securely log in. No password needed.
              </p>
              <Button
                onClick={login}
                disabled={isLoggingIn}
                className="btn-neon-orange w-full py-3 rounded-lg"
                data-ocid="auth.login_button"
              >
                {isLoggingIn
                  ? "Connecting..."
                  : "🔐 Login with Internet Identity"}
              </Button>
              <div className="relative my-4">
                <div
                  className="border-t"
                  style={{ borderColor: "oklch(0.22 0.03 260)" }}
                />
                <span
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 text-xs"
                  style={{
                    background: "oklch(0.11 0.015 260)",
                    color: "oklch(0.45 0.02 260)",
                  }}
                >
                  or
                </span>
              </div>
              <button
                type="button"
                onClick={login}
                className="w-full py-3 rounded-lg border text-sm flex items-center justify-center gap-2 transition-all hover:border-orange-400/40"
                style={{
                  borderColor: "oklch(0.25 0.03 260)",
                  color: "oklch(0.75 0.03 260)",
                  background: "transparent",
                }}
                data-ocid="auth.login_button"
              >
                <span>🌐</span> Continue with Google Sign-In via II
              </button>
            </div>
          )}

          {step === "profile" && (
            <div className="space-y-5">
              <p
                className="text-center text-sm mb-2"
                style={{ color: "oklch(0.65 0.03 260)" }}
              >
                Set up your player profile
              </p>
              <div className="space-y-2">
                <Label
                  htmlFor="profile-name"
                  style={{ color: "oklch(0.75 0.03 260)" }}
                >
                  Name
                </Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  data-ocid="auth.profile.name_input"
                  style={{
                    background: "oklch(0.14 0.02 260)",
                    borderColor: "oklch(0.25 0.03 260)",
                    color: "oklch(0.95 0.02 80)",
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="profile-email"
                  style={{ color: "oklch(0.75 0.03 260)" }}
                >
                  Email
                </Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  data-ocid="auth.profile.email_input"
                  style={{
                    background: "oklch(0.14 0.02 260)",
                    borderColor: "oklch(0.25 0.03 260)",
                    color: "oklch(0.95 0.02 80)",
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="profile-age"
                  style={{ color: "oklch(0.75 0.03 260)" }}
                >
                  Age
                </Label>
                <Input
                  id="profile-age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                  data-ocid="auth.profile.age_input"
                  style={{
                    background: "oklch(0.14 0.02 260)",
                    borderColor: "oklch(0.25 0.03 260)",
                    color: "oklch(0.95 0.02 80)",
                  }}
                />
              </div>
              <Button
                onClick={handleProfileSave}
                disabled={saving}
                className="btn-neon-orange w-full py-3 rounded-lg mt-2"
                data-ocid="auth.profile.submit_button"
              >
                {saving ? "Saving..." : "Save & Continue"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
