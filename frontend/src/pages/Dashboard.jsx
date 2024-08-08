import React from 'react';

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex flex-col items-center">
          {/* Profile Picture */}
          <img
            className="w-24 h-24 rounded-full border-4 border-indigo-500 shadow-md"
            src={user.coverImage || 'https://via.placeholder.com/100'}
            alt={user.username}
          />

          {/* User Information */}
          <h2 className="mt-4 text-3xl font-semibold text-indigo-700">
            {user.username}
          </h2>
          <p className="text-gray-600">{user.email}</p>

          {/* Decorative Divider */}
          <div className="w-full border-t-2 border-indigo-100 my-6"></div>

          {/* Stats or Info Section */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-indigo-100 p-4 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                User Stats
              </h3>
              <p className="text-gray-700">Details about user activity</p>
            </div>
            <div className="bg-indigo-100 p-4 rounded-lg shadow-inner">
              <h3 className="text-xl font-semibold text-indigo-700 mb-2">
                Achievements
              </h3>
              <p className="text-gray-700">User achievements displayed here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
