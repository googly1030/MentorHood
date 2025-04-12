import { Settings2, Plus, Calendar, Users, Clock, DollarSign, Award, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUserData } from '../utils/auth';
import { toast } from 'sonner';
import { API_URL } from '../utils/api';

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
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = {
    totalSessions: 14,
    completedSessions: 8,
    upcomingSessions: 2,
    totalEarnings: 480,
    averageRating: 4.8
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const userData = getUserData();
        if (!userData) {
          toast.error('Please login to view sessions');
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_URL}/api/sessions/mentor/${userData.userId}`);
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

  // Filter sessions based on search query
  const filteredSessions = sessions.filter(session => 
    session.sessionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top header section with gradient background */}
      <div className="bg-gradient-to-r from-gray-700/90 to-gray-600/90 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Mentor Dashboard</h1>
              <p className="text-white/80">
                Manage your sessions and help shape the future of aspiring developers.
              </p>
            </div>
            <div className="flex items-center gap-3">
            <button 
                onClick={() => navigate('/create-ama-session')}
                className="bg-white hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-lg flex items-center gap-2 transition-all font-medium"
              >
                <Plus size={18} />
                CreateAMASession
              </button>
              <button 
                onClick={() => navigate('/create-session')}
                className="bg-white hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-lg flex items-center gap-2 transition-all font-medium"
              >
                <Plus size={18} />
                Create Session
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#4937e8]">
              <Calendar size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalSessions}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <Users size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-800">{stats.completedSessions}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
              <Clock size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-gray-800">{stats.upcomingSessions}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
              <DollarSign size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Earnings</p>
              <p className="text-2xl font-bold text-gray-800">${stats.totalEarnings}</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4 border border-gray-100">
            <div className="w-12 h-12 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
              <Award size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Rating</p>
              <p className="text-2xl font-bold text-gray-800">{stats.averageRating}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Session management area */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Your Mentoring Sessions</h2>
                <p className="text-gray-500 text-sm mt-1">Create and manage your mentorship offerings</p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Search bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search sessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4937e8]/30 w-full sm:w-56"
                  />
                  <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                </div>
                
                {/* Filter tabs */}
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button 
                    onClick={() => setActiveTab('active')}
                    className={`px-4 py-2 text-sm font-medium ${
                      activeTab === 'active' 
                        ? 'bg-gray-700 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Active
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sessions list */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-700"></div>
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Calendar size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">No sessions found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                {searchQuery 
                  ? "No sessions match your search criteria" 
                  : "You haven't created any sessions yet. Create your first session to start mentoring."}
              </p>
              <button
                onClick={() => navigate('/create-session')}
                className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-2 rounded-lg inline-flex items-center gap-2 transition-all"
              >
                <Plus size={18} />
                Create New Session
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {filteredSessions.map((session) => (
                <div 
                  key={session.sessionId}
                  className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-default"
                >
                  {/* Session header with colored accent based on session type */}
                  <div className={`h-2 ${session.sessionType === 'One-on-One' ? 'bg-gray-700' : 'bg-gray-600'}`}></div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold">
                          {session.sessionName.charAt(0)}
                        </div>
                        <h3 className="font-bold text-gray-800 text-lg">
                          {session.sessionName}
                        </h3>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/sessions/${session.sessionId}/edit`);
                        }}
                        className="text-gray-400 hover:text-gray-700 transition-colors"
                        aria-label="Edit session settings"
                      >
                        <Settings2 size={18} />
                      </button>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{session.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="bg-blue-100 text-[#4937e8] px-3 py-1 rounded-full text-sm font-medium">
                        {session.duration} mins
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
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
                        {session.topics.slice(0, 3).map((topic, index) => {
                          const colors = [
                            'bg-gray-100 text-gray-700',
                            'bg-gray-50 text-gray-600',
                            'bg-gray-100 text-gray-700',
                            'bg-gray-50 text-gray-600'
                          ];
                          const colorIndex = index % colors.length;
                          return (
                            <span key={index} className={`px-3 py-1 rounded-full text-sm font-medium ${colors[colorIndex]}`}>
                              {topic}
                            </span>
                          );
                        })}
                        {session.topics.length > 3 && (
                          <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                            +{session.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Available slots preview - showing limited info with expand option */}
                    <div className="mt-auto">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Available Time Slots</h4>
                      <div className="space-y-1">
                        {session.timeSlots
                          .filter(slot => slot.available && slot.timeRanges.length > 0)
                          .slice(0, 2)
                          .map((slot, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="w-20 font-medium">{slot.day}</span>
                              <div className="flex flex-wrap gap-1">
                                {slot.timeRanges.slice(0, 1).map((range, idx) => (
                                  <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-xs">
                                    {range.start} - {range.end}
                                  </span>
                                ))}
                                {slot.timeRanges.length > 1 && (
                                  <span className="text-xs text-gray-500 flex items-center">
                                    +{slot.timeRanges.length - 1} more
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        
                        {session.timeSlots.filter(slot => slot.available && slot.timeRanges.length > 0).length > 2 && (
                          <span className="text-xs text-gray-700 font-medium flex items-center mt-1">
                            +{session.timeSlots.filter(slot => slot.available && slot.timeRanges.length > 0).length - 2} more days available
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* View details button */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button 
                        className="w-full flex items-center justify-center gap-1 text-sm font-medium text-gray-700 hover:text-gray-600 transition-colors"
                        onClick={() => navigate(`/sessions/${session.sessionId}/edit`)}
                      >
                        View Session Details
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;