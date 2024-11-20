import { useEffect, useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Category, fetchCategories } from '../../api/category';
import { updateListing, getListingById, Listing, IFormInputs } from '../../api/listing';
import { listingValidationSchema } from '../../validation/validationSchema';
import FormField from '../../components/common/form/FormFields';
import { API_URL } from '../../api/auth'
import { CategoryDropdown } from "../../components/common/Category/CategoryDropdown";

const UpdateListingForm: React.FC = () => {
  const navigate = useNavigate();
  const { listingId } = useParams<{ listingId: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [defaultCategoryId, setDefaultCategoryId] = useState<string>("");

  const methods = useForm<IFormInputs>({
    resolver: yupResolver(listingValidationSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      condition: '',
      status: '',
      categoryId: '',
    },
  });

  const { handleSubmit, setValue, register, reset, formState: { errors } } = methods;

  const onSubmit: SubmitHandler<IFormInputs> = async (values) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('price', values.price.toString());
    formData.append('condition', values.condition);
    formData.append('status', values.status);
    formData.append('categoryId', values.categoryId.toString());
    images.forEach((image) => formData.append('images', image));

    try {
      const updatedListing = await updateListing(Number(listingId), formData);
      reset();
      navigate("/my-listings"); 
    } catch (error) {
      console.error('Error updating listing:', error);
    }
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
    const fetchListing = async () => {
      try {
        const fetchedListing = await getListingById(Number(listingId));
        setValue('title', fetchedListing.title);
        setValue('description', fetchedListing.description);
        setValue('price', fetchedListing.price);
        setValue('condition', fetchedListing.condition);
        setValue('status', fetchedListing.status);
        setValue('categoryId', fetchedListing.categoryId.toString());
        setDefaultCategoryId(fetchedListing.categoryId.toString()); 
        setImageUrls(fetchedListing.images.map(image => `${API_URL}${image.url}`));
        
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };

    const loadCategories = async () => {
      try {
        const fetchedCategories = await fetchCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
    fetchListing();
  }, [listingId, setValue]);

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-3/4 bg-pink-100 flex items-center justify-center min-h-screen">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">Update Listing</h2>

            <div className="space-y-4">
              <FormField label="Title" name="title" control={methods.control} />
              <FormField label="Price" name="price" control={methods.control} type="number" />
              <FormField label="Condition" name="condition" control={methods.control} />
              <FormField label="Description" name="description" control={methods.control} type="textarea" />
            </div>

            <CategoryDropdown categories={categories} register={register} error={errors.categoryId} defaultValue={defaultCategoryId} />

            {/* Image Upload */}
            <div className="mb-4">
              <label htmlFor="images" className="block mb-2 text-sm">Upload Images</label>
              <input type="file" id="images" multiple onChange={handleFileChange} />
              <p className="text-sm text-red-500">{errors.images && 'Please upload at least one image'}</p>
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
            <div className="flex flex-wrap">
              {imageUrls.slice(0, 6).map((url, index) => ( // Limit to 6 images
                <div key={index} className="w-1/2 h-1/3 p-1"> {/* Use padding to create space */}
                  <img
                    alt={`Uploaded Preview ${index + 1}`}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover rounded-lg" // Use w-full and h-full to fill parent div
                    src={url}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </FormProvider>
  );
};

export default UpdateListingForm;
