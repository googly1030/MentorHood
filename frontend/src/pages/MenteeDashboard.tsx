import { Calendar, Clock , BookOpen , ArrowUpRight , Trophy  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function MenteeDashboard() {
  const navigate = useNavigate();

  const upcomingSessions = [
    {
      id: 1,
      title: "System Design Interview Prep",
      mentor: "Sarah Johnson",
      mentorRole: "Senior Tech Lead at Google",
      date: "April 15, 2024",
      time: "10:00 AM",
      duration: "45 min",
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
    }
  ];

  const completedSessions = [
    {
      id: 1,
      title: "Career Growth in Tech",
      mentor: "Michael Chen",
      mentorRole: "Engineering Manager at Meta",
      date: "April 8, 2024",
      duration: "60 min",
      rating: 5,
      feedback: "Excellent session with practical insights",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    }
  ];

  const learningProgress = {
    sessionsCompleted: 12,
    totalHours: 15,
    skillsImproved: ["System Design", "Leadership", "Frontend Development"],
    certificates: 2
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, Alex!</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Sessions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Upcoming Sessions</h2>
              <div className="space-y-4">
                {upcomingSessions.map(session => (
                  <div key={session.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <img 
                      src={session.image} 
                      alt={session.mentor}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{session.title}</h3>
                      <p className="text-gray-600 text-sm">{session.mentor} • {session.mentorRole}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Calendar size={14} />
                          {session.date}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock size={14} />
                          {session.time} ({session.duration})
                        </span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-[#4937e8] text-white rounded-lg text-sm hover:bg-[#4338ca] transition-colors">
                      Join Session
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Sessions */}
            <div className="bg-white rounded-2xl p-6 mt-8 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Past Sessions</h2>
              <div className="space-y-4">
                {completedSessions.map(session => (
                  <div key={session.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <img 
                      src={session.image} 
                      alt={session.mentor}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{session.title}</h3>
                      <p className="text-gray-600 text-sm">{session.mentor} • {session.mentorRole}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1 text-gray-500">
                          <Calendar size={14} />
                          {session.date}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                          <Clock size={14} />
                          {session.duration}
                        </span>
                        <span className="flex items-center gap-1 text-yellow-500">
                          {"⭐".repeat(session.rating)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{session.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            {/* Skills Progress */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Skills Progress</h2>
              <div className="space-y-4">
                {learningProgress.skillsImproved.map((skill, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-700">{skill}</span>
                      <span className="text-sm text-gray-500">In Progress</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#4937e8] h-2 rounded-full"
                        style={{ width: `${Math.random() * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenteeDashboard;