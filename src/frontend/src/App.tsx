import {
  Outlet,
  RootRoute,
  Route,
  Router,
  RouterProvider,
  createHashHistory,
} from "@tanstack/react-router";
import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/sonner";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";

// Root layout component
function RootLayout() {
  const { isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center"
        style={{ background: "oklch(0.08 0.01 260)" }}
      >
        <div className="flex flex-col items-center gap-6">
          <span
            style={{
              fontFamily: "Rajdhani, sans-serif",
              fontWeight: 900,
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              letterSpacing: "0.15em",
              color: "oklch(0.72 0.19 45)",
              textShadow:
                "0 0 20px oklch(0.72 0.19 45 / 0.8), 0 0 50px oklch(0.72 0.19 45 / 0.4), 0 0 80px oklch(0.72 0.19 45 / 0.2)",
            }}
          >
            AR ESPORTS
          </span>
          <div className="relative w-12 h-12">
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
              style={{
                borderTopColor: "oklch(0.72 0.19 45)",
                borderRightColor: "oklch(0.72 0.19 45 / 0.4)",
              }}
            />
            <div
              className="absolute inset-1 rounded-full border border-transparent"
              style={{
                borderBottomColor: "oklch(0.6 0.22 160 / 0.6)",
                animation: "spin 1.5s linear infinite reverse",
              }}
            />
          </div>
          <p
            style={{
              color: "oklch(0.55 0.05 260)",
              fontSize: "0.85rem",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: "oklch(0.08 0.01 260)" }}
    >
      <Navbar />
      <Outlet />
      <Toaster position="top-center" />
    </div>
  );
}

// Route tree
const rootRoute = new RootRoute({ component: RootLayout });

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const authRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/auth",
  component: AuthPage,
});

const registerRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: RegisterPage,
});

const historyRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/history",
  component: HistoryPage,
});

const adminRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  authRoute,
  registerRoute,
  historyRoute,
  adminRoute,
]);

const hashHistory = createHashHistory();

const router = new Router({ routeTree, history: hashHistory });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
