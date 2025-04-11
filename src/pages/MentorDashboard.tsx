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
              <div 
                key={session.sessionId} 
                onClick={() => navigate(`/sessions/${session.sessionId}/edit`)}
                className="flex flex-col justify-between border border-gray-200 rounded-lg p-6 bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#4937e8] flex items-center justify-center text-white font-bold">
                        {session.sessionName.charAt(0)}
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg">{session.sessionName}</h3>
                    </div>
                    <button className="text-gray-400 hover:text-[#4937e8] transition-colors">
                      <Settings2 size={20} />
                    </button>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{session.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-[#4937e8] px-3 py-1 rounded-full text-sm font-medium">
                      {session.duration} mins
                    </span>
                    <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                      {session.sessionType}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${session.isPaid ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                      {session.isPaid ? `$${session.price}` : 'Free'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <span className="text-sm font-medium">{session.occurrence}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm">{session.numberOfSessions} session(s)</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Topics</h4>
                    <div className="flex flex-wrap gap-2">
                      {session.topics.map((topic, index) => {
                        const colors = [
                          'bg-blue-100 text-blue-600',
                          'bg-purple-100 text-purple-600',
                          'bg-pink-100 text-pink-600',
                          'bg-green-100 text-green-600',
                          'bg-yellow-100 text-yellow-600',
                          'bg-indigo-100 text-indigo-600',
                          'bg-red-100 text-red-600',
                          'bg-teal-100 text-teal-600'
                        ];
                        const colorIndex = index % colors.length;
                        return (
                          <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${colors[colorIndex]}`}>
                            {topic}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Available Time Slots</h4>
                    <div className="space-y-1">
                      {session.timeSlots.map((slot, index) => (
                        slot.available && slot.timeRanges.length > 0 && (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="w-20 font-medium">{slot.day}</span>
                            <span className="flex flex-col">
                              {slot.timeRanges.map((range, idx) => (
                                <span key={idx} className="bg-gray-100 px-2 py-1 rounded">
                                  {range.start} - {range.end}
                                </span>
                              ))}
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
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