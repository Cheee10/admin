import axios from "axios";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import BlocklistPassengerModal from "../modals/BlocklistPassengerModal";

interface Passenger {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  image: string;
  birthDate: string;
  active: number;
}

export default function N_List() {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState<string | null>(null);
  const [isBlocklistModalOpen, setIsBlocklistModalOpen] = useState(false);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);

  const fetchPassengers = async () => {
    try {
      const response = await axios.get("http://192.168.1.24:5000/api/passenger");
      const activePassengers = response.data.filter((passenger: Passenger) => passenger.active === 0);
      setPassengers(activePassengers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching passengers:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPassengers();
  }, []);

  const toggleDropdown = (id: string) => {
    setIsOpen(isOpen === id ? null : id);
  };

  const handleViewPassenger = (passenger: Passenger) => {
    // Add view logic here
    setIsOpen(null);
  };

  const handleBlockPassenger = (passenger: Passenger) => {
    setSelectedPassenger(passenger);
    setIsBlocklistModalOpen(true);
    setIsOpen(null);
  };

  const handleBlocklistConfirm = async () => {
    await fetchPassengers();
  };

  return (
    <div className="h-[400px] overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="h-full max-w-full overflow-auto">
        <div className="min-w-[1102px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  User
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Phone Number
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Birth Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {loading ? (
                <TableRow>
                  <td colSpan={4} className="px-5 py-6 text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </td>
                </TableRow>
              ) : passengers.length > 0 ? (
                passengers.map((passenger) => (
                  <TableRow key={passenger._id}>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <img
                            width={40}
                            height={40}
                            src={passenger.image ? `http://192.168.1.24:5000${passenger.image}` : "http://192.168.1.24:5000/uploads/default-image.png"}
                            alt={`${passenger.firstName} ${passenger.lastName}`}
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {`${passenger.lastName || ''}, ${passenger.firstName || ''}`.trim()}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {passenger.phoneNumber}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      {new Date(passenger.birthDate).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                      <div className="relative inline-block">
                        <button
                          className="dropdown-toggle"
                          onClick={() => toggleDropdown(passenger._id)}
                        >
                          <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
                        </button>
                        {isOpen === passenger._id && (
                          <Dropdown isOpen={true} onClose={() => setIsOpen(null)} className="w-40 p-2">
                            <DropdownItem
                              onItemClick={() => handleViewPassenger(passenger)}
                              className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
                            >
                              View
                            </DropdownItem>
                            <DropdownItem
                              onItemClick={() => handleBlockPassenger(passenger)}
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
                  <td colSpan={4} className="px-5 py-6 text-center text-gray-500 dark:text-gray-400">
                    No data available
                  </td>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <BlocklistPassengerModal
        isOpen={isBlocklistModalOpen}
        onClose={() => setIsBlocklistModalOpen(false)}
        onConfirm={handleBlocklistConfirm}
        passengerName={selectedPassenger ? `${selectedPassenger.lastName}, ${selectedPassenger.firstName}` : ''}
        passengerId={selectedPassenger?._id || ''}
      />
    </div>
  );
}