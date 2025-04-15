import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { server } from "@/main";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";  // Importing navigate

const EditProfile = () => {
    const { user, setUser } = useAuth();
    const [username, setUsername] = useState("");
    const [mobile, setMobile] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setMobile(user.mobile || "");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url =
                user?.role === "admin"
                    ? `${server}/api/admin/update-profile`
                    : `${server}/api/user/update-profile`;

            const { data } = await axios.put(
                url,
                { username, mobile, password: currentPassword, newPassword },
                { withCredentials: true }
            );

            if (typeof setUser === "function") {
                setUser(data.admin || data.user);
            }

            toast.success(data.message || "Profile updated successfully");

            // Redirect to admin dashboard after profile edit
            if (user.role === "admin") {
                navigate("/adminDashboard"); // Redirect to admin page
            } else {
                navigate("/"); // Redirect to user homepage
            }
        } catch (err) {
            console.error("Profile update error:", err);
            toast.error(err.response?.data?.message || "Failed to update profile");
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-10 px-4">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Username</Label>
                            <Input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Mobile</Label>
                            <Input
                                type="text"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Current Password</Label>
                            <Input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default EditProfile;
