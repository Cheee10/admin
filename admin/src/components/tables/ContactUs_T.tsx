import Label from "../form/Label";
import Input from "../form/input/InputField";
import { EnvelopeIcon } from "../../icons";
import PhoneInput from "../form/group-input/PhoneInput";
import { useState, useEffect } from "react";

interface Contact {
  _id: string;
  email: string;
  phone: string;
  image: string | null;
  updatedAt: Date;
}

export default function CUtable() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Contact>({
    _id: "",
    email: "",
    phone: "",
    image: null,
    updatedAt: new Date()
  });

  // Fetch contacts from the API
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.1.24:5000/api/contact');
      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      console.log('Fetched contact data:', data); // Debug log
      setContacts(data);
      
      if (data.length > 0) {
        console.log('Setting form data with:', data[0]); // Debug log
        setFormData(data[0]); // Set the latest contact data
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch contacts when component mounts
  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">Error: {error}</div>;
  }

  return (
    <div>
      <form className="space-y-6">
        <div className="mb-6">
          <Label>Current Image</Label>
          <div className="mt-2 relative w-full h-[350px] rounded-lg overflow-hidden border border-gray-300 dark:border-gray-700">
            <img 
              src={formData.image ? `http://192.168.1.24:5000/${formData.image}` : ''}
              alt="Contact" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', formData.image); // Debug log
                e.currentTarget.src = '';
              }}
            />
          </div>
        </div>
        <div>
          <Label>Email</Label>
          <div className="relative">
            <Input 
              placeholder="info@gmail.com" 
              type="text" 
              className="pl-[62px] bg-gray-100 cursor-not-allowed"
              value={formData.email}
              disabled
            />
            <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
              <EnvelopeIcon className="size-6" />
            </span>
          </div>
        </div>
        <div>
          <Label>Phone</Label>
          <PhoneInput
            value={formData.phone}
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
        </div>
      </form>
    </div>
  );
}