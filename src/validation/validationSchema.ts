// src/validation/validationSchema.ts
import * as yup from 'yup';

export const listingValidationSchema = yup.object().shape({
    title: yup.string().required('Title is required').min(3, 'Title must be at least 3 characters'),
    description: yup.string().required('Description is required').min(10, 'Description must be at least 10 characters'),
    price: yup.number().required('Price is required').positive('Price must be a positive number'),
    condition: yup.string().required('Condition is required'),
    categoryId: yup.string().required('Category is required'),
    status: yup.string().required('Status is required'),
    images: yup.mixed().required('At least one image is required'),
});


