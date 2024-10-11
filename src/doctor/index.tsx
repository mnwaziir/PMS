import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import toast, { Toaster } from 'react-hot-toast';

interface DoctorRegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  specialty: string;
}

const DoctorRegister = () => {
  const initialValues: DoctorRegisterFormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialty: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
    specialty: Yup.string().required('Specialty is required'),
  });

  const handleSubmit = async (values: DoctorRegisterFormValues) => {
    const hashedPassword = await bcrypt.hash(values.password, 10);
    
    const response = await axios.post('/api/doctors/register', {
      name: values.name,
      email: values.email,
      password: hashedPassword,
      specialty: values.specialty,
    });

    if (response.status === 201) {
      toast.success('Doctor registered successfully!');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Register Doctor</h1>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">Name</label>
              <Field
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <Field
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <Field
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-700">Confirm Password</label>
              <Field
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="specialty" className="block text-gray-700">Specialty</label>
              <Field
                type="text"
                id="specialty"
                name="specialty"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <ErrorMessage name="specialty" component="div" className="text-red-500 text-sm" />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Register
            </button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default DoctorRegister;
