import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import "./login.css";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            showMessage("Please enter email and password");
            return;
        }

        try {
            const response = await api.post("/users/login", formData);
            localStorage.setItem("token", response.data.accessToken);
            navigate("/dashboard");
        } catch (error) {
            showMessage(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Login</h1>

                {message && <p className="message">{message}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                </form>

                <p className="register-link">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
