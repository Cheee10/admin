import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput, EventClickArg } from "@fullcalendar/core";
import MDriver from "../components/common/Modal";
import { useModal } from "../hooks/useModal";
import axios from "axios";

interface Booking {
  _id: string;
  title: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  active: number;
}

interface CalendarEvent extends EventInput {
  extendedProps: {
    booking: Booking;
  };
}

const Calendar: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupedEvents, setGroupedEvents] = useState<{ [key: string]: CalendarEvent[] }>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  

  const parseTime = (timeStr: string) => {
    // Parse time in format "2:00 PM"
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 24-hour format
    let hours24 = hours;
    if (period === 'PM' && hours !== 12) {
      hours24 = hours + 12;
    } else if (period === 'AM' && hours === 12) {
      hours24 = 0;
    }
    
    return { hours: hours24, minutes };
  };

  const parseDate = (dateStr: string, timeStr: string) => {
    // Parse the date string (e.g., "Wed Apr 02 2025")
    const date = new Date(dateStr);
    
    // Parse the time string (e.g., "2:00 PM")
    const { hours, minutes } = parseTime(timeStr);
    
    // Set the time on the date
    date.setHours(hours, minutes);
    
    return date;
  };

  const groupEventsByDate = (events: CalendarEvent[]) => {
    const grouped: { [key: string]: CalendarEvent[] } = {};
    
    events.forEach(event => {
      const date = new Date(event.start as string).toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(event);
    });
    
    return grouped;
  };

  const processEvents = (events: CalendarEvent[]) => {
    const grouped = groupEventsByDate(events);
    setGroupedEvents(grouped);
    const processedEvents: CalendarEvent[] = [];
    
    Object.entries(grouped).forEach(([date, dayEvents]) => {
      // Sort events by time
      dayEvents.sort((a, b) => {
        const timeA = a.extendedProps.booking.time;
        const timeB = b.extendedProps.booking.time;
        return timeA.localeCompare(timeB);
      });
      
      // Add first two events
      processedEvents.push(...dayEvents.slice(0, 2));
      
      // If there are more events, add a "more events" indicator
      if (dayEvents.length > 2) {
        processedEvents.push({
          id: `more-${date}`,
          title: `+${dayEvents.length - 2} more`,
          start: date,
          extendedProps: {
            booking: {
              _id: `more-${date}`,
              title: `+${dayEvents.length - 2} more appointments`,
              firstName: '',
              lastName: '',
              phone: '',
              email: '',
              date: date,
              time: '',
              active: 1
            }
          },
          className: 'more-events-indicator',
          display: 'background',
          interactive: false, // <-- Add this
  editable: false,
        });
      }
    });
    
    return processedEvents;
  };

  const fetchBookings = async () => {
    try {
      const response = await axios.get("http://192.168.1.45:5000/api/booking");
      const bookings = response.data;
      
      // Transform bookings into calendar events
      const calendarEvents = bookings.map((booking: Booking) => {
        const eventDate = parseDate(booking.date, booking.time);
        
        return {
          id: booking._id,
          title: booking.title.charAt(0).toUpperCase() + booking.title.slice(1),
          start: eventDate.toISOString(),
          extendedProps: {
            booking: booking
          }
        };
      });
      
      // Process events to limit to 2 per day
      const processedEvents = processEvents(calendarEvents);
      setEvents(processedEvents);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    if (clickInfo.event.classNames.includes('more-events-indicator')) {
      return; // Ignore clicks on the more events indicator
    }
    
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    openModal();
  };

  const formatDate = (dateStr: string, timeStr: string) => {
    const date = parseDate(dateStr, timeStr);
    return date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="custom-calendar">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            eventClick={handleEventClick}
            eventContent={renderEventContent}
            loading={(isLoading) => setLoading(isLoading)}
            eventClassNames={(arg) => {
              if (arg.event.classNames.includes('more-events-indicator')) {
                return 'more-events-indicator';
              }
              return '';
            }}
            eventDisplay="block"
            eventTimeFormat={{
              hour: 'numeric',
              minute: '2-digit',
              meridiem: 'short'
            }}
            eventMinHeight={60}
            eventMinWidth={150}
            slotMinTime="00:00:00"
            slotMaxTime="24:00:00"
            allDaySlot={false}
            expandRows={true}
            height="auto"
            contentHeight="auto"
            dayMaxEvents={true}
            eventOrder="start,title"
            eventConstraint={{
              startTime: '00:00',
              endTime: '24:00',
              overlap: false
            }}
          />
        </div>
        <MDriver title="Booking Details" isOpen={isOpen}>
          <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
            <div className="mt-8">
              {selectedEvent && selectedEvent.extendedProps.booking && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Title
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                      {selectedEvent.extendedProps.booking.title}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Name
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {`${selectedEvent.extendedProps.booking.firstName} ${selectedEvent.extendedProps.booking.middleName || ''} ${selectedEvent.extendedProps.booking.lastName}`}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Contact Information
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedEvent.extendedProps.booking.phone}
                    </p>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {selectedEvent.extendedProps.booking.email}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Date and Time
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {formatDate(
                        selectedEvent.extendedProps.booking.date,
                        selectedEvent.extendedProps.booking.time
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
              <button
                onClick={closeModal}
                type="button"
                className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
              >
                Close
              </button>
            </div>
          </div>
          </MDriver>
          
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const booking = eventInfo.event.extendedProps.booking;
  
  if (eventInfo.event.classNames.includes('more-events-indicator')) {
    return (
      <div className="event-fc-color flex items-center justify-center fc-event-main ">
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
      </div>
    );
  }

  const time = booking.time;
  const name = `${booking.firstName} ${booking.lastName}`;

  return (
    <div className="event-fc-color flex flex-col fc-event-main p-2 rounded-lg bg-white shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div className="fc-event-time text-xs font-medium text-gray-500 dark:text-gray-400">
          {time}
        </div>
        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
      </div>
      <div className="mt-1">
        <div className="fc-event-title text-sm font-semibold text-gray-900 dark:text-white">
          {eventInfo.event.title}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {name}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
