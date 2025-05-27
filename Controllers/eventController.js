const eventModel = require('../Models/Event');
const bookingModel = require('../Models/Booking');
require("dotenv").config();
const secretKey = process.env.secretKey;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
require("dotenv").config();


const eventController = {
  createEvent: async (req, res) => {
    try {
      console.log("=== CREATE EVENT REQUEST ===");
      console.log("Request body:", req.body);
      console.log("User:", req.user);

      const {
        title, description, location,
        category, date, time, totalTickets
      } = req.body;

      const organizerId = req.user._id;

      // Validate required fields
      if (!title || !description || !location || !category || !date || !time || !totalTickets) {
        console.log("Missing required fields");
        return res.status(400).json({ 
          message: "Missing required fields",
          received: { title: !!title, description: !!description, location: !!location, category: !!category, date: !!date, time: !!time, totalTickets: !!totalTickets }
        });
      }

      // Check for duplicate event
      const existingEvent = await eventModel.findOne({ title, date, time });
      if (existingEvent) {
        console.log("Duplicate event found");
        return res.status(409).json({ message: "An event with the same title, date, and time already exists." });
      }

      // Create new event
      const eventData = {
        title,
        description,
        location,
        category,
        date,
        time,
        totalTickets: parseInt(totalTickets),
        organizer: organizerId
      };

      console.log("Creating event with data:", eventData);
      const event = new eventModel(eventData);
      await event.save();
      
      console.log("Event created successfully:", event._id);
      return res.status(201).json(event);
    } catch (error) {
      console.error("=== CREATE EVENT ERROR ===");
      console.error("Error:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      // Handle specific error types
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          message: "Validation error", 
          error: error.message,
          details: error.errors 
        });
      }
      
      if (error.name === 'CastError') {
        return res.status(400).json({ 
          message: "Invalid data format", 
          error: error.message 
        });
      }
      
      return res.status(500).json({ 
        message: 'Internal server error',
        error: error.message,
        errorType: error.name
      });
    }
  },

  deleteEvent: async (req, res) => {
    const eventId = req.params.id;
    try {
      const deletedEvent = await eventModel.findByIdAndDelete(eventId);
      if (!deletedEvent) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  getEventAnalysis: async (req, res) => {
    try {
      const organizerId = req.user._id; // Organizer's ID from token/session

      // Find all events organized by this user
      const events = await eventModel.find({ organizer: organizerId });

      if (!events.length) {
        return res.status(404).json({ message: 'No events found for this organizer' });
      }

      // Prepare analysis data
      const analysis = events.map(event => {
        const booked = event.totalTickets - event.remainingTickets;
        const percentageBooked = (booked / event.totalTickets) * 100;

        return {
          title: event.title,
          eventId: event._id,
          percentageBooked: Math.round(percentageBooked),
        };
      });

      res.status(200).json({ analysis });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },


  getEventDetails: async (req, res) => {
    try {
      const eventId = req.params.id;
      const event = await eventModel.findById(eventId);
  
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
  
      res.status(200).json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateEvent: async (req, res) => {
    try {
      const eventId = req.params.id;

      if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return res.status(400).json({ message: "Invalid event ID" });
      }

      const allowedFields = ["title", "description", "date", "time", "location", "category", "totalTickets"];
      const updateData = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      });

      const updatedEvent = await eventModel.findByIdAndUpdate(
        eventId,
        { $set: updateData },
        { new: true }
      );

      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.status(200).json(updatedEvent);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ message: "Error updating event", error: error.message });
    }
  },

   getUserConfirmedBookings : async (req, res) => {
    try {
      const userId = req.user._id;
  
      const confirmedBookings = await bookingModel.find({
        user: userId,
        bookingStatus: "Confirmed"
      }).populate("event"); // populate event details
  
      const events = confirmedBookings.map(booking => booking.event);
  
      res.status(200).json({ events });
    } 
    catch (error) {
      console.error("Error fetching confirmed bookings:", error);
      res.status(500).json({ message: "Error fetching confirmed bookings" });
    }
},
approveEvent: async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status === "approved") {
      return res.status(400).json({ message: "Event is already approved" });
    }

    event.status = "approved";
    await event.save();

    res.status(200).json({ message: "Event approved successfully", event });
  } catch (error) {
    console.error("Error approving event:", error);
    res.status(500).json({ message: "Error approving event" });
  }
},
declineEvent: async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await eventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.status === "Cancelled") {
      return res.status(400).json({ message: "Event is already Cancelled" });
    }

    event.status = "Cancelled";
    await event.save();

    res.status(200).json({ message: "Event declined successfully", event });
  } catch (error) {
    console.error("Error declining event:", error);
    res.status(500).json({ message: "Error declining event" });
  }
}
,
getApprovedEvents: async (req, res) => {
  try {
    const approvedEvents = await eventModel.find({ status: "approved" });

    if (!approvedEvents || approvedEvents.length === 0) {
      return res.status(404).json({ message: "No approved events found" });
    }

    res.status(200).json(approvedEvents);
  } catch (error) {
    console.error("Error fetching approved events:", error);
    res.status(500).json({ message: "Server error" });
  }
},

getAllEvents: async (req, res) => {
  try {
    const events = await eventModel.find();

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }

    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching all events:", error);
    res.status(500).json({ message: "Server error" });
  }
},
}

module.exports = eventController;
