import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import ContactUsInputGroup from "../../components/modals/ContactUs";
import Modal2 from "../../components/common/Modal2";
import CUtable from "../../components/tables/ContactUs_T";
import { useState } from "react";

export default function Cu() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <PageBreadcrumb pageTitle="Contact Us Page" />
      <div className="space-y-6">
        <ComponentCard 
          title="Set Up"
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
          <CUtable/>
        </ComponentCard>
      </div>

      <Modal2 
        title="Edit Contact Information" 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
      >
        <div className="space-y-3">
          <ContactUsInputGroup onClose={() => setModalOpen(false)} />
        </div>
      </Modal2>

    </>
  );
}
