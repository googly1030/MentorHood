import { Settings2, Plus, Share2, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserData } from '../utils/auth';
import { toast } from 'sonner';

interface Session {
  sessionId: string;
  sessionName: string;
  description: string;
  duration: number;
  sessionType: string;
  numberOfSessions: number;
  occurrence: string;
  topics: string[];
  allowMenteeTopics: boolean;
  showOnProfile: boolean;
  isPaid: boolean;
  price: number;
  timeSlots: {
    day: string;
    available: boolean;
    timeRanges: {
      start: string;
      end: string;
    }[];
  }[];
  userId: string;
  created_at: string;
  updated_at: string;
}

function Dashboard() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const userData = getUserData();
        if (!userData) {
          toast.error('Please login to view sessions');
          navigate('/login');
          return;
        }

        const response = await fetch(`http://localhost:9000/api/sessions/mentor/${userData.userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }

        const data = await response.json();
        setSessions(data.sessions);
      } catch (error) {
        toast.error('Failed to load sessions');
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Mentor Dashboard</h1>
        
        <p className="text-gray-700 mb-2">
          Welcome to Mentor-Hood! Manage your mentoring sessions and availability here.
          Help shape the future of aspiring developers.
        </p>

        <div className="flex items-center gap-2 mb-8">
          <p className="text-gray-700">Your current timezone:</p>
          <span className="font-medium text-[#4937e8]">Asia/Singapore</span>
          <button className="text-[#4937e8] hover:text-[#4338ca] font-medium">Change</button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Mentoring Sessions</h2>
          <button 
            onClick={() => navigate('/create-session')}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} />
            Create Session Type
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4937e8]"></div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't created any sessions yet.</p>
            <button 
              onClick={() => navigate('/create-session')}
              className="bg-[#4937e8] hover:bg-[#4338ca] text-white px-6 py-3 rounded-lg flex items-center gap-2 mx-auto"
            >
              <Plus size={20} />
              Create Your First Session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div key={session.sessionId} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-800">{session.sessionName}</h3>
                  </div>
                  <button className="text-gray-400 hover:text-[#4937e8]">
                    <Settings2 size={20} />
                  </button>
                </div>
                <p className="text-gray-600 mb-2">{session.description}</p>
                <div className="text-gray-600 mb-2">
                  {session.duration} mins • {session.sessionType} • {session.isPaid ? `$${session.price}` : 'Free'}
                </div>
                <div className="text-gray-600 mb-2">
                  {session.occurrence} • {session.numberOfSessions} session(s)
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {session.topics.map((topic, index) => (
                    <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="text-gray-600 mb-4">
                  <p className="font-medium mb-1">Available Time Slots:</p>
                  {session.timeSlots.map((slot, index) => (
                    slot.available && slot.timeRanges.length > 0 && (
                      <div key={index} className="text-sm">
                        {slot.day}: {slot.timeRanges.map(range => `${range.start} - ${range.end}`).join(', ')}
                      </div>
                    )
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-2 text-gray-600 hover:text-[#4937e8]">
                    <Copy size={18} />
                    Copy Link
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-[#4937e8]">
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;