"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "USER",
        phone: "",
        secondaryPhone: "",
        address: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await register(formData);
            router.push("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Registration failed");
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
                        alt="Registration"
                        fill
                        className="object-cover"
                    />
                </figure>
                <div className="card-body lg:w-1/2 p-8">
                    <h2 className="card-title text-2xl font-bold text-primary-brown mb-6">Create an Account</h2>

                    {error && (
                        <div className="alert alert-error mb-4">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Full Name</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                className="input input-bordered w-full"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Phone Number</span>
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="01712345678"
                                    className="input input-bordered w-full"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Secondary Phone (Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="secondaryPhone"
                                placeholder="01812345678"
                                className="input input-bordered w-full"
                                value={formData.secondaryPhone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-control flex flex-col">
                            <label className="label">
                                <span className="label-text">Address</span>
                            </label>
                            <textarea
                                name="address"
                                className="textarea textarea-bordered h-24"
                                placeholder="Dhaka, Bangladesh"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>

                        <div className="card-actions flex flex-col items-center gap-4 mt-6">
                            <button
                                type="submit"
                                className={`btn btn-primary w-full  bg-[#543441] ${loading ? "loading" : ""}`}
                                disabled={loading}
                            >
                                {loading ? "Registering..." : "Register"}
                            </button>
                            <p className="text-sm">
                                Already have an account?{" "}
                                <Link href="/login" className="text-primary font-bold hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
