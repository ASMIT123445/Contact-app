import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "./register.css";

//Function for register of data
function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    //Function for submit of data
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password) {
            showMessage("Please fill all the fields.");
            return;
        }

        try {
            await api.post("/users/register", formData);
            showMessage("Registration successful.");
            setFormData({ username: "", email: "", password: "" });
            setTimeout(() => navigate("/"), 1000);
        } catch (error) {
            showMessage(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1>Register</h1>

                {message && <p className="message">{message}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
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
                    <button type="submit" className="register-btn">Register</button>
                </form>

                <p className="login-link">
                    Already have an account? <Link to="/">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
