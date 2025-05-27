const mongoose = require("mongoose");
const Booking = require("./Booking");
const User = require("./user");
const Organizer = require("./Organizer");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  description: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  location: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: false,
    default: 0
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: "Organizer",
  },
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  totalTickets: {
    type: Number,
    required: true,
  },
  remainingTickets: {
    type: Number,
    required: true,
    default: function() {
      return this.totalTickets;
    }
  },
  image: {
    type: String,
    default: "default.jpg",
  },
  status: {
    type: String,
    enum: ["Pending", "approved", "Cancelled"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Pre-save middleware to ensure remainingTickets is set to totalTickets for new events
eventSchema.pre('save', function(next) {
  if (this.isNew) {
    this.remainingTickets = this.totalTickets;
  }
  next();
});

eventSchema.methods.updateRemainingTickets = function (bookings) {
  this.remainingTickets = this.totalTickets - bookings;
  return this.save();
};

module.exports = mongoose.model("Event", eventSchema);
