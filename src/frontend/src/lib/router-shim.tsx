/**
 * Compatibility shim: adapts @tanstack/react-router to a react-router-dom-like API.
 * Used by all page components to avoid react-router-dom dependency.
 */
export { Link } from "@tanstack/react-router";

import { useNavigate as useTanstackNavigate } from "@tanstack/react-router";

/**
 * Drop-in replacement for react-router-dom's useNavigate.
 * Returns a function that accepts either a string path or an options object.
 */
export function useNavigate() {
  const tanstackNavigate = useTanstackNavigate();
  return (to: string | { to?: string; replace?: boolean }) => {
    if (typeof to === "string") {
      return tanstackNavigate({ to });
    }
    return tanstackNavigate(to as Parameters<typeof tanstackNavigate>[0]);
  };
}
