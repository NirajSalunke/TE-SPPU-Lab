import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { link } from '../components/Baselink';

const EditProfilePage = () => {
    const [updating, setUpdating] = useState(false)
    const navigate = useNavigate();
    // const url = "https://react-blog-server-gamma.vercel.app/";
    const url = link
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        name: '',
        location: '',
        picture: '',
        dob: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log('entered useeffect')
                const token = localStorage.getItem('token');
                const response = await axios.get(url + '/api/auth/getProfile', {
                    headers: { Authorization: token }
                });

                const userData = response.data.user;
                setFormData(prevData => ({
                    ...prevData,
                    username: userData.username || '',
                    email: userData.email || '',
                    name: userData.name || '',
                    location: userData.location || '',
                    picture: userData.picture || '',
                    dob: userData.dob ? userData.dob.split('T')[0] : ''
                }));
            } catch (error) {
                setError('Failed to load profile data');
                console.error(error);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
        // Clear any previous error/success messages
        setError('');
        setSuccess('');
    };

    const validateForm = () => {
        if (!formData.email.includes('@')) {
            setError('Please enter a valid email address');
            return false;
        }

        if (formData.newPassword && formData.newPassword.length < 8) {
            setError('New password must be at least 8 characters long');
            return false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return false;
        }

        return true;
    };

    const validateFileSize = (file) => {
      const maxFileSize = 500 * 1024; // 500KB in bytes
      if (file.size > maxFileSize) {
        setError('Profile picture must be smaller than 500KB.');
        return false;
      }
      return true;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setIsLoading(true);
      try {
          const token = localStorage.getItem('token');
          const updateData = {
              username: formData.username,
              email: formData.email,
              name: formData.name,
              location: formData.location,
              picture: formData.picture,
              dob: formData.dob
          };

          console.log(formData)
          console.log(updateData)

          // Only include password fields if user is trying to change password
          if (formData.currentPassword && formData.newPassword) {
              updateData.currentPassword = formData.currentPassword;
              updateData.newPassword = formData.newPassword;
          }
          setUpdating(true)
          axios.post(url + '/api/auth/editProfile', updateData, {
              headers: { Authorization: token, 'Content-Type': 'multipart/form-data' }
          }).then(() => {
              setSuccess('Profile updated successfully!');
              setUpdating(false)
          }).then((response) =>
              navigate('/profile'));
              setUpdating(false)
              // console.log(response))
      } catch (error) {
          if (error.response?.status === 401) {
              setError('Current password is incorrect');
          } else if (error.response?.status === 409) {
              setError('Email or username already in use');
          } else {
              setError('Failed to update profile. Please try again.');
          }
      } finally {
          setIsLoading(false);
      }
  };
    return (
      <div className="profile-container min-h-screen p-8 pt-20 bg-gradient-to-b from-blue-100 via-white to-blue-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800" style={{ color: 'var(--text-color)' }}>
        <div className="profile-header text-center mb-8 mt-5">
          <h1 className="text-5xl font-extrabold text-indigo-800 dark:text-indigo-400 drop-shadow-lg">Edit Profile</h1>
        </div>
        {/* Profile Card */}
        <div className="profile-card max-w-4xl mx-auto p-8 rounded-2xl shadow-2xl mb-12 bg-white dark:bg-gray-800 border-4 border-indigo-300 dark:border-indigo-600 transform hover:scale-105 transition-all duration-300">
          <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
            {/* Profile Picture Preview */}
            
            <div className="flex justify-center mb-6">
              <div className="relative group">
                {formData.picture ? (
                  <img
                    src={formData.picture}
                    alt="Profile"
                    className="w-40 h-40 rounded-full object-cover border-4 border-indigo-500 transform transition-transform duration-300 hover:scale-110 shadow-lg"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full bg-indigo-200 flex items-center justify-center border-4 border-indigo-500 shadow-lg">
                    <span className="text-indigo-700 text-2xl font-semibold">
                      {formData.name
                        ? formData.name
                            .split(' ')
                            .map((word) => word[0])
                            .join('')
                        : 'N/A'}
                    </span>
                  </div>
                )}
                {/* Hover overlay for "Change Picture" */}
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-sm font-medium">Change Picture</span>
                </div>
                {/* Hidden file input */}
                <input
                  type="file"
                  name="picture"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      if (file.size > 500 * 1024) {
                        alert('File size exceeds the 500 KB limit. Please choose a smaller file.');
                        return;
                      }
                      setFormData((prevData) => ({
                        ...prevData,
                        picture: file,
                      }));
                    }
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="flex flex-col h-full lg:col-span-2">
                {/* Basic Information */}
                <h2 className="text-indigo-700 dark:text-indigo-300 font-semibold text-lg mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 border border-indigo-700 dark:border-indigo-500 p-6 flex-grow">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Username</label>
                    {/* <div className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gradient-to-r from-gray-700 to-gray-800' : 'bg-gradient-to-r from-gray-100 to-white'}`}> */}
                    <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 border border-gray-300 dark:border-gray-700 cursor-not-allowed">
                      {formData.username}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">Email</label>                  
                    <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500 border border-gray-300 dark:border-gray-700 cursor-not-allowed">
                      {formData.email}
                    </div>
                  </div>

                  {/* Input fields with animations */}
                  {['name', 'location',  'dob'].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium mb-1 capitalize text-gray-500 dark:text-gray-400">{field.replace('_', ' ')}</label>
                      <input
                        type={field === 'dob' ? 'date' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none transform transition-transform hover:scale-105 
                          ${formData[field] ? 'border-green-500' : 'border-gray-300'} 
                          bg-white dark:bg-gray-700 
                          text-gray-700 dark:text-white`}
                        
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                {/* Password Change Section */}
                <div className="flex flex-col h-full">
                  <h3 className="text-indigo-700 dark:text-indigo-300 font-semibold text-lg mb-4">Change Password</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 border border-indigo-700 dark:border-indigo-500 p-6 flex-grow">
                    {['currentPassword', 'newPassword', 'confirmPassword'].map((passwordField) => (
                      <div key={passwordField}>
                        <label className="block text-sm font-medium mb-1 capitalize text-gray-500 dark:text-gray-400">{passwordField.replace('Password', ' Password')}</label>
                        <input
                          type="password"
                          name={passwordField}
                          value={formData[passwordField]}
                          onChange={handleChange}                                
                          className={`w-full p-3 rounded-lg border focus:ring-2 focus:ring-green-500 focus:outline-none transform transition-transform hover:scale-105 
                            bg-white dark:bg-gray-700 
                            text-gray-700 dark:text-white 
                            ${formData[passwordField] ? 'border-green-500' : 'border-gray-300'}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Error and Success Messages */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-400 p-4 text-red-700 animate-bounce">
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-100 border-l-4 border-green-400 p-4 text-green-700 animate-fadeIn">
                <p>{success}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              {/* <button
                type="button"
                onClick={() => navigate('/profile')}
                className={`px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transform transition-transform hover:scale-105`}
              >
                Cancel
              </button> */}
              <button
                    className="relative rounded-lg bg-gradient-to-r from-purple-500 to-red-500 hover:from-purple-600 hover:to-red-600 text-white px-4 hover:scale-105"
                    onClick={() => navigate('/profile')}
                  >
                    <span className="relative z-10">Cancel</span>
                  </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`bg-gradient-to-r relative from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-2 rounded-lg transform hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {/* {isLoading ? 'Saving...' : 'Save Changes'}  */}
                {/* <span className="relative z-10">{isLoading ? 'Saving...' : 'Save Changes'}</span> */}
                {console.log(updating)}
                <span className="relative z-10">{updating ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>


    );
}

export default EditProfilePage;