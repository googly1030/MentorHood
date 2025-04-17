import { Settings2, Plus, Calendar , ChevronRight, Search, ArrowUpRight } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');



  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const userData = getUserData();
        if (!userData) {
          toast.error('Please login to view sessions');
          navigate('/login');
          return;
        }

        const response = await fetch(`${API_URL}/sessions/mentor/${userData.userId}`);
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
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Decorative Backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/40 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-100/20 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
      
      <div className="relative z-10">
        {/* Top header section with gradient background */}
        <div className="bg-gradient-to-r from-[#4937e8] to-[#4338ca] text-white py-12 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/20 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full translate-y-1/3 -translate-x-1/3"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
              <div>
                <div className="inline-flex px-3 py-1 bg-white/10 text-white/90 rounded-full text-sm font-medium mb-3 backdrop-blur-sm border border-white/20">
                  Mentor Portal
                </div>
                <h1 className="text-3xl font-bold mb-2">Your Mentoring Dashboard</h1>
                <p className="text-white/80 max-w-2xl">
                  Manage your sessions and help shape the future of aspiring developers through personalized mentorship.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => navigate('/create-ama-session')}
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all font-medium backdrop-blur-sm"
                >
                  <Plus size={18} />
                  Create AMA Session
                </button>
                <button 
                  onClick={() => navigate('/create-session')}
                  className="bg-white hover:bg-gray-50 text-[#4937e8] px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30"
                >
                  <Plus size={18} />
                  Create Session
                </button>
              </div>
            </div>
          </div>
        </div>


        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3 space-y-8">
              {/* Session management area */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-gray-200/80 transition-colors">
                <div className="border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Your Mentoring Sessions</h2>
                      <p className="text-gray-500 text-sm mt-1">Create and manage your mentorship offerings</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
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
                    
                    </div>
                  </div>
                </div>
                
                {/* Sessions list */}
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="w-12 h-12 rounded-full border-t-2 border-b-2 border-[#4937e8] animate-spin"></div>
                  </div>
                ) : filteredSessions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                      <Calendar size={24} className="text-[#4937e8]" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No sessions found</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {searchQuery 
                        ? "No sessions match your search criteria" 
                        : "You haven't created any sessions yet. Create your first session to start mentoring."}
                    </p>
                    <button
                      onClick={() => navigate('/create-session')}
                      className="bg-[#4937e8] hover:bg-[#4338ca] text-white px-5 py-2.5 rounded-lg inline-flex items-center gap-2 transition-all shadow-md shadow-indigo-500/10 hover:shadow-indigo-500/20"
                    >
                      <Plus size={18} />
                      Create New Session
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    {filteredSessions.map((session) => (
                      <div 
                        key={session.sessionId}
                        className="group flex flex-col h-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-default"
                      >
                        {/* Session header with colored accent based on session type */}
                        <div className={`h-2 ${session.sessionType === 'One-on-One' ? 'bg-[#4937e8]' : 'bg-indigo-400'}`}></div>
                        
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4937e8] font-bold">
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
                              className="text-gray-400 hover:text-[#4937e8] transition-colors"
                              aria-label="Edit session settings"
                            >
                              <Settings2 size={18} />
                            </button>
                          </div>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">{session.description}</p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-indigo-50 text-[#4937e8] px-3 py-1 rounded-full text-sm font-medium">
                              {session.duration} mins
                            </span>
                            <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                              {session.sessionType}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${session.isPaid ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
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
                                  'bg-indigo-50 text-indigo-600',
                                  'bg-purple-50 text-purple-600',
                                  'bg-blue-50 text-blue-600',
                                  'bg-gray-100 text-gray-700'
                                ];
                                const colorIndex = index % colors.length;
                                return (
                                  <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium ${colors[colorIndex]}`}>
                                    {topic}
                                  </span>
                                );
                              })}
                              {session.topics.length > 3 && (
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 flex items-center gap-1">
                                  <Plus size={10} />
                                  {session.topics.length - 3} more
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
                                        <span key={idx} className="bg-gray-50 px-2 py-1 rounded text-xs border border-gray-100">
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
                                <span className="text-xs text-[#4937e8] font-medium flex items-center mt-1">
                                  +{session.timeSlots.filter(slot => slot.available && slot.timeRanges.length > 0).length - 2} more days available
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* View details button */}
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <button 
                              className="w-full flex items-center justify-center gap-1.5 text-sm font-medium text-[#4937e8] hover:text-[#4338ca] transition-colors group"
                              onClick={() => navigate(`/sessions/${session.sessionId}/edit?step=3`)}
                            >
                              View Session Details
                              <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-gray-200/80 transition-colors">
                <div className="h-24 bg-gradient-to-r from-[#4937e8] to-[#4338ca] relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/3"></div>
                </div>
                <div className="px-6 pb-6 relative">
                  <div className="absolute -top-10 left-6">
                    <div className="w-16 h-16 rounded-full border-4 border-white bg-indigo-50 flex items-center justify-center text-[#4937e8] font-bold text-xl">
                      M
                    </div>
                  </div>
                  <div className="pt-8">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">Your Mentor Profile</h3>
                    <p className="text-gray-600 text-sm mb-4">Keep your profile updated to attract more mentees</p>
                    
                    <button 
                      onClick={() => navigate('/profile')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Profile
                      <ArrowUpRight size={16} className="text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Upcoming Schedule */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-gray-200/80 transition-colors">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Calendar size={16} className="text-[#4937e8]" />
                    Upcoming Schedule
                  </h3>
                  <button className="text-xs text-[#4937e8] font-medium">View all</button>
                </div>
                
                <div className="p-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 mb-2">
                      <Calendar size={18} />
                    </div>
                    <p className="text-gray-600 text-sm text-center">No upcoming sessions scheduled</p>
                    <button 
                      onClick={() => navigate('/availability')}
                      className="mt-3 text-xs font-medium text-[#4937e8]"
                    >
                      Manage availability
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;