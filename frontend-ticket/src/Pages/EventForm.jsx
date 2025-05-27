import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { eventService } from '../services/api';
import "./EventForm.css";

function EventForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [totalTickets, setTotalTickets] = useState(0);
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isEditing = Boolean(id);

    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            eventService.getEventById(id)
                .then(response => {
                    const event = response.data;
                    setTitle(event.title);
                    setDescription(event.description);
                    setLocation(event.location);
                    setCategory(event.category);
                    setDate(event.date ? new Date(event.date).toISOString().split('T')[0] : "");
                    setTime(event.time);
                    setTotalTickets(event.totalTickets);
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Error fetching event for edit:", err);
                    setError("Failed to load event data for editing. " + err);
                    setLoading(false);
                });
        }
    }, [id, isEditing]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const eventData = { title, description, location, category, date, time, totalTickets };

        try {
            if (isEditing) {
                await eventService.updateEvent(id, eventData);
                navigate('/my-events');
            } else {
                await eventService.createEvent(eventData);
                navigate('/my-events');
            }
        } catch (err) {
            console.error("Error submitting event form:", err);
            setError(err.response?.data?.message || "Failed to save event.");
            setLoading(false);
        }
    };

    

    return (
        <div className="event-container">
            <div className="event-header">
                <h1>{isEditing ? "Edit Event" : "Create New Event"}</h1>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            {loading && isEditing ? (
                <div className="loading">Loading event details...</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="location">Location</label>
                        <input type="text" id="location" value={location} onChange={e => setLocation(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="category">Category</label>
                        <input type="text" id="category" value={category} onChange={e => setCategory(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="date">Date</label>
                        <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="time">Time</label>
                        <input type="time" id="time" value={time} onChange={e => setTime(e.target.value)} required />
                    </div>
                    <div>
                        <label htmlFor="totalTickets">Total Tickets</label>
                        <input type="number" id="totalTickets" value={totalTickets} onChange={e => setTotalTickets(parseInt(e.target.value, 10))} required min="1" />
                    </div>
                    
                    <button type="submit" disabled={loading}>
                        {loading ? "Saving..." : (isEditing ? "Update Event" : "Create Event")}
                    </button>
                </form>
            )}
        </div>
    );
}

export default EventForm;