"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineMail, HiOutlineArrowLeft } from "react-icons/hi";
import { FaTelegram, FaLinkedin, FaGithub } from "react-icons/fa";

const MIN_DESCRIPTION_LENGTH = 10;

export default function HirePage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        company: "",
        budget: "",
        projectType: "",
        description: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(
        null
    );

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Auto-resize textarea
    const adjustTextareaHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, []);

    useEffect(() => {
        adjustTextareaHeight();
    }, [formData.description, adjustTextareaHeight]);

    const validateForm = useCallback(() => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        if (!formData.description.trim()) {
            newErrors.description = "Project description is required";
        } else if (formData.description.trim().length < MIN_DESCRIPTION_LENGTH) {
            newErrors.description = `Description must be at least ${MIN_DESCRIPTION_LENGTH} characters`;
        }

        setErrors(newErrors);
        setServerError("");
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleTextareaChange = useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
            setIsDirty(true);
            if (errors[name]) {
                setErrors((prev) => ({ ...prev, [name]: "" }));
            }
            adjustTextareaHeight();
        },
        [adjustTextareaHeight, errors]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
            setIsDirty(true);
            if (errors[name]) {
                setErrors((prev) => ({ ...prev, [name]: "" }));
            }
        },
        [errors]
    );

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!validateForm()) {
                return;
            }

            setIsLoading(true);
            setServerError("");

            try {
                const response = await fetch("/api/contact", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (!response.ok) {
                    if (data.errors) {
                        const fieldErrors: Record<string, string> = {};
                        data.errors.forEach((msg: string) => {
                            if (msg.toLowerCase().includes("name")) fieldErrors.name = msg;
                            else if (msg.toLowerCase().includes("email"))
                                fieldErrors.email = msg;
                            else if (msg.toLowerCase().includes("description"))
                                fieldErrors.description = msg;
                        });
                        setErrors(fieldErrors);
                    } else {
                        setServerError(
                            data.error || "Something went wrong. Please try again."
                        );
                    }
                    setIsLoading(false);
                    return;
                }

                setSubmitted(true);
                setIsDirty(false);
                setErrors({});

                // Reset form after 8 seconds
                setTimeout(() => {
                    setFormData({
                        name: "",
                        email: "",
                        company: "",
                        budget: "",
                        projectType: "",
                        description: "",
                    });
                    setSubmitted(false);
                    setServerError("");

                    if (textareaRef.current) {
                        textareaRef.current.style.height = "auto";
                    }
                }, 8000);
            } catch {
                setServerError(
                    "Network error. Please check your connection and try again."
                );
            } finally {
                setIsLoading(false);
            }
        },
        [formData, validateForm]
    );

    // Navigation with unsaved changes confirmation
    const handleBackClick = useCallback(() => {
        if (isDirty) {
            setPendingNavigation(() => () => router.back());
            setShowConfirmModal(true);
        } else {
            router.back();
        }
    }, [router, isDirty]);

    const handleReset = useCallback(() => {
        setFormData({
            name: "",
            email: "",
            company: "",
            budget: "",
            projectType: "",
            description: "",
        });
        setIsDirty(false);
        setErrors({});
        setServerError("");
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
        }
    }, []);

    const confirmNavigation = useCallback(() => {
        setShowConfirmModal(false);
        if (pendingNavigation) {
            pendingNavigation();
            setPendingNavigation(null);
        }
    }, [pendingNavigation]);

    const cancelNavigation = useCallback(() => {
        setShowConfirmModal(false);
        setPendingNavigation(null);
    }, []);

    // Close modal on Escape
    useEffect(() => {
        if (!showConfirmModal) return;
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") cancelNavigation();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [showConfirmModal, cancelNavigation]);

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#030014] via-[#0a041f] to-[#030014] text-white py-20 px-4 relative z-10">
            <div className="max-w-4xl mx-auto">
                {/* Header with back button */}
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={handleBackClick}
                        className="inline-flex cursor-pointer items-center space-x-2 text-gray-400 hover:text-blue-400 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg px-3 py-2 bg-white/5 hover:bg-white/10 active:scale-95"
                        aria-label="Go back"
                        type="button"
                    >
                        <HiOutlineArrowLeft className="text-xl group-hover:-translate-x-1 transition-transform duration-300" />
                        <span>Back</span>
                    </button>

                    {isDirty && !submitted && (
                        <button
                            onClick={handleReset}
                            className="text-sm cursor-pointer text-gray-400 hover:text-red-400 transition-colors duration-300 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10"
                            type="button"
                        >
                            Clear form
                        </button>
                    )}
                </div>

                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Let's Work Together
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Have a project in mind? I'd love to help bring it to
                        life. Fill out the form below and let's discuss your
                        ideas.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        {submitted ? (
                            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/50 rounded-2xl p-8 text-center backdrop-blur-sm animate-in fade-in zoom-in">
                                <div className="text-6xl mb-4">✅</div>
                                <h2 className="text-2xl font-bold mb-2">
                                    Thank you!
                                </h2>
                                <p className="text-gray-300">
                                    Your message has been sent. I'll get back
                                    to you as soon as possible.
                                </p>
                                <p className="text-gray-500 text-sm mt-4">
                                    You can send another message in a moment.
                                </p>
                            </div>
                        ) : (
                            <form
                                ref={formRef}
                                onSubmit={handleSubmit}
                                className="space-y-6"
                            >
                                {/* Server error banner */}
                                {serverError && (
                                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-300 text-sm">
                                        {serverError}
                                    </div>
                                )}

                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Your Name{" "}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className={`w-full px-4 py-3 bg-gray-900/50 border ${
                                            errors.name
                                                ? "border-red-500"
                                                : "border-gray-700"
                                        } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-600 transition-all duration-300`}
                                        placeholder="John Doe"
                                        disabled={isLoading}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Email Address{" "}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className={`w-full px-4 py-3 bg-gray-900/50 border ${
                                            errors.email
                                                ? "border-red-500"
                                                : "border-gray-700"
                                        } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-600 transition-all duration-300`}
                                        placeholder="john@example.com"
                                        disabled={isLoading}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Company */}
                                <div>
                                    <label
                                        htmlFor="company"
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Company / Organization
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-600 transition-all duration-300"
                                        placeholder="Your Company"
                                        disabled={isLoading}
                                    />
                                </div>

                                {/* Budget */}
                                <div>
                                    <label
                                        htmlFor="budget"
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Budget Range
                                    </label>
                                    <select
                                        id="budget"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-600 transition-all duration-300 cursor-pointer"
                                        disabled={isLoading}
                                    >
                                        <option value="">
                                            Select a budget range
                                        </option>
                                        <option value="$1k - $5k">
                                            $1k - $5k
                                        </option>
                                        <option value="$5k - $10k">
                                            $5k - $10k
                                        </option>
                                        <option value="$10k - $25k">
                                            $10k - $25k
                                        </option>
                                        <option value="$25k - $50k">
                                            $25k - $50k
                                        </option>
                                        <option value="$50k+">$50k+</option>
                                    </select>
                                </div>

                                {/* Project Type */}
                                <div>
                                    <label
                                        htmlFor="projectType"
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Project Type
                                    </label>
                                    <select
                                        id="projectType"
                                        name="projectType"
                                        value={formData.projectType}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-600 transition-all duration-300 cursor-pointer"
                                        disabled={isLoading}
                                    >
                                        <option value="">
                                            Select project type
                                        </option>
                                        <option value="Web Application">
                                            Web Application
                                        </option>
                                        <option value="Mobile App">
                                            Mobile App
                                        </option>
                                        <option value="Full Stack">
                                            Full Stack
                                        </option>
                                        <option value="Frontend Only">
                                            Frontend Only
                                        </option>
                                        <option value="Backend Only">
                                            Backend Only
                                        </option>
                                        <option value="Consulting">
                                            Consulting
                                        </option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                {/* Description */}
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium mb-2"
                                    >
                                        Project Description{" "}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        ref={textareaRef}
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleTextareaChange}
                                        required
                                        rows={5}
                                        className={`w-full px-4 py-3 bg-gray-900/50 border ${
                                            errors.description
                                                ? "border-red-500"
                                                : "border-gray-700"
                                        } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 hover:border-gray-600 transition-all duration-300 resize-none overflow-hidden min-h-[120px]`}
                                        placeholder="Tell me about your project..."
                                        disabled={isLoading}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.description}
                                        </p>
                                    )}
                                    <div className="mt-1 text-xs text-gray-500 flex justify-between">
                                        <span>
                                            {formData.description.length}{" "}
                                            characters
                                        </span>
                                        <span
                                            className={
                                                formData.description.length >=
                                                MIN_DESCRIPTION_LENGTH
                                                    ? "text-green-400"
                                                    : "text-gray-600"
                                            }
                                        >
                                            {formData.description.length >=
                                            MIN_DESCRIPTION_LENGTH
                                                ? "✓"
                                                : `Minimum ${MIN_DESCRIPTION_LENGTH} characters`}
                                        </span>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full cursor-pointer px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 active:scale-[0.98] text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg
                                                className="animate-spin h-5 w-5 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        <span>Send Inquiry</span>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* Contact Info Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-gradient-to-br from-blue-500/15 via-purple-500/10 to-blue-500/5 border border-blue-400/30 rounded-2xl p-8 space-y-1 sticky top-20 backdrop-blur-lg shadow-lg shadow-blue-500/10">
                            <div className="mb-8">
                                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Get in Touch
                                </h3>
                                <p className="text-sm text-gray-400 mt-2">
                                    Connect via your preferred platform
                                </p>
                            </div>

                            {/* Email */}
                            <a
                                href="mailto:bogdangembatyuk@gmail.com"
                                className="flex items-start space-x-4 group p-4 rounded-xl transition-all duration-300 hover:bg-blue-500/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                            >
                                <div className="text-3xl text-blue-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <HiOutlineMail />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Email
                                    </p>
                                    <p className="group-hover:text-blue-300 group-hover:underline break-all font-medium text-white truncate group-hover:no-truncate transition-all duration-300">
                                        bogdangembatyuk@gmail.com
                                    </p>
                                </div>
                            </a>

                            {/* Telegram */}
                            <a
                                href="https://t.me/badan_badanowycz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start space-x-4 group p-4 rounded-xl transition-all duration-300 hover:bg-blue-500/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                            >
                                <div className="text-3xl text-sky-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <FaTelegram />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        Telegram
                                    </p>
                                    <p className="group-hover:text-sky-300 group-hover:underline font-medium text-white transition-all duration-300">
                                        @badan_badanowycz
                                    </p>
                                </div>
                            </a>

                            {/* LinkedIn */}
                            <a
                                href="https://linkedin.com/in/bohdan-hembatiuk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start space-x-4 group p-4 rounded-xl transition-all duration-300 hover:bg-blue-500/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                            >
                                <div className="text-3xl text-blue-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <FaLinkedin />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        LinkedIn
                                    </p>
                                    <p className="group-hover:text-blue-300 group-hover:underline font-medium text-white transition-all duration-300">
                                        Bohdan Hembatiuk
                                    </p>
                                </div>
                            </a>

                            {/* GitHub */}
                            <a
                                href="https://github.com/W1ntermann"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-start space-x-4 group p-4 rounded-xl transition-all duration-300 hover:bg-blue-500/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer"
                            >
                                <div className="text-3xl text-gray-300 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                    <FaGithub />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                        GitHub
                                    </p>
                                    <p className="group-hover:text-gray-200 group-hover:underline font-medium text-white transition-all duration-300">
                                        W1ntermann
                                    </p>
                                </div>
                            </a>

                            {/* Divider */}
                            <div className="my-6 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

                            {/* Response time */}
                            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-400/30 rounded-xl p-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Response Time
                                </p>
                                <p className="font-semibold text-green-400 flex items-center">
                                    <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse mr-2" />
                                    Usually within 24 hours
                                </p>
                            </div>

                            {/* CTA Badge */}
                            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-400/30 rounded-xl p-4 text-center mt-6">
                                <p className="text-sm font-semibold text-purple-300">
                                    ✨ Let's create something amazing
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Confirm Modal */}
            {showConfirmModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    onClick={cancelNavigation}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                >
                    <div
                        className="bg-[#0a0520] border border-purple-500/30 rounded-2xl p-6 max-w-sm mx-4 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3
                            id="modal-title"
                            className="text-lg font-semibold text-white mb-3"
                        >
                            Unsaved Changes
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                            You have unsaved changes. Are you sure you want to
                            leave? Your form data will be lost.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelNavigation}
                                className="px-4 py-2 text-sm text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200"
                                type="button"
                            >
                                Stay
                            </button>
                            <button
                                onClick={confirmNavigation}
                                className="px-4 py-2 text-sm text-white bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-all duration-200"
                                type="button"
                            >
                                Leave
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}