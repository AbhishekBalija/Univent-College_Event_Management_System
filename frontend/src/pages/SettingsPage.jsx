import { useState, useEffect } from 'react';
import { useAuth } from '../context';
import { settingsService } from '../services';

const SettingsPage = () => {
  const { user } = useAuth();
  const [notification, setNotification] = useState({
    email: true,
    push: true,
    sms: false
  });
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('english');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleNotificationChange = (type) => {
    setNotification(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleThemeChange = (e) => {
    setTheme(e.target.value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Load user settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch settings from the backend
        // const userSettings = await settingsService.getUserSettings();
        // setNotification(userSettings.notification);
        // setTheme(userSettings.theme);
        // setLanguage(userSettings.language);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (err) {
        console.error('Failed to fetch settings:', err);
        setError('Failed to load your settings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);

    try {
      // In a real app, you would save these settings to the backend
      await settingsService.updateUserSettings({
        notification,
        theme,
        language
      });
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
      setError('Failed to save settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-12">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-800 px-6 py-4">
          <h1 className="text-3xl font-bold text-white">User Settings</h1>
        </div>
        <div className="p-6">
          <p className="text-lg text-gray-700 mb-6">Customize your experience, {user?.firstName || 'User'}!</p>
          
          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Settings saved successfully!</p>
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
          
          <form onSubmit={handleSaveSettings}>
            {/* Notification Settings */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="email-notifications"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={notification.email}
                    onChange={() => handleNotificationChange('email')}
                  />
                  <label htmlFor="email-notifications" className="ml-3 block text-gray-700">
                    Email Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="push-notifications"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={notification.push}
                    onChange={() => handleNotificationChange('push')}
                  />
                  <label htmlFor="push-notifications" className="ml-3 block text-gray-700">
                    Push Notifications
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="sms-notifications"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    checked={notification.sms}
                    onChange={() => handleNotificationChange('sms')}
                  />
                  <label htmlFor="sms-notifications" className="ml-3 block text-gray-700">
                    SMS Notifications
                  </label>
                </div>
              </div>
            </div>
            
            {/* Appearance Settings */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Appearance</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="theme" className="block text-gray-700 mb-2">Theme</label>
                  <select
                    id="theme"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={theme}
                    onChange={handleThemeChange}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Language Settings */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Language</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="language" className="block text-gray-700 mb-2">Preferred Language</label>
                  <select
                    id="language"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    value={language}
                    onChange={handleLanguageChange}
                  >
                    <option value="english">English</option>
                    <option value="kannada">Kannada</option>
                    <option value="hindi">Hindi</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="chinese">Chinese</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Privacy Settings */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Privacy</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    id="profile-visibility"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="profile-visibility" className="ml-3 block text-gray-700">
                    Make my profile visible to other users
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="event-participation"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    defaultChecked
                  />
                  <label htmlFor="event-participation" className="ml-3 block text-gray-700">
                    Show my event participation history
                  </label>
                </div>
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
                ) : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;