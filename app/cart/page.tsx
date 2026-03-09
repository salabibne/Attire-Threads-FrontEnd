"use client"
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from "react-icons/fa";
import toast from "react-hot-toast";

const CartPage = () => {
    const { cart, updateCartItem, removeCartItem, clearCart, isLoading } = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const router = useRouter();

    const subtotal = cart?.items?.reduce((sum, item) => sum + (item.sku.price * item.quantity), 0) || 0;
    const shipping = subtotal > 0 ? 100 : 0; // Flat shipping rate if cart not empty
    const total = subtotal + shipping;

    const handleCheckout = async () => {
        if (!cart || cart.items.length === 0) return;

        setIsCheckingOut(true);
        const toastId = toast.loading("Initializing checkout...");

        try {
            // Simulated delay for "wait after posting" requirement
            await new Promise(resolve => setTimeout(resolve, 1500));

            toast.success("Checkout confirmed! Redirecting to order details...", { id: toastId });

            // Wait a bit for the user to read the success message
            await new Promise(resolve => setTimeout(resolve, 1000));

            router.push("/order");
        } catch (error) {
            toast.error("An error occurred. Please try again.", { id: toastId });
            console.error("Checkout error:", error);
        } finally {
            setIsCheckingOut(false);
        }
    };

    if (isLoading && !cart) {
        return (
            <div className="flex justify-center items-center min-vh-100 py-40">
                <span className="loading loading-spinner loading-lg text-[#543441]"></span>
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 mt-32 text-center">
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
                    <div className="bg-gray-50 p-6 rounded-full mb-6">
                        <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-md">Looks like you haven't added anything to your cart yet. Explore our collections to find something you love!</p>
                    <Link
                        href="/"
                        className="btn bg-[#543441] hover:bg-[#3d262f] text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2"
                    >
                        <FaArrowLeft className="text-sm" />
                        START SHOPPING
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20 mt-32">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Cart Items List */}
                <div className="lg:col-span-2 space-y-6">
                    {cart.items.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 items-center sm:items-start transition-all hover:shadow-md">
                            <div className="relative w-32 h-40 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                                <Image
                                    src={item.sku.product.defaultImageBanner}
                                    alt={item.sku.product.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 hover:text-[#543441] transition-colors">
                                            <Link href={`/product/${item.sku.productId}`}>{item.sku.product.name}</Link>
                                        </h3>
                                        <p className="text-sm text-gray-500 font-medium mt-1">
                                            {item.sku.productVariant.color} / {item.sku.productVariant.size}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeCartItem(item.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                        title="Remove item"
                                    >
                                        <FaTrash size={16} />
                                    </button>
                                </div>

                                <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-10">
                                        <button
                                            onClick={() => updateCartItem(item.id, Math.max(1, item.quantity - 1))}
                                            className="px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                                        >
                                            <FaMinus size={12} />
                                        </button>
                                        <span className="px-4 font-bold text-gray-900 border-x border-gray-200 min-w-[40px] text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateCartItem(item.id, item.quantity + 1)}
                                            className="px-3 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors"
                                        >
                                            <FaPlus size={12} />
                                        </button>
                                    </div>

                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">Unit: {item.sku.price} BDT</p>
                                        <p className="text-xl font-bold text-[#543441]">{item.sku.price * item.quantity} BDT</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 sticky top-40">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span className="font-semibold">{subtotal} BDT</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Shipping Fee</span>
                                <span className="font-semibold">{shipping} BDT</span>
                            </div>
                            <div className="divider opacity-50"></div>
                            <div className="flex justify-between text-xl font-bold text-gray-900">
                                <span>Total</span>
                                <span>{total} BDT</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className={`w-full btn bg-[#543441] hover:bg-[#3d262f] border-none text-white h-14 text-lg font-bold rounded-xl mb-4 shadow-lg shadow-[#543441]/20 ${isCheckingOut ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isCheckingOut ? (
                                <span className="loading loading-spinner"></span>
                            ) : (
                                "PROCEED TO CHECKOUT"
                            )}
                        </button>

                        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Secure Checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
