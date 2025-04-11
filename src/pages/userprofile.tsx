import { useState, useEffect } from 'react';
import { MessageCircle, Heart, MoreHorizontal, Rocket, Trophy, Users, Sun, Moon, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Service {
  _id: string;
  sessionName: string;
  description: string;
  duration: string;
  sessionType: string;
  price: string;
  isPaid: boolean;
}

interface GroupDiscussion {
  _id: string;
  sessionName: string;
  description: string;
  duration: string;
  sessionType: string;
  price: string;
  isPaid: boolean;
}

enum TabType {
  OVERVIEW = 'overview',
  REVIEWS = 'reviews',
  ACHIEVEMENTS = 'achievements',
  GROUP_SESSIONS = 'groupSessions'
}

interface Review {
  id: number;
  user: {
    name: string;
    image: string;
    role: string;
  };
  rating: number;
  comment: string;
  date: string;
}

function App() {
  const navigate = useNavigate();
  const { mentorId } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.OVERVIEW);
  const [mentorProfile, setMentorProfile] = useState<any>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [groupDiscussions, setGroupDiscussions] = useState<GroupDiscussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        const response = await fetch(`http://localhost:9000/api/mentors/${mentorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch mentor profile');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setMentorProfile(data.mentor);
        } else {
          throw new Error('Failed to fetch mentor profile');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch(`http://localhost:9000/api/mentors/${mentorId}/sessions?type=one-on-one`);
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setServices(data.sessions);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      }
    };

    const fetchGroupDiscussions = async () => {
      try {
        const response = await fetch(`http://localhost:9000/api/mentors/${mentorId}/sessions?type=group-sessions`);
        if (!response.ok) {
          throw new Error('Failed to fetch group discussions');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setGroupDiscussions(data.sessions);
        }
      } catch (err) {
        console.error('Error fetching group discussions:', err);
      }
    };

    if (mentorId) {
      fetchMentorProfile();
      fetchServices();
      fetchGroupDiscussions();
    }
  }, [mentorId]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleBooking = (sessionId: string) => {
    navigate(`/booking/${sessionId}`);
  };

  const textColor = isDarkMode ? 'text-white' : 'text-gray-700';
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  if (!mentorProfile) {
    return <div className="flex items-center justify-center min-h-screen">Mentor profile not found</div>;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case TabType.REVIEWS:
        return (
          <div className="space-y-6">
            {mentorProfile.reviews.map((review: any) => (
              <div key={review.id} className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                <div className="flex items-start gap-4">
                  <img src={review.user.image} alt={review.user.name} className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className={`font-medium ${textColor}`}>{review.user.name}</h3>
                      <span className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                        <span className={textColor}>{review.rating}</span>
                      </span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{review.user.role}</p>
                    <p className={`mt-3 ${textColor}`}>{review.comment}</p>
                    <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case TabType.ACHIEVEMENTS:
        return (
          <div className="space-y-6">
            {mentorProfile.achievements.map((achievement: any) => (
              <div key={achievement.id} className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                <div className="flex items-center gap-4">
                  <Trophy className="w-12 h-12 text-yellow-500" />
                  <div>
                    <h3 className={`font-medium ${textColor}`}>{achievement.title}</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{achievement.description}</p>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{achievement.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case TabType.GROUP_SESSIONS:
        return (
          <div className="space-y-6">
            {groupDiscussions.map((session) => (
              <div key={session._id} className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-medium ${textColor}`}>{session.sessionName}</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      Duration: {session.duration} minutes
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      {session.description}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleBooking(session._id)}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    {session.isPaid ? `Join • Rs ${session.price}` : 'Join • Free'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return (
          <div className="space-y-8">
            {/* About Section */}
            <div>
              <p className={textColor}>
                {mentorProfile.headline}
              </p>
              <button className="text-teal-600 mt-2">Show more</button>
            </div>

            {/* Services Section */}
            <div>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Services</h2>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service._id} className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-medium ${textColor}`}>{service.sessionName}</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          Duration: {service.duration} minutes
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          {service.description}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleBooking(service._id)}
                        className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm"
                      >
                        {service.isPaid ? `Book • Rs ${service.price}` : 'Book • Free'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Experience Section */}
            <div>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Experience</h2>
              <div className="space-y-4">
                {mentorProfile.experience.map((exp: any, index: number) => (
                  <div key={index} className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                    <div className="flex justify-between">
                      <div>
                        <h3 className={`font-medium ${textColor}`}>{exp.title}</h3>
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>{exp.company}</p>
                      </div>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{exp.duration}</span>
                    </div>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Section */}
            <div>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Projects</h2>
              <div className="grid grid-cols-2 gap-4">
                {mentorProfile.projects.map((project: any, index: number) => (
                  <div key={index} className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                    <h3 className={`font-medium ${textColor}`}>{project.title}</h3>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources Section */}
            <div>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Resources</h2>
              <div className="grid grid-cols-2 gap-4">
                {mentorProfile.resources.map((resource: any, index: number) => (
                  <div key={index} className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                    <h3 className={`font-medium ${textColor}`}>{resource.title}</h3>
                    <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {resource.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-200`}>
      <div className="relative">
        <div 
          className="h-64 w-full bg-cover bg-center" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')"
          }}
        />
        
        <div className="absolute top-4 right-4 flex gap-3">
          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all">
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all">
            <Heart className="w-6 h-6 text-white" />
          </button>
          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all">
            <MoreHorizontal className="w-6 h-6 text-white" />
          </button>
        </div>

        <div className="absolute top-4 left-4 flex gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all"
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6 text-white" />
            ) : (
              <Moon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-[10rem]">
        <div className="relative -mt-32">
          <div className="flex items-start">
            <div className="flex items-end">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80"
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-white shadow-lg"
              />
              <div className="ml-6 mb-4">
                <h1 className={`text-3xl text-white font-bold `}>
                  {mentorProfile.name}
                </h1>
                <p className={`mt-1 text-white`}>
                  {mentorProfile.headline}
                </p>
                <div className="mt-2">
                  <span className={`inline-block ${isDarkMode ? 'bg-gray-800' : 'bg-black'} text-white text-sm px-3 py-1 rounded-full`}>
                    {mentorProfile.membership}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className={`flex gap-8 mt-8 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button 
              onClick={() => setActiveTab(TabType.OVERVIEW)}
              className={`pb-4 font-medium ${
                activeTab === TabType.OVERVIEW 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
              }`}
            >
              Overview
            </button>
            <button 
              onClick={() => setActiveTab(TabType.REVIEWS)}
              className={`pb-4 font-medium ${
                activeTab === TabType.REVIEWS 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
              }`}
            >
              Reviews ({mentorProfile.reviews.length})
            </button>
            <button 
              onClick={() => setActiveTab(TabType.ACHIEVEMENTS)}
              className={`pb-4 font-medium ${
                activeTab === TabType.ACHIEVEMENTS 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
              }`}
            >
              Achievements
            </button>
            <button 
              onClick={() => setActiveTab(TabType.GROUP_SESSIONS)}
              className={`pb-4 font-medium ${
                activeTab === TabType.GROUP_SESSIONS 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
              }`}
            >
              Group sessions
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-8">
            {/* Left Column - Made scrollable */}
            <div className="col-span-2 space-y-8 pb-8">
              {renderTabContent()}
            </div>

            <div className="relative">
              <div className="sticky top-[7rem]">
                <div className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                  <h2 className={`text-xl font-bold ${textColor}`}>Community statistics</h2>
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Rocket className="w-5 h-5 text-blue-500" />
                        <div>
                          <p className="font-medium">1,170 mins</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total mentoring time</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-pink-500" />
                        <div>
                          <p className="font-medium">54</p>
                          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sessions completed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Available sessions</h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>Book 1:1 sessions from the options based on your needs</p>
                  
                  <div className="space-y-4">
                    {mentorProfile.services.map((session: any) => (
                      <div key={session.id} className={`${cardBg} p-4 rounded-lg shadow-sm`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Advance</span>
                            <h3 className={`font-medium mt-2 ${textColor}`}>{session.title}</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                              {session.duration}, {session.frequency}, {session.sessions} sessions
                            </p>
                          </div>
                          <button 
                            onClick={() => handleBooking(session.id)}
                            className="bg-black text-white px-4 py-1 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                          >
                            Book
                          </button>
                        </div>
                        <p className={`text-lg font-medium mt-2 ${textColor}`}>${session.price}.00</p>
                      </div>
                    ))}
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

export default App;