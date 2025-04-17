import { useState, useEffect } from 'react';
import {  Trophy, Users, Sun, Moon , Edit, Settings2, ChevronRight } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
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
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);

  const ensureHttps = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam === 'services') {
      setActiveTab(TabType.SERVICES);
    }
  }, []);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab');
    
    if (tabParam === 'services') {
      setActiveTab(TabType.SERVICES);
    }
  }, []);

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
        const response = await fetch(`${API_URL}/users/profile?userId=${mentorId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Profile fetch error:', errorData);
          setError(errorData.message || 'An error occurred');
          throw new Error(`Failed to fetch mentor profile: ${response.status}`);
        } else {
          const data = await response.json();
          if (data.status === 'success') {
            setMentorProfile(data.profile);
          } else {
            setMentorProfile(null);
          }
        }
      } catch (err) {
        console.error('Error:', err);
        setMentorProfile(null);
      } finally {
        setLoading(false);
        setIsCreatingProfile(false);
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

  if (loading || isCreatingProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800 mb-4"></div>
        <p className="text-gray-600">
          {isCreatingProfile ? 'Creating your profile...' : 'Loading profile information...'}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800 mb-4"></div>
        <p className="text-gray-600">Loading profile information...</p>
      </div>
    );
  }

  if (!mentorProfile) {
    return <div className="flex items-center justify-center min-h-screen">Mentor profile not found</div>;
  }

  // Update EmptyStateMessage component to accept a custom navigation path
  const EmptyStateMessage = ({ 
    title, 
    message, 
    isCurrentUser, 
    mentorId, 
    navigate,
    customPath
  }: { 
    title: string;
    message: string;
    isCurrentUser: boolean;
    mentorId: string;
    navigate: (path: string) => void;
    customPath?: string;
  }) => (
    <div className={`${cardBg} p-6 rounded-lg shadow-sm border border-gray-900/10 hover:border-gray-900/20 transition-colors`}>
      <h3 className={`font-medium ${textColor} mb-2`}>{title}</h3>
      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
        {message}
      </p>
      {isCurrentUser && (
        <button 
          onClick={() => navigate(customPath || `/profile/${mentorId}/edit`)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
        >
          <Edit size={16} />
          Add {title}
        </button>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case TabType.SERVICES:
        return (
          <div className="space-y-8">
            {/* One-on-One Sessions */}
            <div className={`${cardBg} p-8 rounded-xl shadow-sm border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300`}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className={`text-2xl font-semibold ${textColor}`}>One-on-One Sessions</h2>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Book personalized mentoring sessions
                  </p>
                </div>
                {isCurrentUser && (
                  <button 
                  onClick={() => navigate('/mentor-dashboard')}
                  className="flex items-center gap-2 px-4 py-2 text-[#4937e8] hover:text-[#4338ca] font-medium rounded-lg hover:bg-indigo-50 transition-all duration-200"
                >
                  <Settings2 size={18} />
                  <span>Manage Sessions</span>
                </button>
                )}
              </div>
              {services.length > 0 ? (
                <div className="grid grid-cols-2 gap-6">
                  {services.map((service, index) => (
                    <div 
                      key={index} 
                      className={`${cardBg} p-6 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-4 w-full">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-800 border border-yellow-100">
                            One-on-One
                          </span>
                          <h3 className={`text-lg font-medium ${textColor} group-hover:text-teal-600 transition-colors`}>
                            {service.sessionName}
                          </h3>
                          <div className="space-y-2">
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              <span className="font-medium">Duration:</span> {service.duration} minutes
                            </p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {service.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <p className={`text-lg font-semibold ${textColor}`}>
                              {service.isPaid ? `Rs ${service.price}` : 'Free'}
                            </p>
                            {service.userId !== userId && (
                              <button 
                                onClick={() => handleBooking(service.sessionId || service._id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                Book Session
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyStateMessage 
                  title="One-on-One Sessions"
                  message="No one-on-one sessions have been created yet."
                  isCurrentUser={isCurrentUser}
                  mentorId={mentorId || ''}
                  navigate={navigate}
                  customPath="/create-session" 
                />
              )}
            </div>

            {/* Group Sessions */}
            <div className={`${cardBg} p-8 rounded-xl shadow-sm border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300`}>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className={`text-2xl font-semibold ${textColor}`}>Group Sessions</h2>
                  <p className={`mt-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Join collaborative learning sessions
                  </p>
                </div>
                {isCurrentUser && (
                  <button 
                    onClick={() => navigate('/mentor-dashboard')}
                                    className="flex items-center gap-2 px-4 py-2 text-[#4937e8] hover:text-[#4338ca] font-medium rounded-lg hover:bg-indigo-50 transition-all duration-200"
                  >
                    <Settings2 size={18} />
                    <span>Manage Sessions</span>
                  </button>
                )}
              </div>
              {groupDiscussions.length > 0 ? (
                <div className="grid grid-cols-2 gap-6">
                  {groupDiscussions.map((session, index) => (
                    <div 
                      key={index} 
                      className={`${cardBg} p-6 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 group`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-4 w-full">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-800 border border-purple-100">
                            Group Session
                          </span>
                          <h3 className={`text-lg font-medium ${textColor} group-hover:text-teal-600 transition-colors`}>
                            {session.sessionName}
                          </h3>
                          <div className="space-y-2">
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              <span className="font-medium">Duration:</span> {session.duration} minutes
                            </p>
                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {session.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                            <p className={`text-lg font-semibold ${textColor}`}>
                              {session.isPaid ? `Rs ${session.price}` : 'Free'}
                            </p>
                            {session.userId !== userId && (
                              <button 
                                onClick={() => handleBooking(session.sessionId || session._id)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                Join Session
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyStateMessage 
                  title="Group Sessions"
                  message="No group sessions have been created yet."
                  isCurrentUser={isCurrentUser}
                  mentorId={mentorId || ''}
                  navigate={navigate}
                  customPath="/create-session" 
                />
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-8">
            {/* About Section */}
            <div className={`mt-6 ${cardBg} p-6 rounded-lg shadow-sm border border-gray-900/10 hover:border-gray-900/20 transition-colors`}>
              {/* Add this new description section */}
              <div className={`mt-6 ${cardBg} p-6 rounded-lg shadow-sm border border-gray-900/10 hover:border-gray-900/20 transition-colors`}>
                <div className="flex justify-between items-start">
                  <h2 className={`text-xl font-bold ${textColor} mb-4`}>About Me</h2>
                </div>
                {mentorProfile.bio ? (
                  <p className={`text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {mentorProfile.bio}
                  </p>
                ) : (
                  <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <p>This mentor hasn't added a description yet.</p>
                  </div>
                )}
              </div>

              {/* Rest of the Overview content */}
              <div className={`mt-8 ${cardBg} p-4 rounded-lg border border-gray-900/10 hover:border-gray-900/20 transition-colors`}>
                <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Skills</h3>
                {mentorProfile.skills && mentorProfile.skills.length > 0 ? (
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
                ) : (
                  <EmptyStateMessage 
                    title="Skills"
                    message="No skills have been added yet."
                    isCurrentUser={isCurrentUser}
                    mentorId={mentorId || ''}
                    navigate={navigate}
                  />
                )}
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className={`${cardBg} p-4 rounded-lg border border-gray-900/10 hover:border-gray-900/20 transition-colors`}>
                  <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Experience</h3>
                  <p className={`text-lg font-medium ${textColor}`}>
                    {mentorProfile.totalExperience?.years} years {mentorProfile.totalExperience?.months} months
                  </p>
                </div>
                <div className={`${cardBg} p-4 rounded-lg border border-gray-900/10 hover:border-gray-900/20 transition-colors`}>
                  <h3 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Primary Expertise</h3>
                  <p className={`text-lg font-medium ${textColor}`}>{mentorProfile.primaryExpertise}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className={`${cardBg} p-4 rounded-lg border border-gray-900/10 hover:border-gray-900/20 transition-colors`}>
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
                <div className={`${cardBg} p-4 rounded-lg border border-gray-900/10 hover:border-gray-900/20 transition-colors`}>
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



              <div className={`mt-4 ${cardBg} p-4 rounded-lg border border-gray-900/10 hover:border-gray-900/20 transition-colors`}>
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
                {mentorProfile.experience && mentorProfile.experience.length > 0 ? (
                  mentorProfile.experience.map((exp: any, index: number) => (
                    <div key={index} className={`${cardBg} p-6 rounded-lg shadow-sm border border-gray-900/10 hover:border-gray-900/20 transition-colors`}>
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
                  ))
                ) : (
                  <EmptyStateMessage 
                    title="Experience"
                    message="No work experience has been added yet."
                    isCurrentUser={isCurrentUser}
                    mentorId={mentorId || ''}
                    navigate={navigate}
                  />
                )}
              </div>
            </div>

            {/* Projects Section */}
            <div>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Projects</h2>
              <div className="grid grid-cols-2 gap-4">
                {mentorProfile.projects && mentorProfile.projects.length > 0 ? (
                  mentorProfile.projects.map((project: any, index: number) => (
                    <div key={index} className={`${cardBg} p-6 rounded-lg shadow-sm border border-gray-900/10 hover:border-gray-900/20 transition-colors`}>
                      <h3 className={`font-medium ${textColor}`}>{project.title}</h3>
                      <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {project.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2">
                    <EmptyStateMessage 
                      title="Projects"
                      message="No projects have been added yet."
                      isCurrentUser={isCurrentUser}
                      mentorId={mentorId || ''}
                      navigate={navigate}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Resources Section */}
            <div>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Resources</h2>
              <div className="grid grid-cols-2 gap-4">
                {mentorProfile.resources && mentorProfile.resources.length > 0 ? (
                  mentorProfile.resources.map((resource: any, index: number) => (
                    <div key={index} className={`${cardBg} p-6 rounded-lg shadow-sm border border-gray-900/10 hover:border-gray-900/20 transition-colors`}>
                      <h3 className={`font-medium ${textColor}`}>{resource.title}</h3>
                      <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {resource.description}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2">
                    <EmptyStateMessage 
                      title="Resources"
                      message="No learning resources have been added yet."
                      isCurrentUser={isCurrentUser}
                      mentorId={mentorId || ''}
                      navigate={navigate}
                    />
                  </div>
                )}
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
      </div>

      {/* Update this section */}
      <div className="max-w-6xl mx-auto px-4 pb-[10rem]">
        <div className="relative -mt-32">
          <div className="flex items-start">
            {/* Profile image and name section */}
            <div className="flex items-end">
              <img 
                src={mentorProfile.profilePhoto || `https://ui-avatars.com/api/?name=${mentorProfile.name}&background=random&size=200`}
                alt="Profile"
                className="w-40 h-40 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <div className="ml-6 mb-4">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl text-white font-bold">
                    {mentorProfile.name}
                  </h1>
                </div>
                <div className="mt-2">
                  <span className={`inline-block ${isDarkMode ? 'bg-gray-800' : 'bg-black'} text-white text-sm px-3 py-1 rounded-full`}>
                    {mentorProfile.headline}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 mb-4">
            <div className={`${cardBg} p-4 rounded-lg shadow-sm border border-gray-200/50 hover:border-gray-300/50 transition-all duration-300`}>
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-3">
                  <li className="flex items-center">
                    <button 
                      onClick={() => navigate('/')}
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-teal-600 text-base font-medium transition-colors`}
                    >
                      Home
                    </button>
                  </li>
                  <ChevronRight className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                  <li className="flex items-center">
                    <button 
                      onClick={() => navigate('/mentors')}
                      className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} hover:text-teal-600 text-base font-medium transition-colors`}
                    >
                      My Profile
                    </button>
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 border-b border-gray-200">
            <div className="flex gap-8">
             <button 
                onClick={() => {
                  setActiveTab(TabType.OVERVIEW);
                  navigate(`/profile/${mentorId}`);
                }}
                className={`pb-4 font-medium ${
                  activeTab === TabType.OVERVIEW 
                    ? 'text-teal-600 border-b-2 border-teal-600' 
                    : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
                }`}
              >
                Overview
              </button>
              <button 
                onClick={() => {
                  setActiveTab(TabType.SERVICES);
                  navigate(`/profile/${mentorId}?tab=services`);
                }}
                className={`pb-4 font-medium ${
                  activeTab === TabType.SERVICES 
                    ? 'text-teal-600 border-b-2 border-teal-600' 
                    : `${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`
                }`}
              >
                Available Sessions
              </button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4 mb-2">
              {isCurrentUser && userRole === 'mentor' && (
                <button 
                  onClick={() => navigate(`/profile/${mentorId}/edit`)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-full transition-all"
                >
                  <Edit size={16} />
                  <span className="text-sm font-medium">Edit Profile</span>
                </button>
              )}
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 hover:bg-gray-800 text-white transition-all"
              >
                {isDarkMode ? (
                  <>
                    <Sun size={16} className="text-yellow-500" />
                    <span className="text-sm font-medium">Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={16} className="text-gray-600" />
                    <span className="text-sm font-medium">Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 mt-8">
            {/* Left Column - Made scrollable */}
            <div className="col-span-2 space-y-8 pb-8">
              {renderTabContent()}
            </div>

            <div className="relative mt-6">
              <div className="sticky top-[5.5rem] space-y-6">
                <div className={`${cardBg} p-6 rounded-lg shadow-sm border border-gray-900/10 hover:border-gray-900/20 transition-colors`}>
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

                <div className={`${cardBg} p-6 rounded-lg shadow-sm border border-gray-900/10 hover:border-gray-900/20 transition-colors`}>
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