import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import MotionButton from "../common/MotionButton";

const validationSchema = Yup.object().shape({
    firstName: Yup.string()
        .required('First Name is required')
        .min(2, 'First Name must be at least 2 characters'),
    lastName: Yup.string()
        .required('Last Name is required')
        .min(2, 'Last Name must be at least 2 characters'),
    email: Yup.string()
        .required('Email is required')
        .email('Email is invalid'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

interface RegisterFormInputs {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export const Register = () => {
    const authContext = useContext(AuthContext);

    const {
        register,
        handleSubmit,
        formState: { errors } } = useForm<RegisterFormInputs>({
            resolver: yupResolver(validationSchema)
        });
    const onSubmit = (data: RegisterFormInputs) => {
        authContext?.register(data.firstName, data.lastName, data.email, data.password);
    };
    return (
      <div className="flex align-middle justify-center h-screen">
      <div className="z-10 self-center w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl" >
      <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16" >
        <h3 className="text-xl font-semibold">Register</h3>
        <p className="text-sm text-gray-500">Enter information for active register</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
        <div>
          <label className="block text-xs text-gray-600 uppercase">First Name</label>
          <input
            type="text"
            {...register('firstName')}
            placeholder="Enter your first name"
            className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
             />
          {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName.message}</p>}
        </div>

        <div>
          <label className="block text-xs text-gray-600 uppercase">Last Name</label>
          <input
            type="text"
            {...register('lastName')}
            placeholder="Enter your last name"
            className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
             />
          {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName.message}</p>}
        </div>

        <div>
          <label className="block text-xs text-gray-600 uppercase">Email</label>
          <input
            type="email"
            {...register('email')}
            placeholder="Enter your email"
            className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
             />
          {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs text-gray-600 uppercase">Password</label>
          <input
            type="password"
            {...register('password')}
            placeholder="Enter your password"
            className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
             />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
        </div>

        <MotionButton 
        type="submit" 
        className="flex h-10 bg-black w-full items-center justify-center rounded-md border text-sm">Register</MotionButton>
      </form>
    </div>
    </div>
    );
}