import localFont from "next/font/local";
import "../globals.css"
import Leftbar from "../_components/Leftbar";
import Rightbar from "../_components/Rightbar";

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
    <>
      <Leftbar />
      <div className='ml-[300px] mr-[300px] p-4'>{children}</div>
      <Rightbar />
    </>
  );
}
