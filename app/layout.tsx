import "./globals.css";

export const metadata = {
  title: "NailArtGenius",
  description: "AI-powered nail art platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
