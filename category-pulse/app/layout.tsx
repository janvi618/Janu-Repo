import type { Metadata } from "next";
import "./globals.css";
import "./pulse.css";
import "./decision-lab.css";
export const metadata: Metadata = { title:"Pulse Decision Lab · Pet Food",description:"Compare pet food ideas, review the evidence and plan the next test.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"} };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body className="antialiased">{children}</body></html>;}
