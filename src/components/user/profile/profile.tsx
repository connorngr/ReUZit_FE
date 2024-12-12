import React, { useContext, useEffect, useState, useRef } from 'react';
import { getCurrentUser, User, updateUser, updateUserImage } from '../../../api/user'; // Đảm bảo đường dẫn đúng
import { API_URL } from '../../../api/auth'
import { AuthContext } from "../../../context/AuthContext";
import '../../../assets/styles/App.css';
import Sidebar from './common/Sidebar';
import ProfileForm from './common/ProfileForm';
import { getToken } from "../../../utils/storage";

const ProfileSettings: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
  });
  if (!authContext) {
    return null; // Or you could redirect the user to a login page
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true); // Đảm bảo trạng thái loading được thiết lập đúng
        const userData = await getCurrentUser();
        setUser(userData);
        setFormData({
          firstName: userData.firstName,
          lastName: userData.lastName,
          bio: userData.bio || '',
        });
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to fetch user data. Please try again later.');
      } finally {
        setLoading(false); // Đảm bảo trạng thái loading được tắt sau khi API hoàn tất
      }
    };

    fetchUserData();
  }, []);


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !user) return;

    const file = event.target.files[0];
    try {
      const updatedUser = await updateUserImage(file); // Use updateUserImage API
      setUser(updatedUser);
      authContext?.setAuthData({ token: getToken(), user: updatedUser });
      alert('Profile picture updated successfully!');
    } catch (err) {
      console.error('Error updating profile picture:', err);
      alert('Failed to update profile picture.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      try {
        const updatedUser = await updateUser(formData);
        setUser(updatedUser);
        alert('Profile updated successfully!');

      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
      }
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white w-full flex flex-col gap-5 px-3 md:px-16 lg:px-28 md:flex-row text-[#161931]">
      <Sidebar />
      <main className="w-full min-h-screen py-1 md:w-2/3 lg:w-3/4">
        <div className="p-2 md:p-4">
          <div className="w-full px-6 pb-8 mt-8 sm:max-w-xl sm:rounded-lg">
            <h2 className="pl-6 text-2xl font-bold sm:text-xl">Public Profile</h2>
            <div className="grid max-w-2xl mx-auto mt-8">
              <div className="flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0">
                <img
                  className="object-cover w-40 h-40 p-1 rounded-full ring-2 ring-indigo-300 dark:ring-indigo-500"
                  src={user?.imageUrl ? `${API_URL}${user.imageUrl}` : "https://www.shutterstock.com/image-vector/error-customer-icon-editable-line-260nw-1714948474.jpg"} // Use fallback if no image is present
                  alt="User Avatar"
                />
                <div className="flex flex-col space-y-5 sm:ml-8">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="py-3.5 px-7 text-base font-medium text-indigo-100 bg-[#202142] rounded-lg border hover:bg-indigo-900"
                  >
                    Change picture
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </div>
              </div>
              <ProfileForm
                formData={formData}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                userEmail={user?.email || ''}
                userMoney={user?.money || ''}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileSettings;
