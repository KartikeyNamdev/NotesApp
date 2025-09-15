import React from "react";
import type { MouseEvent } from "react";
import type { MouseEventHandler } from "react";

// Define the shape of a single note object
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  onClick: MouseEvent;
}

interface NoteCardProps {
  note: Note;
  onClick: MouseEventHandler<HTMLDivElement> | undefined;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col justify-between rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-md transition-shadow duration-200 hover:shadow-lg hover:shadow-indigo-500/10"
    >
      <div>
        <h3 className="mb-2 text-xl font-bold text-white">{note.title}</h3>
        <p className="mb-4 text-gray-300">{note.content}</p>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-gray-600 pt-4">
        <p className="text-xs text-gray-400">
          Created on: {new Date(note.createdAt).toLocaleDateString()}
        </p>
        <button className="rounded-md bg-green-400 px-3 py-1 text-sm font-semibold text-white transition-colors hover:bg-green-700">
          View
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
