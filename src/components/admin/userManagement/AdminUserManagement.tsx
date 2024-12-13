import React, { useState, useEffect } from 'react';
import { User, fetchUsers, toggleUserLock } from '../../../api/user'
import Swal from 'sweetalert2';

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle user lock/unlock
  const handleToggleLock = async (userId: number) => {
    try {
      const updatedUser = await toggleUserLock(userId);
      console.log('Updated User:', updatedUser);  // Add logging to see if the response is correct

      // Update user in the state
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === userId ? updatedUser : user))
      );

      // Show success notification
      Swal.fire({
        icon: 'success',
        title: `User ${updatedUser.locked ? 'locked' : 'unlocked'} successfully!`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('Error toggling user lock:', err);

      // Show error notification
      Swal.fire({
        icon: 'error',
        title: 'Failed to update user status.',
        text: 'Check account again if don\'t problem. please update user status again.',
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{`${user.firstName} ${user.lastName}`}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">
                {user.locked ? 'Locked' : 'Active'}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleToggleLock(user.id)}
                  className={`px-4 py-2 rounded ${user.locked ? 'bg-green-500' : 'bg-red-500'
                    } text-white`}
                >
                  {user.locked ? 'Unlock' : 'Lock'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserManagement;