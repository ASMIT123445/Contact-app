import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../services/api";
import "./dashboard.css";

function EditContact() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 3000);
    };

    // Fetch existing contact data to pre-fill the form
    useEffect(() => {
        const fetchContact = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await api.get(`/contacts/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const { name, email, phone } = response.data;
                setFormData({ name, email, phone });
                setLoading(false);
            } catch (error) {
                showMessage(error.response?.data?.message || "Failed to load contact");
                setLoading(false);
            }
        };
        fetchContact();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.email || !formData.phone) {
            showMessage("Please enter all the fields");
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await api.put(`/contacts/${id}`, formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            showMessage("Contact updated successfully");
            navigate("/dashboard");
        } catch (error) {
            showMessage(error.response?.data?.message || "Something went wrong");
        }
    };

    if (loading) return <p className="loading">Loading contact...</p>;

    return (
        <div >
            <Link to={"/dashboard"}>
                <button className="submit-btn" style={{ whiteSpace: "nowrap", width: "120px" , margin: "20px" }}>Back</button>
            </Link>

            <div className="contact-form" style={{ maxWidth: "600px", margin: "40px auto"}}>
                <h1>Edit Contact</h1>

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
                    <button type="submit" className="submit-btn">Update Contact</button>
                    <Link to="/dashboard">
                        <button type="button" className="cancel-btn">Cancel</button>
                    </Link>
                </div>
            </form>
            </div>
            
        </div>
    );
}

export default EditContact;
