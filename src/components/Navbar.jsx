import { LogIn, ShoppingCart, User } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ModeToggle } from "./mode-toggle";
import { ToastContainer } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { CartData } from "@/context/CartContext";

import logoLight from "@/assets/logo_noslogan_light.png"; // Light mode logo
import logoDark from "@/assets/logo_noslogan_dark.png";   // Dark mode logo

const Navbar = () => {
    const { user, isAuth, logout } = useAuth();
    const navigate = useNavigate();
    const { totalItem } = CartData(); // Get the total items in the cart

    const isAdmin = user?.role === "admin"; // Check if the user is an admin

    return (
        <div className="z-50 sticky top-0 bg-background/50 border-b backdrop-blur h-16">
            <div className="container mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
                    {/* Light mode logo */}
                    <img
                        src={logoLight}
                        alt="MERNify Logo"
                        className="block dark:hidden h-10 sm:h-12 md:h-14 w-auto max-w-none scale-[1.3] md:scale-[1.5] transition-transform"
                    />
                    {/* Dark mode logo */}
                    <img
                        src={logoDark}
                        alt="MERNify Logo"
                        className="hidden dark:block h-10 sm:h-12 md:h-14 w-auto max-w-none scale-[1.3] md:scale-[1.5] transition-transform"
                    />
                </div>

                {/* Navigation Links & User Controls */}
                <ul className="flex items-center space-x-6">
                    <li className="cursor-pointer" onClick={() => navigate("/")}>
                        Home
                    </li>
                    <li className="cursor-pointer" onClick={() => navigate("/products")}>
                        Products
                    </li>

                    {/* Cart Icon (only for non-admin users) */}
                    {isAuth && !isAdmin && ( // Show the cart only if the user is authenticated and not an admin
                        <li className="cursor-pointer" onClick={() => navigate("/cart")}>
                            <div className="relative">
                                <ShoppingCart className="z-10" /> {/* Ensure the cart icon is above the badge */}
                                {/* Display the total number of items in the cart */}
                                {totalItem > 0 && (
                                    <span
                                        className="absolute right-0 bg-red-600 text-white text-xs rounded-full px-2 py-1 z-20"
                                        style={{ top: '60%' }} // Adjust the position with a percentage value or fixed units (e.g., '5px', '-5px')
                                    >
                                        {totalItem}
                                    </span>
                                )}

                            </div>
                        </li>
                    )}

                    {/* Auth Dropdown */}
                    {isAuth ? (
                        <li className="cursor-pointer">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <User />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>
                                        {user?.username || "User"}
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {isAdmin ? (
                                        <>
                                            <DropdownMenuItem onClick={() => navigate("/adminDashboard")}>
                                                Dashboard
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate("/editProfile")}>
                                                Edit Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate("/admin/addAdmin")}>Add Admin</DropdownMenuItem>
                                        </>
                                    ) : (
                                        <>
                                            <DropdownMenuItem onClick={() => navigate("/orders")}>
                                                Your Orders
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate("/editProfile")}>
                                                Edit Profile
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                    <DropdownMenuItem onClick={logout}>
                                        Logout
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                    ) : (
                        <li className="cursor-pointer" onClick={() => navigate("/login")}>
                            <LogIn />
                        </li>
                    )}

                    <ModeToggle />
                </ul>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Navbar;
