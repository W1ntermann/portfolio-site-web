import { NextResponse } from "next/server";

// Rate limiting map (in-memory, resets on server restart)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 3; // max submissions per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour in ms

export async function POST(request: Request) {
    try {
        // Basic rate limiting by IP
        const forwarded = request.headers.get("x-forwarded-for");
        const ip = forwarded?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";

        const now = Date.now();
        const entry = rateLimitMap.get(ip);

        if (entry) {
            if (now > entry.resetTime) {
                rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
            } else if (entry.count >= RATE_LIMIT) {
                return NextResponse.json(
                    { error: "Too many requests. Please try again later." },
                    { status: 429 }
                );
            } else {
                entry.count += 1;
            }
        } else {
            rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
        }

        const body = await request.json();

        const { name, email, company, budget, projectType, description } = body;

        // Server-side validation
        const errors: string[] = [];

        if (!name || typeof name !== "string" || name.trim().length < 2) {
            errors.push("Name must be at least 2 characters.");
        }

        if (!email || typeof email !== "string" || !/\S+@\S+\.\S+/.test(email)) {
            errors.push("A valid email address is required.");
        }

        if (!description || typeof description !== "string" || description.trim().length < 10) {
            errors.push("Project description must be at least 10 characters.");
        }

        if (errors.length > 0) {
            return NextResponse.json({ errors }, { status: 400 });
        }

        // Sanitize inputs
        const sanitized = {
            name: name.trim().slice(0, 100),
            email: email.trim().slice(0, 200),
            company: (company || "").trim().slice(0, 100) || "Not specified",
            budget: (budget || "").trim().slice(0, 50) || "Not specified",
            projectType: (projectType || "").trim().slice(0, 100) || "Not specified",
            description: description.trim().slice(0, 5000),
        };

        // In production, you would send an email via a service like Resend, SendGrid, etc.
        // For now, we log the submission and return success.
        // You can also use nodemailer + SMTP, or a webhook to Slack/Discord.

        console.log("=== New Hire Request ===");
        console.log("From:", sanitized.name, `(${sanitized.email})`);
        console.log("Company:", sanitized.company);
        console.log("Budget:", sanitized.budget);
        console.log("Type:", sanitized.projectType);
        console.log("Description:", sanitized.description);
        console.log("========================");

        // TODO: Replace with actual email sending logic
        // Example with Resend:
        // await resend.emails.send({
        //   from: 'portfolio@bohdan-hembatiuk.dev',
        //   to: 'bogdangembatyuk@gmail.com',
        //   subject: `Hire Request from ${sanitized.name}`,
        //   text: `...`,
        // });

        return NextResponse.json({
            success: true,
            message: "Thank you! Your message has been received. I'll get back to you within 24 hours.",
        });
    } catch {
        return NextResponse.json(
            { error: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}