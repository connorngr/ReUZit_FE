import React from "react";
import { UseFormRegister, FieldError } from "react-hook-form";
import { Category } from "../../../api/category";

interface CategoryDropdownProps {
  categories: Category[];
  register: UseFormRegister<any>;
  error?: FieldError;
  defaultValue?: string;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({ categories, register, error, defaultValue }) => {
  return (
    <div className="mb-4">
      <label htmlFor="categories" className="block mb-2 text-sm font-medium text-gray-900">
        Select category
      </label>
      <select
        {...register("categoryId")}
        id="categories"
        className="w-full p-2 text-sm rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        defaultValue={defaultValue}
      >
        <option value="">Select a category</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};

export { CategoryDropdown };

