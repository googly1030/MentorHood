import { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, ArrowUpRight, Trophy, ChevronRight, User, BarChart2, Award, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/api';
import TokenDisplay from '../components/TokenDisplay';

// Define types for our data
interface User {
  name: string;
  email: string;
}

interface Session {
  id: string;
  title: string;
  mentor: string;
  mentorRole: string;
  date: string;
  time?: string;
  duration: string;
  status?: string;
  image: string;
  meeting_link?: string;
  rating?: number;
  feedback?: string;
  timezone?: string;
}

interface LearningProgress {
  sessionsCompleted: number;
  totalHours: number;
  skillsImproved: string[];
  certificates: number;
}

interface DashboardData {
  user: User;
  upcomingSessions: Session[];
  completedSessions: Session[];
  learningProgress: LearningProgress;
}

function MenteeDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('upcoming');

  // Get the user email from local storage
  const getUserEmail = (): string => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      return user.email || '';
    } catch (error) {
      console.error('Error parsing user data:', error);
      return '';
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const userEmail = getUserEmail();
        
        if (!userEmail) {
          setError('No user found. Please log in again.');
          setLoading(false);
          return;
        }
        
        const response = await fetch(`${API_URL}/dashboard/mentee/${userEmail}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        
        const data = await response.json();
        setDashboardData(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load your dashboard. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date to be more readable
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch  {
      return dateStr;
    }
  };

  // Handle joining a session
  const handleJoinSession = (meetingLink: string) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    }
  };

  // Add this handler to navigate to token history
  const navigateToTokenHistory = () => {
    navigate('/tokens/history');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <p className="text-red-600 mb-4 font-medium">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-[#4937e8] to-[#4338ca] text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // If no data yet, show placeholder
  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">No dashboard data available</p>
        </div>
      </div>
    );
  }

  const { user, upcomingSessions, completedSessions, learningProgress } = dashboardData;

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Decorative Backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/40 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-100/20 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
      
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-3 text-sm">
              <li>
                <button 
                  onClick={() => navigate('/')}
                  className="text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  Home
                </button>
              </li>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <li>
                <span className="text-gray-800 font-medium">
                  Dashboard
                </span>
              </li>
            </ol>
          </nav>
        </div>
      
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-100 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-y-1/2 translate-x-1/3 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-50 rounded-full translate-y-1/2 -translate-x-1/3 opacity-70"></div>
          
          <div className="relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user.name}!</h1>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:ml-14 gap-2 md:gap-4">
                  <p className="text-gray-600">
                    Track your mentorship journey and manage your upcoming sessions
                  </p>
                  <TokenDisplay 
                    className="px-3 py-2 bg-amber-50 rounded-full border border-amber-100" 
                    onClick={() => navigate('/tokens/history')}
                    showWarning={true}  
                    warningThreshold={100}  
                  />
                </div>
              </div>
              <button 
                onClick={() => navigate('/mentors')}
                className="mt-4 md:mt-0 bg-gradient-to-r from-[#4937e8] to-[#4338ca] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 group"
              >
                Find New Mentors
                <ArrowUpRight size={20} className="transform group-hover:translate-x-1 group-hover:translate-y--1 transition-transform" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-indigo-100 group">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-blue-50 rounded-xl text-[#4937e8] group-hover:bg-blue-100 transition-colors">
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-0.5">Total Sessions</div>
                    <div className="text-2xl font-bold text-gray-900">{learningProgress.sessionsCompleted}</div>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" 
                    style={{ width: `${Math.min(100, learningProgress.sessionsCompleted * 10)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-indigo-100 group">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-100 transition-colors">
                    <Clock size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-0.5">Learning Hours</div>
                    <div className="text-2xl font-bold text-gray-900">{learningProgress.totalHours}h</div>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full" 
                    style={{ width: `${Math.min(100, learningProgress.totalHours * 5)}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-indigo-100 group">
                <div className="flex items-center gap-4 mb-2">
                  <div className="p-3 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-100 transition-colors">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-0.5">Certificates</div>
                    <div className="text-2xl font-bold text-gray-900">{learningProgress.certificates}</div>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-violet-600 rounded-full" 
                    style={{ width: `${Math.min(100, learningProgress.certificates * 20)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {/* Sessions Tabs */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="border-b border-gray-100">
                <div className="flex">
                  <button 
                    className={`px-6 py-4 text-sm font-medium flex items-center gap-2 ${activeTab === 'upcoming' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('upcoming')}
                  >
                    <Calendar className="w-4 h-4" />
                    Upcoming Sessions
                    {upcomingSessions.length > 0 && (
                      <span className="ml-1 bg-indigo-100 text-indigo-600 text-xs px-2 py-0.5 rounded-full">
                        {upcomingSessions.length}
                      </span>
                    )}
                  </button>
                  <button 
                    className={`px-6 py-4 text-sm font-medium flex items-center gap-2 ${activeTab === 'past' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setActiveTab('past')}
                  >
                    <Clock className="w-4 h-4" />
                    Past Sessions
                    {completedSessions.length > 0 && (
                      <span className="ml-1 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                        {completedSessions.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {activeTab === 'upcoming' ? (
                  <div className="space-y-4">
                    {upcomingSessions.length > 0 ? (
                      upcomingSessions.map(session => (
                        <div 
                          key={session.id} 
                          className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all group"
                        >
                          <div className="relative">
                            <img 
                              src={session.image} 
                              alt={session.mentor}
                              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = 'https://ui-avatars.com/api/?name=' + session.mentor + '&background=random&size=100';
                              }}
                            />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">{session.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{session.mentor} • {session.mentorRole}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                              <span className="flex items-center gap-1 text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-100">
                                <Calendar size={14} className="text-indigo-500" />
                                {formatDate(session.date)}
                              </span>
                              <span className="flex items-center gap-1 text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-100">
                                <Clock size={14} className="text-indigo-500" />
                                {session.time} ({session.duration})
                              </span>
                              <span className="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-lg border border-green-100">
                                Confirmed
                              </span>
                            </div>
                          </div>
                          <button 
                            className="px-4 py-2 bg-gradient-to-r from-[#4937e8] to-[#4338ca] text-white rounded-lg text-sm hover:shadow-md hover:shadow-indigo-500/20 transition-all"
                            onClick={() => handleJoinSession(session.meeting_link || '')}
                          >
                            Join Session
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 px-6 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="mb-4 bg-white p-4 rounded-full inline-flex">
                          <Calendar className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-gray-700 font-medium mb-2">No upcoming sessions</h3>
                        <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                          You don't have any upcoming sessions scheduled. Find a mentor and book a session to begin your learning journey.
                        </p>
                        <button
                          onClick={() => navigate('/mentors')}
                          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Book a Session
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {completedSessions.length > 0 ? (
                      completedSessions.map(session => (
                        <div 
                          key={session.id} 
                          className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-indigo-100 hover:shadow-md transition-all group"
                        >
                          <div className="relative">
                            <img 
                              src={session.image} 
                              alt={session.mentor}
                              className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-sm"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.src = 'https://ui-avatars.com/api/?name=' + session.mentor + '&background=random&size=100';
                              }}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800 group-hover:text-indigo-600 transition-colors">{session.title}</h3>
                            <p className="text-gray-600 text-sm mb-2">{session.mentor} • {session.mentorRole}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                              <span className="flex items-center gap-1 text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-100">
                                <Calendar size={14} className="text-indigo-500" />
                                {formatDate(session.date)}
                              </span>
                              <span className="flex items-center gap-1 text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-100">
                                <Clock size={14} className="text-indigo-500" />
                                {session.duration}
                              </span>
                              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-lg border border-gray-200">
                                Completed
                              </span>
                            </div>
                            {session.rating && (
                              <div className="mt-3 flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <div 
                                    key={i} 
                                    className={`w-4 h-4 rounded-full flex items-center justify-center ${i < session.rating! ? 'text-yellow-400' : 'text-gray-200'}`}
                                  >
                                    ★
                                  </div>
                                ))}
                                <span className="text-xs text-gray-500 ml-1">Your rating</span>
                              </div>
                            )}
                            {session.feedback && (
                              <div className="mt-3 bg-white p-3 rounded-lg border border-gray-200 text-sm text-gray-600">
                                "{session.feedback}"
                              </div>
                            )}
                          </div>
                          {!session.rating && (
                            <button 
                              className="px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                            >
                              Rate Session
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 px-6 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="mb-4 bg-white p-4 rounded-full inline-flex">
                          <Clock className="w-6 h-6 text-gray-400" />
                        </div>
                        <h3 className="text-gray-700 font-medium mb-2">No completed sessions yet</h3>
                        <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                          Once you complete your first mentoring session, it will appear here.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Learning Progress */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <BarChart2 size={18} className="text-indigo-600" />
                  Learning Progress
                </h2>
              </div>
              
              <div className="p-6">
                {learningProgress.skillsImproved && learningProgress.skillsImproved.length > 0 ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Skills Improved</h3>
                      <div className="flex flex-wrap gap-2">
                        {learningProgress.skillsImproved.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Achievements</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Award size={16} className="text-indigo-600" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-gray-800">First Session Completed</div>
                            <div className="text-xs text-gray-500">Embarked on your learning journey</div>
                          </div>
                        </div>
                        
                        {learningProgress.sessionsCompleted >= 5 && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <Trophy size={16} className="text-purple-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-800">Dedicated Learner</div>
                              <div className="text-xs text-gray-500">Completed 5+ mentoring sessions</div>
                            </div>
                          </div>
                        )}
                        
                        {learningProgress.totalHours >= 10 && (
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <Clock size={16} className="text-green-600" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-800">10+ Learning Hours</div>
                              <div className="text-xs text-gray-500">Invested in your growth</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4">
                      <Award className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-sm">Complete your first session to track your learning progress</p>
                  </div>
                )}
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenteeDashboard;