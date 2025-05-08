import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import N_List from "../../components/tables/NewsRoom_T";
import Modal2 from "../../components/common/Modal2";



export default function Nr() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>

      <PageBreadcrumb pageTitle="Newsroom" />
      <div className="space-y-6">
        <ComponentCard 
        title="List of News"
        headerRight={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 bg-brand-500 border border-transparent rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Edit
          </button>
        }
        >
          <N_List/>
        </ComponentCard>
      </div>


      <Modal2 
        title="Edit Contact Information" 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-3">

        </div>
      </Modal2>
    </>
  );
}
