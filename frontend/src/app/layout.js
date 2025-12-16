import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/assets/css/app.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Main from "@/components/layout/Main";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "방명록 | Guest Book App",
    description: "Spring Boot와 Next.js로 만든 방명록 애플리케이션",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
            <div id="App">
                <Header />
                <Main>
                    {children}
                </Main>
                <Footer />
            </div>
        </body>
        </html>
    );
}
