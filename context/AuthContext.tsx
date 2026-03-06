"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("accessToken");
        const storedUser = localStorage.getItem("user");
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post("http://localhost:3000/v1/auth/login", {
                email,
                password,
            });
            if (response.data) {
                const { accessToken, user } = response.data;
                setToken(accessToken);
                setUser(user);
                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("user", JSON.stringify(user));
            } else {
                throw new Error(response.data.message || "Login failed");
            }
        } catch (error: any) {
            console.error("Login error:", error);
            throw error;
        }
    };

    const register = async (data: any) => {
        try {
            const response = await axios.post("http://localhost:3000/v1/auth/register", data);
            console.log(response.data)
            if (response.data) {
                alert(`Your registration is successfull, ${response.data.name}`);
            } else {
                throw new Error(response.data.message || "Registration failed");
            }
        } catch (error: any) {
            console.error("Registration error:", error);
            throw error;
        }
    };

    const logout = async () => {
        const response = await axios.post("http://localhost:3000/v1/auth/logout", {
            "usermail": user?.email,
        });
        if (response?.data?.message) {
            setToken(null);
            setUser(null);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("user");
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
