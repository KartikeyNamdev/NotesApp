import "./App.css";
import { Buttons } from "./components/Buttons";
import { useNavigate } from "react-router";

function App() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
      <main className="flex w-full flex-1 flex-col items-center justify-center px-4 text-center md:px-20">
        <h1 className="text-5xl font-extrabold leading-tight md:text-7xl">
          Your Notes, <span className="text-indigo-500">Organized</span> and
          <span className="text-indigo-500">Secure</span>.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-300 md:text-xl">
          Welcome to the multi-tenant notes application. Securely manage your
          team's notes with strict data isolation and role-based access.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {/* Replace 'a' with 'Link' if using React Router */}
          <Buttons
            onClick={() => {
              navigate("/login");
            }} // This should point to your login page
            className="transform rounded-md bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform duration-200 ease-in-out hover:-translate-y-1 hover:bg-indigo-700"
          >
            Get Started
          </Buttons>
        </div>
      </main>

      <footer className="w-full border-t border-gray-700 p-4 text-center text-sm text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} NotesApp Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;

// You might want to use Link from 'react-router-dom' if you have routing set up
// import { Link } from 'react-router-dom';
