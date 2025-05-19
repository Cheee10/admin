import React, { useEffect, useState } from "react";
import axios from "axios";
import Badge from "../ui/badge/Badge";
import Modal2 from "../common/Modal2";
import UserEditModal from "../modals/User_EditModal";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  active: number;
  image: string;
}

export default function UserGrid() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://192.168.1.24:5000/api/user");
        console.log("Fetched users:", response.data.users);
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserUpdate = () => {
    // Refresh the user list after update
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://192.168.1.24:5000/api/user");
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error refreshing users:", error);
      }
    };
    fetchUsers();
    handleCloseEditModal();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="flex flex-col p-4 rounded-xl border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] hover:shadow-lg transition-shadow duration-200 relative"
          >
            {/* Edit Button */}
            <button
              onClick={() => handleEdit(user)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-brand-500 dark:hover:bg-white/[0.05] transition-colors duration-200"
              title="Edit User"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>

            {/* User Header with Image and Name */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 overflow-hidden rounded-full bg-gray-200">
                <img
                  width={48}
                  height={48}
                  src={
                    user.image
                      ? `http://192.168.1.24:5000${user.image}`
                      : "http://192.168.1.24:5000/uploads/default-image.png"
                  }
                  alt={user.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "http://192.168.1.24:5000/uploads/default-image.png";
                  }}
                />
              </div>
              <div>
                <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                  {user.name}
                </span>
                <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                  {user.role}
                </span>
              </div>
            </div>

            {/* User Details */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </p>
            </div>

            {/* Permissions */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Permissions
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.permissions && user.permissions.length > 0 ? (
                  user.permissions.map((perm, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                    >
                      {perm}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    No permissions assigned
                  </span>
                )}
              </div>
            </div>

            {/* Footer with Status */}
            <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-white/[0.05]">
              <Badge size="sm" color={user.active === 1 ? "success" : "error"}>
                {user.active === 1 ? "Active" : "Inactive"}
              </Badge>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                ID: {user._id.slice(-4)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      <Modal2
        title="Edit User"
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
      >
        <UserEditModal
          isOpen={isEditModalOpen}
          onClose={handleCloseEditModal}
          user={selectedUser}
          onUpdate={handleUserUpdate}
        />
      </Modal2>
    </>
  );
}
