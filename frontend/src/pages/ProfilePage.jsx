import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { authService } from '../services';
import { PageLoader } from '../components/common';

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    college: ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await authService.getCurrentUser();
        setProfileData(response.user);
        setFormData({
          firstName: response.user.firstName,
          lastName: response.user.lastName,
          email: response.user.email,
          college: response.user.college
        });
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.updateProfile(formData);
      setProfileData(response.user);
      setUpdateSuccess(true);
      setIsEditing(false);
      setTimeout(() => {
        setUpdateSuccess(false);
      }, 3000);
    } catch (error) {
      setError(error.message || 'Failed to update profile');
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const renderRoleSpecificInfo = () => {
    if (!profileData) return null;

    const roleInfo = {
      admin: {
        title: 'Admin Information',
        description: 'As an admin, you have full access to manage the platform.',
        features: [
          'Manage all users and their roles',
          'Approve or reject events',
          'Access platform analytics',
          'Configure system settings'
        ],
        colors: 'bg-purple-50 border-purple-200 text-purple-800'
      },
      organizer: {
        title: 'Organizer Information',
        description: 'As an organizer, you can create and manage events.',
        features: [
          'Create new events',
          'Manage your existing events',
          'View participant registrations',
          'Send announcements to participants'
        ],
        colors: 'bg-blue-50 border-blue-200 text-blue-800'
      },
      participant: {
        title: 'Participant Information',
        description: 'As a participant, you can register for and attend events.',
        features: [
          'Browse and register for events',
          'View your registered events',
          'Receive event updates',
          'Participate in event activities'
        ],
        colors: 'bg-green-50 border-green-200 text-green-800'
      }
    };

    const currentRoleInfo = roleInfo[profileData.role];

    if (!currentRoleInfo) return null;

    return (
      <div className={`mt-8 p-6 rounded-2xl border ${currentRoleInfo.colors}`}>
        <h3 className="text-xl font-bold mb-2">{currentRoleInfo.title}</h3>
        <p className="mb-4">{currentRoleInfo.description}</p>
        <ul className="list-disc list-inside space-y-2">
          {currentRoleInfo.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
    );
  };

  if (loading) {
    return <PageLoader text="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600">View and edit your personal information</p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {updateSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6" role="alert">
                Profile updated successfully!
              </div>
            )}

            {profileData && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left column for photo and basic info */}
                <div className="md:col-span-1 flex flex-col items-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <span className="text-5xl font-bold text-gray-500">
                      {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 text-center">
                    {profileData.firstName} {profileData.lastName}
                  </h2>
                  <span className={`mt-2 py-1 px-4 rounded-full text-sm font-semibold capitalize ${
                    profileData.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                    profileData.role === 'organizer' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {profileData.role}
                  </span>
                </div>

                {/* Right column for details and editing */}
                <div className="md:col-span-2">
                  {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                          required
                          disabled
                        />
                         <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                      </div>
                      <div>
                        <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">College</label>
                        <input
                          type="text"
                          id="college"
                          name="college"
                          value={formData.college}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-sm"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-200 font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">First Name</h3>
                          <p className="mt-1 text-lg text-gray-900">{profileData.firstName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Last Name</h3>
                          <p className="mt-1 text-lg text-gray-900">{profileData.lastName}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email</h3>
                        <p className="mt-1 text-lg text-gray-900">{profileData.email}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">College</h3>
                        <p className="mt-1 text-lg text-gray-900">{profileData.college}</p>
                      </div>
                      <div>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-semibold shadow-sm"
                        >
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {renderRoleSpecificInfo()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;