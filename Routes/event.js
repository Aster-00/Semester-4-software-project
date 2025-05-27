// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const userController = require("../Controllers/userController");
const eventController = require("../Controllers/eventController");
const authorizationMiddleware = require("../Middleware/authorizationMiddleware");
const authenticationMiddleware = require("../Middleware/authenticationMiddleware");

// Public routes (no authentication required)
router.get('/', eventController.getApprovedEvents);
router.get('/:id', eventController.getEventDetails);

// Protected routes (authentication + authorization required)
router.get('/all', authenticationMiddleware, authorizationMiddleware('Admin'), eventController.getAllEvents);
router.post('/', authenticationMiddleware, authorizationMiddleware(['Organizer']), eventController.createEvent);
router.patch('/approveevent/:eventId', authenticationMiddleware, authorizationMiddleware(['Admin']), eventController.approveEvent);
router.patch('/decline/:eventId', authenticationMiddleware, authorizationMiddleware(['Admin']), eventController.declineEvent);
router.delete('/:id', authenticationMiddleware, authorizationMiddleware(['Organizer','Admin']), eventController.deleteEvent);
router.put('/:id', authenticationMiddleware, authorizationMiddleware(['Admin', 'Organizer']), eventController.updateEvent);
module.exports = router;
