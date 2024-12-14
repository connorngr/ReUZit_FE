import { createListing, IFormInputs } from "../../api/listing";
import React, {useCallback, useEffect, useState} from 'react';
import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from "react-router-dom";
import { fetchCategories, Category } from '../../api/category';
import { listingValidationSchema } from '../../validation/validationSchema';
import FormField from '../../components/common/form/FormFields';
import { Dropdown } from "../../components/common/form/Dropdown";
import { getConditions, Condition } from "../../api/enum";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import QuillToolbar, { modules, formats } from "../../components/reactQuill/EditorToolbar";
import {addListing} from "../../stores/listingSlice.ts";
import {AppDispatch} from "../../stores/store.ts";
import {useDispatch} from "react-redux";

interface ListingFormValues {
    title: string;
    description: string;
    price: string | number;
    condition: string;
    status: string;
    categoryId: string | number;
    images: File[] | null;
}

const CreateListing: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [conditions, setConditions] = useState<Condition[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const [description, setDescription] = useState<string>("");

    const methods = useForm<IFormInputs>({
        resolver: yupResolver(listingValidationSchema) as any,
    });

    const { handleSubmit, reset, setValue, register, formState: { errors } } = methods;

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        setValue("description", value); // Sync React-Quill value with React Hook Form
    };

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
                const fetchedConditions = await getConditions();
                setCategories(fetchedCategories);
                setConditions(
                    fetchedConditions.map((condition: string) => ({
                        id: condition, // Enum values as `id`
                        name: condition, // Enum values as `name`
                    }))
                );
            } catch (error) {
                console.error('Error loading categories', error);
            }
        };
        loadCategories();
    }, []);

    // Form submit handler
    // const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    //     const formData = new FormData();
    //
    //     formData.append('title', data.title);
    //     formData.append('description', data.description);
    //     formData.append('price', data.price.toString());
    //     formData.append('condition', data.condition);
    //     formData.append('categoryId', data.categoryId);
    //     // Append all selected image files
    //     images.forEach((image) => {
    //         formData.append('images', image);
    //     });
    //     console.log(formData);
    //
    //     try {
    //         await createListing(formData);
    //         reset();  // Reset form after successful submission
    //         navigate("/my-listings");
    //         console.log('Listing created successfully');
    //     } catch (error) {
    //         console.error('Error creating listing:', error);
    //     }
    // };


    // Xử lý submit form
    const onSubmit: (values: ListingFormValues) => Promise<void> = useCallback(
        async (values: ListingFormValues) => {
            await dispatch(addListing({ ...values, images: images }));
            reset();
            navigate("/my-listings");
            console.log('Listing created successfully');
        },
        [dispatch, images, navigate, reset]
    );

    return (
        <FormProvider {...methods}>
            <div className="flex p-5 rounded-md min-h-screen bg-gray-100">
                <div className="w-3/4 bg-grey-100 flex items-center justify-center min-h-screen">
                    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">Create Listing</h2>

                        <div className="space-y-4">
                            <FormField label="Title" name="title" control={methods.control} />
                            <FormField label="Price" name="price" control={methods.control} type="number" />
                            <Dropdown
                                options={conditions}
                                register={register}
                                name="condition"
                                label="Condition"
                                error={errors.condition}
                            />
                            <Dropdown
                                options={categories}
                                register={register}
                                name="categoryId"
                                label="Category"
                                error={errors.categoryId}
                            />
                            {/* <FormField label="Description" name="description" control={methods.control} type="textarea" /> */}
                            <div className="form-group col-md-12 editor">
                                <label className="font-weight-bold">
                                    Description <span className="required">*</span>
                                </label>
                                {/* Quill Toolbar */}
                                <QuillToolbar toolbarId="t1" />

                                {/* Quill Editor */}
                                <ReactQuill
                                    theme="snow"
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    placeholder="Write something awesome..."
                                    modules={modules({ toolbarId: "t1" })}
                                    formats={formats}
                                    style={{ height: "200px", overflow: "auto" }}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                                )}
                            </div>
                        </div>

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
                            <button type="submit" className="px-6 py-2 font-semibold text-white bg-primary rounded hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500">Create Listing</button>
                        </div>
                    </form>
                </div>
                <div className="w-1/2 bg-white flex items-center justify-center">
                    <div className="max-w-md w-full">
                        <h3 className="text-lg font-medium text-orange-500 mb-4 text-center">Image(s)</h3>
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
