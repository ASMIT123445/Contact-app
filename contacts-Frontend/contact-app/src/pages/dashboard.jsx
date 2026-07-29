import { useState, useEffect } from "react";
import api from "../services/api";

function Dashboard() {
    const [contacts, setContacts ] = useState([]);

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


    return <h1>Dashboard pages</h1>
}

export default Dashboard;