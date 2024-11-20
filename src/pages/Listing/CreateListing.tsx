import { createListing, IFormInputs } from "../../api/listing";
import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from "react-router-dom";
import { fetchCategories, Category } from '../../api/category';
import { listingValidationSchema } from '../../validation/validationSchema';
import FormField from '../../components/common/form/FormFields';
import { CategoryDropdown } from "../../components/common/Category/CategoryDropdown";
import { MultipleFilesDropzone } from "../../components/common/dropzone";

const CreateListing: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const navigate = useNavigate();

    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const methods = useForm<IFormInputs>({
        resolver: yupResolver(listingValidationSchema) as any,
    });

    const { handleSubmit, reset, setValue, register, formState: { errors } } = methods;
    const [images, setImages] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const fileArray = Array.from(files);
            setImages(fileArray);
            setImageUrls(fileArray.map((file) => URL.createObjectURL(file))); // Create object URLs for preview
            setValue('images', fileArray); // Update form values
        }
    };

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
            navigate("/my-listings");
            console.log('Listing created successfully');
        } catch (error) {
            console.error('Error creating listing:', error);
        }
    };

    return (
        <FormProvider {...methods}>
            <div className="flex min-h-screen bg-gray-100">
                <div className="w-3/4 bg-pink-100 flex items-center justify-center min-h-screen">
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">Create Listing</h2>
                        
                        <div className="space-y-4">
                            <FormField label="Title" name="title" control={methods.control} />
                            <FormField label="Price" name="price" control={methods.control} type="number" />
                            <FormField label="Condition" name="condition" control={methods.control} />
                            <FormField label="Description" name="description" control={methods.control} type="textarea" />
                        </div>
                        
                        <CategoryDropdown categories={categories} register={register} error={errors.categoryId} />
                        
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
                                            {...methods.register('status')}
                                            className="w-4 h-4 border-gray-300 focus:ring-blue-500"
                                        />
                                        <label htmlFor={`status-option-${status}`} className="ml-2 text-sm text-gray-900 capitalize">{status}</label>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-red-500">{methods.formState.errors.status?.message}</p>
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
                            <p className="text-sm text-red-500">{methods.formState.errors.images && 'Please upload at least one image'}</p>
                        </div>
                        {/* Submit Button */}
                        <div className="flex justify-center mt-6">
                            <button type="submit" className="px-6 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">Create Listing</button>
                        </div>
                    </form>
                </div>
                <div className="w-1/2 bg-white flex items-center justify-center">
                            <div className="max-w-md w-full">
                                <h3 className="text-lg font-medium text-orange-500 mb-4 text-center">ReUZit</h3>
                                <div className="flex flex-wrap">
                                    {imageUrls.length > 0 ? (
                                        imageUrls.slice(0, 6).map((url, index) => (
                                            <div key={index} className="w-1/2 h-1/3 p-1">
                                                <img
                                                    alt={`Uploaded Preview ${index + 1}`}
                                                    loading="eager"
                                                    decoding="async"
                                                    className="w-full h-full object-cover rounded-lg"
                                                    src={url}
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500">Please select at least one image.</p> // Message when no images are uploaded
                                    )}
                                </div>
                            </div>
                        </div>
            </div>
        </FormProvider>
    );
};

export default CreateListing;