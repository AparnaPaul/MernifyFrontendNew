import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios"; 
import { server } from "@/main"; 

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({ username: "", email: "", password: "", mobile: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({ ...signupInfo, [name]: value });
  };

  // Validate form before submission
  const validateForm = () => {
    let formErrors = {};
    const { username, email, password, mobile } = signupInfo;

    if (!username) formErrors.username = "Username is required.";
    if (!email) formErrors.email = "Email is required.";
    if (!password) formErrors.password = "Password is required.";
    if (!mobile) formErrors.mobile = "Mobile number is required.";

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      formErrors.email = "Please enter a valid email address.";
    }

    // Mobile number validation (must be 10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (mobile && !mobileRegex.test(mobile)) {
      formErrors.mobile = "Please enter a valid 10-digit mobile number.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0; 
  };

  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    const { username, email, password, mobile } = signupInfo;
  
  
    try {
      const response = await axios.post(`${server}/api/user/signup`, signupInfo, {
        withCredentials:true
      });
  
      const result = response.data;
      if (result.success) {
        toast.success(result.message);
        setTimeout(() => navigate("/login"), 1000); 
      } else if (result.message === "User already exists, you can login") {
        toast.info("You are already registered. Please login instead.");
      } else {
        toast.error(result.message || "An error occurred during signup.");
      }
    } catch (err) {
      console.error("Signup error:", err);
  
      if (err.response) {
        if (err.response.status === 409) {
          toast.info("User already exists, please login.");
        } else if (err.response.status === 400) {
          // Log the error message from the backend if available
          const errorMessage = err.response.data.message || "Invalid data, please check the form.";
          toast.error(errorMessage);
        } else {
          toast.error("An unexpected error occurred.");
        }
      } else {
        toast.error("Network error, please try again later.");
      }
    }
  };
  
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="md:w-[400px] sm:w-[300px] m-auto mt-5">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Username</Label>
            <Input type="text" name="username" value={signupInfo.username} onChange={handleChange} placeholder="Enter your username" />
            {errors.username && <p className="text-red-600 text-sm">{errors.username}</p>}
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" name="email" value={signupInfo.email} onChange={handleChange} placeholder="Enter your email" />
            {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" name="password" value={signupInfo.password} onChange={handleChange} placeholder="Enter your password" />
            {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
          </div>
          <div>
            <Label>Mobile</Label>
            <Input type="tel" name="mobile" value={signupInfo.mobile} onChange={handleChange} placeholder="Enter your mobile number" />
            {errors.mobile && <p className="text-red-600 text-sm">{errors.mobile}</p>}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" onClick={handleSignup} className="w-full">Sign Up</Button>
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default Signup;
