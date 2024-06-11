const mongoose = require("mongoose");
const { type } = require("os");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
  
    image1: {
      type: String,
      default:
        "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
    image2: {
      type: String,
      default:
        "https://www.hostinger.com/tutorials/wp-content/uploads/sites/2/2021/09/how-to-write-a-blog-post.png",
    },
   
    link1:{
      type:String,
    },
    link2:{
      type:String,
    },
    
    category: {
      type: [String],
      default: "uncategorized",
    },
    readingType: {
      type: String,
      default: "Blog",
    },
    contributionType: {
      type: String,
      // default: "Blog",u8
    },
    slug: {
      type: String,
    },

    publish: {
      type: Boolean,
      default: false,
    },
    bookmark: {
      type: Boolean,
      default: false,
    },
    quizQuestion: {
      type: String,
    },
    quizOptions: {
      type: [String],
    },
    correctAnswer: {
      type: String,
    },
  },
  { timestamps: true }
);

const PostModel = model("Post", PostSchema);

module.exports = PostModel;
