import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function Dashboard() {
    const [contacts, setContacts] = useState([]);
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const navigate = useNavigate();

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
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

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete the contact?"
        );

        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");

            await api.delete(`/contacts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setContacts(contacts.filter((c) => c._id !== id));
            showMessage("Contact deleted successfully");
        } catch (error) {
            showMessage(error.response?.data?.message || "Failed to delete contact");
        }
    };

    const handleEdit = (contact) => {
        setFormData({
            name: contact.name,
            email: contact.email,
            phone: contact.phone,
        });
        setEditId(contact._id);
    };

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await api.get("/contacts", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setContacts(response.data);
                setLoading(false);
            } catch (error) {
                showMessage(error.response?.data?.message || "Failed to load contacts");
                setLoading(false);
            }
        };
        fetchContacts();
    }, []);

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
            }

            setFormData({ name: "", email: "", phone: "" });
        } catch (error) {
            showMessage(error.response?.data?.message || "Something went wrong");
        }
    };
    const filtercontacts = contacts.filter((contact) => {
        return contact.name.toLowerCase().includes(search.toLowerCase())
    })

    return (
        <div className="dashboard-container">

            <div className="dashboard-header">
                <h1>My Contacts</h1>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <Link to={"/addContact"}>Add Contact</Link>

            <input
                type="text"
                placeholder="Search names..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: "100%", padding: "10px 14px", marginBottom: "20px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }}
            />

            {message && <p className="message">{message}</p>}

            {loading ? (
                <p className="loading">Loading contacts...</p>
            ) : filtercontacts.length === 0 ? (
                <p className="no-contacts">No contacts found.</p>
            ) : (
                <ul className="contacts-list">
                    {filtercontacts.map((contact) => (
                        <li key={contact._id} className="contact-item">
                            <span className="contact-info">
                                <strong>{contact.name}</strong> — {contact.email} — {contact.phone}
                            </span>
                            <div className="contact-actions">
                                <button className="edit-btn" onClick={() => handleEdit(contact)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(contact._id)}>Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="contact-form">
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

        </div>
    );
}

export default Dashboard;
