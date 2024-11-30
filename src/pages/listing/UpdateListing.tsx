import { useEffect, useState, useRef } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Category, fetchCategories } from '../../api/category';
import { updateListing, getListingById, IFormInputs } from '../../api/listing';
import { listingValidationSchemaUpdate } from '../../validation/validationSchema';
import FormField from '../../components/common/form/FormFields';
import { getAllImagesByListingId, addImages, deleteImages } from '../../api/image';
import { API_URL } from '../../api/auth'
import { Dropdown } from "../../components/common/form/Dropdown";
import { Image } from '../../api/image';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getConditions, Condition } from "../../api/enum"

const UpdateListingForm: React.FC = () => {
  const navigate = useNavigate();
  const { listingId } = useParams<{ listingId: string }>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageUrls, setImageUrls] = useState<Image[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<IFormInputs>({
    resolver: yupResolver(listingValidationSchemaUpdate) as any,
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

    // Log formData contents to verify that the data is correct
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    try {
      const updatedListing = await updateListing(Number(listingId), formData);
      reset(); // Reset form
      navigate("/my-listings"); // Navigate after successful update
    } catch (error) {
      console.error('Error updating listing:', error);
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
        setValue('categoryId', (fetchedListing.category.id ?? 0).toString());
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };

    const fetchImages = async () => {
      try {
        const images = await getAllImagesByListingId(Number(listingId)); // Fetch images by listing ID
        setImageUrls(images); // Extract URLs
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    const loadCategories = async () => {
      try {
        const fetch_Categories = await fetchCategories();
        const fetchedConditions = await getConditions();
        setCategories(fetch_Categories);
        setConditions(
          fetchedConditions.map((condition: string) => ({
            id: condition, // Enum values as `id`
            name: condition, // Enum values as `name`
          }))
        );

      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
    fetchListing();
    fetchImages();
  },[imageUrls]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(Array.from(event.target.files)); // Update selected files
      handleAddImages(event.target.files); // Automatically upload the images
    }
  };

  const handleAddImages = async (files: FileList) => {
    if (files.length > 0) {
      try {
        const newImages = await addImages(Number(listingId), Array.from(files)); // Add images
        setImageUrls(prevImages => [
          ...prevImages,
          ...newImages, // newImages is now an array of Image objects
        ]);
        setSelectedFiles([]); // Clear the selected files
      } catch (error) {
        console.error('Error adding images:', error);
      }
    } else {
      console.log('No files selected.');
    }
  };

  const handleDeleteImage = async (imageId: number, index: number) => {
    try {
      const idsToDelete = [imageId]; // We now pass the image ID directly

      // Call the deleteImages API
      const response = await deleteImages(idsToDelete);

      // Remove the deleted image from the UI
      setImageUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
      console.log('Image deleted:', response);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Programmatically click the file input
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-screen bg-gray-100">
        <div className="w-3/4 bg-pink-100 flex items-center justify-center min-h-screen">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-semibold text-center text-gray-900 mb-6">Update Listing</h2>

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
              <FormField label="Description" name="description" control={methods.control} type="textarea" />
            </div>
            
            <div className="flex justify-center mt-6">
              <button type="submit" className="px-6 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700">Update Listing</button>
            </div>
          </form>
        </div>

        {/* Right Side - Image Preview */}
        <div className="w-1/2 bg-white flex items-center justify-center">
          <div className="max-w-md w-full">
            <h3 className="text-lg font-medium text-orange-500 mb-4 text-center">Edit Image</h3>
            <div className="flex flex-wrap">
              {imageUrls.slice(0, 6).map((image, index) => ( // Map over Image[] instead of just URLs
                <div key={index} className="relative w-1/2 h-1/3 p-1"> {/* Use padding to create space */}
                  <img
                    alt={`Uploaded Preview ${index + 1}`}
                    loading="eager"
                    decoding="async"
                    className="w-full h-full object-cover rounded-lg"
                    src={`${API_URL}${image.url}`} // Access the URL property of Image object
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(image.id, index)} // Pass the image ID and index
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <input
                ref={fileInputRef} // Attach the ref
                type="file"
                multiple
                onChange={handleFileChange} // Call the handler when files are selected
                className="hidden" // Hide the input element
              />

              {/* Button to trigger file selection */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={triggerFileInput} // Trigger file input when the button is clicked
                  className="px-6 py-2 font-semibold text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Add Image
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </FormProvider>
  );
};

export default UpdateListingForm;
