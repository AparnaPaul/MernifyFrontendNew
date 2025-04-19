import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import { CartData } from "./CartContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const navigate = useNavigate();
  const { fetchCart, clearCart } = CartData();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (isAuth && user?.role !== 'admin') {
        // Only fetch the cart for non-admin users
        fetchCart();
    }
  }, [isAuth, user]);

  // Login function
  const login = async (name, token, role, email, mobile) => {
    setBtnLoading(true);
    console.log("TOKEM--", token)
    try {
      const userData = { username: name, role, email, mobile };

      // Store user data and token in cookies
      Cookies.set("loggedInUser", JSON.stringify(userData), { expires: 1 });
      Cookies.set("token", token, { expires: 1 });

      setUser(userData);
      setIsAuth(true);
      toast.success("Logged in successfully");

      if (role === "admin") {
        navigate("/adminDashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      toast.error("Login failed");
      console.error("Login error:", error);
    } finally {
      setBtnLoading(false);
    }
  };

  // Fetch user function to load user data from cookies
  const fetchUser = () => {
    const storedUser = Cookies.get("loggedInUser");
    const token = Cookies.get("token");

    try {
      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.username) {
          setUser(parsedUser);
          setIsAuth(true);
        } else {
          throw new Error("Invalid user data");
        }
      } else {
        throw new Error("No valid user found");
      }
    } catch (error) {
      console.error("Error fetching user from cookies:", error);
      setUser(null);
      setIsAuth(false);
      Cookies.remove("loggedInUser");
      Cookies.remove("token");
    }

    setLoading(false);
  };

  // Logout function
  const logout = () => {
    Cookies.remove("loggedInUser");
    Cookies.remove("token");

    setUser(null);
    setIsAuth(false);

    clearCart();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, isAuth, loading, btnLoading, login, logout, setUser }}>
      {!loading && children} {/* Prevent rendering before authentication is checked */}
      <Toaster />
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
