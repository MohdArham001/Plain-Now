import { useState, useEffect } from "react";
import { supabase } from "../services/supabase";

type AuthMode = "login" | "signup";

interface AuthProps {
  mode: AuthMode;
}

export const Auth: React.FC<AuthProps> = ({ mode }) => {
  const [authMode, setAuthMode] = useState<AuthMode>(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔄 Sync mode when parent changes
  useEffect(() => {
    setAuthMode(mode);
  }, [mode]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const { error } =
      authMode === "signup"
        ? await supabase.auth.signUp({ email, password })
        : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white border rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-2">
          {authMode === "signup" ? "Create your account" : "Welcome back"}
        </h1>

        <p className="text-sm text-gray-500 mb-6">
          {authMode === "signup"
            ? "Start understanding documents in seconds."
            : "Sign in to continue using PlainNow."}
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-black text-white font-semibold"
          >
            {loading
              ? "Please wait…"
              : authMode === "signup"
              ? "Create Account"
              : "Login"}
          </button>
        </div>

        <div className="mt-6 text-center text-sm">
          {authMode === "signup" ? (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setAuthMode("login")}
                className="font-medium hover:underline"
              >
                Login
              </button>
            </>
          ) : (
            <>
              New to PlainNow?{" "}
              <button
                onClick={() => setAuthMode("signup")}
                className="font-medium hover:underline"
              >
                Create account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
