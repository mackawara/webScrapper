import mongoose from "mongoose";

const sylabiSchema = new mongoose.Schema({
  subjectName: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
});

const sylabiModels=new mongoose.model("sylabi",sylabiSchema)
export default sylabiModels