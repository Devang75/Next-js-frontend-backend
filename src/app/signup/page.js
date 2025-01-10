"use client"
import api from "../../lib/api/api";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Signup() {
  const { data: session, status } = useSession();
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    logintype: "email",
  });

  const handleSignUp = useCallback(async (payload) => {
    try {
      const response = await api.auth.signup(payload);
      const data = response.data;

      if (data?.status) {
        setFormData({
          firstname: "",
          lastname: "",
          username: "",
          email: "",
          password: "",
        });
        router.push(status === 'authenticated' ? '/' : '/login');
      }
    } catch (error) {
      await signOut({ redirect: false });
      setFormData({
        firstname: "",
        lastname: "",
        username: "",
        email: "",
        password: "",
      });
      console.error('Signup error:', error);
    }
  }, [router, status]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      const payload = {
        firstname: session.user.name || "test",
        lastname: session.user.name || "test",
        username: session.user.name || `test${Math.floor(Math.random() * 1000)}`,
        email: session.user.email,
        password: "12345678",
        logintype: "google",
      };
      handleSignUp(payload);
    }
  }, [status, session]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    await handleSignUp(formData);
  }, [formData, handleSignUp]);

  const handleGoogleSignup = useCallback(async (e) => {
    e.preventDefault();
    await signIn('google');
  }, []);

  const handleSignInClick = useCallback(async () => {
    await signOut({ redirect: false });
    router.push('/login');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {
        status === "loading" ? <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div> : <>
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-black">Sign Up</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="firstname" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstname"
                  id="firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastname" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastname"
                  id="lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  required
                />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign Up
              </button>
            </form>
            <div className="mt-6 flex items-center justify-center">
              <button
                type="button"
                onClick={handleGoogleSignup}
                className="flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <img
                  src="https://developers.google.com/identity/images/g-logo.png"
                  alt="Google logo"
                  className="w-5 h-5 mr-2"
                />
                Sign up with Google
              </button>
            </div>
            <div className="mt-6 flex items-center justify-center">
              <span className="text-gray-700 text-sm">Already have an account?</span>
              <button
                type="button"
                onClick={handleSignInClick}
                className="ml-2 text-blue-500 hover:text-blue-800 font-bold text-sm"
              >
                Sign In
              </button>
            </div>
          </div>
        </>
      }
    </div>
  );
}