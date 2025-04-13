import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Video, Mail,  Calendar, Star, MapPin, Globe, ChevronLeft, ChevronRight, Loader2, Check } from 'lucide-react';
import { format, addDays, isSameDay } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { API_URL } from '../utils/api';

interface Timezone {
  value: string;
  label: string;
  offset: string;
}

interface TimeRange {
  start: string;
  end: string;
}

interface TimeSlot {
  day: string;
  available: boolean;
  timeRanges: TimeRange[];
}

interface Session {
  sessionName: string;
  description: string;
  duration: string;
  sessionType: string;
  numberOfSessions: string;
  occurrence: string;
  topics: string[];
  allowMenteeTopics: boolean;
  showOnProfile: boolean;
  isPaid: boolean;
  price: string;
  timeSlots: TimeSlot[];
  userId: string;
  mentorName?: string;
  mentorRole?: string;
  mentorCompany?: string;
  mentorImage?: string;
}

const timezones: Timezone[] = [
  {
    value: 'Asia/Kolkata',
    label: 'Chennai, Kolkata, Mumbai, New Delhi',
    offset: 'GMT+5:30'
  },
  {
    value: 'America/Los_Angeles',
    label: 'Pacific Time',
    offset: 'GMT-7:00'
  },
  {
    value: 'America/New_York',
    label: 'Eastern Time',
    offset: 'GMT-4:00'
  },
  {
    value: 'Europe/London',
    label: 'London, United Kingdom',
    offset: 'GMT+1:00'
  },
  {
    value: 'Asia/Singapore',
    label: 'Singapore, Singapore',
    offset: 'GMT+8:00'
  },
  {
    value: 'Australia/Sydney',
    label: 'Sydney, Australia',
    offset: 'GMT+10:00'
  }
];

interface BookingState {
  isLoading: boolean;
  isSuccess: boolean;
  meeting_link: string;
}

// Fix the any type by providing a proper interface
interface BookingResponse {
  date: string;
  time: string;
  timezone: string;
  meeting_link?: string;
  _id: string;
}

const BookingDetails: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const dateSliderRef = useRef<HTMLDivElement>(null);
  const [selectedTimezone, setSelectedTimezone] = useState(timezones[0]);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingState, setBookingState] = useState<BookingState>({
    isLoading: false,
    isSuccess: false,
    meeting_link: ''
  });
  const [isAlreadyBooked, setIsAlreadyBooked] = useState(false);
  const [bookedDetails, setBookedDetails] = useState<{
    date: string;
    time: string;
    timezone: string;
  } | null>(null);
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());

  // Generate dates for next 14 days starting from tomorrow
  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1));

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch(`${API_URL}/sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setSession(data.session);
        } else {
          throw new Error('Failed to fetch session');
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        toast.error('Failed to load session details');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId, navigate]);

  useEffect(() => {
    const checkBookingStatus = async () => {
      if (!sessionId) return;
      
      // Get user details from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userEmail = user.email || '';
      
      if (!userEmail) return; // Skip check if no email available
      
      try {
        const response = await fetch(
          `${API_URL}/bookings/check/${sessionId}/${userEmail}`
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.bookings && data.bookings.length > 0) {
            // Set isAlreadyBooked to true if there are any bookings
            setIsAlreadyBooked(data.bookings.length > 0);
            
            // Store all booked dates in a Set for easy checking
            const bookedDatesSet = new Set<string>(
              data.bookings.map((booking: BookingResponse) => {
                // Extract just the date part for comparison
                return new Date(booking.date).toISOString().split('T')[0];
              })
            );
            setBookedDates(bookedDatesSet);
            
            // Store details of the first booking for display
            if (data.bookings[0]) {
              setBookedDetails({
                date: data.bookings[0].date,
                time: data.bookings[0].time,
                timezone: data.bookings[0].timezone
              });
            }
          }
        }
      } catch (error) {
        console.error("Error checking booking status:", error);
      }
    };

    checkBookingStatus();
  }, [sessionId]);

  const scrollDates = (direction: 'left' | 'right') => {
    if (!dateSliderRef.current) return;
    const scrollAmount = 200; 
    const newScrollLeft = dateSliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    dateSliderRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const getWeekdayKey = (date: Date) => {
    const day = date.toLocaleDateString(undefined, { weekday: 'long' }).toUpperCase();
    return `${day}S`; // Match format like "MONDAYS"
  };
  

  const getAvailableTimeSlots = (date: Date) => {
    if (!session) return [];
  
    const dayKey = getWeekdayKey(date);
    const timeSlot = session.timeSlots.find(slot => slot.day === dayKey);
  
    return timeSlot?.available ? timeSlot.timeRanges : [];
  };
  
  const isDateAvailable = (date: Date) => {
    if (!session) return false;
  
    const dayKey = getWeekdayKey(date);
    const timeSlot = session.timeSlots.find(slot => slot.day === dayKey);
  
    return !!timeSlot?.available;
  };

  const isDateAlreadyBooked = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return bookedDates.has(dateString);
  };

  const handleBooking = async () => {
    if (!session || !selectedDate || !selectedTime) return;

    setBookingState({ ...bookingState, isLoading: true });
    
    try {
      // Get user details from localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userEmail = user.email || '';
      
      // Prepare session data to send with the request
      const sessionData = {
        title: session.sessionName,
        description: session.description,
        duration: session.duration,
        mentor: {
          name: session.mentorName || 'Mentor',
          role: session.mentorRole || '',
          company: session.mentorCompany || '',
          image: session.mentorImage || 'https://via.placeholder.com/50'
        },
        tag: session.sessionType || '',
        _id: sessionId
      };
      
      const response = await fetch(`${API_URL}/bookings/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          date: selectedDate.toISOString(),
          time: selectedTime,
          timezone: selectedTimezone.value,
          email: userEmail,
          session_data: sessionData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to book session');
      }

      const data = await response.json();
      setBookingState({
        isLoading: false,
        isSuccess: true,
        meeting_link: data.meeting_link || ''
      });
      
      toast.success('Booking confirmed! Check your email for details.');
    } catch (error) {
      console.error('Error booking session:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to book session. Please try again.');
      setBookingState({ ...bookingState, isLoading: false });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-700 hover:text-black mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Mentor Profile */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-start gap-6 mb-6">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                  alt="Mentor"
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100"
                />
                <div>
                  <h1 className="text-2xl font-bold mb-2">{session.sessionName}</h1>
                  <p className="text-gray-600 mb-2">{session.description}</p>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Star className="w-5 h-5 fill-current text-yellow-400" />
                    <span>4.9 (1.2k+ sessions)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{session.duration} minutes session</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Video className="w-5 h-5" />
                  <span>Google Meet</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>Remote</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold mb-4">About the Session</h2>
                <p className="text-gray-600 mb-4">
                  {session.description}
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  {session.topics.map((topic, index) => (
                    <li key={index}>{topic}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Right Column - Calendar */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              When should we meet?
            </h2>

            {/* Date Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Select date</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => scrollDates('left')}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => scrollDates('right')}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>

              <div className="relative">
                <div 
                  ref={dateSliderRef}
                  className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {dates.map((date) => {
                    const isAvailable = isDateAvailable(date);
                    const alreadyBooked = isDateAlreadyBooked(date);
                    
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => {
                          if (isAvailable && !alreadyBooked) {
                            setSelectedDate(date);
                            setSelectedTime(''); // Reset time selection when date changes
                          }
                        }}
                        className={`flex-shrink-0 w-[80px] p-3 rounded-lg text-center transition-all duration-200 border ${
                          selectedDate && isSameDay(selectedDate, date)
                            ? 'bg-black text-white border-black'
                            : alreadyBooked
                              ? 'bg-gray-100 border-gray-200 cursor-not-allowed'
                              : isAvailable
                                ? 'hover:bg-gray-50 border-gray-200'
                                : 'opacity-50 cursor-not-allowed border-gray-200'
                        }`}
                        disabled={!isAvailable || alreadyBooked}
                      >
                        <div className="text-xs font-medium">{format(date, 'EEE')}</div>
                        <div className="text-lg font-bold my-0.5">{format(date, 'd')}</div>
                        <div className="text-xs">{format(date, 'MMM')}</div>
                        {alreadyBooked && (
                          <div className="mt-1 text-xs bg-gray-200 rounded-full px-2 py-0.5 text-gray-700">
                            Booked
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Select time of day</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {getAvailableTimeSlots(selectedDate).map((range) => (
                    <button
                      key={`${range.start}-${range.end}`}
                      onClick={() => setSelectedTime(range.start)}
                      className={`p-3 rounded-xl text-center transition-all duration-200 ${
                        selectedTime === range.start
                          ? 'bg-black text-white'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {range.start}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Timezone Dropdown */}
            <div className="mb-8 relative">
              <h3 className="text-lg font-medium mb-4">Timezone</h3>
              <div className="relative">
                <select
                  value={selectedTimezone.value}
                  onChange={(e) => {
                    const newTimezone = timezones.find(tz => tz.value === e.target.value);
                    if (newTimezone) setSelectedTimezone(newTimezone);
                  }}
                  className="w-full p-3 pr-10 rounded-xl border border-gray-200 bg-gray-50 appearance-none"
                >
                  {timezones.map(timezone => (
                    <option key={timezone.value} value={timezone.value}>
                      ({timezone.offset}) {timezone.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>

            {/* Booking Button or Already Booked State */}
            {selectedDate && isDateAlreadyBooked(selectedDate) ? (
              <div className="w-full py-4 rounded-xl bg-gray-100 text-gray-700 text-lg font-medium flex items-center justify-center gap-2 border border-gray-200">
                <Check className="w-5 h-5 text-green-600" />
                Already Booked
              </div>
            ) : (
              <button
                disabled={!selectedDate || !selectedTime || bookingState.isLoading}
                onClick={handleBooking}
                className={`w-full py-4 rounded-xl text-white text-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  selectedDate && selectedTime && !bookingState.isLoading
                    ? 'bg-black hover:bg-gray-800'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {bookingState.isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : selectedDate && selectedTime ? (
                  `Book Session • ${session.isPaid ? `₹${session.price}` : 'Free'}`
                ) : (
                  'Select date and time to continue'
                )}
              </button>
            )}

            {/* Show booking details only if the selected date is booked */}
            {selectedDate && isDateAlreadyBooked(selectedDate) && bookedDetails && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <h3 className="font-medium text-green-800">You've already booked this session</h3>
                </div>
                
                <div className="mb-4 p-3 bg-white rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 text-gray-700 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">
                      {new Date(bookedDetails.date).toLocaleDateString(undefined, {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 mb-1">
                    <Clock className="w-4 h-4" />
                    <span>{bookedDetails.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Globe className="w-3 h-3" />
                    <span>
                      {timezones.find(tz => tz.value === bookedDetails.timezone)?.label || bookedDetails.timezone}
                    </span>
                  </div>
                </div>
                
                <p className="text-green-700 text-sm mb-3">
                  You can find all your booking details in your email inbox.
                </p>
                <div className="flex gap-3 mt-4">
                  <a 
                    href="https://mail.google.com/mail/u/0/#inbox" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      Check Email
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* Success Modal */}
            <AnimatePresence>
              {bookingState.isSuccess && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                >
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-2">Booking Confirmed!</h3>
                      <p className="text-gray-600 mb-6">
                        Your session has been scheduled for {selectedDate && format(selectedDate, 'MMMM d, yyyy')} at {selectedTime}
                      </p>
                      <div className="w-full p-4 bg-gray-50 rounded-xl mb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Mail className="w-5 h-5 text-gray-700" />
                          <span className="font-medium">Booking Details Sent</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">
                          We've sent all the meeting details to your email. Please check your inbox for the meeting link and further instructions.
                        </p>
                        <a 
                          href="https://mail.google.com/mail/u/0/#inbox" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          Check Email
                        </a>
                      </div>
                      {/* <div className="w-full p-4 bg-gray-50 rounded-xl mb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <Video className="w-5 h-5 text-gray-700" />
                          <span className="font-medium">Meeting Link</span>
                        </div>
                        <a 
                          href={bookingState.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm break-all"
                        >
                          {bookingState.meeting_link}
                        </a>
                      </div> */}

                      <button
                        onClick={() => navigate('/')}
                        className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors"
                      >
                        Back to Home
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;