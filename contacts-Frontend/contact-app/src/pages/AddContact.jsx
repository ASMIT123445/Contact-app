import { useState } from "react";
import api from "../services/api";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

function AddContact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [editId, setEditId] = useState(null);
    const [contacts, setContacts] = useState([]);
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

    const handleCancel = () => {
        setEditId(null);
        setFormData({ name: "", email: "", phone: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone) {
            showMessage("Please enter all the fields");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            if (editId) {
                // Update existing contact
                const response = await api.put(`/contacts/${editId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setContacts(
                    contacts.map((contact) =>
                        contact._id === editId ? response.data : contact
                    )
                );
                setEditId(null);
                showMessage("Contact updated successfully");
                
                
            } else {
                // Create new contact
                const response = await api.post("/contacts", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setContacts([...contacts, response.data]);
                showMessage("Contact added successfully");
                navigate("/dashboard");
            }

            setFormData({ name: "", email: "", phone: "" });
        } catch (error) {
            showMessage(error.response?.data?.message || "Something went wrong");
        }
    };


    return (  
        <div className="contact-form">
            <h1>Add Contact</h1>
            <p>This is where you add a contact</p>

            {message && <p className="message">{message}</p>}

                <h2>{editId ? "Edit Contact" : "Add Contact"}</h2>
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
                        <button type="submit" className="submit-btn">
                            {editId ? "Update Contact" : "Add Contact"}
                        </button>
                        {editId && (
                            <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        )}
                    </div>
                </form>

            </div>

    )
    
}

export default AddContact;