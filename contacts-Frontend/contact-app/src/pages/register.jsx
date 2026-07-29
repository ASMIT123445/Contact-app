import { Link } from "react-router-dom";

function Register() {
    return (
        <>
            <h1>Register user</h1>

            <p>
                Already have a account? <Link to="/">Login</Link>
            </p>
        
        
        </>
    )
}

export default Register;