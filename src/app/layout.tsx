import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/providers/theme-provider";
import AuthProvider from "@/providers/auth-provider";
import DesignerContextProvider from "@/context/designer-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Языковой лифт",
  description: "Платформа для обучения сотрудников иностранным языкам",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AuthProvider>
          <DesignerContextProvider>
            <ThemeProvider attribute="class" defaultTheme='dark' enableSystem disableTransitionOnChange>
              {children}
              <Toaster/>
            </ThemeProvider>
          </DesignerContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
