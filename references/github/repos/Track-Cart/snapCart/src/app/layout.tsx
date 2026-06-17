import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "@/provider";
import StoreProvider from "@/redux/StoreProvider";
import InitUUser from "@/InitUUser";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className=" w-full h-[200vh] bg-linear-to-b from-green-50 to-white">
        <Provider>
          <StoreProvider>
            <InitUUser />
            {children}
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}
