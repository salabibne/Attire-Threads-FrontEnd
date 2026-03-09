"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { FaArrowLeft, FaCheckCircle, FaLock } from "react-icons/fa";
import toast from "react-hot-toast";

const OrderPage = () => {
    const { cart, clearCart, isLoading } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const router = useRouter();

    const subtotal = cart?.items?.reduce((sum, item) => sum + (item.sku.price * item.quantity), 0) || 0;
    const shipping = subtotal > 0 ? 100 : 0;
    const total = subtotal + shipping;

    const handleFinalProcess = async () => {
        setIsProcessing(true);
        const toastId = toast.loading("Finalizing your order...");

        try {
            await clearCart();
            toast.success("Order processed! Redirecting...", { id: toastId });
            router.push("/order-success");
        } catch (error) {
            toast.error("Failed to process order. Please try again.", { id: toastId });
            console.error("Order processing error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading && !cart) {
        return (
            <div className="flex justify-center items-center h-screen pt-20">
                <span className="loading loading-spinner loading-lg text-[#543441]"></span>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-40 mt-32 text-center">
                <h2 className="text-2xl font-bold mb-4">No order details found.</h2>
                <Link href="/" className="btn bg-[#543441] text-white rounded-full">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-20 mt-32">
            <div className="flex items-center gap-4 mb-10">
                <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <FaArrowLeft className="text-gray-600" />
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Review & Confirm Order</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Order Items Review */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                            <h2 className="font-bold text-gray-900">Order Items</h2>
                            <span className="text-sm font-medium text-gray-500">{cart.items.length} items</span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {cart.items.map((item) => (
                                <div key={item.id} className="p-6 flex gap-6 items-center">
                                    <div className="relative w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                                        <Image
                                            src={item.sku.product.defaultImageBanner}
                                            alt={item.sku.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 text-lg uppercase tracking-tight">{item.sku.product.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1 font-medium italic">
                                            {item.sku.productVariant.color} / {item.sku.productVariant.size}
                                        </p>
                                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                                            <span>Quantity: {item.quantity}</span>
                                            <span>•</span>
                                            <span>{item.sku.price} BDT per unit</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-xl text-gray-900">{item.sku.price * item.quantity} BDT</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#543441]/5 p-6 rounded-2xl border border-[#543441]/10 flex gap-4 items-start">
                        <div className="bg-[#543441] p-2 rounded-full">
                            <FaLock className="text-white text-xs" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-[#543441]">Secure Confirmation</h4>
                            <p className="text-xs text-gray-600 mt-1">
                                This is your final chance to review your order. Once you click "PROCESS TO ORDER", your selection will be finalized.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Final Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-3xl sticky top-40 shadow-2xl border border-gray-100">
                        <h2 className="text-2xl font-black text-gray-900 mb-8 border-b pb-4">Order Summary</h2>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Subtotal</span>
                                <span>{subtotal} BDT</span>
                            </div>
                            <div className="flex justify-between text-gray-500 font-medium">
                                <span>Delivery Fee</span>
                                <span className="text-green-600">+{shipping} BDT</span>
                            </div>
                            <div className="pt-6 mt-6 border-t border-gray-100 flex justify-between items-end">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Total Payable</p>
                                    <p className="text-3xl font-black text-[#543441]">{total} BDT</p>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleFinalProcess}
                            disabled={isProcessing}
                            className={`w-full h-16 bg-[#543441] hover:bg-[#3d262f] text-white font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#543441]/20 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isProcessing ? (
                                <span className="loading loading-spinner text-white"></span>
                            ) : (
                                <>
                                    <FaCheckCircle className="text-white" />
                                    PROCESS TO ORDER
                                </>
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            One final click to complete your purchase.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;
