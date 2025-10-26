import React from 'react';
import { User, Mail, Edit2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Added for navigation
import { useSelector } from 'react-redux';



const Profile = () => {
  const navigate = useNavigate(); // Added for navigation
  const { user } = useSelector((state) => state.auth);

  // Function to handle back navigation
  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  console.log('User data in Profile component:', user);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <p className="text-white text-lg">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="flex-1 flex flex-col p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>
        <div className="max-w-md mx-auto bg-gray-800 bg-opacity-90 rounded-xl p-6 shadow-md hover:shadow-lg transition-all">
          <h1 className="text-2xl font-bold text-white mb-6">User Profile</h1>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <User className="w-6 h-6 text-gray-300" />
              <div>
                <label className="block text-sm font-medium text-gray-300">Name</label>
                <p className="text-white text-lg">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-gray-300" />
              <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <p className="text-white text-lg">{user.email}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all"
              onClick={() => alert('Edit profile functionality to be implemented')}
            >
              <Edit2 className="w-5 h-5" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;