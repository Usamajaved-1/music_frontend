"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // ✅ loading state
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // ✅ Start loading
    setError("");

    const url = isLogin
      ? "http://127.0.0.1:8000/login"
      : "http://127.0.0.1:8000/register";

    const headers = {
      "Content-Type": isLogin
        ? "application/x-www-form-urlencoded"
        : "application/json",
    };

    const body = isLogin
      ? new URLSearchParams({ username, password })
      : JSON.stringify({ username, email, password });

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Authentication failed");
      }

      const data = await response.json();

      if (isLogin) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("username", username);
        toast.success(
          data.role === "admin"
            ? "Login as admin successful!"
            : "Login successful!"
        );
        router.push(data.role === "admin" ? "/admin" : "/courses");
      } else {
        const loginRes = await fetch("http://127.0.0.1:8000/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ username, password }),
        });

        if (!loginRes.ok)
          throw new Error("Auto-login failed after registration");

        const loginData = await loginRes.json();

        localStorage.setItem("token", loginData.access_token);
        localStorage.setItem("role", loginData.role);
        localStorage.setItem("username", username);

        toast.success(
          loginData.role === "admin"
            ? "Registered & logged in as admin!"
            : "Registered & logged in!"
        );

        router.push(loginData.role === "admin" ? "/admin" : "/courses");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false); // ✅ Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-[#0f0f0f] to-[#1f1f1f] p-4 text-white">
      <div className="w-full max-w-md bg-[#1c1c1c]/80 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-indigo-400">
          {isLogin ? "Welcome Back" : "Join the Rhythm"}
        </h1>
        <p className="text-center text-sm text-gray-400 mb-6">
          {isLogin
            ? "Login to continue your musical journey"
            : "Create your free account"}
        </p>

        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
            className={`w-1/2 py-2 rounded-full text-sm font-medium transition ${
              isLogin
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
            className={`w-1/2 py-2 rounded-full text-sm font-medium transition ${
              !isLogin
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-800 hover:bg-gray-700 text-gray-300"
            }`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-center text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          )}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md font-semibold transition ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
