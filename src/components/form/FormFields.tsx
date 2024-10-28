// FormFields.tsx
import React from 'react';
import { useFormContext } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface IFormInputs {
    title: string;
    description: string;
    price: number;
    condition: string;
    categoryId: string;
    status: string;
    images: File[];
}

const schema = yup.object({
    title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
    description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    price: yup.number().required('Price is required').positive('Price must be a positive number'),
    condition: yup.string().required('Condition is required'),
    categoryId: yup.string().required('Category is required'),
    status: yup.string().required('Status is required'),
    images: yup.mixed().required('At least one image is required'),
});

const renderInput = (label: string, name: keyof IFormInputs, type = "text") => {
    const {
        register,
        formState: { errors }} = useFormContext<IFormInputs>();
    return (
        <div className="relative z-0 w-full mb-5 group">
            {type === "textarea" ? (
                <>
                    <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
                    <textarea
                        {...register(name)}
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
                        {...register(name)}
                        id={`floating_${name}`}
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        required
                    />
                    <label
                        htmlFor={`floating_${name}`}
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                        {label}
                    </label>
                </>
            )}
            {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name]?.message}</p>}
        </div>
    );
};

export default renderInput;
