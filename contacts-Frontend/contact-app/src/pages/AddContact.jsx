import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./dashboard.css";


//Function for adding contacts
function AddContact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
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
    // Function for submit 
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone) {
            showMessage("Please enter all the fields");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await api.post("/contacts", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showMessage("Contact added successfully");
            navigate("/dashboard");
        } catch (error) {
            showMessage(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div style={{ margin: "15px"}}>
            <Link to="/dashboard">
                    <button className="submit-btn" style={{ whiteSpace: "nowrap", width: "120px" }}>Back</button>
                </Link>
            
            <div  className="contact-form" style={{ maxWidth: "700px", margin:' 40px auto',  }}>
                <h1>Add Contact</h1>

            {message && <p className="message">{message}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-actions">
                    <button type="submit" className="submit-btn">Add Contact</button>
                    <Link to="/dashboard">
                        <button type="button" className="cancel-btn">Cancel</button>
                    </Link>
                </div>
            </form>
            </div>

            
        </div>
    );
}

export default AddContact;
