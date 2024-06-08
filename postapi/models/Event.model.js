const mongoose = require("mongoose");



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
    // eventEntries: [data],
    startDate: {
      type: Date,
      // required: true,
    },
    endDate: {
      type: Date,
      // required: true,
    },
    yes:{
      type:Number,
    },
    no:{
      type:Number,
    },
    maybe:{
      type:Number,
    },
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
