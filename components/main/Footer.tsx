"use client";

import React, { memo, useCallback } from "react";
import {
    RxGithubLogo,
    RxInstagramLogo,
    RxLinkedinLogo,
} from "react-icons/rx";
import { FaTelegram, FaHeart } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Type definitions
interface SocialLink {
    id: string;
    url: string;
    icon: React.ElementType;
    label: string;
    hoverColor: string;
    username?: string;
}

interface NavLink {
    id: string;
    sectionId: string;
    label: string;
    emoji: string;
}

// Constants
const SOCIAL_LINKS: SocialLink[] = [
    {
        id: 'email',
        url: "mailto:bogdangembatyuk@gmail.com",
        icon: HiOutlineMail,
        label: "Email",
        hoverColor: "hover:text-red-400",
        username: "bogdangembatyuk@gmail.com"
    },
    {
        id: 'instagram',
        url: "https://instagram.com/bohdan_codes",
        icon: RxInstagramLogo,
        label: "Instagram",
        hoverColor: "hover:text-pink-400",
        username: "@bohdan_codes"
    },
    {
        id: 'telegram',
        url: "https://t.me/badan_badanowycz",
        icon: FaTelegram,
        label: "Telegram",
        hoverColor: "hover:text-blue-400",
        username: "@badan_badanowycz"
    },
    {
        id: 'github',
        url: "https://github.com/W1ntermann",
        icon: RxGithubLogo,
        label: "GitHub",
        hoverColor: "hover:text-gray-300",
        username: "@W1ntermann"
    },
];

const NAV_LINKS: NavLink[] = [
    { id: 'projects', sectionId: 'projects', label: 'Projects', emoji: '💻' },
    { id: 'about', sectionId: 'about', label: 'About Me', emoji: '👨‍💻' },
    { id: 'contact', sectionId: 'contact', label: 'Contact', emoji: '📫' },
];

const SUPPORT_LINKS = [
    { id: 'sponsor', href: '/sponsor', label: 'Sponsor my work', icon: FaHeart, iconColor: 'text-yellow-400' },
    { id: 'collaboration', href: '/collaboration', label: 'Collaboration', emoji: '🤝' },
    { id: 'hire', href: '/hire', label: 'Hire me', icon: HiOutlineMail, iconColor: 'text-blue-400' },
] as const;

// Utility function for smooth scroll
const smoothScrollToElement = (elementId: string): void => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Sub-components
const SocialIconButton = memo(({ link }: { link: SocialLink }) => {
    const handleClick = useCallback(() => {
        window.open(link.url, '_blank', 'noopener,noreferrer');
    }, [link.url]);

    return (
        <button
            onClick={handleClick}
            className={`cursor-pointer text-gray-500 ${link.hoverColor} transition-all duration-300 p-2 hover:scale-110 active:scale-90 transform focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg`}
            aria-label={link.label}
            type="button"
        >
            <link.icon className="text-xl" />
        </button>
    );
});

SocialIconButton.displayName = 'SocialIconButton';

const SocialLinkItem = memo(({ link }: { link: SocialLink }) => {
    const handleClick = useCallback(() => {
        window.open(link.url, '_blank', 'noopener,noreferrer');
    }, [link.url]);

    return (
        <button
            onClick={handleClick}
            className={`cursor-pointer flex items-center space-x-3 text-gray-400 ${link.hoverColor} transition-all duration-300 transform hover:translate-x-2 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-lg px-2 py-1 w-full text-left`}
            aria-label={`Visit ${link.label} profile`}
            type="button"
        >
            <link.icon className="text-xl flex-shrink-0" />
            <span className="text-sm">
                {link.label}
                {link.username && <span className="hidden lg:inline"> {link.username}</span>}
            </span>
        </button>
    );
});

SocialLinkItem.displayName = 'SocialLinkItem';

const Footer: React.FC = () => {
    const router = useRouter();
    const currentYear = new Date().getFullYear();

    const handleNavigation = useCallback((sectionId: string): void => {
        if (window.location.pathname === '/') {
            smoothScrollToElement(sectionId);
        } else {
            router.push(`/#${sectionId}`);
        }
    }, [router]);

    const handleEmailClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        window.location.href = 'mailto:bogdangembatyuk@gmail.com';
    }, []);

    return (
        <footer 
            className="w-full bg-gradient-to-b from-transparent to-gray-900/50 text-gray-200 py-12 px-4 relative z-10"
            role="contentinfo"
        >
            <div className="max-w-7xl mx-auto">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
                    
                    {/* Developer info section */}
                    <section className="flex flex-col space-y-4" aria-labelledby="developer-info-heading">
                        <h3 id="developer-info-heading" className="text-xl font-bold">
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Bohdan Codes
                            </span>
                            <span className="block w-12 h-0.5 bg-blue-400 mt-2" aria-hidden="true" />
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Full-stack developer & tech enthusiast. Creating modern web applications 
                            and sharing experience with the community.
                        </p>
                    </section>

                    {/* Social Media section */}
                    <section className="flex flex-col space-y-4" aria-labelledby="social-media-heading">
                        <h3 id="social-media-heading" className="text-lg font-semibold text-white">
                            Social Media
                            <span className="block w-12 h-0.5 bg-blue-400 mt-2" aria-hidden="true" />
                        </h3>
                        <nav className="flex flex-col space-y-2" aria-label="Social media links">
                            {SOCIAL_LINKS.map((link) => (
                                <SocialLinkItem key={link.id} link={link} />
                            ))}
                        </nav>
                    </section>

                    {/* Quick Links section */}
                    <section className="flex flex-col space-y-4" aria-labelledby="quick-links-heading">
                        <h3 id="quick-links-heading" className="text-lg font-semibold text-white">
                            Quick Links
                            <span className="block w-12 h-0.5 bg-blue-400 mt-2" aria-hidden="true" />
                        </h3>
                        <nav className="flex flex-col space-y-2" aria-label="Quick navigation">
                            {NAV_LINKS.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={() => handleNavigation(link.sectionId)}
                                    className="cursor-pointer text-left text-gray-400 hover:text-green-400 transition-all duration-300 transform hover:translate-x-2 active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg px-2 py-1"
                                    aria-label={`Navigate to ${link.label} section`}
                                    type="button"
                                >
                                    <span className="flex items-center space-x-2">
                                        <span aria-hidden="true">{link.emoji}</span>
                                        <span>{link.label}</span>
                                    </span>
                                </button>
                            ))}
                        </nav>
                    </section>

                    {/* Support section */}
                    <section className="flex flex-col space-y-4" aria-labelledby="support-heading">
                        <h3 id="support-heading" className="text-lg font-semibold text-white">
                            Support
                            <span className="block w-12 h-0.5 bg-blue-400 mt-2" aria-hidden="true" />
                        </h3>
                        <nav className="flex flex-col space-y-2" aria-label="Support links">
                            {SUPPORT_LINKS.map((link) => (
                                <Link
                                    key={link.id}
                                    href={link.href}
                                    className="cursor-pointer flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-all duration-300 transform hover:translate-x-2 focus:outline-none focus:ring-2 focus:ring-green-400 rounded-lg px-2 py-1"
                                    aria-label={link.label}
                                >
                                    {'icon' in link ? (
                                        <link.icon className={`text-lg ${link.iconColor}`} aria-hidden="true" />
                                    ) : (
                                        <span aria-hidden="true">{link.emoji}</span>
                                    )}
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </section>
                </div>

                {/* Bottom footer */}
                <div className="pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        {/* Copyright */}
                        <div className="text-sm text-gray-500">
                            © {currentYear} Bohdan Codes. All rights reserved.
                        </div>
                        
                        {/* Social icons row */}
                        <nav className="flex space-x-2" aria-label="Social media quick links">
                            {SOCIAL_LINKS.map((link) => (
                                <SocialIconButton key={link.id} link={link} />
                            ))}
                        </nav>
                        
                        {/* Made with love */}
                        <Link 
                            href="/sponsor"
                            className="group cursor-pointer text-xs text-gray-600 hover:text-yellow-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded-lg px-3 py-1 flex items-center space-x-1"
                            aria-label="Support my work"
                        >
                            <span>Made with</span>
                            <FaHeart 
                                className="text-red-400 text-xs mx-1 group-hover:scale-110 transition-transform" 
                                aria-hidden="true"
                            />
                            <span>by Bohdan</span>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default memo(Footer);