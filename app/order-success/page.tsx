"use client";

import React from "react";
import Link from "next/link";
import { FaCheckCircle, FaShoppingBag, FaArrowRight } from "react-icons/fa";

const OrderSuccessPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-20  md:mt-0">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center transform transition-all hover:scale-[1.01] mt-32">
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25"></div>
                        <div className="relative bg-green-50 p-6 rounded-full">
                            <FaCheckCircle className="text-6xl text-green-500" />
                        </div>
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Placed!</h1>
                <p className="text-gray-500 mb-10 leading-relaxed">
                    Thank you for your purchase. Your order has been received and is being processed. We'll send you a confirmation email shortly.
                </p>

                <div className="space-y-4">
                    <Link
                        href="/"
                        className="w-full btn bg-[#543441] hover:bg-[#3d262f] border-none text-white h-14 text-lg font-bold rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#543441]/20"
                    >
                        CONTINUE SHOPPING
                        <FaArrowRight className="text-sm" />
                    </Link>

                    <button className="w-full btn btn-ghost text-gray-500 h-14 rounded-2xl hover:bg-gray-50 flex items-center justify-center gap-3">
                        <FaShoppingBag className="text-sm" />
                        VIEW MY ORDERS
                    </button>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100">
                    <p className="text-sm text-gray-400">
                        Need help? <Link href="/contact" className="text-[#543441] font-semibold hover:underline">Contact Support</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
