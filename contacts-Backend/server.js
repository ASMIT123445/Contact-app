const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDB = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const cors = require("cors")

connectDB();
const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/api/contacts', require("./routes/contactRoute"));
app.use('/api/users', require("./routes/userRoutes"));
app.use(errorHandler)

app.listen(port, () => {console.log(`Server is successfully running in port ${port}`)});
  