import * as React from 'react';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopNavBar from '@/components/TopNavBar';
import ApplicationDrawer from "@/components/ApplicationDrawer";
import { Box, Stack } from "@mui/material";
import { ApplicationContext } from "@/helpers/Contexts";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Log Tracer",
  description: "Log tracing application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" >
      <body className={inter.className} style={{backgroundColor: '#383838'}}>
        <Box>
          <TopNavBar/>
          {children}
        </Box>
      </body>
    </html>
  );
}
