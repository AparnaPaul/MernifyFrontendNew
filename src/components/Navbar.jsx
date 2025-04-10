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

const Navbar = () => {
    const { user, isAuth, logout } = useAuth();
    const navigate = useNavigate();

    const {totalItem }= CartData();
    console.log("Total items in Cart" , totalItem)

    return (
        <div className="z-50 sticky top-0 bg-background/50 border-b backdrop-blur">
            <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between">
                <h1 className="text-2xl font-bold">MERNify</h1>
                <ul className="flex items-center space-x-6">
                    <li className="cursor-pointer" onClick={() => navigate("/")}>
                        Home
                    </li>
                    <li className="cursor-pointer" onClick={() => navigate("/products")}>
                        Products
                    </li>

              
                    {isAuth ? (
                        <>
                            <li className="cursor-pointer relative flex items-center" onClick={() => navigate("/cart")}>
                                <ShoppingCart className="w-6 h-6" />
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                   {totalItem ?? 0}
                                </span>
                            </li>

                            <li className="cursor-pointer">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <User />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>{user?.username || "User"}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => navigate("/orders")}>
                                            Your Orders
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => logout()}>
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </li>
                        </>
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
