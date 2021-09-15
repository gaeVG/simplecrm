require("dotenv").config()
const express = require("express");
const db = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();

const loginRoutes = require("./routes/login")
const registerRoutes = require("./routes/register")
const usersRoutes = require("./routes/users")
const contactsRoutes = require("./routes/contacts")

app.use(express.json());
app.use(cookieParser());


db.connect(process.env.DB, { useNewUrlParser: true }).then( () => {
	console.log("Connected to MongoDB !");
});

app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/users", usersRoutes);
app.use("/contacts", contactsRoutes);

app.listen(process.env.PORT, () => {
	console.log(`Listening on port ${process.env.PORT}`);
});