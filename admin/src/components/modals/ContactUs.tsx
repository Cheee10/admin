import Label from "../form/Label";
import Input from "../form/input/InputField";
import { EnvelopeIcon } from "../../icons";
import PhoneInput from "../form/group-input/PhoneInput";
import { useDropzone } from "react-dropzone";
import { useState, useEffect } from "react";

interface Contact {
  _id: string;
  email: string;
  phone: string;
  image: string | null;
  updatedAt: Date;
}

interface ContactUsInputGroupProps {
  onClose?: () => void;
}

export default function ContactUsInputGroup({ onClose }: ContactUsInputGroupProps) {
  const [preview, setPreview] = useState<string>("");
  const [oldPreview, setOldPreview] = useState<string>("");
  const [showingOld, setShowingOld] = useState(false);
  const [currentImage, setCurrentImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState<Contact>({
    _id: "",
    email: "",
    phone: "",
    image: null,
    updatedAt: new Date(),
  });

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://192.168.1.7:5000/api/contact");
      if (!response.ok) throw new Error("Failed to fetch contacts");

      const data = await response.json();
      if (data.length > 0) {
        setFormData(data[0]);
        if (data[0].image) {
          const imageUrl = `http://192.168.1.7:5000/${data[0].image}`;
          setPreview(imageUrl);
          setOldPreview(imageUrl);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, email: event.target.value }));
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setFormData((prev) => ({ ...prev, phone: phoneNumber }));
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setOldPreview(preview);
      setPreview(URL.createObjectURL(file));
      setCurrentImage(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
  });

  const togglePreview = () => {
    setShowingOld(!showingOld);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const submitData = new FormData();
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      if (currentImage) {
        submitData.append('image', currentImage);
      }

      const response = await fetch(`http://192.168.1.7:5000/api/contact/${formData._id}`, {
        method: 'POST',
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to update contact");
      }

      setSuccess("Contact information updated successfully!");
      fetchContacts(); // Refresh data
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 1500); // Close modal after 1.5 seconds
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData._id) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {success && (
        <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
          <div className="flex items-center">
            <svg className="flex-shrink-0 w-4 h-4 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
            </svg>
            <span className="font-medium">{success}</span>
          </div>
        </div>
      )}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <Label>Current Image</Label>
          {oldPreview !== preview && (
            <button
              type="button"
              onClick={togglePreview}
              className="px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors duration-200 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
            >
              {showingOld ? "Show New Image" : "Show Old Image"}
            </button>
          )}
        </div>
        <div className="mt-2 relative w-full h-[350px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
          <img 
            src={showingOld ? oldPreview : preview}
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          {oldPreview !== preview && (
            <div className="absolute bottom-2 right-2 px-2 py-1 text-xs font-medium text-white bg-gray-900/75 rounded">
              {showingOld ? "Old Image" : "New Image"}
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
          <div
            {...getRootProps()}
            className={`dropzone rounded-xl border-dashed border-gray-300 p-4 lg:p-6
              ${isDragActive ? "border-brand-500 bg-gray-100 dark:bg-gray-800" : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"}
            `}
            id="demo-upload"
          >
            <input {...getInputProps()} />

            <div className="dz-message flex flex-col items-center !m-0">
              <div className="mb-3 flex justify-center">
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                  <svg
                    className="fill-current"
                    width="20"
                    height="20"
                    viewBox="0 0 29 28"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M14.5019 3.91699C14.2852 3.91699 14.0899 4.00891 13.953 4.15589L8.57363 9.53186C8.28065 9.82466 8.2805 10.2995 8.5733 10.5925C8.8661 10.8855 9.34097 10.8857 9.63396 10.5929L13.7519 6.47752V18.667C13.7519 19.0812 14.0877 19.417 14.5019 19.417C14.9161 19.417 15.2519 19.0812 15.2519 18.667V6.48234L19.3653 10.5929C19.6583 10.8857 20.1332 10.8855 20.426 10.5925C20.7188 10.2995 20.7186 9.82463 20.4256 9.53184L15.0838 4.19378C14.9463 4.02488 14.7367 3.91699 14.5019 3.91699ZM5.91626 18.667C5.91626 18.2528 5.58047 17.917 5.16626 17.917C4.75205 17.917 4.41626 18.2528 4.41626 18.667V21.8337C4.41626 23.0763 5.42362 24.0837 6.66626 24.0837H22.3339C23.5766 24.0837 24.5839 23.0763 24.5839 21.8337V18.667C24.5839 18.2528 24.2482 17.917 23.8339 17.917C23.4197 17.917 23.0839 18.2528 23.0839 18.667V21.8337C23.0839 22.2479 22.7482 22.5837 22.3339 22.5837H6.66626C6.25205 22.5837 5.91626 22.2479 5.91626 21.8337V18.667Z"
                    />
                  </svg>
                </div>
              </div>

              <h4 className="mb-2 text-sm font-semibold text-gray-800 dark:text-white/90">
                {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
              </h4>

              <span className="text-center mb-3 block w-full max-w-[200px] text-xs text-gray-700 dark:text-gray-400">
                Drag and drop your PNG, JPG, WebP, SVG images here or browse
              </span>

              <span className="text-xs font-medium underline text-brand-500">
                Browse File
              </span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <Label>Email</Label>
        <div className="relative">
          <Input 
            placeholder="info@gmail.com" 
            type="text" 
            className="pl-[62px]"
            onChange={handleEmailChange}
          />
          <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
            <EnvelopeIcon className="size-6" />
          </span>
        </div>
      </div>
      <div>
        <Label>Phone</Label>
        <PhoneInput
          onChange={handlePhoneNumberChange}
          placeholder="+63 912 345 6789"
        />
      </div>
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors duration-200 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Close
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 text-sm font-medium text-white transition-colors duration-200 bg-brand-500 rounded-lg hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </div>
          ) : (
            "Update Contact Information"
          )}
        </button>
      </div>
    </form>
  );
}
