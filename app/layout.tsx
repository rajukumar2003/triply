import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "TRIPLY",
  description: "travel itinerary planner web application. The app will help users plan, organize, and categorize their travel itineraries by providing a user-friendly interface for creating and managing travel plans.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        
      >
        {children}
      </body>
    </html>
  );
}
