import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  description: { type: String, required: true, trim: true, minLength: 5 },
  createAt: { type: Date, required: true, default: Date.now },
  hashTags: [{ type: String, trim: true }],
  fileUrl: { type: String, required: true },
  thumbUrl : { type: String, required: true},
  meta: {
    views: { type: Number, required: true, default: 0 },
  },
  owner : { type : mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
  comments : [{type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment"}]
});

// 미들웨어 
// videoSchema.pre("save", async function () {
//   this.hashTags = this.hashTags[0].split(",")
//   .map((item) => (item.startsWith("#") ? item : `#${item}`))
// });

// videoSchema.pre("updateOne", async function () {
//   this.hashTags = this.hashTags[0].split(",")
//   .map((item) => (item.startsWith("#") ? item : `#${item}`))
// });

videoSchema.static("formatHashtags", function(hashtags){
  return hashtags
  .split(",")
  .map((item) => (item.startsWith("#") ? item : `#${item}`))
})

// 모델 스키마 생성전에 미들웨어 작성
const Video = mongoose.model("Video", videoSchema);

export default Video;
