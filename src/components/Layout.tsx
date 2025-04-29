
import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "@/contexts/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAdmin } = useAuth();
  
  return (
    <div className="flex min-h-screen flex-col">
      <Header/>
      <main className="flex-1 pt-20 md:pt-32">
        {children}
      </main>
      <footer className="bg-slate-100 py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Radio Station. All rights reserved.
          </p>
          <nav className="flex gap-4 sm:gap-6">
            <Link
              to="/datenschutz"
              className="text-xs hover:underline underline-offset-4"
            >
              Datenschutz
            </Link>
            <Link
              to="/impressum"
              className="text-xs hover:underline underline-offset-4"
            >
              Impressum
            </Link>
            <Link
              to="/nutzungsbedingungen"
              className="text-xs hover:underline underline-offset-4"
            >
              AGB
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
