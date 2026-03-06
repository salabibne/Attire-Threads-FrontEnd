"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(formData.email, formData.password);
            router.push("/");
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-40 pb-20 mt-20">
            <div className="card lg:card-side bg-base-100 shadow-xl max-w-5xl w-full overflow-hidden">
                <figure className="lg:w-1/2 relative min-h-[300px]">
                    <Image
                        src="https://i.ibb.co.com/xKnHmgLb/Gemini-Generated-Image-ubqhltubqhltubqh.png"
                        alt="Login"
                        fill
                        className="object-cover"
                    />
                </figure>
                <div className="card-body lg:w-1/2 p-8 flex flex-col justify-center">
                    <h2 className="card-title text-2xl font-bold text-primary-brown mb-6">Welcome Back</h2>
                    <p className="mb-6">Please login to your account.</p>

                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email Address</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="john@example.com"
                                className="input input-bordered w-full"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="******"
                                className="input input-bordered w-full"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <label className="label">
                                <Link href="#" className="label-text-alt link link-hover">Forgot password?</Link>
                            </label>
                        </div>

                        <div className="card-actions flex flex-col items-center gap-4 mt-6">
                            <button
                                type="submit"
                                className={`btn btn-primary w-full bg-[#543441] text-white ${loading ? "loading" : ""}`}
                                disabled={loading}
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                            <p className="text-sm">
                                Don&apos;t have an account?{" "}
                                <Link href="/register" className="text-primary font-bold hover:underline">
                                    Register here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
