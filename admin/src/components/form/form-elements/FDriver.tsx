import { useState } from "react";
import Label from "../Label";
import Input from "../input/InputField";
import FileInput from "../input/FileInput";
import axios from "axios";  // ✅ Using Axios

interface DFormProps {
  onClose: () => void;
}

export default function DForm({ onClose }: DFormProps) {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); // ✅ Show preview
    }
  };

  const handleSubmit = async () => {
    const payload = new FormData();
  
    Object.entries(formData).forEach(([key, value]) => {
      payload.append(key, value);
    });
  
    if (image) {
      payload.append("image", image);
    }
  
    try {
      const response = await axios.post("http://192.168.1.59:5000/api/driver", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      if (response.status === 200) {
        console.log("✅ Data saved successfully!");
        
        // Show success notification
        alert("Driver added successfully!");
  
        // Reset form data
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
        });
  
        setImage(null);
        setPreview(null);
  
        // Close the modal immediately
        onClose();
      } else {
        console.error("❌ Failed to save data");
      }
    } catch (error) {
      console.error("❌ Error submitting data:", error);
    }
  };
    

  return (
    <div className="space-y-6">
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
              <Input type="number" id="age" value={formData.age} onChange={handleChange} />
            </div>
            <div className="col-span-5">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input type="number" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <div className="col-span-5">
              <Label htmlFor="email">Email</Label>
              <Input type="text" id="email" value={formData.email} onChange={handleChange} />
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
          className="flex justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
        >
          Close
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="btn btn-success btn-update-event flex justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
        >
          Add
        </button>
      </div>
    </div>
  );
}
