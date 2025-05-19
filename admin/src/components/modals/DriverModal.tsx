import React from 'react';
import MDriver from "../common/Modal";
import Badge from "../ui/badge/Badge";

interface Driver {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  address: string;
  plateNumber: string;
  birthDate: string;
  status: string;
  image: string;
  phoneNumber?: string;
  email?: string;
  color?: string;
  motorcycleModel?: string;
}

interface DriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  driver: Driver | null;
}

const DriverModal: React.FC<DriverModalProps> = ({ isOpen, onClose, driver }) => {
  if (!driver) return null;

  return (
    <MDriver 
      isOpen={isOpen} 
      title="Driver Details"
    >
      <div className="flex flex-col relative z-0 max-h-[calc(100vh-12rem)] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-start p-2">
          {/* Left column with image */}
          <div className="flex flex-col items-center md:col-span-1 p-2">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-gray-300 overflow-hidden">
              <img
                src={driver.image ? `http://192.168.1.7:5000${driver.image}` : "http://192.168.1.7:5000/uploads/default-image.png"}
                alt={`${driver.firstName} ${driver.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-2">
              <Badge variant="light" color="primary">{driver.status}</Badge>
            </div>
          </div>

          {/* Right column with details */}
          <div className="md:col-span-3 space-y-3">
            {/* Name Fields */}
            <div className="p-2.5 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">First Name</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{driver.firstName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Middle Name</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{driver.middleName}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last Name</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{driver.lastName}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="p-2.5 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Birth Date</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                    {driver.birthDate ? new Date(driver.birthDate).toLocaleDateString('en-US', {
                      month: '2-digit',
                      day: '2-digit',
                      year: 'numeric'
                    }) : ''}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{driver.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{driver.email || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Address Field */}
            <div className="p-2.5 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Address</h3>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{driver.address}</p>
            </div>

            {/* Vehicle Details */}
            <div className="p-2.5 bg-gray-50 rounded-lg dark:bg-gray-800/50">
              <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-2">Vehicle Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Plate Number</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{driver.plateNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Color</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{driver.color || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Motorcycle Model</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-white/90">{driver.motorcycleModel || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom Close Button */}
        <div className="flex justify-end mt-3 px-2">
          <button
            onClick={onClose}
            className="flex items-center justify-center px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </MDriver>
  );
};

export default DriverModal; 