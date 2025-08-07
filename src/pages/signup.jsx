import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UseAuth } from "../context/authContext";
import { signupHandler } from "../utils/apiService";


export default function Signup() {
    const [form, setForm] = useState({ name: "", email: "", password: "" })
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const {isLoggedIn} = UseAuth();

    if (isLoggedIn) return <Navigate to="/" />
    
    const validate = ()=>{
        const newErrors = {};
        if(!form.name){
            newErrors.name = "Name is required";
        }if(!form.email){
            newErrors.email = "Email address is invalid";
        }else if(!/\S+@\S+\.\S+/.test(form.email)){
            newErrors.email = "Email address is invalid";
        }
        if(!form.password){
            newErrors.password = "Password is required"
        }else if(form.password.length < 6){
            newErrors.password = "password must be of 6 characters or more"
        }
        return newErrors;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        try {
            const res = await signupHandler(form);
            if(res.status==201){
                alert("signup successful, please login");
                navigate("/signin");
            }
        } catch (err) {
            setErrors({...errors, submit:err.response?.data?.error || "Signup failed, please try again"});
        }


    }

    const handleChange = async (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    return (<>
        <div className="min-h-screen flex justify-center items-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm space-y-4">
                <h1 className="text-2xl font-bold text-center">Sign Up</h1>
                <input name="name" type="text" placeholder="Name" onChange={handleChange} className="border w-full p-2 rounded" />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                <input name="email" type="text" placeholder="Email" onChange={handleChange} className="border w-full p-2 rounded" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                <input name="password" type="password" placeholder="Pasword" onChange={handleChange} className="border w-full p-2 rounded" />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Sign Up</button>
                {errors.submit && <p className="text-red-500 text-xs mt-1">{errors.submit}</p>}
                <p className="text-sm text-center">
                    Already have an account? <a href="/signin" className="text-blue-500">Sign in</a></p>
            </form>
        </div>
    </>
    )
}