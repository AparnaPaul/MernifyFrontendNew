import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [totalItem, setTotalItem] = useState(0);
  const [subTotal, setSubTotal] = useState(0);
  const [cart, setCart] = useState([]);

  // Fetch Cart Function
  const fetchCart = async () => {
    const token = Cookies.get("token");
    if (!token) {
      toast.error("You need to log in to view your cart.");
      return;
    }
    try {
      const { data } = await axios.get(`${server}/api/cart/all`, {
        withCredentials: true,
      });
      setCart(data.cart);
      setTotalItem(data.totalQuantity);
      setSubTotal(data.subTotal);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      toast.error("Failed to load cart.");
    }
  };

  // Add to Cart Function
  const addToCart = async (product) => {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.post(
        `${server}/api/cart/add`,
        { product },
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding to cart");
    }
  };

  // Update Cart Function (Increment/Decrement)
  const updateCart = async (action, id) => {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.put(
        `${server}/api/cart/update`,
        { id },
        {
          params: { action },
          withCredentials: true,
        }
      );
      toast.success(data.message);
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating cart");
    }
  };

  // Remove from Cart Function
  const removeFromCart = async (id) => {
    const token = Cookies.get("token");
    try {
      const { data } = await axios.delete(
        `${server}/api/cart/remove/${id}`,
        {
          withCredentials: true,
        }
      );
      toast.success(data.message);
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error removing from cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItem,
        subTotal,
        fetchCart,
        addToCart,
        updateCart,    // Export updateCart function
        removeFromCart, // Export removeFromCart function
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const CartData = () => useContext(CartContext);
