import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import Utable from "../../components/tables/Users_T";
import Modal2 from "../../components/common/Modal2";
import UserAddModal from "../../components/modals/User_AddModal";

export default function U() {
  const [isModalOpen, setModalOpen] = useState(false);

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleUserAdded = () => {
    // Force a re-render of the Users_T component
    const event = new Event('userAdded');
    window.dispatchEvent(event);
  };

  return (
    <>
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <ComponentCard 
          title="Users List"
          headerRight={
            <button
              type="button"
              onClick={handleOpenModal}
              className="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-brand-500 border border-transparent rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            >
              Add User
            </button>
          }
        >
          <Utable />
        </ComponentCard>
      </div>

      {isModalOpen && (
        <Modal2 
          title="Add New User" 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        >
          <UserAddModal 
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onUserAdded={handleUserAdded}
          />
        </Modal2>
      )}
    </>
  );
}
