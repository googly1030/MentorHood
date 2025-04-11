import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Video, Calendar, Star, MapPin, Globe, ChevronLeft, ChevronRight, ChevronDown, Loader2, Check } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface Timezone {
  value: string;
  label: string;
  offset: string;
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
  meetingLink: string;
}

const BookingDetails: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const dateSliderRef = useRef<HTMLDivElement>(null);
  const [selectedTimezone, setSelectedTimezone] = useState(timezones[0]);
  const [isTimezoneOpen, setIsTimezoneOpen] = useState(false);
  const [bookingState, setBookingState] = useState<BookingState>({
    isLoading: false,
    isSuccess: false,
    meetingLink: ''
  });

  const timeSlots = [
    '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  // Generate dates for next 60 days
  const dates = Array.from({ length: 60 }, (_, i) => addDays(new Date(), i));

  const scrollDates = (direction: 'left' | 'right') => {
    if (!dateSliderRef.current) return;
    const scrollAmount = 200; 
    const newScrollLeft = dateSliderRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
    dateSliderRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const handleBooking = async () => {
    setBookingState({ ...bookingState, isLoading: true });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setBookingState({
      isLoading: false,
      isSuccess: true,
      meetingLink: 'https://meet.google.com/abc-defg-hij'
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
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
                  <h1 className="text-2xl font-bold mb-2">Michael Chen</h1>
                  <p className="text-gray-600 mb-2">Engineering Manager at Meta</p>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Star className="w-5 h-5 fill-current text-yellow-400" />
                    <span>4.9 (1.2k+ sessions)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>45 minutes session</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Video className="w-5 h-5" />
                  <span>Google Meet</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>Seattle, WA</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-xl font-bold mb-4">About the Session</h2>
                <p className="text-gray-600 mb-4">
                  Get personalized guidance on software architecture, leadership, and career growth in tech. 
                  Topics we can cover:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                  <li>System design and architecture principles</li>
                  <li>Engineering leadership and team management</li>
                  <li>Career progression in tech</li>
                  <li>Interview preparation for senior roles</li>
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
                  {dates.map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 w-[80px] p-3 rounded-lg text-center transition-all duration-200 border ${
                        selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                          ? 'bg-black text-white border-black'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="text-xs font-medium">{format(date, 'EEE')}</div>
                      <div className="text-lg font-bold my-0.5">{format(date, 'd')}</div>
                      <div className="text-xs">{format(date, 'MMM')}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Select time of day</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`p-3 rounded-xl text-center transition-all duration-200 ${
                      selectedTime === time
                        ? 'bg-black text-white'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Timezone Dropdown */}
            <div className="mb-8 relative">
              <h3 className="text-lg font-medium mb-4">Timezone</h3>
              <div className="w-full flex items-center p-3 rounded-xl border border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900">
                      (GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Button and Modal */}
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
                'Book Session • ₹1,000'
              ) : (
                'Select date and time to continue'
              )}
            </button>

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
                          <Video className="w-5 h-5 text-gray-700" />
                          <span className="font-medium">Meeting Link</span>
                        </div>
                        <a 
                          href={bookingState.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 text-sm break-all"
                        >
                          {bookingState.meetingLink}
                        </a>
                      </div>

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