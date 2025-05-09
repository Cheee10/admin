import React from 'react';
import MDriver from "../common/Modal";
import axios from 'axios';

interface BlocklistPassengerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  passengerName: string;
  passengerId: string;
}

const BlocklistPassengerModal: React.FC<BlocklistPassengerModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm,
  passengerName,
  passengerId
}) => {

  const handleBlocklist = async () => {
    try {
      // Update passenger's active status to "3" (blocklisted)
      await axios.patch(`http://192.168.1.9:5000/api/passenger/${passengerId}/active`, {
        active: 3
      });
      
      // Call the onConfirm callback to refresh the passenger list
      onConfirm();
      onClose();
    } catch (error) {
      console.error('Error blocklisting passenger:', error);
    }
  };

  return (
    <MDriver
      isOpen={isOpen}
      title="Confirm Blocklist"
    >
      <div className="p-2">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Are you sure you want to blocklist <span className="font-medium text-gray-900 dark:text-white">{passengerName}</span>? This action can be undone later.
        </p>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleBlocklist}
            className="px-2.5 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            Blocklist
          </button>
        </div>
      </div>
    </MDriver>
  );
};

export default BlocklistPassengerModal; 