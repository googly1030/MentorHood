import  { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface CustomSelectProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

const CustomSelect = ({ label, options, selectedValues, onChange, placeholder = "Select options" }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (option: string) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter(v => v !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4937e8] cursor-pointer bg-white flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1">
          {selectedValues.length > 0 ? (
            selectedValues.map((value) => (
              <span
                key={value}
                className="bg-gray-100 px-2 py-1 rounded-md text-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleOption(value);
                }}
              >
                {value}
              </span>
            ))
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          size={20}
        />
      </div>
      
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                selectedValues.includes(option) ? 'bg-gray-100' : ''
              }`}
              onClick={() => toggleOption(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;