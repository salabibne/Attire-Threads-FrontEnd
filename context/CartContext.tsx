"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

interface Product {
    id: string;
    name: string;
    description: string;
    brand: string;
    defaultImageBanner: string;
    defaultPrice: number;
    maxPrice: number;
    minPrice: number;
}

interface ProductVariant {
    id: string;
    name: string;
    size: string;
    color: string;
    productId: string;
}

interface SKU {
    id: string;
    price: number;
    stock: number;
    productId: string;
    productVariantId: string;
    skuCode: string;
    product: Product;
    productVariant: ProductVariant;
}

export interface CartItem {
    id: string;
    cartId: string;
    skuId: string;
    quantity: number;
    createdAt: string;
    updatedAt: string;
    sku: SKU;
}

interface Cart {
    id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    items: CartItem[];
}

interface CartContextType {
    cart: Cart | null;
    addToCart: (skuId: string, quantity: number) => Promise<void>;
    updateCartItem: (id: string, quantity: number) => Promise<void>;
    removeCartItem: (id: string) => Promise<void>;
    clearCart: () => Promise<void>;
    fetchCart: () => Promise<void>;
    isLoading: boolean;
    totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { token } = useAuth();

    const fetchCart = useCallback(async () => {
        if (!token) {
            setCart(null);
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.get("http://localhost:3000/v1/cart", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data && response.data.data) {
                setCart(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching cart:", error);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (skuId: string, quantity: number) => {
        if (!token) {
            alert("Please login to add items to cart");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/v1/cart-items",
                { skuId, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data) {
                await fetchCart(); // Refresh cart state
            }
        } catch (error: any) {
            console.error("Error adding to cart:", error);
            alert(error.response?.data?.message || "Failed to add item to cart");
        }
    };

    const updateCartItem = async (id: string, quantity: number) => {
        if (!token || !cart) return;

        const item = cart.items.find((i) => i.id === id);
        if (!item) return;

        try {
            const response = await axios.patch(
                `http://localhost:3000/v1/cart-items/${id}`,
                { skuId: item.skuId, quantity },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data) {
                await fetchCart(); // Refresh cart state
            }
        } catch (error: any) {
            console.error("Error updating cart item:", error);
            alert(error.response?.data?.message || "Failed to update quantity");
        }
    };

    const removeCartItem = async (id: string) => {
        if (!token) return;

        try {
            await axios.delete(`http://localhost:3000/v1/cart-items/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            await fetchCart(); // Refresh cart state
        } catch (error: any) {
            console.error("Error removing cart item:", error);
            alert(error.response?.data?.message || "Failed to remove item");
        }
    };

    const clearCart = async () => {
        if (!token) return;

        try {
            await axios.delete("http://localhost:3000/v1/cart/clear", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCart(null); // Instantly clear local state
            await fetchCart(); // Sync with backend
        } catch (error: any) {
            console.error("Error clearing cart:", error);
            throw error; // Let the component handle the error toast
        }
    };

    const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateCartItem,
                removeCartItem,
                clearCart,
                fetchCart,
                isLoading,
                totalItems,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
