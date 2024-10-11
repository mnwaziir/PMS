import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const DoctorRegistration: React.FC = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      license: '',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
      license: Yup.string()
        .required('License number is required')
        .min(5, 'License number must be at least 5 characters'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:4000', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });

        const data = await response.json();
        alert(data.message);
      } catch (error) {
        console.error('Error during registration:', error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto mt-5 p-4 border rounded shadow">
      <div className="mb-4">
        <label htmlFor="name" className="block mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          {...formik.getFieldProps('name')}
          className={`border rounded w-full py-2 px-3 ${formik.touched.name && formik.errors.name ? 'border-red-500' : ''}`}
        />
        {formik.touched.name && formik.errors.name ? (
          <div className="text-red-500 text-sm">{formik.errors.name}</div>
        ) : null}
      </div>
      <div className="mb-4">
        <label htmlFor="license" className="block mb-2">
          License Number
        </label>
        <input
          type="text"
          id="license"
          {...formik.getFieldProps('license')}
          className={`border rounded w-full py-2 px-3 ${formik.touched.license && formik.errors.license ? 'border-red-500' : ''}`}
        />
        {formik.touched.license && formik.errors.license ? (
          <div className="text-red-500 text-sm">{formik.errors.license}</div>
        ) : null}
      </div>
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
        Register Doctor
      </button>
    </form>
  );
};

export default DoctorRegistration;
