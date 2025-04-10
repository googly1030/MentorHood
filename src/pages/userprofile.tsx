import React, { useState } from 'react';
import { MessageCircle, Heart, MoreHorizontal, Rocket, Trophy, Users , Sun, Moon, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface Service {
  id: number;
  title: string;
  duration: string;
  type: string;
  frequency: string;
  sessions: number;
  price: number;
  rating?: number;
}

export const services: Service[] = [
  {
    id: 1,
    title: 'Performance Boost',
    duration: '20 minutes',
    type: 'Video Call',
    frequency: 'Weekly',
    sessions: 6,
    price: 360,
    rating: 4.9
  },
  {
    id: 2,
    title: 'Mentorship session',
    duration: '20 minutes',
    type: 'Video Call',
    frequency: 'Weekly',
    sessions: 2,
    price: 50,
    rating: 4.8
  },
  {
    id: 3,
    title: 'Momentum Overview',
    duration: '20 minutes',
    type: 'Video Call',
    frequency: 'Fortnightly',
    sessions: 2,
    price: 56,
    rating: 4.7
  }
];

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.OVERVIEW);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleBooking = (sessionId: number) => {
    navigate(`/booking/${sessionId}`);
  };

  const textColor = isDarkMode ? 'text-white' : 'text-gray-700';
  const bgColor = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = isDarkMode ? 'bg-gray-800' : 'bg-white';

  const reviews: Review[] = [
    {
      id: 1,
      user: {
        name: "John Doe",
        image: "https://randomuser.me/api/portraits/men/1.jpg",
        role: "Product Manager"
      },
      rating: 5,
      comment: "Exceptional mentorship session! Ney provided invaluable insights...",
      date: "2025-03-15"
    },
    {
      id: 2,
      user: {
        name: "Sarah Smith",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
        role: "UX Designer"
      },
      rating: 4.8,
      comment: "Great session focused on product strategy and execution...",
      date: "2025-03-10"
    }
  ];

  const achievements = [
    {
      id: 1,
      title: "Top 50 in Program Management",
      description: "Recognized among the top 50 program managers globally",
      icon: <Trophy className="w-12 h-12 text-yellow-500" />,
      date: "Jan 2025 - Mar 2025"
    },
  ];

  const groupSessions = [
    {
      id: 1,
      title: "Product Strategy Workshop",
      date: "2025-04-15",
      time: "10:00 AM - 11:30 AM",
      participants: 8,
      maxParticipants: 12,
      price: 99
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case TabType.REVIEWS:
        return (
          <div className="space-y-6">
            {reviews.map(review => (
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
            {achievements.map(achievement => (
              <div key={achievement.id} className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                <div className="flex items-center gap-4">
                  {achievement.icon}
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
            {groupSessions.map(session => (
              <div key={session.id} className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-medium ${textColor}`}>{session.title}</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      {session.date} • {session.time}
                    </p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      {session.participants}/{session.maxParticipants} participants
                    </p>
                  </div>
                  <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm">
                    Join • ${session.price}
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
                Worked in organizations such as Circles.Life, Alibaba Group, Lazada Group and Dafiti Group.
              </p>
              <p className={`${textColor} mt-4`}>
                I'm a seasoned executive in the e-commerce and telecom industries, bringing and building high-performance organizations with process solutions
                within commercial constraints - local, cross-boundary, and remote teams; complemented by an MBA in Strategic and Economic Project Management...
              </p>
              <button className="text-teal-600 mt-2">Show more</button>
            </div>

            {/* Experience Section */}
            <div>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Experience</h2>
              <div className="space-y-4">
                <div className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                  <div className="flex justify-between">
                    <div>
                      <h3 className={`font-medium ${textColor}`}>Senior Product Manager</h3>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Stanford Graduate School of Business</p>
                    </div>
                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>2020 - Present</span>
                  </div>
                  <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
                    Led cross-functional teams in developing and launching educational products...
                  </p>
                </div>
              </div>
            </div>

            {/* Projects Section */}
            <div>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Projects</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                  <h3 className={`font-medium ${textColor}`}>Digital Transformation Initiative</h3>
                  <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Led the digital transformation of legacy systems...
                  </p>
                </div>
              </div>
            </div>

            {/* Resources Section */}
            <div>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Resources</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                  <h3 className={`font-medium ${textColor}`}>Product Management Toolkit</h3>
                  <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    A comprehensive guide for product managers...
                  </p>
                  <button className="text-teal-600 mt-2">Download →</button>
                </div>
              </div>
            </div>

            {/* Testimonials Section */}
            <div>
              <h2 className={`text-xl font-bold mb-4 ${textColor}`}>Testimonials</h2>
              <div className="space-y-4">
                <div className={`${cardBg} p-6 rounded-lg shadow-sm`}>
                  <div className="flex items-start gap-4">
                    <img 
                      src="https://randomuser.me/api/portraits/men/1.jpg"
                      alt="Testimonial"
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <h3 className={`font-medium ${textColor}`}>John Doe</h3>
                      <p className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        "Ney's mentorship was instrumental in helping me transition into product management..."
                      </p>
                    </div>
                  </div>
                </div>
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
                  ney batista
                </h1>
                <p className={`mt-1 text-white`}>
                  Product Manager, Program Manager, Project Manager at Stanford Graduate School of Business
                </p>
                <div className="mt-2">
                  <span className={`inline-block ${isDarkMode ? 'bg-gray-800' : 'bg-black'} text-white text-sm px-3 py-1 rounded-full`}>
                    Member of uxfolio
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
              Reviews (2)
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
                    {services.map((session) => (
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