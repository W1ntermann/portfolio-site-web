"use client";

import { Socials } from "@/constants";
import Image from "next/image";
import React, { useState, useCallback, useEffect } from "react";

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = useCallback(() => {
        setIsMobileMenuOpen((prev) => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setIsMobileMenuOpen(false);
    }, []);

    // Close menu on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsMobileMenuOpen(false);
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    return (
        <div className="w-screen md:w-full h-[65px] fixed top-0 shadow-lg shadow-[#2A0E61]/50 bg-[#03001417] backdrop-blur-md z-[100] px-4 md:px-10 m-0 max-w-[1855px] items-center rounded-full">
            <div className="w-full h-full flex flex-row items-center justify-between m-auto px-[0px] md:px-[10px]">
                <a
                    href="#home"
                    className="h-auto w-auto flex flex-row items-center"
                >
                    <Image
                        src="/logo.png"
                        alt="logo"
                        width={50}
                        height={50}
                        className="cursor-pointer hover:animate-spin w-10"
                    />

                    <span className="font-bold ml-[10px] hidden md:block text-gray-300 z-50 md:text-lg text-xl">
                        Bohdan Hembatiuk
                    </span>
                </a>

                {/* Desktop Navigation */}
                <div className="hidden w-3/6 lg:w-1/3 h-full md:flex flex-row items-center justify-between md:mx-auto lg:pr-12">
                    <div className="flex items-center justify-between w-full h-auto border border-[#7042f861] bg-[#0300145e] mr-[15px] px-[20px] py-[10px] rounded-full text-gray-200">
                        <a href="#about" className="cursor-pointer">
                            About me
                        </a>
                        <a href="#skills" className="cursor-pointer">
                            Skills
                        </a>
                        <a href="#projects" className="cursor-pointer">
                            Projects
                        </a>
                    </div>
                </div>

                {/* Desktop Social Icons */}
                <div className="hidden md:flex flex-row gap-5 text-white">
                    {Socials.map((social) => (
                        <a
                            href={social.link}
                            key={social.name}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image
                                src={social.src}
                                alt={social.name}
                                key={social.name}
                                width={24}
                                height={24}
                                className="cursor-pointer hover:animate-spin"
                            />
                        </a>
                    ))}
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[#7042f840] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMobileMenuOpen}
                    type="button"
                >
                    <span
                        className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
                            isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
                        }`}
                    />
                    <span
                        className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
                            isMobileMenuOpen ? "opacity-0" : ""
                        }`}
                    />
                    <span
                        className={`block w-6 h-0.5 bg-white rounded-full transition-all duration-300 ${
                            isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                        }`}
                    />
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 top-0 bg-[#030014]/95 backdrop-blur-lg z-[99] md:hidden transition-all duration-300 ${
                    isMobileMenuOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
                onClick={closeMenu}
                aria-hidden={!isMobileMenuOpen}
            >
                <nav className="flex flex-col items-center justify-center h-full gap-8 px-6">
                    <a
                        href="#home"
                        onClick={closeMenu}
                        className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 hover:scale-110 transition-transform duration-300"
                    >
                        Home
                    </a>
                    <a
                        href="#about"
                        onClick={closeMenu}
                        className="text-2xl text-gray-200 hover:text-purple-400 transition-colors duration-300"
                    >
                        About me
                    </a>
                    <a
                        href="#skills"
                        onClick={closeMenu}
                        className="text-2xl text-gray-200 hover:text-purple-400 transition-colors duration-300"
                    >
                        Skills
                    </a>
                    <a
                        href="#projects"
                        onClick={closeMenu}
                        className="text-2xl text-gray-200 hover:text-purple-400 transition-colors duration-300"
                    >
                        Projects
                    </a>

                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-purple-500 to-transparent my-4" />

                    {/* Mobile Social Icons */}
                    <div className="flex flex-row gap-8 mt-4">
                        {Socials.map((social) => (
                            <a
                                href={social.link}
                                key={social.name}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:scale-125 transition-transform duration-300"
                            >
                                <Image
                                    src={social.src}
                                    alt={social.name}
                                    width={32}
                                    height={32}
                                    className="cursor-pointer"
                                />
                            </a>
                        ))}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default Navbar;
