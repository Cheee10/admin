import { useState, useEffect } from "react";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import FileInput from "../form/input/FileInput";
import axios from "axios";
import Alert from "../ui/alert/Alert";

interface DFormProps {
  onClose: () => void;
}

export default function DForm({ onClose }: DFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false); // ✅ Success modal state

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    age: "",
    phoneNumber: "",
    email: "",
    address: "",
    plateNumber: "",
    color: "",
    motorcycleModel: "",
    active: "0", // ✅ Added active field
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    const payload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, key === "active" ? Number(value).toString() : value);
    });
  
    if (image) {
      payload.append("image", image);
    }
  
    try {
      const response = await axios.post("http://192.168.1.59:5000/api/driver", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 201) { // ✅ Changed from 200 to 201
        console.log("✅ Data saved successfully!");
        setShowModal(true);
  
        // ✅ Reset form
        setFormData({
          firstName: "",
          middleName: "",
          lastName: "",
          age: "",
          phoneNumber: "",
          email: "",
          address: "",
          plateNumber: "",
          color: "",
          motorcycleModel: "",
          active: "0",
        });
  
        setImage(null);
        setPreview(null);
  
        setTimeout(() => {
          setShowModal(false);
          onClose();
        }, 2000);
      } else {
        console.error("❌ Failed to save data");
      }
    } catch (error) {
      console.error("❌ Error submitting data:", error);
    }
  };
  
  

  // Debug modal state changes
  useEffect(() => {
    console.log("Modal state changed:", showModal);
  }, [showModal]);

  return (
    <div className="space-y-6">
      {/* Success Modal */}
      {showModal && (
        <Alert
        variant="success"
        title="Driver Added Successfully!"
        message="The driver has been saved successfully."
      />
      )}

      <div className="grid grid-cols-4 gap-6 items-center">
        <div className="flex flex-col items-center col-span-1">
          <div className="w-32 h-32 rounded-full border border-gray-300 overflow-hidden">
            {preview ? (
              <img src={preview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="mt-2">
            <Label>Upload file</Label>
            <FileInput onChange={handleFileChange} className="custom-class" />
          </div>
        </div>

        <div className="col-span-3 space-y-6">
          <div className="grid grid-cols-3 gap-x-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input type="text" id="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="middleName">Middle Name</Label>
              <Input type="text" id="middleName" value={formData.middleName} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input type="text" id="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-x-6">
            <div className="col-span-2">
              <Label htmlFor="age">Age</Label>
              <Input
                type="integer"
                id="age"
                value={formData.age}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d{0,2}$/.test(value)) {
                    handleChange(e);
                  }
                }}
              />
            </div>

            <div className="col-span-5">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input type="integer" 
              id="phoneNumber" 
              value={formData.phoneNumber} 
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,13}$/.test(value)) {
                  handleChange(e);
                }
              }}
              />
            </div>
            <div className="col-span-5">
              <Label htmlFor="email">Email</Label>
              <Input type="text" 
              id="email" value={formData.email} 
              onChange={handleChange} 
              placeholder="info@gmail.com"
              />
            </div>
          </div>

          <div className="col-span-10">
            <Label htmlFor="address">Address</Label>
            <Input type="text" id="address" value={formData.address} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-3 gap-x-4">
            <div>
              <Label htmlFor="plateNumber">Plate Number</Label>
              <Input type="text" id="plateNumber" value={formData.plateNumber} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input type="text" id="color" value={formData.color} onChange={handleChange} />
            </div>
            <div>
              <Label htmlFor="motorcycleModel">Motorcycle Model</Label>
              <Input type="text" id="motorcycleModel" value={formData.motorcycleModel} onChange={handleChange} />
            </div>
          </div>
        </div>
      </div>

      {/* Buttons Aligned to Right */}
      <div className="flex justify-end items-center gap-3 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-white"
        >
          Close
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-500 border border-blue-600 rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:border-blue-800 dark:hover:bg-blue-800"
        >
          Add
        </button>
      </div>
    </div>
  );
}
