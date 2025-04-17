import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Trash2, CheckCircle, Calendar, Settings, MessageSquare, Sparkles, AlertTriangle } from 'lucide-react';
import { SessionForm, AvailabilityForm, ReviewForm } from './CreateSession';
import { getUserData } from '../utils/auth';
import { toast } from 'sonner';
import { API_URL } from '../utils/api';

interface FormData {
  sessionName: string;
  description: string;
  duration: string;
  sessionType: string;
  numberOfSessions: string;
  topics: string[];
  allowMenteeTopics: boolean;
  showOnProfile: boolean;
  isPaid: boolean;
  price: string;
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

const DAYS = [
  'SUNDAYS', 'MONDAYS', 'TUESDAYS', 'WEDNESDAYS',
  'THURSDAYS', 'FRIDAYS', 'SATURDAYS'
];

function EditSession() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Initialize step from URL parameter, default to 1 if not provided
  const [step, setStep] = useState(parseInt(searchParams.get('step') || '1'));
  const [formData, setFormData] = useState<FormData>({
    sessionName: '',
    description: '',
    duration: '30',
    sessionType: 'one-on-one',
    numberOfSessions: '1',
    topics: [],
    allowMenteeTopics: false,
    showOnProfile: true,
    isPaid: false,
    price: '0'
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    DAYS.map(day => ({
      day,
      available: false,
      timeRanges: []
    }))
  );

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/sessions/${sessionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const data = await response.json();
        if (data.status === 'success') {
          const session = data.session;
          setFormData({
            sessionName: session.sessionName,
            description: session.description || '',
            duration: session.duration.toString(),
            sessionType: session.sessionType,
            numberOfSessions: '1',
            topics: session.topics || [],
            allowMenteeTopics: session.allowMenteeTopics || false,
            showOnProfile: session.showOnProfile || true,
            isPaid: session.isPaid || false,
            price: session.price?.toString() || '0'
          });
          setTimeSlots(session.timeSlots || DAYS.map(day => ({
            day,
            available: false,
            timeRanges: []
          })));
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        toast.error('Failed to load session data');
        navigate('/mentor-dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId, navigate]);

  const handleSubmit = async () => {
    try {
      const userData = getUserData();
      if (!userData) {
        toast.error('Please login to edit session');
        navigate('/login');
        return;
      }

      const sessionData = {
        ...formData,
        userId: userData.userId,
        timeSlots: timeSlots
      };

      const response = await fetch(`${API_URL}/sessions/update/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error('Failed to update session');
      }

      const result = await response.json();
      if (result.status === 'success') {
        toast.success('Session updated successfully!');
        navigate('/mentor-dashboard/');
      } else {
        throw new Error('Failed to update session');
      }
    } catch (error) {
      console.error('Error updating session:', error);
      toast.error('Failed to update session. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_URL}/sessions/delete/${sessionId}`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to delete session');
      }

      const result = await response.json();
      if (result.status === 'success') {
        toast.success('Session deleted successfully');
        navigate('/mentor-dashboard/');
      } else {
        throw new Error('Failed to delete session');
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete session. Please try again.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-2/5 h-1/3 bg-indigo-100/40 rounded-full filter blur-3xl opacity-60 z-0"></div>
      <div className="absolute bottom-0 left-0 w-2/5 h-1/3 bg-blue-100/40 rounded-full filter blur-3xl opacity-60 z-0"></div>
      <div className="absolute top-1/3 left-1/4 w-1/5 h-1/5 bg-purple-100/30 rounded-full filter blur-3xl opacity-60 z-0"></div>
      
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
      
      <div className="relative z-10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with enhanced styling */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
            <button
              onClick={() => navigate('/mentor-dashboard/')}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors duration-300 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-100 hover:shadow-md w-fit"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors duration-300 px-4 py-2 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-red-100 hover:shadow-md w-fit md:ml-auto"
            >
              <Trash2 size={18} />
              <span className="font-medium">Delete Session</span>
            </button>
          </div>

          <div className="mb-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-4 border border-indigo-100/50 shadow-sm">
                <Settings className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium text-indigo-700">Session Management</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-700">
                Edit Your Session
              </h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Update your mentoring session details and availability to keep your profile current and attract the right mentees
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-10 max-w-3xl mx-auto px-4">
            <div className="w-full flex items-center">
              {[
                { num: 1, label: "Session Details", icon: <MessageSquare className="w-5 h-5" /> },
                { num: 2, label: "Availability", icon: <Calendar className="w-5 h-5" /> },
                { num: 3, label: "Review", icon: <CheckCircle className="w-5 h-5" /> }
              ].map((stepItem, i) => (
                <div key={stepItem.num} className="flex-1 relative z-10">
                  <div className="flex flex-col items-center">
                    <button 
                      className={`w-14 h-14 rounded-full flex items-center justify-center mb-2 relative
                        ${step === stepItem.num 
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' 
                          : step > stepItem.num 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-100 text-gray-500'}
                        transition-all duration-300 hover:shadow-md
                      `}
                      onClick={() => {
                        if (step > stepItem.num) {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setStep(stepItem.num);
                        }
                      }}
                      disabled={step < stepItem.num}
                    >
                      {step > stepItem.num ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        stepItem.icon
                      )}
                      
                      {/* Pulsing effect for current step */}
                      {step === stepItem.num && (
                        <span className="absolute w-full h-full rounded-full bg-indigo-500/20 animate-ping"></span>
                      )}
                    </button>
                    
                    <span className={`text-sm font-medium ${
                      step >= stepItem.num ? 'text-indigo-700' : 'text-gray-500'
                    }`}>{stepItem.label}</span>
                  </div>
                  
                  {i < 2 && (
                    <div className="relative">
                      <div className={`absolute top-7 h-0.5 w-full left-1/2 -z-10 bg-gray-200`}></div>
                      <div 
                        className={`absolute top-7 h-0.5 left-0 -z-10 bg-indigo-600 transition-all duration-700 ease-in-out`}
                        style={{ width: step > i+1 ? '100%' : step === i+1 ? '50%' : '0%' }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main content card with enhanced styling */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden mb-10">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium">Loading session data...</p>
              </div>
            ) : (
              <>
                {step === 1 && (
                  <SessionForm
                    formData={formData}
                    setFormData={setFormData}
                    onNext={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setStep(2);
                    }}
                  />
                )}

                {step === 2 && (
                  <AvailabilityForm
                    timeSlots={timeSlots}
                    setTimeSlots={setTimeSlots}
                    onBack={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setStep(1);
                    }}
                    onNext={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setStep(3);
                    }}
                  />
                )}

                {step === 3 && (
                  <ReviewForm
                    formData={formData}
                    timeSlots={timeSlots}
                    onBack={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setStep(2);
                    }}
                    onSubmit={handleSubmit}
                    finalText='Update'
                  />
                )}
              </>
            )}
          </div>
          
          {/* Tips and help section */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/60 rounded-xl p-6 border border-indigo-100 shadow-sm">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-indigo-800 text-lg mb-2">Tips for a Successful Session</h3>
                  <ul className="space-y-2 text-indigo-700/90 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>Use a descriptive session name that clearly conveys the value you'll provide</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>Select topics that align with your expertise to attract the right mentees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span>Ensure your availability is up-to-date to avoid scheduling conflicts</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="mb-5 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Session</h3>
              <p className="text-gray-600">
                Are you sure you want to delete this session? This action cannot be undone and all associated data will be permanently removed.
              </p>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Delete Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditSession;