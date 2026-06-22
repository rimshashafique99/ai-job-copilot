import React from "react";

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Profile</h1>
        <p className="text-sm text-slate-300">
          This is your profile page. Add user settings, account details, and
          preferences here.
        </p>
      </div>
    </div>
  );
};

export default Profile;
