// src/pages/AllNotesPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import NoteCard, { type Note } from "../components/NoteCard";
import UserDetailsHeader, {
  type TenantDetails,
  type UserDetails,
} from "../components/UserHeaderDetail";
import { BE_URL } from "../utils";
interface user {
  user: UserDetails;
  tenant: TenantDetails;
}
export const AllNotesPage: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [userDetails, setUserDetails] = useState<user>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        navigate("/login"); // Redirect to login if no token
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch both notes and user details at the same time
        const [notesResponse, userResponse] = await Promise.all([
          fetch(`${BE_URL}notes`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${BE_URL}notes/me`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!notesResponse.ok || !userResponse.ok) {
          throw new Error("Failed to fetch data. Please try logging in again.");
        }

        const notesData = await notesResponse.json();
        const userData = await userResponse.json();

        setNotes(notesData.data);
        setUserDetails(userData);
      } catch (err) {
        if (err instanceof Error) {
          // Now TypeScript knows that 'err' has a .message property
          setError(err.message);
        } else {
          // Handle cases where a non-Error was thrown
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleNoteClick = (id: string) => {
    navigate(`/notes/${id}`);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-900 text-center text-white p-10">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        {userDetails && (
          <UserDetailsHeader
            user={userDetails.user}
            tenant={userDetails.tenant}
          />
        )}

        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-white">My Notes</h1>
          <button
            onClick={() => navigate("/notes/new")}
            className="rounded-md bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
          >
            + New Note
          </button>
        </div>

        {error && <p className="mb-4 text-center text-red-400">{error}</p>}

        {notes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => handleNoteClick(note.id)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-20 rounded-lg border-2 border-dashed border-gray-700 p-12 text-center text-gray-400">
            <p>You haven't created any notes yet.</p>
            <p className="mt-2 text-sm">Click "+ New Note" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNotesPage;
