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
    const { user, setUser, loading } = useAuth();  // Loading state from context
    const [username, setUsername] = useState("");
    const [mobile, setMobile] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");  // State to handle password error
    const [isOldPasswordValid, setIsOldPasswordValid] = useState(false); // Track if old password is valid
    const [userDetails, setUserDetails] = useState(null);  // To store user details fetched from API
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        // Fetch user details if not already available
        if (user && !userDetails) {
            fetchUserDetails();
        }
    }, [user, userDetails]);  // Only fetch if user or userDetails is missing

    const fetchUserDetails = async () => {
        try {
            const response = await axios.get(`${server}/api/${user?.role === 'admin' ? 'admin' : 'user'}/me`, { withCredentials: true });
            setUserDetails(response.data);  // Store the fetched user details
            setUsername(response.data.username || "");
            setMobile(response.data.mobile || "");
        } catch (err) {
            console.error("Error fetching user details:", err);
            toast.error("Failed to fetch user details");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear any previous password error
        setPasswordError("");

        // Prepare the data to be sent
        const updateData = {
            username,
            mobile,
        };

        // If the user has entered a new password, add the old and new passwords to the request
        if (newPassword && currentPassword) {
            updateData.oldPassword = currentPassword;
            updateData.newPassword = newPassword;
        }

        try {
            const url =
                user?.role === "admin"
                    ? `${server}/api/admin/update-profile`
                    : `${server}/api/user/update-profile`;

            const { data } = await axios.put(url, updateData, { withCredentials: true });

            if (typeof setUser === "function") {
                setUser(data.admin || data.user);
            }

            toast.success(data.message || "Profile updated successfully");

            // Redirect to the correct page after the profile update
            if (user.role === "admin") {
                navigate("/adminDashboard"); // Redirect to admin page
            } else {
                navigate("/"); // Redirect to user homepage
            }
        } catch (err) {
            console.error("Profile update error:", err);

            // Check if the error is due to an invalid password
            if (err.response?.data?.message === "Old password is incorrect") {
                setPasswordError("Old password is incorrect. Please try again.");
                setIsOldPasswordValid(false);  // Mark old password as invalid
            } else {
                toast.error(err.response?.data?.message || "Failed to update profile");
            }
        }
    };

    const handleCurrentPasswordChange = (e) => {
        const enteredPassword = e.target.value;
        setCurrentPassword(enteredPassword);

        if (enteredPassword) {
            setIsOldPasswordValid(true);  // Assume user is trying to validate the old password
            setPasswordError("");  // Clear error if they're typing the old password
        } else {
            setIsOldPasswordValid(false); // If no password entered, disable new password field
        }
    };

    // If loading, show a loading message or spinner
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-xl mx-auto mt-10 px-4">
            {/* Display user details container */}
            {userDetails && (
                <Card className="mb-4">
                    <CardHeader>
                        <CardTitle>User Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div>
                            <strong>Username: </strong> {userDetails.username}
                        </div>
                        <div>
                            <strong>Mobile: </strong> {userDetails.mobile}
                        </div>
                        <div>
                            <strong>Email: </strong> {userDetails.email}
                        </div>

                    </CardContent>
                </Card>
            )}

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
                                placeholder={user.username || ""}  // Show current username as placeholder
                            />
                        </div>

                        <div>
                            <Label>Mobile</Label>
                            <Input
                                type="text"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder={user.mobile || ""}
                            />
                        </div>

                        <div>
                            <Label>New Password (Leave empty if you don't want to change)</Label>
                            <Input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                disabled={!isOldPasswordValid}  // Disable new password field if old password is invalid
                            />
                        </div>

                        <div>
                            <Label>Current Password</Label>
                            <Input
                                type="password"
                                value={currentPassword}
                                onChange={handleCurrentPasswordChange}
                                placeholder="Enter your current password"
                            />
                        </div>

                        {/* Show password error message */}
                        {passwordError && <p className="text-red-500">{passwordError}</p>}

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
