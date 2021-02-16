const express = require("express");
const connectDB = require("./config/db");
const app = express();

connectDB();

app.use(express.json({ exteended: false }));

const PORT = process.env.PORT || 5000;

app.use("/api/user", require("./routes/api/user"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/notes", require("./routes/api/notes"));

app.listen(PORT, () => {
  console.log("Server Started On PORT : ", PORT);
});
