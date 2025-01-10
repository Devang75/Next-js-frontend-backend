"use client"
import { useRouter } from 'next/navigation';
import api from '../../lib/api/api';
import React, { useCallback, useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';

const INITIAL_FORM_STATE = {
    email: '',
    password: ''
};

export default function LoginPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const isAuthenticated = status === "authenticated";

    const handleInputChange = useCallback((e) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.auth.login(formData);
            if (response?.data?.status) {
                setFormData(INITIAL_FORM_STATE);
                router.push('/');
            }
        } catch (error) {
            console.error('Login error:', error.response?.data);
        }
    };

    const handleSignUp = useCallback(async (payload) => {
        try {
            const { data } = await api.auth.signup(payload);
            if (data?.status) {
                router.push(isAuthenticated ? '/' : '/login');
            }
        } catch (error) {
            await signOut({ redirect: false });
            console.error('Signup error:', error);
        }
    }, [router, isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated && session?.user?.email) {
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
    }, [status, session, handleSignUp]);

    const handleGoogleSignup = useCallback((e) => {
        e.preventDefault();
        signIn('google');
    }, []);

    const handleSignupClick = useCallback(() => {
        signOut({ redirect: false });
        router.push('/signup');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {
                status === "loading" ? <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div> : <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {['email', 'password'].map((field) => (
                            <div key={field}>
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor={field}
                                >
                                    {field.charAt(0).toUpperCase() + field.slice(1)}
                                </label>
                                <input
                                    type={field}
                                    id={field}
                                    value={formData[field]}
                                    onChange={handleInputChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder={`Enter your ${field}`}
                                    required
                                />
                            </div>
                        ))}
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Sign In
                            </button>
                            <a
                                href="#"
                                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                            >
                                Forgot Password?
                            </a>
                        </div>
                    </form>
                    <div className="mt-4">
                        <button
                            onClick={handleGoogleSignup}
                            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                            Sign in with Google
                        </button>
                    </div>
                    <div className="mt-4 text-center">
                        <span className="text-gray-700 text-sm">Don't have an account?</span>
                        <button
                            onClick={handleSignupClick}
                            className="ml-2 text-blue-500 hover:text-blue-800 font-bold text-sm"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            }
        </div>
    );
}