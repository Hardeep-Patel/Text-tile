import React from "react";
import UserHeader from "./UserHeader";

const UserHome = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <UserHeader /> {/* User-specific header */}
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Welcome to Your Dashboard</h2>
        <p className="text-gray-700">Here, you can manage your profile, view activities, and more.</p>
      </div>
    </div>
  );
};

export default UserHome;
