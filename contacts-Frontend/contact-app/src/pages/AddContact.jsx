import { useState } from "react";

function AddContact() {
    const [formData, setFormData] = useState();
    return (  

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
                    <h1>Add content</h1>
        
                    <p>This is where you add content</p>
            </div>

    )
    
}

export default AddContact;