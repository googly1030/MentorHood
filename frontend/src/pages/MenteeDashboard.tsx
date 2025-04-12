import { useState, useEffect } from 'react';
import { Calendar, Clock, BookOpen, ArrowUpRight, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../utils/api';

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
        
        const response = await fetch(`${API_URL}/api/dashboard/mentee/${userEmail}`);
        
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-black text-white px-6 py-3 rounded-xl"
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user.name}!</h1>
              <p className="text-gray-600">
                Track your mentorship journey and upcoming sessions
              </p>
            </div>
            <button 
              onClick={() => navigate('/mentors')}
              className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300"
            >
              Find New Mentors
              <ArrowUpRight size={20} />
            </button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen size={20} className="text-[#4937e8]" />
                </div>
                <span className="text-gray-600">Total Sessions</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{learningProgress.sessionsCompleted}</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock size={20} className="text-green-600" />
                </div>
                <span className="text-gray-600">Learning Hours</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{learningProgress.totalHours}h</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Trophy size={20} className="text-purple-600" />
                </div>
                <span className="text-gray-600">Certificates</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{learningProgress.certificates}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Upcoming Sessions</h2>
              <div className="space-y-4">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map(session => (
                    <div key={session.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <img 
                        src={session.image} 
                        alt={session.mentor}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{session.title}</h3>
                        <p className="text-gray-600 text-sm">{session.mentor} • {session.mentorRole}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Calendar size={14} />
                            {formatDate(session.date)}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <Clock size={14} />
                            {session.time} ({session.duration})
                          </span>
                        </div>
                      </div>
                      <button 
                        className="px-4 py-2 bg-[#4937e8] text-white rounded-lg text-sm hover:bg-[#4338ca] transition-colors"
                        onClick={() => handleJoinSession(session.meeting_link || '')}
                      >
                        Join Session
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6">
                    <p className="text-gray-500">No upcoming sessions</p>
                    <button
                      onClick={() => navigate('/mentors')}
                      className="mt-4 px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Book a Session
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Completed Sessions */}
            <div className="bg-white rounded-2xl p-6 mt-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Past Sessions</h2>
              <div className="space-y-4">
                {completedSessions.length > 0 ? (
                  completedSessions.map(session => (
                    <div key={session.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <img 
                        src={session.image} 
                        alt={session.mentor}
                        className="w-12 h-12 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{session.title}</h3>
                        <p className="text-gray-600 text-sm">{session.mentor} • {session.mentorRole}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1 text-gray-500">
                            <Calendar size={14} />
                            {formatDate(session.date)}
                          </span>
                          <span className="flex items-center gap-1 text-gray-500">
                            <Clock size={14} />
                            {session.duration}
                          </span>
                          {session.rating && (
                            <span className="flex items-center gap-1 text-yellow-500">
                              {"⭐".repeat(session.rating)}
                            </span>
                          )}
                        </div>
                        {session.feedback && (
                          <p className="text-sm text-gray-600 mt-2">{session.feedback}</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-6">
                    <p className="text-gray-500">No completed sessions</p>
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