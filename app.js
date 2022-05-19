const express = require("express");
const logger = require("morgan");
const cors = require("cors");
// const multer = require("multer");
// const mime = require("mime-types");
// const uuid = require("uuid");

// const upload = multer({
//   storage: multer.diskStorage({
//     filename: (req, file, cb) => {
//       const extname = mime.extension(file.mimetype);
//       const filename = uuid.v4() + "." + extname;
//       cb(null, filename);
//     },
//     destination: "public",
//   }),
// });

const contactsRouter = require("./routes/api/contactsRouter");
const usersRouter = require("./routes/api/usersRouter");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
// app.use("/avatars", express.static("public"));
// app.post("/avatar", upload.single("avatar"), function (req, res, next) {
//   res.send();
// });

app.use("/api/contacts", contactsRouter);
app.use("/api/users", usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

module.exports = app;
