const mongoose = require("mongoose");

const data = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  title: {
    type: String,
    // required: true,
    // maxlength: 100,
  },
  image1: {
    type: String,
  },
  image2: {
    type: String,
  },
  image3: {
    type: String,
  },
  content: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const interestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    enum: ['y', 'n', 'm'],
    required: true
  }
});
const eventSchema = mongoose.Schema(
  {
    // userId: {
    //   type: String,
    //   required: true,
    // },
    eventTitle: {
      type: String,
      required: true,
    },
    eventImage: {
      type: String,
    },
    eventDescription: {
      type: String,
      required: true,
    },
    eventEntries: [data],
    startDate: {
      type: Date,
      // required: true,
    },
    endDate: {
      type: Date,
      // required: true,
    },
    interest: [interestSchema], // Array of user interests

    
    link1:{
      type:String,
    },
    link2:{
      type:String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("event", eventSchema);
