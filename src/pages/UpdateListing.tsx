import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { updateListing } from '../api/listing'; // Import your API file
import { getListingById, Listing } from '../api/listing';

interface UpdateListingFormProps {
  listingId: number;
  onSuccess: (listing: Listing) => void;
}

// Define the type for initial values
interface InitialValues { // đổi tên 
  title: string;
  description: string;
  price: number | string; // Can be number or string, depending on your handling
  condition: string;
  status: string;
  categoryId: number | string; // Can be number or string, depending on your handling
  images: File[];
}

const UpdateListingForm: React.FC<UpdateListingFormProps> = ({ listingId, onSuccess }) => {
  const [initialValues, setInitialValues] = useState<InitialValues | null>(null); // Define initialValues as a state

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    price: Yup.number().required('Price is required').min(0, 'Price must be a positive number'),
    condition: Yup.string().required('Condition is required'),
    status: Yup.string().required('Status is required'),
    categoryId: Yup.number().required('Category ID is required'),
    images: Yup.mixed(),
  });

  const handleSubmit = async (values: InitialValues) => { // Use InitialValues type
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('price', values.price.toString());
    formData.append('condition', values.condition);
    formData.append('status', values.status);
    formData.append('categoryId', values.categoryId.toString());

    // Specify the type of the image parameter
    values.images.forEach((image: File, index: number) => {
      formData.append(`images[${index}]`, image);
    });

    try {
      const updatedListing = await updateListing(listingId, formData);
      onSuccess(updatedListing); // Callback when update is successful
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const fetchedListing = await getListingById(listingId);
        // Set initial values with fetched listing data
        setInitialValues({
          title: fetchedListing.title,
          description: fetchedListing.description,
          price: fetchedListing.price,
          condition: fetchedListing.condition,
          status: fetchedListing.status,
          categoryId: fetchedListing.categoryId,
          images: [], // Reset images or keep it empty for new uploads
        });
      } catch (error) {
        console.error('Error fetching listing:', error);
      }
    };

    fetchListing();
  }, [listingId]);

  if (!initialValues) {
    return <div>Loading...</div>; // Show loading while fetching data
  }

  
  return (
    <Formik
      initialValues={initialValues} // Use the fetched initialValues
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form>
          <div>
            <label>Title</label>
            <Field name="title" type="text" />
            <ErrorMessage name="title" component="div" />
          </div>

          <div>
            <label>Description</label>
            <Field name="description" as="textarea" />
            <ErrorMessage name="description" component="div" />
          </div>

          <div>
            <label>Price</label>
            <Field name="price" type="number" />
            <ErrorMessage name="price" component="div" />
          </div>

          <div>
            <label>Condition</label>
            <Field name="condition" type="text" />
            <ErrorMessage name="condition" component="div" />
          </div>

          <div>
            <label>Status</label>
            <Field name="status" type="text" />
            <ErrorMessage name="status" component="div" />
          </div>

          <div>
            <label>Category ID</label>
            <Field name="categoryId" type="number" />
            <ErrorMessage name="categoryId" component="div" />
          </div>

          <div>
            <label>Images</label>
            <input
              name="images"
              type="file"
              multiple
              onChange={(event) => {
                const files = event.currentTarget.files;
                if (files) {
                  setFieldValue("images", Array.from(files));
                }
              }}
            />
            <ErrorMessage name="images" component="div" />
          </div>

          <button type="submit">Update Listing</button>
        </Form>
      )}
    </Formik>
  );
};

export default UpdateListingForm;
