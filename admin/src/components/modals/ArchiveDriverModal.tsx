import React from 'react';
import MDriver from "../common/Modal";
import axios from 'axios';

interface ArchiveConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  driverName: string;
  driverId: string;
}

const ArchiveConfirmModal: React.FC<ArchiveConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  driverName,
  driverId
}) => {
  const handleArchive = async () => {
    try {
      // Update driver's active status to "2" (archived)
      await axios.patch(`http://192.168.1.7:5000/api/driver/${driverId}/active`, {
        active: 2
      });
      
      // Call the onConfirm callback to refresh the driver list
      onConfirm();
      onClose();
    } catch (error) {
      console.error('Error archiving driver:', error);
    }
  };

  return (
    <MDriver
      isOpen={isOpen}
      title="Confirm Archive"
    >
      <div className="p-2">
      <p className="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to archive <span className="font-medium text-gray-900 dark:text-white">{driverName}</span>? This action can be undone later.
        </p>
        
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleArchive}
            className="px-2.5 py-1 text-xs font-medium text-white bg-yellow-600 rounded hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800"
          >
            Archive
          </button>
        </div>
      </div>
    </MDriver>
  );
};

export default ArchiveConfirmModal;