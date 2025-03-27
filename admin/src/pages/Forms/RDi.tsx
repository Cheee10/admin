import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ADriver from "../../components/tables/Driver";
import MDriver from "../../components/common/Modal";
import DForm from "../../components/form/form-elements/FDriver";

export default function RDi() {
  const [isModalOpen, setModalOpen] = useState(false);


  return (
    <div>
      <PageMeta title="Admin" description="Driver Registration Page" />
      <PageBreadcrumb pageTitle="Register A Driver" />

      <div className="space-y-6">
        <ComponentCard
          title="Drivers"
          headerRight={
            <div className="flex items-center space-x-4">

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
                onClick={() => setModalOpen(true)}
              >
                Add
              </button>
            </div>
          }
        >
          <ADriver  />
        </ComponentCard>
      </div>

      {/* Modal for registering a driver */}
      <MDriver title="Add" isOpen={isModalOpen}>
        <DForm onClose={() => setModalOpen(false)} />
      </MDriver>
    </div>
  );
}
