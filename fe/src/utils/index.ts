export const BE_URL = import.meta.env.VITE_BE_URL;
export const token = localStorage.getItem("authToken");
import Snackbar from "awesome-snackbar";

export const HandleDeleteNote = async (id: string) => {
  const token = localStorage.getItem("authToken");
  // Optimistically remove the note from the UI

  try {
    await fetch(`${BE_URL}notes/${id}`, {
      // <-- IMPORTANT: Use your backend URL
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    new Snackbar(`Note <a class='bold'>deleted</a>`, {
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
  } catch (err) {
    // If the delete fails, add the note back (or show an error message)
    console.log("Failed to delete the note. Please refresh the page.");
    new Snackbar(`Failed to delete <a class='bold'>note !</a>`, {
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
    console.log(err);
  }
};
