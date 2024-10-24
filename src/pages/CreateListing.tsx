import { createListing } from "../api/listing";
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from "react-router-dom";


interface IFormInputs {
    title: string;
    description: string;
    price: number;
    condition: string;
    categoryId: string;
    status: string;
    images: File[];
}

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
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }, reset, setValue } = useForm<IFormInputs>({
            resolver: yupResolver(schema) as any,
        });

    const [images, setImages] = useState<File[]>([]);

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

    return (
        <form onSubmit={handleSubmit(onSubmit)}>

            <div>
                <label>Title</label>
                <input type="text" {...register('title')} />
                <p>{errors.title?.message}</p>
            </div>

            <div>
                <label>Description</label>
                <textarea {...register('description')} />
                <p>{errors.description?.message}</p>
            </div>

            <div>
                <label>Price</label>
                <input type="number" {...register('price')} />
                <p>{errors.price?.message}</p>
            </div>

            <div>
                <label>Condition</label>
                <input type="text" {...register('condition')} />
                <p>{errors.condition?.message}</p>
            </div>

            <div>
                <label>Category</label>
                <select {...register('categoryId')}>
                    <option value="">Select a category</option>
                    <option value="1">Electronics</option>
                    <option value="2">Books</option>
                    <option value="3">Furniture</option>
                    <option value="4">Clothing</option>
                </select>
                <p>{errors.categoryId?.message}</p>
            </div>

            <div>
                <label>Status</label>
                <select {...register('status')}>
                    <option value="">Select status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="sold">Sold</option>
                    <option value="pending">Pending</option>
                </select>
                <p>{errors.status?.message}</p>
            </div>

            <div>
                <label>Images</label>
                <input type="file" multiple onChange={handleFileChange} />
                <p>{errors.images && 'Please upload at least one image'}</p>
            </div>

            <button type="submit">Create Listing</button>
        </form>
    );
};

export default CreateListing;