import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const [signupInfo, setSignupInfo] = useState({ username: "", email: "", password: "", mobile: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo({ ...signupInfo, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const { username, email, password, mobile } = signupInfo;

    if (!username || !email || !password || !mobile) return handleError("All fields are required");

    try {
      const response = await fetch("https://mernifyserver.onrender.com/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();
      if (result.success) {
        toast.success(result.message);
        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.error(result.error?.details?.[0]?.message || result.message);
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
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
          </div>
          <div>
            <Label>Email</Label>
            <Input type="email" name="email" value={signupInfo.email} onChange={handleChange} placeholder="Enter your email" />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" name="password" value={signupInfo.password} onChange={handleChange} placeholder="Enter your password" />
          </div>
          <div>
            <Label>Mobile</Label>
            <Input type="tel" name="mobile" value={signupInfo.mobile} onChange={handleChange} placeholder="Enter your mobile number" />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignup} className="w-full">Sign Up</Button>
        </CardFooter>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default Signup;
