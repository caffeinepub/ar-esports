import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Navbar() {
  const { identity, clear } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: "oklch(0.09 0.015 260 / 0.95)",
        borderColor: "oklch(0.22 0.03 260)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2"
            data-ocid="nav.home_link"
          >
            <span
              className="text-2xl font-gaming animate-pulse-glow"
              style={{
                color: "oklch(0.72 0.19 45)",
                fontFamily: "Rajdhani, sans-serif",
                fontWeight: 900,
                letterSpacing: "0.1em",
              }}
            >
              AR ESPORTS
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium hover:text-orange-400 transition-colors"
              style={{ color: "oklch(0.75 0.03 260)" }}
              data-ocid="nav.home_link"
            >
              Home
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium hover:text-orange-400 transition-colors"
              style={{ color: "oklch(0.75 0.03 260)" }}
              data-ocid="nav.tournaments_link"
            >
              Tournaments
            </Link>
            {isAuthenticated && (
              <Link
                to="/history"
                className="text-sm font-medium hover:text-orange-400 transition-colors"
                style={{ color: "oklch(0.75 0.03 260)" }}
                data-ocid="nav.history_link"
              >
                My History
              </Link>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <Button
                className="btn-neon-orange px-4 py-2 rounded text-sm"
                onClick={() => navigate("/auth")}
                data-ocid="nav.login_button"
              >
                Login
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-9 h-9 p-0 text-lg"
                    data-ocid="nav.user_menu.dropdown_menu"
                  >
                    ⋮
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  style={{
                    background: "oklch(0.12 0.015 260)",
                    border: "1px solid oklch(0.25 0.03 260)",
                  }}
                >
                  <DropdownMenuItem
                    onClick={() => navigate("/history")}
                    data-ocid="nav.history_menu.link"
                    className="cursor-pointer"
                  >
                    My History
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      clear();
                      navigate("/");
                    }}
                    data-ocid="nav.logout_button"
                    className="cursor-pointer text-red-400"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ color: "oklch(0.72 0.19 45)" }}
            >
              {mobileOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block px-3 py-2 text-sm"
              style={{ color: "oklch(0.75 0.03 260)" }}
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.home_link"
            >
              Home
            </Link>
            <Link
              to="/register"
              className="block px-3 py-2 text-sm"
              style={{ color: "oklch(0.75 0.03 260)" }}
              onClick={() => setMobileOpen(false)}
              data-ocid="nav.tournaments_link"
            >
              Tournaments
            </Link>
            {isAuthenticated && (
              <Link
                to="/history"
                className="block px-3 py-2 text-sm"
                style={{ color: "oklch(0.75 0.03 260)" }}
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.history_link"
              >
                My History
              </Link>
            )}
            {!isAuthenticated ? (
              <button
                type="button"
                className="block px-3 py-2 text-sm btn-neon-orange rounded"
                onClick={() => {
                  navigate("/auth");
                  setMobileOpen(false);
                }}
                data-ocid="nav.login_button"
              >
                Login
              </button>
            ) : (
              <button
                type="button"
                className="block px-3 py-2 text-sm text-red-400"
                onClick={() => {
                  clear();
                  navigate("/");
                  setMobileOpen(false);
                }}
                data-ocid="nav.logout_button"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
