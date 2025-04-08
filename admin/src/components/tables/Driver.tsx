import { useState, useEffect } from "react";
import axios from "axios";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";

import { MoreDotIcon } from "../../icons";
import DriverModal from "../modals/DriverModal";
import BlocklistConfirmModal from "../modals/BlocklistDriverModal";
import ArchiveConfirmModal from "../modals/ArchiveDriverModal";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Driver {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  address: string;
  plateNumber: string;
  age: number;
  status: string;
  image: string;
  phoneNumber?: string;
  email?: string;
  color?: string;
  motorcycleModel?: string;
  active: number;
}  

interface Props {
  searchQuery: string;
}

export default function ADriver({ searchQuery }: Props) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlocklistModalOpen, setIsBlocklistModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);

  const fetchDrivers = async () => {
    try {
      const response = await axios.get("http://192.168.1.45:5000/api/driver");
      // Filter drivers to only show those with active=0
      const activeDrivers = response.data.filter(driver => driver.active === 0);
      setDrivers(activeDrivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const toggleDropdown = (id: string) => {
    setIsOpen(isOpen === id ? null : id);
  };

  const handleViewDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsModalOpen(true);
    setIsOpen(null); // Close the dropdown
  };

  const handleBlocklistClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsBlocklistModalOpen(true);
    setIsOpen(null); // Close the dropdown
  };

  const handleBlocklistConfirm = async () => {
    // Refresh the drivers list after successful blocklist
    await fetchDrivers();
  };

  const handleArchiveClick = (driver: Driver) => {
    setSelectedDriver(driver);
    setIsArchiveModalOpen(true);
    setIsOpen(null); // Close the dropdown
  };

  const handleArchiveConfirm = async () => {
    // Refresh the drivers list after successful archive
    await fetchDrivers();
  };

  // Add this function to filter drivers based on search query
  const filteredDrivers = drivers.filter((driver) => {
    const fullName = `${driver.lastName} ${driver.firstName} ${driver.middleName}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    
    return (
      fullName.includes(searchLower) ||
      driver.plateNumber.toLowerCase().includes(searchLower) ||
      driver.email?.toLowerCase().includes(searchLower) ||
      driver.phoneNumber?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="h-[400px] overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="h-full max-w-full overflow-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  User
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Plate Number
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Motorcycle Model
                </TableCell>

                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((driver) => (
                <TableRow key={driver._id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 overflow-hidden rounded-full">
                      <img
                        width={40}
                        height={40}
                        src={driver.image ? `http://192.168.1.45:5000${driver.image}` : "http://192.168.1.45:5000/uploads/default-image.png"}
                      />
                    </div>
                    <div>
                      <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {`${driver.lastName || ''}, ${driver.firstName || ''}`.trim()}
                      </span>
                      <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                        {driver.plateNumber}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {driver.plateNumber}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {driver.motorcycleModel}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <div className="relative inline-block">
                    <button
                      className="dropdown-toggle"
                      onClick={() => toggleDropdown(driver._id)}
                    >
                      <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                    </button>
                    {isOpen === driver._id && (
                      <Dropdown isOpen={true} onClose={() => setIsOpen(null)} className="w-40 p-2">
                        <DropdownItem
                          onItemClick={() => handleViewDriver(driver)}
                          className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          View
                        </DropdownItem>
                        <DropdownItem
                          onItemClick={() => handleArchiveClick(driver)}
                          className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Archive
                        </DropdownItem>
                        <DropdownItem
                          onItemClick={() => handleBlocklistClick(driver)}
                          className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                        >
                          Blocklist
                        </DropdownItem>
                      </Dropdown>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <td colSpan={5} className="px-5 py-6 text-center text-gray-500 dark:text-gray-400">
                <div className="space-y-6">No data available</div>
              </td>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  </div>

      {/* Driver Details Modal */}
      <DriverModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        driver={selectedDriver}
      />

      {/* Blocklist Confirmation Modal */}
      <BlocklistConfirmModal
        isOpen={isBlocklistModalOpen}
        onClose={() => setIsBlocklistModalOpen(false)}
        onConfirm={handleBlocklistConfirm}
        driverName={selectedDriver ? `${selectedDriver.firstName} ${selectedDriver.lastName}` : ''}
        driverId={selectedDriver?._id || ''}
      />

      {/* Archive Confirmation Modal */}
      <ArchiveConfirmModal
        isOpen={isArchiveModalOpen}
        onClose={() => setIsArchiveModalOpen(false)}
        onConfirm={handleArchiveConfirm}
        driverName={selectedDriver ? `${selectedDriver.firstName} ${selectedDriver.lastName}` : ''}
        driverId={selectedDriver?._id || ''}
      />
    </div>
  );
}
