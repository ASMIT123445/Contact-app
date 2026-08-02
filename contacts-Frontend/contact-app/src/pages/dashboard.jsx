import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [contacts, setContacts] = useState([]);
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(null);
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

    return (
        <>
            <h1>Dashboard pages</h1>

            <button onClick={handleLogout}>Logout</button>

            {message && <p>{message}</p>}

            {loading ? (
                <p>Loading contacts...</p>
            ) : contacts.length === 0 ? (
                <p>No contacts found.</p>
            ) : (
                <ul>
                    {contacts.map((contact) => (
                        <li key={contact._id}>
                            {contact.name} - {contact.email} - {contact.phone}
                            <button onClick={() => handleEdit(contact)}>Edit</button>
                            <button onClick={() => handleDelete(contact._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleSubmit}>
                <input
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                />
                <button type="submit">
                    {editId ? "Update Contact" : "Add Contact"}
                </button>
                {editId && (
                    <button type="button" onClick={handleCancel}>Cancel</button>
                )}
            </form>
        </>
    );
}

export default Dashboard;
