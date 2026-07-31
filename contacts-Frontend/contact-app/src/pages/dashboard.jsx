import { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const [contacts, setContacts] = useState([]);
    const  [editId, setEditId] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });
    const navigate = useNavigate();

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

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token")

            await api.delete(`/contacts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            setContacts(contacts.filter((c) => c._id !== id));
        } catch (error) {
            console.log(error.response?.data || error.message);  
        };
    };

    const handleEdit = (contact) => {
        setFormData({
            name:contact.name,
            email:contact.email,
            phone:contact.phone,
        });

        setEditId(contact._id);

    }

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
                console.log(response.data);
            } catch (error) {
                console.log(error.response?.data || error.message);
            }
        };
        fetchContacts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
      
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
          } else {
            // Create new contact
            const response = await api.post("/contacts", formData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
      
            setContacts([...contacts, response.data]);
          }
      
          setFormData({
            name: "",
            email: "",
            phone: "",
          });
        } catch (error) {
          console.log(error.response?.data || error.message);
        }
      };

    return (
        <>
            <h1>Dashboard pages</h1>

            <button onClick={handleLogout}>Logout</button>

            {contacts.length === 0 ? (
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
                    {editId ? "Update Contact" : "Add Contact"}</button>
            </form>
        </>
    );
}


export default Dashboard;
