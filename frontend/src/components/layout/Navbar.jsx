import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Menu, X, User, Shield } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0b1120]/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-[#0b1120] font-black text-xs">GCC</span>
              </div>
              <span className="text-white font-bold tracking-tight text-lg">
                Golf<span className="text-green-500">Charity Club</span>
              </span>
            </Link>
          </div>

          {}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {user ? (
                <>
                  <Link
                    to={user.role === "admin" ? "/admin" : "/dashboard"}
                    className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    {user.role === "admin" ? (
                      <Shield size={14} />
                    ) : (
                      <User size={14} />
                    )}
                    {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                  </Link>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={logout}
                    className="flex items-center gap-2"
                  >
                    <LogOut size={14} /> Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Button
                    size="sm"
                    as={Link}
                    to="/signup"
                    className="text-white"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>

          {}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none border-none bg-transparent cursor-pointer"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {}
      {isOpen && (
        <div className="md:hidden bg-[#0b1120] border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/dashboard"}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  {user.role === "admin" ? "Admin Panel" : "Dashboard"}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="text-red-400 hover:text-red-300 block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-transparent border-none cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="text-green-500 font-bold block px-3 py-2 rounded-md text-base font-medium"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
