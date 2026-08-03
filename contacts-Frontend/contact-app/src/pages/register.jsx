import { useState } from "react";
import api from "../services/api";
import { Link, useNavigate } from "react-router-dom";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name] : e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username || !formData.email || !formData.password) {
            showMessage("Please fill all the fields.");
            return
        }

        try {
            await api.post("users/register");

            showMessage("Registeration successfull.");

            setFormData({
                name:"",
                email:"",
                password:""
            })

            setTimeout=(() => {
                navigate("/")
            }, 1000);

            
        } catch (error) {
            showMessage(error.message?.data?.message || "Registration failed");
            
        }
    }
    

    const [message, setMessage] = useState("");

    const showMessage = (msg) =>{
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000)
    };





    return (
        <>
            <h1>Register user</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>UserName:</label>
                    <br/>
                    <input 
                    type="text" 
                    name="username" 
                    placeholder="Enter your name"
                    value={formData.username}
                    onChange={handleChange}/>
                    <br/>
                    <label>Email</label>
                    <br/>
                    <input 
                    type="email" 
                    name="email" 
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}/>
                    <br/>
                    <label>Password:</label>
                    <br/>
                    <input 
                    type="password" 
                    name="password" 
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}/>

                    <button type="submit">Register</button>
                </div>
            
            </form>

            <p>
                Already have a account? <Link to="/">Login</Link>
            </p>
        
        
        </>
    )
}

export default Register;