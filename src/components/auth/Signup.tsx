import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

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
        <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>First Name</label>
          <input
            type="text"
            {...register('firstName')}
            placeholder="Enter your first name"
          />
          {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName.message}</p>}
        </div>

        <div>
          <label>Last Name</label>
          <input
            type="text"
            {...register('lastName')}
            placeholder="Enter your last name"
          />
          {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName.message}</p>}
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            {...register('email')}
            placeholder="Enter your email"
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            {...register('password')}
            placeholder="Enter your password"
          />
          {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
    );
}