import localFont from "next/font/local";
import "../globals.css"
import Leftbar from "../_components/Leftbar";

const geistSans = localFont({
  src: "../../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={geistSans.variable}>
      <Leftbar />
      <div className="lg:ml-64 p-8 pl-12 lg:pl-8 min-h-screen transition-all">
        {children}
      </div>
    </div>
  );
}