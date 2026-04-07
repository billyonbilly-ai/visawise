import "./globals.css";
import { DM_Sans } from "next/font/google";
import { VisaDataProvider } from "@/contexts/VisaDataContext";
import { AuthProvider } from "@/contexts/AuthContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  metadataBase: new URL("https://visawiseng.vercel.app"),
  title: {
    default: "Visawise | Get your visa right the first time",
    template: "%s | Visawise",
  },
  description:
    "Personalized document checklists for your visa application. Tailored to your destination, visa type, and employment status to ensure you submit with confidence.",
  icons: {
    icon: "https://funqfablmmtesjxtbzar.supabase.co/storage/v1/object/public/visawise/icon.png",
  },
  openGraph: {
    title: "Visawise",
    description:
      "Personalized visa document checklists tailored to your situation.",
    url: "https://visawise.ng",
    siteName: "Visawise",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Visawise Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Visawise",
    description:
      "Get your visa right the first time with personalized checklists.",
    creator: "@billyonbilly",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${dmSans.className} antialiased`}>
        <AuthProvider>
          <VisaDataProvider>{children}</VisaDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
