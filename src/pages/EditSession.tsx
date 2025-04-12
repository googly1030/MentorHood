import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
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
  occurrence: string;
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

// const TOPICS = [
//   'UX Design', 'Product Management', 'Web Development',
//   'Mobile Development', 'Data Science', 'Marketing',
//   'Leadership', 'Career Development', 'Entrepreneurship'
// ];

const OCCURRENCE_OPTIONS = [
  'Repeats every week',
  'Repeats every 2 weeks',
  'Repeats every month',
  'Custom'
];

const DAYS = [
  'SUNDAYS', 'MONDAYS', 'TUESDAYS', 'WEDNESDAYS',
  'THURSDAYS', 'FRIDAYS', 'SATURDAYS'
];

function EditSession() {
  const navigate = useNavigate();
  const { sessionId } = useParams();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    sessionName: '',
    description: '',
    duration: '30',
    sessionType: 'one-on-one',
    numberOfSessions: '1',
    occurrence: OCCURRENCE_OPTIONS[0],
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
        const response = await fetch(`${API_URL}/api/sessions/${sessionId}`);
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
            occurrence: OCCURRENCE_OPTIONS[0],
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

      const response = await fetch(`${API_URL}/api/sessions/update/${sessionId}`, {
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
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        const response = await fetch(`${API_URL}/api/sessions/delete/${sessionId}`, {
          method: 'POST',
        });

        if (!response.ok) {
          throw new Error('Failed to delete session');
        }

        const result = await response.json();
        if (result.status === 'success') {
          navigate('/mentor-dashboard/');
        } else {
          throw new Error('Failed to delete session');
        }
      } catch (error) {
        console.error('Error deleting session:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate('/mentor-dashboard/')}
            className="flex items-center gap-2 text-gray-600 hover:text-[#4937e8] transition-colors duration-300"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 hover:text-red-800 transition-colors duration-300"
          >
            <Trash2 size={20} />
            Delete Session
          </button>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent mb-4">
            Edit Session
          </h1>
          <p className="text-gray-600">Update your mentoring session details and availability</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                ${step === stepNum ? 'bg-[#4937e8] text-white' : 
                  step > stepNum ? 'bg-[#4338ca] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-20 h-1 ${step > stepNum ? 'bg-[#4338ca]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {step === 1 && (
            <SessionForm
              formData={formData}
              setFormData={setFormData}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <AvailabilityForm
              timeSlots={timeSlots}
              setTimeSlots={setTimeSlots}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <ReviewForm
              formData={formData}
              timeSlots={timeSlots}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
              finalText='Edit'
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default EditSession; 