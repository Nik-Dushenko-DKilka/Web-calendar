import { Providers } from "./providers";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/Providers/AuthProvider";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Web calendar",
  description:
    "Web calendar by NextJS. It's a simple web calendar for planning you life/work/hobbies. Just use it if you sometimes can't remind something",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/iconForTab.png" />
      </head>
      <body className={inter.className + "overflow-hidden"}>
        <AuthProvider>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}
