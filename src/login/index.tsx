import React from "react";
import axios from "axios";
import { Formik, FormikHelpers } from "formik";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import bcrypt from "bcryptjs"; // Import bcryptjs

// Define the shape of form values
interface LoginFormValues {
  email: string;
  password: string;
}

// Define the shape of user data from the API
interface User {
  email: string;
  password: string; // Store the hashed password
}

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (
    values: LoginFormValues,
    { setSubmitting }: FormikHelpers<LoginFormValues>
  ) => {
    setSubmitting(true); // Disable form while submitting
    try {
      // Fetch users from your API
      const { data } = await axios.get<User[]>("http://localhost:4000/users");

      // Find the user by email
      const user = data.find((user) => user.email === values.email);

      // If the user exists, check the password
      if (user) {
        const passwordMatch = await bcrypt.compare(values.password, user.password);

        if (passwordMatch) {
          toast.success("User login successful!");
          localStorage.setItem("login-system", values.email);
          navigate("/");  // Redirect to the root "/" after login
        } else {
          toast.error("Incorrect password!");
        }
      } else {
        toast.error("User not found!");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="flex h-screen items-center justify-center relative"
      style={{
        backgroundImage: "url('/images/hms.jpg')", // Fixed background image
      }}
    >
      {/* Add a dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      <div className="relative z-10 bg-white bg-opacity-90 p-8 rounded-lg shadow-xl sm:max-w-md w-full">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={loginSchema}
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
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
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
                      className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
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
                      className="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm placeholder-gray-400 focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
                    />
                    {errors.password && touched.password && (
                      <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  {isSubmitting && <Loader2 className="animate-spin mr-2" />}{" "}
                  Login
                </button>
              </form>
            )}
          </Formik>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
