import EventCard from '../Components/EventCard';
import { useEffect, useState } from 'react';
import './MyEventsPage.css';
import { useNavigate, Link } from 'react-router-dom';
import { eventService } from '../services/api';


function MyEventsPage() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Function to fetch events
        const fetchEvents = async () => {
            try {
                setLoading(true);
                const response = await eventService.getUserEvents();
                console.log("Full API Response:", response);
                console.log("Response data:", response.data);
                
                // Check if response.data.events exists (common API pattern)
                const eventsData = response.data.events || response.data;
                
                // Log the events data structure
                console.log("Events data structure:", eventsData);
                
                // Ensure we're working with an array
                if (Array.isArray(eventsData)) {
                    console.log("Number of events found:", eventsData.length);
                    setEvents(eventsData);
                } else {
                    console.warn("Events data is not an array:", eventsData);
                    // If it's not an array, check if it's a single event object
                    if (eventsData && typeof eventsData === 'object') {
                        setEvents([eventsData]);
                    } else {
                    setEvents([]); 
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching events:', err);
                console.error('Error response:', err.response);
                // Handle unauthorized or other errors
                if (err.response?.status === 403) {
                    setError('You are not authorized to view these events. Only organizers can access this page.');
                } else if (err.response?.status === 401) {
                    setError('Please log in to view your events.');
                    // Optionally redirect to login
                    navigate('/login');
                } else {
                    setError('Failed to load events. Error: ' + (err.response?.data?.message || err.message));
                }
                setLoading(false);
            }
        };

        fetchEvents();
    }, [navigate]);

    const handleEventDeleted = (deletedEventId) => {
        setEvents(prevEvents => prevEvents.filter(event => event._id !== deletedEventId));
    };

    // Loading state
    if (loading) {
        return <div className="loading">Loading events...</div>;
    }

    // Error state
    if (error) {
        return <div className="error-message">{error}</div>;
    }

    // Empty state
    if (events.length === 0) {
        return (
            <div className="my-events-container">
                <div className="page-header">
                <h1>My Events</h1>
                    <div className="page-header-actions">
                        <Link to="/my-events/new" className="create-event-button">
                            Create New Event
                        </Link>
                        <Link to="/my-events/analytics" className="analytics-button page-header-button">
                            View Analytics
                        </Link>
                    </div>
                </div>
                <p className="no-events">You haven't created any events yet. Click "Create New Event" to get started!</p>
            </div>
        );
    }

    // Render events
    return (
        <div className="my-events-container">
            <div className="page-header">
                <h1>My Events</h1>
                <div className="page-header-actions">
                    <Link to="/my-events/new" className="create-event-button">
                        Create New Event
                    </Link>
                    <Link to="/my-events/analytics" className="analytics-button page-header-button">
                        View Analytics
                    </Link>
                </div>
            </div>
            <div className="events-grid">
                {events.map(event => (
                    <EventCard 
                        key={event._id}
                        id={event._id}
                        title={event.title}
                        description={event.description}
                        location={event.location}
                        date={new Date(event.date).toLocaleDateString()}
                        organizerId={event.organizer}
                        image={event.image}
                        onDelete={handleEventDeleted}
                    />
                ))}
            </div>
        </div>
    );
}

export default MyEventsPage;