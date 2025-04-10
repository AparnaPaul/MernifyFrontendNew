import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/user/Home";
import Login from "./pages/shared/Login";
import Signup from "./pages/shared/Signup";
import Products from "./pages/shared/Products";
import ProductPage from "./pages/shared/ProductPage";
import Cart from "./pages/user/Cart";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NotFound from "./pages/user/NotFound";
import Checkout from "./pages/user/Checkout";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Payment from "./pages/user/Payment";
import OrderProcessing from "./pages/user/OrderProcessing";
import Orders from "./pages/user/Orders";
import OrderPage from "./pages/shared/OrderPage";

const AppRoutes = () => {
  const { isAuth, loading, user } = useAuth();

  if (loading) return <Loading />;

  return (
    <>
    
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductPage />} />
        
        {/* Protected Routes - Require Authentication */}
        <Route path="/cart" element={isAuth ? <Cart /> : <Login />} />
        <Route path="/orders" element={isAuth ? <Orders /> : <Login />} />
        <Route path="/order/:id" element={isAuth ? <OrderPage /> : <Login />} />

        <Route path="/checkout" element={isAuth ? <Checkout /> : <Login />} />
        <Route path="/payment/:id" element={isAuth ? <Payment /> : <Login />} />
        <Route path="/orderSuccess" element={isAuth ? <OrderProcessing /> : <Login />} />

        {/* Admin Protected Route */}
        <Route path="/adminDashboard" element={isAuth && user?.role === "admin" ? <AdminDashboard /> : <Login />} />

        {/* Authentication Routes */}
        <Route path="/login" element={isAuth ? <Home /> : <Login />} />
        <Route path="/signup" element={isAuth ? <Home /> : <Signup />} />
        
        {/* Catch-All Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
        <CartProvider> {/* ✅ CartProvider must be inside AuthProvider */}
      <AuthProvider> {/* ✅ AuthProvider must be inside BrowserRouter */}
          <AppRoutes />
      </AuthProvider>
        </CartProvider>
    </BrowserRouter>
  );
};

export default App;
