"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, ShoppingCart, Package, Settings } from "lucide-react";
import { useNotification } from "./Notification";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <div className="navbar bg-base-300 sticky top-0 z-40 shadow-lg">
      <div className="container mx-auto">
        <div className="flex-1 px-2 lg:flex-none">
          <Link
            href="/"
            className="btn btn-ghost text-xl gap-2 normal-case font-bold"
            prefetch={true}
          >
            <Package className="w-6 h-6" />
            PixelKit
          </Link>
        </div>
        
        <div className="flex-none hidden lg:block">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/" className="gap-2">
                <Home className="w-4 h-4" />
                Home
              </Link>
            </li>
            <li>
              <Link href="/products" className="gap-2">
                <Package className="w-4 h-4" />
                Browse
              </Link>
            </li>
            {session && (
              <li>
                <Link href="/orders" className="gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  My Orders
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="flex flex-1 justify-end px-2">
          <div className="flex items-stretch gap-2">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle"
              >
                <User className="w-5 h-5" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] shadow-lg bg-base-100 rounded-box w-64 mt-4 py-2"
              >
                {session ? (
                  <>
                    <li className="px-4 py-1">
                      <span className="text-sm opacity-70">
                        Welcome, {session.user?.email?.split("@")[0]}
                      </span>
                    </li>
                    <div className="divider my-1"></div>
                    {session.user?.role === "admin" && (
                      <li>
                        <Link
                          href="/admin"
                          className="px-4 py-2 hover:bg-base-200 block w-full gap-2"
                        >
                          <Settings className="w-4 h-4" />
                          Admin Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        href="/orders"
                        className="px-4 py-2 hover:bg-base-200 block w-full gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        My Orders
                      </Link>
                    </li>
                    <div className="divider my-1"></div>
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="px-4 py-2 text-error hover:bg-base-200 w-full text-left"
                      >
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        href="/login"
                        className="px-4 py-2 hover:bg-base-200 block w-full"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/register"
                        className="px-4 py-2 hover:bg-base-200 block w-full"
                      >
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}