import './globals.css';
import React from 'react';

export const metadata = {
  title: 'HealthSync - Personalized Wellness Engine',
  description: 'AI-Powered Health and Wellness Companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
