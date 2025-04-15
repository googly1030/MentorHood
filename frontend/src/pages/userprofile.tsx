import { useState, useEffect } from 'react';
import {  Trophy, Users, Sun, Moon , Edit, Settings2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserData } from '../utils/auth';
import { API_URL } from '../utils/api';

interface Service {
  _id: string;
  sessionName: string;
  description: string;
  duration: string;
  sessionType: string;
  price: string;
  isPaid: boolean;
  sessionId?: string;
  userId?: string;
}

interface GroupDiscussion {
  _id: string;
  sessionName: string;
  description: string;
  duration: string;
  sessionType: string;
  price: string;
  isPaid: boolean;

  sessionId?: string;
  userId?: string;
}

enum TabType {
  OVERVIEW = 'overview',
  SERVICES = 'services'
}

const EMPTY_MENTOR_PROFILE = {
  userId: '',
  name: '',
  headline: 'Professional Developer',
  description: 'Share your story and experience to help mentees understand your journey and expertise.',
  membership: 'Member of MentorHood',
  totalExperience: {
    years: 0,
    months: 0
  },
  experience: [
    {
      title: 'Developer',
      company: '',
      description: 'Professional Developer',
      duration: '0 years'
    }
  ],
  projects: [
    {
      title: 'Project Initiative',
      description: 'Description of the project'
    }
  ],
  resources: [
    {
      title: 'Resource Toolkit',
      description: 'A comprehensive guide.',
      linkText: 'Download →'
    }
  ],
  services: [
    {
      id: 1,
      title: 'Mentorship Session',
      duration: '30 minutes',
      type: 'Video Call',
      frequency: 'Weekly',
      sessions: 1,
      price: 0,
      rating: 5
    }
  ],
  groupSessions: [
    {
      id: 1,
      title: 'Group Workshop',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM - 11:00 AM',
      participants: 0,
      maxParticipants: 10,
      price: 0
    }
  ],
  achievements: [
    {
      id: 1,
      title: 'New Mentor',
      description: 'Joined the MentorHood community',
      date: new Date().toLocaleDateString()
    }
  ],
  reviews: [],
  testimonials: [],
  linkedinUrl: '',
  githubUrl: '',
  primaryExpertise: 'Development',
  disciplines: ['Development'],
  skills: ['Programming'],
  mentoringTopics: ['Technical Skills'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

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
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const ensureHttps = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  useEffect(() => {
    const checkUser = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const { role, userId } = JSON.parse(userData);
          setUserRole(role);
          setUserId(userId);
          if (role === 'mentor' && userId === mentorId) {
            setIsCurrentUser(true);
          }
        } catch (err) {
          console.error('Error parsing token:', err);
        } 
      }
    };

    checkUser();
  }, [mentorId]);

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/mentors/${mentorId}`);
        if (!response.ok) {
          if (response.status === 404 && isCurrentUser) {
            // Create empty profile if user is the current mentor
            const newProfile = {
              ...EMPTY_MENTOR_PROFILE,
              userId: mentorId,
              name: getUserData()?.username || ''
            };

            console.log('Creating new mentor profile:', newProfile);

            const createResponse = await fetch(`${API_URL}/mentors/creatementorprofile`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              },
              credentials: 'include',
              body: JSON.stringify(newProfile)
            });
            window.location.reload();
            
            if (!createResponse.ok) {
              const errorData = await createResponse.json();
              console.error('Failed to create profile:', errorData);
              throw new Error(`Failed to create mentor profile: ${errorData.message || 'Unknown error'}`);
            }

            const data = await createResponse.json();
            console.log('New profile created:', data);
            setMentorProfile(data.mentor);
          } else {
            throw new Error('Failed to fetch mentor profile');
          }
        } else {
          const data = await response.json();
          if (data.status === 'success') {
            setMentorProfile(data.mentor);
          } else {
            throw new Error('Failed to fetch mentor profile');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await fetch(`${API_URL}/mentors/${mentorId}/sessions?type=one-on-one`);
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
        const response = await fetch(`${API_URL}/mentors/${mentorId}/sessions?type=group-session`);
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
  }, [mentorId, isCurrentUser]);

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
      case TabType.SERVICES:
        return (
          <div className="space-y-8">
            {/* One-on-One Sessions */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">One-on-One Sessions</h2>
                {isCurrentUser && (
                  <button 
                    onClick={() => navigate('/mentor-dashboard')}
                    className="text-[#4937e8] hover:text-[#4338ca] font-medium flex items-center gap-2"
                  >
                    <Settings2 size={16} />
                    Manage Sessions
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {services.map((service, index) => (
                  <div key={index} className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                          One-on-One
                        </span>
                        <h3 className={`font-medium mt-2 ${textColor}`}>{service.sessionName}</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          Duration: {service.duration} minutes
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          {service.description}
                        </p>
                        <p className={`text-lg font-medium mt-3 ${textColor}`}>
                          {service.isPaid ? `Rs ${service.price}` : 'Free'}
                        </p>
                      </div>
                      {service.userId !== userId && (
                        <button 
                          onClick={() => handleBooking(service.sessionId || service._id)}
                          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700"
                        >
                          Book Session
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Group Sessions */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Group Sessions</h2>
                {isCurrentUser && (
                  <button 
                    onClick={() => navigate('/mentor-dashboard')}
                    className="text-[#4937e8] hover:text-[#4338ca] font-medium flex items-center gap-2"
                  >
                    <Settings2 size={16} />
                    Manage Sessions
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                {groupDiscussions.map((session, index) => (
                  <div key={index} className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                          Group Session
                        </span>
                        <h3 className={`font-medium mt-2 ${textColor}`}>{session.sessionName}</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          Duration: {session.duration} minutes
                        </p>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                          {session.description}
                        </p>
                        <p className={`text-lg font-medium mt-3 ${textColor}`}>
                          {session.isPaid ? `Rs ${session.price}` : 'Free'}
                        </p>
                      </div>
                      {session.userId !== userId && (
                        <button 
                          onClick={() => handleBooking(session.sessionId || session._id)}
                          className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700"
                        >
                          Join Session
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
              
              {/* Add this new description section */}
              <div className={`mt-6 ${cardBg} p-6 rounded-lg shadow-sm`}>
                <div className="flex justify-between items-start">
                  <h2 className={`text-xl font-bold ${textColor} mb-4`}>About Me</h2>
                </div>
                {mentorProfile.description ? (
                  <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {mentorProfile.description}
                  </p>
                ) : (
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <p>This mentor hasn't added a description yet.</p>
                  </div>
                )}
              </div>

              {/* Rest of the Overview content */}
              <div className={`mt-8 ${cardBg} p-4 rounded-lg`}>
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Skills</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mentorProfile.skills?.map((skill: string, index: number) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className={`${cardBg} p-4 rounded-lg`}>
                  <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Experience</h3>
                  <p className={`text-lg font-medium ${textColor}`}>
                    {mentorProfile.totalExperience?.years} years {mentorProfile.totalExperience?.months} months
                  </p>
                </div>
                <div className={`${cardBg} p-4 rounded-lg`}>
                  <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Primary Expertise</h3>
                  <p className={`text-lg font-medium ${textColor}`}>{mentorProfile.primaryExpertise}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className={`${cardBg} p-4 rounded-lg`}>
                  <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mentor Profile</h3>
                  <div className="mt-2 space-y-2">
                    <a
                      href={ensureHttps(mentorProfile.linkedinUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 block"
                    >
                      LinkedIn Profile
                    </a>
                    <a
                      href={ensureHttps(mentorProfile.githubUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-700 block"
                    >
                      GitHub Profile
                    </a>
                  </div>
                </div>
                <div className={`${cardBg} p-4 rounded-lg`}>
                  <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Disciplines</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {mentorProfile.disciplines?.map((discipline: string, index: number) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {discipline}
                      </span>
                    ))}
                  </div>
                </div>
              </div>



              <div className={`mt-4 ${cardBg} p-4 rounded-lg`}>
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Mentoring Topics</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {mentorProfile.mentoringTopics?.map((topic: string, index: number) => (
                    <span
                      key={index}
                      className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
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
          {isCurrentUser && userRole === 'mentor' && (
            <button 
              onClick={() => navigate(`/profile/${mentorId}/edit`)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all"
            >
              <Edit className="w-6 h-6 text-white" />
            </button>
          )}
          {/* <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all">
            <MessageCircle className="w-6 h-6 text-white" />
          </button>
          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all">
            <Heart className="w-6 h-6 text-white" />
          </button>
          <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all">
            <MoreHorizontal className="w-6 h-6 text-white" />
          </button> */}
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
              onClick={() => setActiveTab(TabType.SERVICES)}
              className={`pb-4 font-medium ${
                activeTab === TabType.SERVICES 
                  ? 'text-teal-600 border-b-2 border-teal-600' 
                  : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
              }`}
            >
              Available Sessions
            </button>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-8">
            {/* Left Column - Made scrollable */}
            <div className="col-span-2 space-y-8 pb-8">
              {renderTabContent()}
            </div>

            <div className="relative">
              <div className="sticky top-[7rem] space-y-6">
                <div className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Trophy className="w-6 h-6 text-yellow-500" />
                    <h2 className={`text-xl font-bold ${textColor}`}>Career Highlights</h2>
                  </div>
                  
                  {mentorProfile.achievements.length > 0 ? (
                    <div className="space-y-4">
                      {mentorProfile.achievements.map((achievement: any, index: number) => (
                        <div key={index} className="pb-4 border-b last:border-0 border-gray-200 dark:border-gray-700">
                          <h3 className={`font-medium ${textColor}`}>{achievement.title}</h3>
                          <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {achievement.description}
                          </p>
                          <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {achievement.date}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {isCurrentUser ? (
                        <div className="text-center">
                          <p>Share your career highlights!</p>
                          <button 
                            onClick={() => navigate(`/profile/${mentorId}/edit`)}
                            className="mt-2 text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2 mx-auto"
                          >
                            <Edit size={16} />
                            Add Achievements
                          </button>
                        </div>
                      ) : (
                        <p>No achievements shared yet.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-6 h-6 text-blue-500" />
                    <h2 className={`text-xl font-bold ${textColor}`}>Mentoring Stats</h2>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Sessions completed
                      </p>
                      <span className="font-medium">{mentorProfile.stats?.sessionsCompleted || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Total mentoring hours
                      </p>
                      <span className="font-medium">
                        {Math.round((mentorProfile.stats?.totalMentoringMinutes || 0) / 60)} hrs
                      </span>
                    </div>
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