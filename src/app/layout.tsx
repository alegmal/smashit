import type { Metadata } from "next";
import { Press_Start_2P } from "next/font/google";
import "./globals.css";

const pixelFont = Press_Start_2P({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-pixel",
    display: "swap",
});

export const metadata: Metadata = {
    title: "SmashIt 👶",
    description: "Baby keyboard smashing playground — totally safe!",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={pixelFont.variable}>{children}</body>
        </html>
    );
}
