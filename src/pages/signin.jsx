import { useState } from "react";
import { Navigate } from "react-router-dom";
import { UseAuth } from "../context/authContext";


export default function Signin() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [errors, setErrors] = useState({});
    const { isLoggedIn, login } = UseAuth();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    if (isLoggedIn) return <Navigate to="/dashboard" />

    const validate = () => {
        const newErrors = {};
        if (!form.email) {
            newErrors.email = "Email is required"; 
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = "Email address is invalid";
        }
        if (!form.password) {
            newErrors.password = "Password is required";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});

        try {
            await login(form);
        } catch (err) {
            console.log(err);
            alert("signin failed")
        }
    }


    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm space-y-4">
                <h1 className="text-2xl font-bold text-center">Sign In</h1>
                <input name="email" type="text" placeholder="Email" onChange={handleChange} className="border w-full p-2 rounded" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                <input name="password" type="password" placeholder="Pasword" onChange={handleChange} className="border w-full p-2 rounded" />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Sign In</button>
                {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}
                <p className="text-sm text-center">
                    Do not have an account? <a href="/signup" className="text-blue-500">Sign up</a></p>
            </form>
        </div>)
}