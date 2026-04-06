import "./globals.css";
import { DM_Sans } from "next/font/google";
import { VisaDataProvider } from "@/contexts/VisaDataContext";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  icons: {
    icon: "https://funqfablmmtesjxtbzar.supabase.co/storage/v1/object/public/visawise/icon.png",
  },
  title: "Visawise",
  description: "Get your visa right the first time",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${dmSans.className} antialiased`}>
        <VisaDataProvider>{children}</VisaDataProvider>
      </body>
    </html>
  );
}
