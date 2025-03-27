import { useState } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ADriver from "../../components/tables/Driver";
import MDriver from "../../components/common/Modal";
import DForm from "../../components/modals/FDriver";

export default function RDi() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <PageMeta title="Driver" description="Driver Registration Page" />
      <PageBreadcrumb pageTitle="Register A Driver" />

      <div className="space-y-6">
        <ComponentCard
          title="Drivers"
          headerRight={
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search driver..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-4 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
                <svg
                  className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
                onClick={() => setModalOpen(true)}
              >
                Add
              </button>
            </div>
          }
        >
          <ADriver searchQuery={searchQuery} />
        </ComponentCard>
      </div>

      {/* Modal for registering a driver */}
      <MDriver title="Add" isOpen={isModalOpen}>
        <DForm onClose={() => setModalOpen(false)} />
      </MDriver>
    </div>
  );
}
