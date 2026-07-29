import {Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import AddContact from "./pages/AddContact";
import EditContact from "./pages/EditContact";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />}></Route>
        <Route path="/dashboard" 
        element=
        {<ProtectedRoute>
          <Dashboard/>
        </ProtectedRoute>}></Route>
        <Route path="/addContact" element={<AddContact/>}></Route>
        <Route path="/editContact/:id" element={<EditContact/>}></Route>
      </Routes>
    </>

  );
}

export default App;