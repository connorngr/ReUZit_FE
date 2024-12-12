import React, { useState } from 'react';

interface DropdownFilterProps {
  selectedOption: string;
  onOptionChange: (option: string) => void;
}

const DropdownFilter: React.FC<DropdownFilterProps> = ({ selectedOption, onOptionChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleOptionSelect = (option: string) => {
    onOptionChange(option);
    setIsDropdownOpen(false);
  };

  const options = ['Last day', 'Last 7 days', 'Last 30 days', 'Last month', 'Last year'];

  return (
    <div className="relative">
      <button
        id="dropdownRadioButton"
        onClick={handleToggleDropdown}
        className="inline-flex items-center text-[#eb6a4e] bg-white border border-[#eb6a4e] focus:outline-none hover:bg-[#f87047] hover:text-white font-medium rounded-lg text-sm px-3 py-1.5"
        type="button"
      >
        <svg className="w-3 h-3 text-[#eb6a4e] me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
        </svg>
        {selectedOption}
        <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
        </svg>
      </button>
      {isDropdownOpen && (
        <div id="dropdownRadio" className="z-10 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow absolute top-full mt-1">
          <ul className="p-3 space-y-1 text-sm text-[#eb6a4e]" aria-labelledby="dropdownRadioButton">
            {options.map((option) => (
              <li key={option}>
                <div className="flex items-center p-2 rounded hover:bg-[#eb6a4e] hover:text-white" onClick={() => handleOptionSelect(option)}>
                  <input id={`filter-radio-${option}`} type="radio" name="filter-radio" checked={selectedOption === option} readOnly className="w-4 h-4 text-[#eb6a4e] bg-gray-100 border-gray-300 focus:ring-[#eb6a4e]" />
                  <label htmlFor={`filter-radio-${option}`} className="w-full ms-2 text-sm font-medium text-gray-900">
                    {option}
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownFilter;
