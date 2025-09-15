import React from "react";
import { useNavigate } from "react-router";

export interface UserDetails {
  email: string;
  role: string;
}

export interface TenantDetails {
  name: string;
  plan: string;
}

export interface UserDetailsHeaderProps {
  user: UserDetails;
  tenant: TenantDetails;
}

const UserDetailsHeader: React.FC<UserDetailsHeaderProps> = ({
  user,
  tenant,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-gray-800 p-4">
      <div>
        <p className="text-gray-300">
          Welcome, <span className="font-bold text-white">{user.email}</span> (
          {user.role})
        </p>
        <p className="text-gray-400">
          Company:{" "}
          <span className="font-semibold text-gray-200">{tenant.name}</span>
          <span
            className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${
              tenant.plan === "Pro"
                ? "bg-green-500 text-green-900"
                : "bg-yellow-500 text-yellow-900"
            }`}
          >
            {tenant.plan} Plan
          </span>
        </p>
      </div>
      <button
        onClick={handleLogout}
        className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default UserDetailsHeader;
