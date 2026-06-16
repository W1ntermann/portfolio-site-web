import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Hire Me | Bohdan Hembatiuk — FullStack Developer",
    description:
        "Looking for a FullStack developer? Hire Bohdan Hembatiuk — C# & .NET specialist with expertise in React, Next.js, ASP.NET Core, and modern web development.",
    openGraph: {
        title: "Hire Bohdan Hembatiuk | FullStack Developer",
        description:
            "Looking for a FullStack developer? Hire me for your next project — C#, .NET, React, Next.js expertise.",
    },
};

export default function HireLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}