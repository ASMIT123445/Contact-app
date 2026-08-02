import { Link } from "react-router-dom";

function Register() {
    return (
        <>
            <h1>Register user</h1>

            <form>
                <div>
                    <label>UserName:</label>
                    <br/>
                    <input type="string" placeholder="Enter your name"/>
                    <br/>
                    <label>Email</label>
                    <br/>
                    <input type="email" placeholder="Enter your email"/>
                    <br/>
                    <label>Password:</label>
                    <br/>
                    <input type="password" placeholder="Enter password"/>
                </div>
            
            </form>

            <p>
                Already have a account? <Link to="/">Login</Link>
            </p>
        
        
        </>
    )
}

export default Register;