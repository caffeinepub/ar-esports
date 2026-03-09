import { useState } from "react";
import { toast } from "sonner";
import type { Registration, UserProfile } from "../backend.d";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { useActor } from "../hooks/useActor";

const SLOT_NAMES: Record<string, string> = {
  "1": "11:00 AM 2v2",
  "2": "1:00 PM 4v4",
  "3": "4:00 PM 2v2",
  "4": "8:00 PM 4v4",
};

type RegistrationStatus = "pending" | "approved" | "rejected";

function patchStatus(
  regs: Registration[],
  id: string,
  status: RegistrationStatus,
): Registration[] {
  return regs.map((r) =>
    r.id === id
      ? { ...r, status: status as unknown as Registration["status"] }
      : r,
  );
}

export default function AdminPage() {
  const { actor } = useActor();
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState("");
  const [logging, setLogging] = useState(false);

  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAdminLogin = async () => {
    if (!actor) return;
    setLogging(true);
    setAuthError("");
    try {
      const ok = await actor.adminLogin(password);
      if (ok) {
        setIsAdmin(true);
        void loadData();
      } else {
        setAuthError("Invalid password. Please try again.");
      }
    } catch {
      setAuthError("Login failed. Please try again.");
    } finally {
      setLogging(false);
    }
  };

  const loadData = async () => {
    if (!actor) return;
    try {
      const [regs, usrs] = await Promise.all([
        actor.getAllRegistrations(),
        actor.getAllUsers(),
      ]);
      setRegistrations(regs);
      setUsers(usrs);
      setDataLoaded(true);
    } catch {
      toast.error("Failed to load data");
    }
  };

  const handleApprove = async (id: string, idx: number) => {
    if (!actor) return;
    setLoadingAction(id);
    try {
      await actor.approvePayment(id);
      toast.success(`Registration #${idx + 1} approved!`);
      setRegistrations((prev) => patchStatus(prev, id, "approved"));
    } catch {
      toast.error("Failed to approve");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (id: string, idx: number) => {
    if (!actor) return;
    const rejectKey = `${id}_reject`;
    setLoadingAction(rejectKey);
    try {
      await actor.rejectPayment(id);
      toast.success(`Registration #${idx + 1} rejected`);
      setRegistrations((prev) => patchStatus(prev, id, "rejected"));
    } catch {
      toast.error("Failed to reject");
    } finally {
      setLoadingAction(null);
    }
  };

  const formatDate = (ts: bigint) => {
    if (!ts) return "—";
    const ms = Number(ts) / 1_000_000;
    return new Date(ms).toLocaleDateString("en-IN");
  };

  const pending = registrations.filter(
    (r) => r.status.toString() === "pending",
  );

  const inputStyle = {
    background: "oklch(0.14 0.02 260)",
    borderColor: "oklch(0.25 0.03 260)",
    color: "oklch(0.95 0.02 80)",
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="text-4xl mb-2">🔒</div>
            <h1
              className="text-3xl font-gaming"
              style={{ color: "oklch(0.72 0.19 45)" }}
            >
              Admin Panel
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "oklch(0.55 0.03 260)" }}
            >
              Restricted access
            </p>
          </div>
          <div className="card-gaming border rounded-xl p-6 neon-glow-orange space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="admin-password"
                className="text-sm"
                style={{ color: "oklch(0.75 0.03 260)" }}
              >
                Admin Password
              </label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && void handleAdminLogin()}
                placeholder="Enter password"
                data-ocid="admin.password_input"
                style={inputStyle}
              />
            </div>
            {authError && (
              <p className="text-sm" style={{ color: "oklch(0.6 0.22 25)" }}>
                {authError}
              </p>
            )}
            <Button
              onClick={() => void handleAdminLogin()}
              disabled={logging}
              className="btn-neon-orange w-full py-3 rounded-lg"
              data-ocid="admin.login_button"
            >
              {logging ? "Verifying..." : "Enter Admin Panel"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1
            className="text-4xl font-gaming"
            style={{ color: "oklch(0.72 0.19 45)" }}
          >
            Admin Panel
          </h1>
          <div className="flex items-center gap-3">
            <span
              className="text-xs px-2 py-1 rounded"
              style={{
                background: "oklch(0.72 0.2 145 / 0.15)",
                color: "oklch(0.72 0.2 145)",
              }}
            >
              ● Live
            </span>
            <button
              type="button"
              onClick={() => void loadData()}
              className="text-xs px-3 py-1 rounded border"
              style={{
                borderColor: "oklch(0.25 0.03 260)",
                color: "oklch(0.65 0.03 260)",
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        {!dataLoaded ? (
          <div
            className="text-center py-16"
            style={{ color: "oklch(0.45 0.02 260)" }}
          >
            Loading data...
          </div>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList
              className="mb-6"
              style={{ background: "oklch(0.12 0.015 260)" }}
            >
              <TabsTrigger value="pending" data-ocid="admin.pending.tab">
                Pending Approvals{" "}
                {pending.length > 0 && (
                  <span
                    className="ml-2 px-1.5 py-0.5 rounded-full text-xs"
                    style={{
                      background: "oklch(0.72 0.19 45)",
                      color: "oklch(0.08 0.01 260)",
                    }}
                  >
                    {pending.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="registrations"
                data-ocid="admin.registrations.tab"
              >
                All Registrations
              </TabsTrigger>
              <TabsTrigger value="users" data-ocid="admin.users.tab">
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              <h2
                className="text-xl font-gaming mb-4"
                style={{ color: "oklch(0.82 0.18 75)" }}
              >
                Pending Payment Approvals ({pending.length})
              </h2>
              {pending.length === 0 ? (
                <div
                  className="card-gaming border rounded-xl p-10 text-center"
                  style={{ color: "oklch(0.45 0.02 260)" }}
                >
                  No pending approvals
                </div>
              ) : (
                <div className="space-y-3">
                  {pending.map((reg, i) => (
                    <div
                      key={reg.id}
                      className="card-gaming border rounded-xl p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div
                            className="font-gaming text-lg"
                            style={{ color: "oklch(0.95 0.02 80)" }}
                          >
                            {reg.gameName}
                          </div>
                          <div
                            className="text-sm"
                            style={{ color: "oklch(0.65 0.22 195)" }}
                          >
                            {SLOT_NAMES[reg.slotId.toString()] ??
                              `Slot ${reg.slotId.toString()}`}
                          </div>
                          <div
                            className="text-xs space-x-3"
                            style={{ color: "oklch(0.55 0.03 260)" }}
                          >
                            <span>UID: {reg.ffUID}</span>
                            <span>📞 {reg.phone}</span>
                          </div>
                          <div
                            className="text-xs"
                            style={{ color: "oklch(0.55 0.03 260)" }}
                          >
                            UPI/Insta: {reg.upiOrInsta}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => void handleApprove(reg.id, i)}
                            disabled={loadingAction === reg.id}
                            data-ocid={`admin.approve_button.${i + 1}`}
                            className="px-4 py-2 rounded text-sm font-semibold"
                            style={{
                              background: "oklch(0.72 0.2 145 / 0.2)",
                              color: "oklch(0.72 0.2 145)",
                              border: "1px solid oklch(0.72 0.2 145 / 0.4)",
                            }}
                          >
                            {loadingAction === reg.id ? "..." : "✓ Approve"}
                          </Button>
                          <Button
                            onClick={() => void handleReject(reg.id, i)}
                            disabled={loadingAction === `${reg.id}_reject`}
                            data-ocid={`admin.reject_button.${i + 1}`}
                            className="px-4 py-2 rounded text-sm font-semibold"
                            style={{
                              background: "oklch(0.6 0.22 25 / 0.15)",
                              color: "oklch(0.6 0.22 25)",
                              border: "1px solid oklch(0.6 0.22 25 / 0.4)",
                            }}
                          >
                            {loadingAction === `${reg.id}_reject`
                              ? "..."
                              : "✗ Reject"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="registrations">
              <h2
                className="text-xl font-gaming mb-4"
                style={{ color: "oklch(0.75 0.03 260)" }}
              >
                All Registrations ({registrations.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{ borderBottom: "1px solid oklch(0.22 0.03 260)" }}
                    >
                      {[
                        "Game Name",
                        "Slot",
                        "FF UID",
                        "Phone",
                        "UPI/Insta",
                        "Status",
                        "Date",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left py-3 px-3"
                          style={{
                            color: "oklch(0.55 0.03 260)",
                            fontWeight: 500,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((reg) => (
                      <tr
                        key={reg.id}
                        style={{
                          borderBottom: "1px solid oklch(0.15 0.02 260)",
                        }}
                      >
                        <td
                          className="py-3 px-3"
                          style={{ color: "oklch(0.95 0.02 80)" }}
                        >
                          {reg.gameName}
                        </td>
                        <td
                          className="py-3 px-3"
                          style={{ color: "oklch(0.65 0.22 195)" }}
                        >
                          {SLOT_NAMES[reg.slotId.toString()] ??
                            reg.slotId.toString()}
                        </td>
                        <td
                          className="py-3 px-3 font-mono text-xs"
                          style={{ color: "oklch(0.75 0.03 260)" }}
                        >
                          {reg.ffUID}
                        </td>
                        <td
                          className="py-3 px-3"
                          style={{ color: "oklch(0.75 0.03 260)" }}
                        >
                          {reg.phone}
                        </td>
                        <td
                          className="py-3 px-3 text-xs"
                          style={{ color: "oklch(0.65 0.03 260)" }}
                        >
                          {reg.upiOrInsta}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-xs font-semibold status-${reg.status.toString()}`}
                          >
                            {reg.status.toString()}
                          </span>
                        </td>
                        <td
                          className="py-3 px-3"
                          style={{ color: "oklch(0.55 0.03 260)" }}
                        >
                          {formatDate(reg.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <h2
                className="text-xl font-gaming mb-4"
                style={{ color: "oklch(0.75 0.03 260)" }}
              >
                Registered Users ({users.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      style={{ borderBottom: "1px solid oklch(0.22 0.03 260)" }}
                    >
                      {["Name", "Email", "Age", "Joined"].map((h) => (
                        <th
                          key={h}
                          className="text-left py-3 px-3"
                          style={{
                            color: "oklch(0.55 0.03 260)",
                            fontWeight: 500,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, i) => (
                      <tr
                        key={user.email || String(i)}
                        style={{
                          borderBottom: "1px solid oklch(0.15 0.02 260)",
                        }}
                      >
                        <td
                          className="py-3 px-3"
                          style={{ color: "oklch(0.95 0.02 80)" }}
                        >
                          {user.name}
                        </td>
                        <td
                          className="py-3 px-3"
                          style={{ color: "oklch(0.75 0.03 260)" }}
                        >
                          {user.email}
                        </td>
                        <td
                          className="py-3 px-3"
                          style={{ color: "oklch(0.75 0.03 260)" }}
                        >
                          {user.age.toString()}
                        </td>
                        <td
                          className="py-3 px-3"
                          style={{ color: "oklch(0.55 0.03 260)" }}
                        >
                          {formatDate(user.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
