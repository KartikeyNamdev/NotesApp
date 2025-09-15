import { AllNotesPage } from "./pages/AllNotes.tsx";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route } from "react-router";
import LoginPage from "./pages/LoginPage.tsx";
import SingleNotePage from "./pages/SpecificNote.tsx";
import CreateNotePage from "./pages/CreateNotePage.tsx";

createRoot(document.getElementById("root")!).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/notes" element={<AllNotesPage />} />
        <Route path="/notes/:id" element={<SingleNotePage />} />
        <Route path="/notes/new" element={<CreateNotePage />} />
        <Route path="/tenants/:slug/upgrade" element={<CreateNotePage />} />
      </Routes>
    </BrowserRouter>
  </>
);
