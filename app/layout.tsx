import './globals.css';
import type { Metadata } from 'next';
import { Tauri } from 'next/font/google';
import { ThemeProvider } from "@/components/theme-provider";

const tauri = Tauri({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Workflow Automation',
  description: 'Create, test, and deploy custom workflows with AI assistance.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${tauri.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}