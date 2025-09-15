import React, { useState, useEffect, type FormEvent } from "react";

// Define the shape of the data the form will handle
interface NoteFormData {
  title: string;
  content: string;
}

interface NoteFormProps {
  initialData?: NoteFormData; // Optional: for pre-filling the form in "update" mode
  onSubmit: (data: NoteFormData) => void; // Function to call when form is submitted
  isLoading: boolean; // To disable the button during submission
  submitButtonText?: string; // To customize the button text (e.g., "Save" or "Update")
}

const NoteForm: React.FC<NoteFormProps> = ({
  initialData = { title: "", content: "" },
  onSubmit,
  isLoading,
  submitButtonText = "Submit",
}) => {
  const [formData, setFormData] = useState<NoteFormData>(initialData);

  // This effect updates the form if the initialData prop changes (for editing)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-4">
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-medium text-gray-300"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
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
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={8}
          className="w-full rounded-md border border-gray-600 bg-gray-700 p-2.5 text-white placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-md bg-indigo-600 px-5 py-3 text-center font-semibold text-white transition-colors duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-800"
        >
          {isLoading ? "Saving..." : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;
