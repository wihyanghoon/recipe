import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  avata: String,
  email: { type: String, required: true, unique: true },
  socialOnly : { type: Boolean, require: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
});

userSchema.pre('save', async function() {
    console.log(this.password)
    this.password = await bcrypt.hash(this.password, 5);
    console.log(this.password)
})

const User = mongoose.model("User", userSchema);

export default User;
