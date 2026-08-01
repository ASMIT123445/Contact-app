import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function Login() {
    const [formData, setFormData] = useState({
        email:"",
        password:"",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post("/users/login", formData);
            localStorage.setItem("token", response.data.accessToken);
            console.log("Login successful")
            navigate("/dashboard")
            
        } catch (error) {
            console.log(error.response?.data || error.message)
        }
    }

    return (
        <>
            <h1>Login page</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                <br />
                <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange}/>
                <br />
                <label> Password:</label>
                <br />
                <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange}/>
                <br />
                <button type="submit">Submit</button>
                </div>
            </form>

            <p>
                Don't have a account? <Link to="/register">Register</Link>
            </p>


        </>

    )
    

}

export default Login;