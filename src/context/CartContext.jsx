import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext()

export const CartProvider = ({ children }) => {
    const token = Cookies.get("token");
    const [loading, setLoading] = useState(false)
    const [totalItem, setTotalItem] = useState(0)
    const [subTotal, setSubTotal] = useState(0)

    const [cart, setCart] = useState([])
    async function fetchCart() {
        try {
            const { data } = await axios.get(`http://localhost:4000/api/cart/all`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}` // ✅ attach token explicitly
                  }
            });
            console.log("Fetched cart:", data); // Check if data.cart contains correct totalItem value
            setCart(data.cart)
            setTotalItem(data.totalQuantity);
            setSubTotal(data.subTotal)
        } catch (error) {
            console.log(error)
        }
    }
    async function addToCart(product) {
        try {
            const { data } = await axios.post(`http://localhost:4000/api/cart/add`, { product }, {
                withCredentials: true
            })

            toast.success(data.message);
            fetchCart();
        } catch (error) {
            toast.error(error.response.data.message)
        }

    }
    useEffect(() => {
        fetchCart();

    }, [])

    useEffect(() => {
        console.log("Updated totalItem in context:", totalItem);
    }, [totalItem]);

    function clearCart() {
        setCart([]);
        setTotalItem(0);
        setSubTotal(0);
    }

    return <CartContext.Provider value={{ cart, totalItem, subTotal, fetchCart, addToCart, clearCart }}>{children}</CartContext.Provider>
}

export const CartData = () => useContext(CartContext)