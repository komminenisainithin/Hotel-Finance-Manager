"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const { login, loading, token } = useAuth();

    useEffect(() => {
        if (!loading && token) {
            router.replace("/dashboard");
        }
    }, [loading, token, router]);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        login(email, password);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
                Loading…
            </div>
        );
    }

    if (token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-600">
                Redirecting…
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-5 rounded-md shadow-md max-w-[420px] w-full">
                <h1 className="text-2xl font-bold text-center mb-4">
                    Login
                </h1>

                <form className="flex flex-col gap-4" onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="border-2 border-gray-300 rounded-md p-2 focus:outline-none focus:border-teal-500"
                    />

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="border-2 border-gray-300 rounded-md p-2 w-full pr-10 focus:outline-none focus:border-teal-500"
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button
                        className="bg-teal-500 text-white rounded-md p-2 hover:bg-teal-600"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}