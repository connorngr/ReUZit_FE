// FormFields.tsx
import React from 'react';
import { Control, useController } from 'react-hook-form';

interface FormFieldProps {
    label: string;
    name: string;
    control: Control<any>;
    type?: string;
    placeholder?: string;
  }
  
  const FormField: React.FC<FormFieldProps> = ({ label, name, control, type = 'text' }) => {
    const {
      field,
      fieldState: { error },
    } = useController({
      name,
      control,
      defaultValue: '',
    });
  
    return (
      <div className="relative z-0 w-full mb-5 group">
        {type === 'textarea' ? (
          <>
            <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900">
              {label}
            </label>
            <textarea
              {...field}
              id={name}
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Leave a comment..."
            ></textarea>
          </>
        ) : (
          <>
            <input
              type={type}
              {...field}
              id={`floating_${name}`}
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor={`floating_${name}`}
              className="absolute text-sm text-gray-500 transition-all duration-300 transform -translate-y-6 scale-75 top-3 left-0 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:-translate-y-6 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0"
            >
              {label}
            </label>
          </>
        )}
        {error && <p className="text-sm text-red-500 mt-1">{error.message}</p>}
      </div>
    );
  };
  
  export default FormField;