import mongoose from "mongoose";

const commentShema = new mongoose.Schema({
    text: { type: String, required: true,},
    createdAt : { type: Date, required: true, default: Date.now()},
    video : { type: mongoose.Schema.Types.ObjectId, required: true, ref:"Video"},
    owner : { type : mongoose.Schema.Types.ObjectId, required: true, ref: "User"}
})

const Comment = mongoose.model("Comment", commentShema)

export default Comment