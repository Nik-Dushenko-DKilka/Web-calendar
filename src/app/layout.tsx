import { Providers } from "./providers";

import { Inter } from "next/font/google";

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
      <body className={inter.className + "overflow-hidden"}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
