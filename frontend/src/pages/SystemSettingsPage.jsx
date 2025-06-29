import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { settingsService } from '../services';

const SystemSettingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // System settings state
  const [settings, setSettings] = useState({
    maxUsersPerEvent: 100,
    maxEventsPerOrganizer: 10,
    enableRegistration: true,
    maintenanceMode: false,
    emailVerificationRequired: true,
    defaultUserRole: 'participant',
    sessionTimeout: 60, // minutes
    fileUploadLimit: 5, // MB
    allowedFileTypes: '.jpg,.png,.pdf,.doc,.docx',
    systemEmailAddress: 'system@eventflow.com',
    smtpServer: 'smtp.eventflow.com',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    analyticsEnabled: true,
    loggingLevel: 'info'
  });

  // Redirect if user is not an admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/home');
    }
  }, [user, navigate]);
  
  // Load system settings on component mount
  useEffect(() => {
    const fetchSystemSettings = async () => {
      if (!user || user.role !== 'admin') return;
      
      try {
        setLoading(true);
        const response = await settingsService.getSystemSettings();
        
        if (response.success && response.data) {
          // Update all settings from response
          setSettings(prevSettings => ({
            ...prevSettings,
            ...response.data
          }));
        }
      } catch (err) {
        console.error('Failed to fetch system settings:', err);
        setError('Failed to load system settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSystemSettings();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      // In a real app, you would save these settings to the backend
      await settingsService.updateSystemSettings(settings);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save system settings:', err);
      setError('Failed to save system settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-12">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-800 px-6 py-4">
          <h1 className="text-3xl font-bold text-white">System Settings</h1>
        </div>
        <div className="p-6">
          <p className="text-lg text-gray-700 mb-6">Configure platform-wide settings and preferences.</p>
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">System settings saved successfully!</p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSaveSettings} className="space-y-8">
            {/* General Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">General Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="maxUsersPerEvent" className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Users Per Event
                  </label>
                  <input
                    type="number"
                    name="maxUsersPerEvent"
                    id="maxUsersPerEvent"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={settings.maxUsersPerEvent}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="maxEventsPerOrganizer" className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Events Per Organizer
                  </label>
                  <input
                    type="number"
                    name="maxEventsPerOrganizer"
                    id="maxEventsPerOrganizer"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={settings.maxEventsPerOrganizer}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="sessionTimeout" className="block text-sm font-medium text-gray-700 mb-1">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    name="sessionTimeout"
                    id="sessionTimeout"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={settings.sessionTimeout}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="fileUploadLimit" className="block text-sm font-medium text-gray-700 mb-1">
                    File Upload Limit (MB)
                  </label>
                  <input
                    type="number"
                    name="fileUploadLimit"
                    id="fileUploadLimit"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={settings.fileUploadLimit}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="allowedFileTypes" className="block text-sm font-medium text-gray-700 mb-1">
                    Allowed File Types (comma separated)
                  </label>
                  <input
                    type="text"
                    name="allowedFileTypes"
                    id="allowedFileTypes"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={settings.allowedFileTypes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="mt-4 space-y-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="enableRegistration"
                      name="enableRegistration"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={settings.enableRegistration}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="enableRegistration" className="font-medium text-gray-700">Enable User Registration</label>
                    <p className="text-gray-500">Allow new users to register on the platform</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="maintenanceMode"
                      name="maintenanceMode"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={settings.maintenanceMode}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="maintenanceMode" className="font-medium text-gray-700">Maintenance Mode</label>
                    <p className="text-gray-500">Put the site in maintenance mode (only admins can access)</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="emailVerificationRequired"
                      name="emailVerificationRequired"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={settings.emailVerificationRequired}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="emailVerificationRequired" className="font-medium text-gray-700">Require Email Verification</label>
                    <p className="text-gray-500">Users must verify their email before accessing the platform</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="analyticsEnabled"
                      name="analyticsEnabled"
                      type="checkbox"
                      className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={settings.analyticsEnabled}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="analyticsEnabled" className="font-medium text-gray-700">Enable Analytics</label>
                    <p className="text-gray-500">Collect usage data to improve the platform</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* User Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">User Settings</h2>
              <div>
                <label htmlFor="defaultUserRole" className="block text-sm font-medium text-gray-700 mb-1">
                  Default User Role
                </label>
                <select
                  id="defaultUserRole"
                  name="defaultUserRole"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={settings.defaultUserRole}
                  onChange={handleInputChange}
                >
                  <option value="participant">Participant</option>
                  <option value="organizer">Organizer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            
            {/* Email Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Email Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="systemEmailAddress" className="block text-sm font-medium text-gray-700 mb-1">
                    System Email Address
                  </label>
                  <input
                    type="email"
                    name="systemEmailAddress"
                    id="systemEmailAddress"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={settings.systemEmailAddress}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-700 mb-1">
                    SMTP Server
                  </label>
                  <input
                    type="text"
                    name="smtpServer"
                    id="smtpServer"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={settings.smtpServer}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700 mb-1">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    name="smtpPort"
                    id="smtpPort"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={settings.smtpPort}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700 mb-1">
                    SMTP Username
                  </label>
                  <input
                    type="text"
                    name="smtpUsername"
                    id="smtpUsername"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={settings.smtpUsername}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    name="smtpPassword"
                    id="smtpPassword"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    value={settings.smtpPassword}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            {/* Logging Settings */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Logging</h2>
              <div>
                <label htmlFor="loggingLevel" className="block text-sm font-medium text-gray-700 mb-1">
                  Logging Level
                </label>
                <select
                  id="loggingLevel"
                  name="loggingLevel"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  value={settings.loggingLevel}
                  onChange={handleInputChange}
                >
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save System Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SystemSettingsPage;