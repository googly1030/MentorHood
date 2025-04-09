import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Video, Calendar, Info, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import { format, addDays, startOfDay } from 'date-fns';
import { services, Service } from '../pages/userprofile';

const BookingDetails: React.FC = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams<{ serviceId: string }>();
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [selectedTime, setSelectedTime] = useState('');

  const service = services.find((s: Service) => s.id === Number(serviceId));

  useEffect(() => {
    if (!service) {
      navigate('/');
    }
  }, [service, navigate]);

  const nextSevenDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleBooking = () => {
    if (selectedDate && selectedTime) {
      console.log('Booking created:', {
        serviceId,
        serviceName: service?.title,
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        price: service?.price
      });
      navigate('/booking-confirmation');
    }
  };

  if (!service) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section with increased height */}
      <div className="h-72 bg-gradient-to-r from-purple-600 to-blue-500 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        
        {/* Back button moved inside hero section */}
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white hover:text-gray-100 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {/* Main booking card moved up with negative margin */}
        <div className="relative z-10 -mt-32">
          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 border border-gray-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{service.title}</h1>
                <div className="flex items-center gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span>{service.duration}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-purple-600" />
                    <span>{service.type}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                    <span>{service.rating}/5</span>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 px-6 py-3 rounded-xl">
                <span className="text-2xl font-bold text-purple-600">{service.price}</span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="flex items-center gap-2 text-lg font-medium mb-4">
                <Info className="text-purple-600" />
                Session Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium">1-on-1 Video Call</h4>
                    <p className="text-gray-600 text-sm">Private session with screen sharing</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-medium">Preparation</h4>
                    <p className="text-gray-600 text-sm">Get pre-session materials</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl">
              <h2 className="text-xl font-bold mb-8 flex items-center gap-2">
                <Calendar className="text-purple-600" />
                Select Date & Time
              </h2>

              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Date</h3>
                <div className="grid grid-cols-4 md:grid-cols-7 gap-4">
                  {nextSevenDays.map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => setSelectedDate(date)}
                      className={`p-4 rounded-xl text-center transition-all duration-200 transform hover:scale-105 ${
                        format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                          ? 'bg-purple-600 text-white shadow-lg scale-105'
                          : 'bg-gray-50 hover:bg-purple-50 hover:shadow'
                      }`}
                    >
                      <div className="text-sm font-medium">{format(date, 'EEE')}</div>
                      <div className="text-lg font-bold mt-1">{format(date, 'd')}</div>
                      <div className="text-xs mt-1">{format(date, 'MMM')}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Time</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-4 rounded-xl text-center transition-all duration-200 transform hover:scale-105 ${
                        selectedTime === time
                          ? 'bg-purple-600 text-white shadow-lg scale-105'
                          : 'bg-gray-50 hover:bg-purple-50 hover:shadow'
                      }`}
                    >
                      <Clock className={`w-5 h-5 mx-auto mb-2 ${selectedTime === time ? 'text-white' : 'text-purple-600'}`} />
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-8 mb-6 flex items-start gap-3 bg-yellow-50 p-4 rounded-xl">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-1" />
                <p className="text-sm text-yellow-700">
                  By scheduling this session, you agree to our cancellation policy. You can reschedule or cancel up to 24 hours before the session.
                </p>
              </div>

              <button
                disabled={!selectedDate || !selectedTime}
                onClick={handleBooking}
                className={`w-full py-4 rounded-xl text-white text-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
                  selectedDate && selectedTime
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 shadow-lg'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {selectedDate && selectedTime ? (
                  <>Schedule Session • {service.price}</>
                ) : (
                  <>Select date and time to continue</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;