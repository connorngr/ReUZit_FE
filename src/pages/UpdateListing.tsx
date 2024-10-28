import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {Category, fetchCategories} from '../api/category'

import { updateListing, getListingById, Listing } from '../api/listing';

interface UpdateListingFormProps {
  listingId: number;
  onSuccess: (listing: Listing) => void;
}

interface FormValues {
  title: string;
  description: string;
  price: number | string;
  condition: string;
  status: string;
  categoryId: number | string;
  images: File[];
}

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  price: Yup.number().required('Price is required').min(0, 'Price must be a positive number'),
  condition: Yup.string().required('Condition is required'),
  status: Yup.string().required('Status is required'),
  categoryId: Yup.number().required('Category ID is required'),
  images: Yup.mixed(),
});

const UpdateListingForm: React.FC<UpdateListingFormProps> = ({ listingId, onSuccess }) => {
  const [initialValues, setInitialValues] = useState<FormValues | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
    resolver: yupResolver(validationSchema) as any,
  });

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('price', values.price.toString());
    formData.append('condition', values.condition);
    formData.append('status', values.status);
    formData.append('categoryId', values.categoryId.toString());
    images.forEach((image) => formData.append('images', image));

    try {
      const updatedListing = await updateListing(listingId, formData);
      onSuccess(updatedListing);
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImages(fileArray);
      setValue('images', fileArray); // Update form values
    }
  };
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const fetchedListing = await getListingById(listingId);
        setInitialValues({
          title: fetchedListing.title,
          description: fetchedListing.description,
          price: fetchedListing.price,
          condition: fetchedListing.condition,
          status: fetchedListing.status,
          categoryId: fetchedListing.categoryId,
          images: [],
        });
        // Set form values
        Object.entries(fetchedListing).forEach(([key, value]) => {
          setValue(key as keyof FormValues, value);
        });
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };

    const loadCategories = async () => {
      try {
          const fetchedCategories = await fetchCategories();
          setCategories(fetchedCategories);
      } catch (error) {
          console.error('Error loading categories', error);
      }
  };
    loadCategories();
    fetchListing();
  }, [listingId, setValue]);

  if (!initialValues) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Left Side - Form with Pink Background */}
      <div className="w-3/4 bg-pink-100 flex items-center justify-center min-h-screen">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">Update Listing</h2>

          <div className="space-y-4">
            {/* Title */}
            <div className="mb-4">
              <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">Title</label>
              <input
                type="text"
                id="title"
                {...register('title')}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
            </div>

            {/* Price */}
            <div className="mb-4">
              <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900">Price</label>
              <input
                type="number"
                id="price"
                {...register('price')}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>

            {/* Condition */}
            <div className="mb-4">
              <label htmlFor="condition" className="block mb-2 text-sm font-medium text-gray-900">Condition</label>
              <input
                type="text"
                id="condition"
                {...register('condition')}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition.message}</p>}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-900">Description</label>
              <textarea
                id="description"
                {...register('description')}
                rows={4}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
            </div>

            {/* Category */}
            <div className="mb-4">
              <label htmlFor="categoryId" className="block mb-2 text-sm font-medium text-gray-900">Category</label>
              <select
                id="categoryId"
                {...register('categoryId')}
                className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId.message}</p>}
            </div>

            {/* Images */}
          <div className="mb-4">
            <label htmlFor="images" className="block mb-2 text-sm">Upload Images</label>
            <input type="file" id="images" multiple onChange={handleFileChange} />
            {errors.images && <p className="text-red-500">Please upload at least one image</p>}
          </div>
          </div>
          
          <div className="flex justify-center mt-6">
            <button type="submit" className="px-6 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">Update Listing</button>
          </div>
        </form>
      </div>

      {/* Right Side - Image Preview */}
      <div className="w-1/2 bg-white flex items-center justify-center">
        <div className="max-w-md w-full">
          <h3 className="text-lg font-medium text-orange-500 mb-4 text-center">ReUZit</h3>
          <div className="flex flex-wrap gap-2">
            <img alt="Uploaded Preview" loading="eager" decoding="async" className="w-full h-[75vh] object-cover rounded-lg" src="https://png.pngtree.com/thumb_back/fh260/background/20230817/pngtree-lotus-flower-jpg-pink-lotus-flower-image_13023952.jpg" />
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default UpdateListingForm;
