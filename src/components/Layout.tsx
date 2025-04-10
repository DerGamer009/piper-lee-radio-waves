
import { ReactNode } from "react";
import Header from "./Header";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-radio-dark text-white">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        {children}
      </main>
    </div>
  );
};

export default Layout;
