import React from "react";
import axios from "axios";
import { Formik, FormikHelpers } from "formik";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import * as bcrypt from "bcryptjs"; // bcryptjs for browser-compatible hashing

// Define the shape of form values
interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}

// Validation schema using Yup
const registerSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      // Hash the password before sending to the server
      const hashedPassword = await bcrypt.hash(values.password, 10);

      // Create a new object with hashed password
      const userData = { ...values, password: hashedPassword };

      // Send the form data to the server
      await axios.post("http://localhost:4000/users", userData);

      toast.success("User registered successfully!");
      navigate("/login");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('/images/hms.jpg')`,
      }}
    >
      {/* Add a dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-50"></div>

      <div className="relative z-10 bg-white bg-opacity-90 p-8 rounded-lg shadow-xl sm:max-w-md w-full">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-12 w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold leading-9 tracking-tight text-gray-900">
            Sign Up
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={registerSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      name="name"
                      type="text"
                      disabled={isSubmitting}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-sm">{errors.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email Address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      disabled={isSubmitting}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                      className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    />
                    {errors.email && touched.email && (
                      <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      disabled={isSubmitting}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.password}
                      className="block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm"
                    />
                    {errors.password && touched.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-indigo-600"
                >
                  {isSubmitting && <Loader2 className="animate-spin mr-2" />}{" "}
                  Register
                </button>
              </form>
            )}
          </Formik>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
