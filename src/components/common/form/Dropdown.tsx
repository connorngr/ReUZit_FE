import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";

interface DropdownProps {
  options: { id: string | number; name: string }[]; // Generic options structure
  register: UseFormRegister<any>;
  name: string; // Form field name
  label: string; // Label for the dropdown
  error?: FieldError;
  defaultValue?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, register, name, label, error, defaultValue }) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900">
        {label}
      </label>
      <select
        {...register(name)}
        id={name}
        className="w-full p-2 text-sm rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        defaultValue={defaultValue}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export { Dropdown };
