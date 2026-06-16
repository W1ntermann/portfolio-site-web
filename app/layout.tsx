import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/main/Navbar";
import Footer from "@/components/main/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Bohdan Hembatiuk | FullStack Developer — C# & .NET Specialist",
    description:
        "FullStack developer specializing in ASP.NET Core, C#, React, Next.js, and TypeScript. Building scalable web applications, RESTful APIs, and modern digital solutions.",
    keywords: [
        "FullStack Developer",
        "C# Developer",
        ".NET Developer",
        "ASP.NET Core",
        "React",
        "Next.js",
        "TypeScript",
        "Web Development",
        "Bohdan Hembatiuk",
    ],
    authors: [{ name: "Bohdan Hembatiuk" }],
    creator: "Bohdan Hembatiuk",
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "Bohdan Hembatiuk — Portfolio",
        title: "Bohdan Hembatiuk | FullStack Developer — C# & .NET Specialist",
        description:
            "FullStack developer specializing in ASP.NET Core, C#, React, Next.js, and TypeScript. Building scalable web applications and modern digital solutions.",
    },
    twitter: {
        card: "summary_large_image",
        title: "Bohdan Hembatiuk | FullStack Developer",
        description:
            "FullStack developer specializing in ASP.NET Core, C#, React, Next.js, and TypeScript.",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body
                className={`${inter.className} bg-[#030014] overflow-y-scroll overflow-x-hidden max-w-[1855px] mx-auto`}
            >
                <Navbar />
                {children}
                <Footer />
            </body>
        </html>
    );
}
