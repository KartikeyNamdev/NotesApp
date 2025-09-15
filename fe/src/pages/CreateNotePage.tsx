import { BE_URL } from "../utils";
import Snackbar from "awesome-snackbar";
import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";

const CreateNotePage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to create a note.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BE_URL}notes`, {
        // <-- IMPORTANT: Use your backend URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await response.json();

      if (!response.ok) {
        // This will catch errors like the 3-note limit
        throw new Error(data.message || "Failed to create note.");
      }
      new Snackbar(`Note created <a class='bold'>Successfully !</a>`, {
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

      // On success, redirect to the main notes page
      navigate("/notes");
    } catch (err: Error | unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-2xl rounded-lg bg-gray-800 p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-white">Create a New Note</h2>
          <button
            onClick={() => navigate("/notes")}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            &larr; Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {error && (
            <div className="mb-4 rounded-md bg-red-900 p-3 text-center text-red-200">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="My new note title"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={8}
              className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="Write your thoughts here..."
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-indigo-600 px-5 py-3 text-center font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-800"
            >
              {loading ? "Saving..." : "Save Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNotePage;
