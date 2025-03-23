import React from "react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  
}

const MDriver: React.FC<ModalProps> = ({ title, children, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
      <div
        className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-lg w-[90%] max-w-4xl h-auto max-h-[90vh] overflow-y-auto p-8"
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-3">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{title}</h2>

        </div>

        {/* Modal Content */}
        <div className="py-6">{children}</div>
      </div>
    </div>
  );
};

export default MDriver;
