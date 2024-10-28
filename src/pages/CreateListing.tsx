import { createListing, IFormInputs} from "../api/listing";
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from "react-router-dom";
import { fetchCategories, Category } from '../api/category';

// Yup validation schema
const schema = yup.object({
    title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
    description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    price: yup.number().required('Price is required').positive('Price must be a positive number'),
    condition: yup.string().required('Condition is required'),
    categoryId: yup.string().required('Category is required'),
    status: yup.string().required('Status is required'),
    images: yup.mixed().required('At least one image is required'),
});

const CreateListing: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }, reset, setValue } = useForm<IFormInputs>({
            resolver: yupResolver(schema) as any,
        });

    const [images, setImages] = useState<File[]>([]);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const fetchedCategories = await fetchCategories();
                setCategories(fetchedCategories);
            } catch (error) {
                console.error('Error loading categories', error);
            }
        };
        loadCategories();
    }, []);

    // Form submit handler
    const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('price', data.price.toString());
        formData.append('condition', data.condition);
        formData.append('categoryId', data.categoryId);
        formData.append('status', data.status);
        // Append all selected image files
        images.forEach((image) => {
            formData.append('images', image);
        });

        try {
            await createListing(formData);
            reset();  // Reset form after successful submission
            navigate("/");
            console.log('Listing created successfully');
        } catch (error) {
            console.error('Error creating listing:', error);
        }
    };

    // Handling file upload for images
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setImages(Array.from(files));  // Update state with the selected files
            setValue('images', Array.from(files));  // Update react-hook-form field value
        }
    };

    const renderInput = (label: string, name: keyof IFormInputs, type = "text") => (
        <div className="relative z-0 w-full mb-5 group">
            {type === "textarea" ? (
            <>
                <label
                    htmlFor={name}
                    className="block mb-2 text-sm font-medium text-gray-900"
                >
                    {label}
                </label>
                <textarea
                    {...register(name)} // Bind to react-hook-form
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
            {errors[name] && (
                <p className="text-sm text-red-500 mt-1">{errors[name]?.message}</p>
            )}
        </div>
    );
    

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Left Side - Form with Pink Background */}
            <div className="w-3/4 bg-pink-100 flex items-center justify-center min-h-screen">
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      
                    <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">Create Listing</h2>
                    
                    <div className="space-y-4">
                        {/* Title Input */}
                        {renderInput("Title", "title")}
                        
                        {/* Price Input */}
                        {renderInput("Price", "price", "number")}
                        
                        {/* Condition Input */}
                        {renderInput("Condition", "condition")}
                        
                        {/* Description Textarea */}
                        {renderInput("Description", "description", "textarea")}
                    </div>
                    
                    {/* Category Dropdown */}
                    <div className="mb-4">
                        <label htmlFor="categories" className="block mb-2 text-sm font-medium text-gray-900">Select category</label>
                        <select {...register('categoryId')} id="categories" className="w-full p-2 text-sm rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500">
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        <p className="text-sm text-red-500">{errors.categoryId?.message}</p>
                    </div>
                    
                    {/* Status Radio Buttons */}
                    <fieldset className="mb-4">
                        <legend className="text-sm font-medium text-gray-900">Status</legend>
                        <div className="space-y-2">
                            {["active", "inactive", "sold", "pending"].map((status) => (
                                <div key={status} className="flex items-center">
                                    <input 
                                        id={`status-option-${status}`} 
                                        type="radio" 
                                        value={status}
                                        {...register('status')} 
                                        className="w-4 h-4 border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`status-option-${status}`} className="ml-2 text-sm text-gray-900 capitalize">{status}</label>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-red-500">{errors.status?.message}</p>
                    </fieldset>
    
                    {/* Image Upload */}
                    <div className="mb-4">
                        <label htmlFor="images" className="block mb-2 text-sm font-medium text-gray-900">Upload images</label>
                        <input 
                            type="file" 
                            id="images" 
                            multiple 
                            onChange={handleFileChange} 
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                            aria-describedby="images_help"
                        />
                        <p className="text-sm text-gray-500" id="images_help">Upload at least one image</p>
                        <p className="text-sm text-red-500">{errors.images && 'Please upload at least one image'}</p>
                    </div>
    
                    {/* Submit Button */}
                    <div className="flex justify-center mt-6">
                        <button type="submit" className="px-6 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Create Listing</button>
                    </div>
                </form>
            </div>
    
            {/* Right Side - Image Preview */} 
            <div className="w-1/2 bg-white flex items-center justify-center">
    <div className="max-w-md w-full">
    <h3 className="text-lg font-medium text-orange-500 mb-4 text-center">ReUZit</h3>
        {/* Customizable Image Area */}
        <div className="flex flex-wrap gap-2">
            <img 
                alt="Uploaded Preview" 
                loading="eager" 
                decoding="async" 
                data-nimg="1" 
                className="w-full h-[75vh] object-cover rounded-lg" // Adjust height to approximately 3/4 of the container
                src="https://png.pngtree.com/thumb_back/fh260/background/20230817/pngtree-lotus-flower-jpg-pink-lotus-flower-image_13023952.jpg"
            />
        </div>
    </div>
</div>

    </div>
    );
    
};

export default CreateListing;