import { BE_URL } from "../utils";
import React, { useState, useEffect, type FormEvent } from "react";
import { useParams, useNavigate } from "react-router"; // Use react-router-dom
import { type Note } from "../components/NoteCard";
import { HandleDeleteNote } from "../utils";

const SingleNotePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null | unknown>(null);

  // --- State for Edit Mode ---
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchSingleNote = async () => {
      // ... (your existing fetch logic is perfect)
      const token = localStorage.getItem("authToken");
      if (!id || !token) {
        /* ... */ return;
      }
      try {
        const response = await fetch(`${BE_URL}notes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Note not found.");
        }
        const data = await response.json();
        setNote(data.data);
        // Pre-fill the edit fields when data is fetched
        setEditedTitle(data.data.title);
        setEditedContent(data.data.content);
      } catch (err: unknown) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSingleNote();
  }, [id]);

  const handleUpdateSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setUpdateLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`${BE_URL}notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editedTitle, content: editedContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to update note.");
      }

      // Update the main note state and exit edit mode
      setNote((prevNote) =>
        prevNote
          ? { ...prevNote, title: editedTitle, content: editedContent }
          : null
      );
      setIsEditing(false);
    } catch (err: unknown) {
      setError(err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    // ... (your existing delete logic)
    HandleDeleteNote(id);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 text-center text-white p-10">
        Loading note...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-gray-900 text-center text-red-500 p-10">
        {JSON.stringify(error)}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate("/notes")}
          className="mb-8 text-indigo-400 hover:text-indigo-300"
        >
          &larr; Back to all notes
        </button>
        {note && (
          <div className="rounded-lg bg-gray-800 p-8">
            {isEditing ? (
              // --- EDIT MODE ---
              <form onSubmit={handleUpdateSubmit}>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full rounded-md border-gray-600 bg-gray-700 p-2 text-4xl font-bold mb-4 text-white focus:border-indigo-500 focus:ring-indigo-500"
                />
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  rows={10}
                  className="w-full rounded-md border-gray-600 bg-gray-700 p-2 text-lg text-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
                <div className="mt-6 flex gap-4">
                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {updateLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="rounded-md bg-gray-600 px-4 py-2 font-semibold text-white hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              // --- VIEW MODE ---
              <div>
                <h1 className="text-4xl font-bold mb-4">{note.title}</h1>
                <p className="text-gray-400 mb-6 text-sm">
                  Created on: {new Date(note.createdAt).toLocaleString()}
                </p>
                <div className="prose prose-invert max-w-none text-lg text-gray-300 whitespace-pre-wrap">
                  {note.content}
                </div>
                <div className="mt-8 border-t border-gray-700 pt-6 flex gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      handleDelete(note.id);
                      navigate("/notes");
                    }}
                    className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleNotePage;
