import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "./dashboard.css";

function Dashboard() {
    const [contacts, setContacts] = useState([]);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete the contact?"
        );
        if (!confirmDelete) return;

        try {
            const token = localStorage.getItem("token");
            await api.delete(`/contacts/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setContacts(contacts.filter((c) => c._id !== id));
            showMessage("Contact deleted successfully");
        } catch (error) {
            showMessage(error.response?.data?.message || "Failed to delete contact");
        }
    };


    

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await api.get("/contacts", {
                    headers: { Authorization: `Bearer ${token}` },
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

    const filtercontacts = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="dashboard-container">

            <div className="dashboard-header">
                <h1>My Contacts</h1>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <div style={{ display: "flex", gap: "12px", marginBottom: "16px" }}>
                <input
                    type="text"
                    placeholder="Search names..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ flex: 1, padding: "10px 14px", borderRadius: "6px", border: "1px solid #ccc", fontSize: "14px" }}
                />
                <Link to="/addContact">
                    <button className="submit-btn" style={{ whiteSpace: "nowrap" }}>+ Add Contact</button>
                </Link>
            </div>

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
                                <button
                                    className="edit-btn"
                                    onClick={() => navigate(`/editContact/${contact._id}`)}
                                >Edit</button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(contact._id)}
                                >Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}

export default Dashboard;




