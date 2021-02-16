const multer = require("multer");
const path = require("path");
const auth = require("../../middleware/auth");
const Notes = require("../../models/Notes");
const router = require("express").Router();

const storage = multer.diskStorage({
  destination: "./Notes",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage: storage,
});

//@GET Route
//@DESC Get All the Notes
router.get("/all", async (req, res) => {
  try {
    const notes = await Notes.find();
    if (notes.length == 0) {
      return res.status(200).json({ msg: "No Notes Added Yet!" });
    }
    res.json(notes);
  } catch (error) {
    console.log(error.message);
  }
});

//@POST Route
//@DESC Create Notes
router.post("/create", [auth, upload.single("file")], async (req, res) => {
  const { fileName, fileDescription, course, fileAuthor } = req.body;
  const notesFields = {};

  try {
    if (fileName) notesFields.fileName = fileName;
    if (fileDescription) notesFields.fileDescription = fileDescription;
    if (course) notesFields.course = course;
    if (fileAuthor) notesFields.fileAuthor = fileAuthor;
    notesFields.file = `http://${req.headers.host}/Notes/${req.file.filename}`;
    let notes = new Notes(notesFields);
    await notes.save();
    res.json(notes);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

//@PUT Route
//@DESC Update Specific Notes by ID
router.put("/update/:id", [auth, upload.single("file")], async (req, res) => {
  const { fileName, fileDescription, course, fileAuthor } = req.body;
  const notesFields = {};

  try {
    if (fileName) notesFields.fileName = fileName;
    if (fileDescription) notesFields.fileDescription = fileDescription;
    if (course) notesFields.course = course;
    if (fileAuthor) notesFields.fileAuthor = fileAuthor;
    notesFields.file = `http://${req.headers.host}/Notes/${req.file.filename}`;
    var notes = await Notes.findById(req.params.id);
    if (!notes) {
      return res.json({ msg: "No Notes Found . Please Enter a Valid ID" });
    } else {
      notes = await Notes.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: notesFields,
        },
        {
          new: true,
        }
      );
      return res.json({ msg: "Notes Updated", data: notes });
    }
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.status(200).json({ msg: "Please Enter a Valid Notes ID" });
    }
  }
});

//@DELETE Route
//@DESC Delete Specific Notes by ID
router.delete("/delete/:id", auth, async (req, res) => {
  try {
    await Notes.findOneAndDelete({ _id: req.params.id });
    res.json({ msg: "Notes Removed" });
  } catch (error) {
    console.log(error.message);
    if (error.kind == "ObjectId") {
      return res.json({ msg: "Please Enter a Valid ID" });
    }
  }
});
module.exports = router;
