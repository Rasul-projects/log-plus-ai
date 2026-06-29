import "./globals.css";

export const metadata = {
  title: "LogPulse AI - Devpost Submission",
  description: "B2B Scalable Infrastructure Diagnostics Platform Built via AWS and Vercel",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
