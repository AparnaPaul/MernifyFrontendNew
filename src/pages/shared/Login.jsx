import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const [role, setRole] = React.useState("user");
  const { login } = useAuth(); // Get login function from context

  const handleRoleChange = (value) => {
    setRole(value);
  };

  const onSubmit = async (data) => {
    if (!data.email || !data.password) return toast.error("Email and Password are required");
  
    const apiUrl = role === "admin"
      ? "http://localhost:4000/api/admin/login"
      : "http://localhost:4000/api/user/login";
  
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include"
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        return toast.error(result.message || "Login failed");
      }
  
      const userData =  result.user || result.admin;
      const token = document.cookie
        .split(";")
        .find((row) => row.trim().startsWith("token="))
        ?.split("=")[1];
        
      console.log("Debugging--")
      console.log(userData.username, token, userData.role, userData.email)

      if (userData && token) {
        login(userData.username, token, userData.role, userData.email);
        // toast.success("Login successful");
      } else {
        toast.error("Missing user data or token");
        console.warn("Login response missing user/token:", { userData, token });
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
  };
  
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <Card className="md:w-[400px] sm:w-[300px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-3">
            <div>
              <Label>Login As</Label>
              <Select value={role} onValueChange={handleRoleChange}>
                <SelectTrigger>
                  <SelectValue>{role}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Email</Label>
              <Input type="email" {...register("email")} placeholder="Enter your email" required />
            </div>

            <div>
              <Label>Password</Label>
              <Input type="password" {...register("password")} placeholder="Enter your password" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Login</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
