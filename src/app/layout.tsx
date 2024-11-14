import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { QuizProvider } from "@/context/QuizContext";
import { Footer } from "@/components/Footer";

const openSans = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shritam Sir",
  description:
    "This is the personal website of Shritam Mohanty, where he creates varieties of Quizzes for students!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <QuizProvider>
        <body className={openSans.className}>
          <main>
            {children}
            <Footer />
          </main>
          <Toaster />
        </body>
      </QuizProvider>
    </html>
  );
}
