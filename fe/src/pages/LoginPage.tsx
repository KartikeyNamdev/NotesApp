import React, { useState, type FormEvent } from "react";
import Snackbar from "awesome-snackbar";
import { BE_URL } from "../utils";

const LoginPage: React.FC = () => {
  console.log(BE_URL);
  // State for the form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for loading and error messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BE_URL}auth/login`, {
        // <-- IMPORTANT: Use your actual backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      console.log(response);
      const data = await response.json();
      new Snackbar(`Login <a class='bold'>Successfull !</a>`, {
        position: "bottom-center",
        actionText: "Undo",
        style: {
          container: [
            ["background-color", "green"],
            ["border-radius", "5px"],
          ],
          message: [["color", "#eee"]],
          bold: [["font-weight", "bold"]],
          actionButton: [["color", "white"]],
        },
      });

      if (!response.ok) {
        throw new Error(data.message || "Failed to login");
      }

      // On success, store the token and redirect
      localStorage.setItem("authToken", data.token);
      window.location.href = "/notes"; // Redirect to AllNotesPage
    } catch (err) {
      //   setError(err.message);
      console.log(err);
    } finally {
      setLoading(false);
      new Snackbar(`Login <a class='bold'>Failed !</a>`, {
        position: "bottom-center",
        actionText: "Undo",
        style: {
          container: [
            ["background-color", "red"],
            ["border-radius", "5px"],
          ],
          message: [["color", "#eee"]],
          bold: [["font-weight", "bold"]],
          actionButton: [["color", "white"]],
        },
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          Welcome Back
        </h2>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="mb-4 rounded-md bg-red-900 p-3 text-center text-red-200">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="admin@acme.test"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 px-5 py-2.5 text-center font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-800"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
