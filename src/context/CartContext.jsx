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

  async function fetchCart() {
    const token = Cookies.get("token"); // Retrieve token from cookies

    if (!token) {
      toast.error("You need to log in to view your cart.");
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/cart/all`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in the request header
        },
      });

      setCart(data.cart);
      setTotalItem(data.totalQuantity);
      setSubTotal(data.subTotal);
    } catch (error) {
      console.error("Error fetching cart data:", error);
      toast.error("Failed to load cart.");
    }
  }

  async function addToCart(product) {
    const token = Cookies.get("token");

    try {
      const { data } = await axios.post(
        `${server}/api/cart/add`,
        { product },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in the request header
          },
        }
      );

      toast.success(data.message);
      fetchCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding to cart");
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cart, totalItem, subTotal, fetchCart, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const CartData = () => useContext(CartContext);
