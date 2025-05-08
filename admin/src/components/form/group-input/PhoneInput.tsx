import { useState, useEffect } from "react";
import { PhoneIcon } from "../../../icons";

interface PhoneInputProps {
  placeholder?: string;
  onChange?: (phoneNumber: string) => void;
  value?: string;
  disabled?: boolean;
  className?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  placeholder = "+1 (555) 000-0000",
  onChange,
  value,
  disabled = false,
  className = "",
}) => {
  const [phoneNumber, setPhoneNumber] = useState<string>(value || "");

  // Update phoneNumber when value prop changes
  useEffect(() => {
    if (value) {
      setPhoneNumber(value);
    }
  }, [value]);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPhoneNumber = e.target.value;
    setPhoneNumber(newPhoneNumber);
    if (onChange) {
      onChange(newPhoneNumber);
    }
  };

  return (
    <div className="relative flex">
      {/* Phone Icon Separator */}
      <span className="absolute left-0 top-1/2 -translate-y-1/2 border-r border-gray-200 px-3.5 py-3 text-gray-500 dark:border-gray-800 dark:text-gray-400">
        <PhoneIcon className="size-6" />
      </span>

      {/* Input field */}
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`dark:bg-dark-900 h-11 w-full pl-[62px] rounded-lg border border-gray-300 bg-transparent py-3 px-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      />
    </div>
  );
};

export default PhoneInput;
