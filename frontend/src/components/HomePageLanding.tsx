import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  Star,
  Users,
  Coffee,
  BookOpen,
  Award,
  Clock,
  Calendar,
  DollarSign,
  MessageCircle,
  Users2,
  // Search,
  Trophy,
  Loader2,
  Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { getUserData } from '../utils/auth';
import img from "../image.webp";
import mentor1 from '../MentoImg/mentor1.jpg'
import mentor2 from '../MentoImg/mentor2.jpg'
import mentor3 from '../MentoImg/mentor3.jpg'
import mentor4 from '../MentoImg/mentor4.jpg'
import mentor5 from '../MentoImg/mentor5.jpg'
import mentor6 from '../MentoImg/mentor6.jpg'
import mentor7 from '../MentoImg/mentor7.jpg'
import mentor8 from '../MentoImg/mentor8.jpg'
import { API_URL } from '../utils/api';


interface Session {
  sessionId: string;
  sessionName: string;
  description: string;
  duration: string;
  sessionType: string;
  numberOfSessions: string;
  occurrence: string;
  topics: string[];
  allowMenteeTopics: boolean;
  showOnProfile: boolean;
  isPaid: boolean;
  price: string;
  timeSlots: {
    day: string;
    available: boolean;
    timeRanges: {
      start: string;
      end: string;
    }[];
  }[];
  userId: string;
}

interface Mentor {
  userId: string;
  name: string;
  headline: string;
  primaryExpertise: string;
  disciplines: string[];
  skills: string[];
  mentoringTopics: string[];
  totalExperience: {
    years: number;
    months: number;
  };
  experience: {
    title: string;
    company: string;
    description: string;
    duration: string;
  }[];
  profilePhoto?: string;
  rating?: number;
  bookings?: number;
}

interface AMASession {
  _id: string;
  title: string;
  mentor: {
    name: string;
    role: string;
    image: string;
  };
  date: string;
  time: string;
  duration: string;
  registrants: number;
  maxRegistrants: number;
  questions: string[];
  isWomanTech: boolean;
  tag?: string;
}



function App() {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const journeySectionRef = useRef<HTMLDivElement>(null);
  const [isJourneySectionInView, setIsJourneySectionInView] = useState(false);
  // Removed unused emojis state
  const [centerCardContent] = useState({
    icon: (
      <img
        src="https://cdn-icons-png.flaticon.com/512/6009/6009939.png"
        alt="Growth Icon"
        className="h-32 w-32 object-contain drop-shadow-lg"
      />
    ),
    title: "MentorConnect Platform",
    description:
      "Our AI-powered platform matches you with the perfect mentor based on your goals, experience, and learning style.",
    buttonText: "Start Your Journey",
    bgColor: "from-gray-800 to-blue-500",
  });


  const navigate = useNavigate();
  // const [activeTab, setActiveTab] = useState("mentee");

  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [amaSessions, setAmaSessions] = useState<AMASession[]>([]);
  const [womenTechSessions, setWomenTechSessions] = useState<AMASession[]>([]);



  const sessionCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSessionCards, setVisibleSessionCards] = useState<boolean[]>([]);

  const [oneOnOneSessions, setOneOnOneSessions] = useState<Session[]>([]);
  const [groupSessions, setGroupSessions] = useState<Session[]>([]);

  useEffect(() => {
    let rafId: number;

    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const position = window.scrollY;
        setScrollPosition(position);

        const maxScroll = 500;
        const opacity = Math.max(0.1, 1 - position / maxScroll);
        setScrollOpacity(opacity);

        if (journeySectionRef.current) {
          const rect = journeySectionRef.current.getBoundingClientRect();
          const isInView =
            rect.top <= window.innerHeight * 0.5 &&
            rect.bottom >= window.innerHeight * 0.5;

          if (isInView !== isJourneySectionInView) {
            setIsJourneySectionInView(isInView);
          }

          if (isInView) {
            journeySectionRef.current.classList.add("in-view");

            const centerCard = journeySectionRef.current.querySelector(
              ".journey-center-card"
            ) as HTMLElement;
            if (centerCard) {
              const progress = Math.min(
                1,
                Math.max(0, 1 - rect.top / window.innerHeight)
              );
              const scale = 0.8 + progress * 0.2;
              centerCard.style.transform = `translate(-50%, -50%) scale(${scale})`;
            }
          } else {
            journeySectionRef.current.classList.remove("in-view");
          }
        }

        cardsRef.current.forEach((card, index) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const isVisible = rect.top <= window.innerHeight - 100;

          if (isVisible !== visibleCards[index]) {
            setVisibleCards((prev) => {
              const newState = [...prev];
              newState[index] = isVisible;

              return newState;
            });
          }
        });

        sessionCardsRef.current.forEach((card, index) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const isVisible = rect.top <= window.innerHeight - 100;

          if (isVisible !== visibleSessionCards[index]) {
            setVisibleSessionCards((prev) => {
              const newState = [...prev];
              newState[index] = isVisible;
              return newState;
            });
          }

          if (isVisible) {
            const scrollProgress =
              (window.innerHeight - rect.top) /
              (window.innerHeight + rect.height);
            const yOffset = Math.min(50, scrollProgress * 100); // Max 50px offset
            card.style.transform = `translateY(${-yOffset}px)`;
          }
        });
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [
    visibleCards,
    visibleSessionCards,
    isJourneySectionInView,
    mentors.length,
  ]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch(`${API_URL}/mentors/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch mentors');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setMentors(data.mentors);
          setVisibleCards(new Array(data.mentors.length).fill(false));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load mentors');
      } finally {
        setLoading(false);
      }
    };

    const fetchOneOnOneSessions = async () => {
      try {
        const response = await fetch(`${API_URL}/sessions/one-on-one/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch sessions');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setOneOnOneSessions(data.sessions);
          setMentors(data.mentors);
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchGroupSessions = async () => {
      try {
        const response = await fetch(`${API_URL}/sessions/group-session/all`);
        if (!response.ok) {
          throw new Error('Failed to fetch group sessions');
        }
        const data = await response.json();
        if (data.status === 'success') {
          setGroupSessions(data.sessions);
        }
      } catch (error) {
        console.error('Error fetching group sessions:', error);
      }
    };

    fetchMentors();
    fetchOneOnOneSessions();
    fetchGroupSessions();
  }, []);

  useEffect(() => {
    const fetchAMASessions = async () => {
      try {
        const [amaResponse, womenTechResponse] = await Promise.all([
          fetch(`${API_URL}/ama-sessions?is_woman_tech=false`),
          fetch(`${API_URL}/ama-sessions?is_woman_tech=true`)
        ]);

        if (!amaResponse.ok || !womenTechResponse.ok) {
          throw new Error('Failed to fetch sessions');
        }

        const amaData = await amaResponse.json();
        const womenTechData = await womenTechResponse.json();

        setAmaSessions(amaData);
        setWomenTechSessions(womenTechData);
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAMASessions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <img
        src={img}
        alt="Background"
        className="fixed inset-0 w-full h-full object-cover z-[-1] transition-opacity duration-300"
        style={{
          opacity: scrollOpacity,
          transform: `translateY(${scrollPosition * 0.5}px)`,
          display: "none",
        }}
      />

      <div className="hero-section relative">
        {/* Background Images Grid */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Right side images */}
          <img
            src={mentor1}
            alt="Mentor1"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110"
            style={{ left: "2%", top: "23%" }}
          />
          <img
            src={mentor2}
            alt="Mentor2"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110"
            style={{ right: "2%", top: "23%" }}
          />
          <img
            src={mentor3}
            alt="Mentor3"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110"
            style={{ left: "88%", top: "56%" }}
          />
          <img
            src={mentor4}
            alt="Mentor4"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110"
            style={{ right: "12%", top: "32%" }}
          />
          <img
            src={mentor5}
            alt="Mentor"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110"
            style={{ right: "15%", top: "66%" }}
          />

          {/* Left side images (mirrored) */}
          <img
             src={mentor6}
            alt="Mentor"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110"
            style={{ right: "88%", top: "56%" }}
          />
          <img
             src={mentor7}
            alt="Mentor"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110"
            style={{ left: "12%", top: "32%" }}
          />
          <img
            src={mentor8}
            alt="Mentor"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110"
            style={{ left: "15%", top: "66%" }}
          />
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 flex justify-center items-center flex-col relative z-[2] pt-4">
          <div className="flex justify-center space-x-8 mb-12 relative">
            {/* <button
              className={`text-xl font-medium px-4 py-2 relative ${
                activeTab === "mentee" ? "text-black" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("mentee")}
            >
              Mentee
              {activeTab === "mentee" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>
              )}
            </button>
            <button
              className={`text-xl font-medium px-4 py-2 relative ${
                activeTab === "mentor" ? "text-black" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("mentor")}
            >
              Mentor
              {activeTab === "mentor" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500"></div>
              )}
            </button> */}
          </div>

          <h1 className="text-6xl font-bold mb-4 max-w-3xl text-center mx-auto">
            Connect with Top Tech
            <br />
            Mentors in 1-on-1 Sessions
          </h1>
          <p className="text-xl mb-8 text-gray-700 text-center max-w-2xl mx-auto">
            Book personalized 20-45 minute mentoring sessions with industry
            experts. Get career guidance, technical advice, and actionable
            insights.
          </p>
          {/* <AnimatePresence mode="wait">
            {activeTab === "mentee" ? (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="w-full max-w-2xl"
              >
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for mentors by skills, industry, or role..."
                    className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center gap-2">
                    <Search size={20} />
                    Search
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                key="become-mentor"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="px-8 py-4 bg-black text-white rounded-full text-lg font-medium hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
                onClick={() => {
                  const userData = getUserData();
                  if (userData?.role === 'mentor') {
                    navigate('/mentor-dashboard');
                  } else {
                    navigate('/register', { 
                      state: { defaultRole: 'mentor' } 
                    });
                  }
                }}
              >
                Become a Mentor
                <ArrowRight size={20} />
              </motion.button>
            )}
          </AnimatePresence> */}
        </div>
      </div>

      <div className="knowledge-buddies-section py-24 bg-white">
        <div className="max-w-7xl mx-auto px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">
            Your Knowledge Buddies
          </h2>
          {loading ? (
            <div className="text-center">Loading mentors...</div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16">
              {mentors.map((mentor, index) => (
                <div
                  key={mentor.userId}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className={`mentor-card bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow ${
                    visibleCards[index] ? "visible" : ""
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={mentor.profilePhoto || `https://ui-avatars.com/?name=${mentor.name}&background=random`}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{mentor.name}</h3>
                      {/* <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={16} fill="currentColor" />
                        <span>{mentor.rating || 4.5}/5</span>
                      </div> */}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-2">{mentor.headline}</p>
                  <p className="text-gray-700 mb-2">
                    Experience: {mentor.totalExperience?.years || 0}+ years
                  </p>
                  <p className="text-gray-700 mb-2">
                    Specialization: {mentor.primaryExpertise}
                  </p>
                  <p className="text-gray-700 font-medium mb-6">
                    {mentor.bookings || 0}+ sessions conducted
                  </p>
                  <div className="flex gap-3">
                    {/* <a
                      href={`/booking/${oneOnOneSessions.find(s => s.userId === mentor.userId)?.sessionId || ''}`}
                      className="flex-1 bg-black text-white py-2 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800"
                    >
                      <Phone size={16} />
                      Schedule Call<a
                      href={`/booking/${oneOnOneSessions.find(s => s.userId === mentor.userId)?.sessionId || ''}`}
                      className="flex-1 bg-black text-white py-2 rounded-full flex items-center justify-center gap-2 hover:bg-gray-800"
                    >
                      <Phone size={16} />
                      Schedule Call
                    </a>
                    </a> */}
                    <button
                      onClick={() => navigate(`/profile/${mentor.userId}`)}
                      className="flex-1 bg-gray-100 text-black py-2 rounded-full flex items-center justify-center gap-2 hover:bg-gray-200"
                    >
                      <Users size={16} />
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <button
              className="view-all-btn bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 flex items-center gap-2"
              onClick={() => navigate("/mentors")}
            >
              <Users size={20} />
              View All Mentors
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions Section */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <div>
              <h2 className="text-5xl leading-normal font-bold mb-4 bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
                One-on-One Sessions
              </h2>
              <p className="text-gray-700 text-lg max-w-xl">
                Book targeted mentorship sessions with industry experts and
                accelerate your career growth
              </p>
            </div>
            <button 
              onClick={() => navigate('/mentors?tab=one-on-one')} 
              className="view-all-btn bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 flex items-center gap-2"
            >
              View All Sessions
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {oneOnOneSessions.map((session) => {
              const mentor = mentors.find(m => m.userId === session.userId);
              
              return (
                <div key={session.sessionId} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                <div className="flex items-center gap-4 mb-6 ">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-gray-600">
                      {mentor?.name?.charAt(0) || 'M'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 truncate">{session.sessionName}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{mentor?.headline}</p>
                  </div>
                </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>{session.duration} minutes session</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Video className="w-5 h-5" />
                      <span>Google Meet</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span>{session.occurrence}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-semibold mb-3">Topics Covered</h4>
                    <div className="flex flex-wrap gap-2">
                      {session.topics.map((topic, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end">
                    {/* <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 fill-current text-yellow-400" />
                      <span className="font-medium">4.9 (1.2k+ sessions)</span>
                    </div> */}
                    <button
                      onClick={() => navigate(`/booking/${session.sessionId}`)}
                      className="px-4 py-2 bg-black text-white rounded-full flex items-center gap-2 
                        hover:bg-gray-800 transition-all transform hover:scale-105 hover:shadow-lg"
                    >
                      Book Now
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Upcoming Sessions Section */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <div>
              <h2 className="text-5xl leading-normal font-bold mb-4 bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
                Upcoming Sessions
              </h2>
              <p className="text-gray-700 text-lg max-w-xl">
                Book targeted mentorship sessions with industry experts and
                accelerate your career growth
              </p>
            </div>
            <button 
              onClick={() => navigate('/mentors?tab=group-session')} 
              className="view-all-btn bg-black text-white py-2 px-4 rounded-full hover:bg-gray-800 flex items-center gap-2"
            >
              View All Sessions
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 sessions-grid">
            {groupSessions.map((session, index) => {
              const mentor = mentors.find(m => m.userId === session.userId);
              return (
                <div
                  key={session.sessionId}
                  ref={(el) => (sessionCardsRef.current[index] = el)}
                  className={`session-card bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl 
                    transition-all duration-700 group border border-gray-200 ${
                      visibleSessionCards[index] ? "visible" : ""
                    }`}
                  style={{ "--card-index": index } as React.CSSProperties}
                >
                  <div className="transform transition-transform duration-700 group-hover:scale-[1.02]">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-black rounded-full text-sm font-medium mb-4">
                      {session.sessionType}
                    </span>
                    <h3 className="text-2xl font-bold mb-6 text-gray-800">
                      {session.sessionName}
                    </h3>

                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={mentor?.profilePhoto || `https://ui-avatars.com/?name=${mentor?.name}&background=random`}
                        alt={mentor?.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                      />
                      <div>
                        <h4 className="font-medium text-gray-800">
                          {mentor?.name}
                        </h4>
                        <p className="text-gray-500 text-sm line-clamp-2 max-w-[200px]">
                          {mentor?.headline}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-3 text-gray-500">
                        <Calendar size={18} className="text-[#3730A3]" />
                        <span>{session.timeSlots?.[0]?.day || 'Flexible'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500">
                        <Clock size={18} className="text-[#3730A3]" />
                        <span>
                          {session.duration} minutes
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-xl font-bold text-gray-800">
                        <DollarSign size={18} className="text-[#3730A3]" />
                        {session.price || 'Free'}
                      </span>

                      <button
                        onClick={() => navigate(`/booking/${session.sessionId}`)}
                        className="px-4 py-2 bg-black text-white rounded-full flex items-center gap-2 
                        hover:bg-gray-800 transition-all transform hover:scale-105 hover:shadow-lg"
                      >
                        Book Now
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ask Me Anything Sessions Section */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4 leading-normal bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
              Ask Me Anything Sessions
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Join interactive group sessions where industry experts answer your
              burning questions live
            </p>
          </div>

          {loading ? (
            <div className="text-center">Loading sessions...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {amaSessions.map((session) => (
                <div
                  key={session._id}
                  className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 group"
                >
                  <div className="flex items-start gap-6 mb-8">
                    <img
                      src={session.mentor.image}
                      alt={session.mentor.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-200"
                    />
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-gray-800">
                        {session.title}
                      </h3>
                      <p className="text-gray-800 font-medium">
                        {session.mentor.name}
                      </p>
                      <p className="text-gray-500">{session.mentor.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-800 mb-1">
                        <Calendar size={18} className="text-gray-800" />
                        <span className="font-medium">Date & Time</span>
                      </div>
                      <p className="text-gray-500">{session.date}</p>
                      <p className="text-gray-500">
                        {session.time} • {session.duration}
                      </p>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-800 mb-1">
                        <Users2 size={18} className="text-gray-800" />
                        <span className="font-medium">Registrants</span>
                      </div>
                      <p className="text-gray-500">
                        {session.registrants}/{session.maxRegistrants}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-[#4937e8] to-[#4338ca] h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              (session.registrants / session.maxRegistrants) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-2 text-gray-800 mb-4">
                      <MessageCircle size={18} className="text-gray-800" />
                      <span className="font-medium">Sample Questions</span>
                    </div>
                    <ul className="space-y-3">
                      {session.questions.map((question, qIndex) => (
                        <li
                          key={qIndex}
                          className="flex items-start gap-3 text-gray-500"
                        >
                          <span className="w-2 h-2 mt-2 rounded-full bg-gray-800"></span>
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    className="w-full bg-black text-white py-4 rounded-xl font-medium hover:shadow-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={() => navigate(`/questions/${session._id}`)}
                  >
                    Register Now
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Women in Tech Section */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-blue-100 text-[#4937e8] rounded-full text-sm font-medium mb-4">
              Featured: Women in Tech Series
            </span>
            <h2 className="text-5xl font-bold mb-4 leading-normal bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
              Empowering Women in Technology
            </h2>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Join exclusive sessions with accomplished women leaders in technology sharing their journey, 
              insights, and strategies for success in the tech industry
            </p>
          </div>

          {loading ? (
            <div className="text-center">Loading sessions...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {womenTechSessions.map((session) => (
                <div
                  key={session._id}
                  className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 group"
                >
                  <div className="flex items-start gap-6 mb-8">
                    <img
                      src={session.mentor.image}
                      alt={session.mentor.name}
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-gray-200"
                    />
                    <div>
                      <h3 className="text-2xl font-bold mb-2 text-gray-800">
                        {session.title}
                      </h3>
                      <p className="text-gray-800 font-medium">
                        {session.mentor.name}
                      </p>
                      <p className="text-gray-500">{session.mentor.role}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="bg-gray-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-800 mb-1">
                        <Calendar size={18} className="text-gray-800" />
                        <span className="font-medium">Date & Time</span>
                      </div>
                      <p className="text-gray-500">{session.date}</p>
                      <p className="text-gray-500">
                        {session.time} • {session.duration}
                      </p>
                    </div>
                    <div className="bg-gray-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-800 mb-1">
                        <Users2 size={18} className="text-gray-800" />
                        <span className="font-medium">Registrants</span>
                      </div>
                      <p className="text-gray-500">
                        {session.registrants}/{session.maxRegistrants}
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-[#4937e8] to-[#4338ca] h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              (session.registrants / session.maxRegistrants) * 100
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 rounded-xl p-6 mb-8">
                    <div className="flex items-center gap-2 text-gray-800 mb-4">
                      <MessageCircle size={18} className="text-gray-800" />
                      <span className="font-medium">Sample Questions</span>
                    </div>
                    <ul className="space-y-3">
                      {session.questions.map((question, qIndex) => (
                        <li
                          key={qIndex}
                          className="flex items-start gap-3 text-gray-500"
                        >
                          <span className="w-2 h-2 mt-2 rounded-full bg-gray-800"></span>
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button 
                    className="w-full bg-black text-white py-4 rounded-xl font-medium hover:shadow-lg hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
                    onClick={() => navigate(`/questions/${session._id}`)}
                  >
                    Register Now
                    <ArrowRight size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section
        ref={journeySectionRef}
        className={`journey-section py-16 pb-32 bg-white relative overflow-hidden min-h-[600px] ${
          isJourneySectionInView ? "in-view" : ""
        }`}
      >
        <div className="max-w-5xl mx-auto px-8 relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
            Your Growth Journey
          </h2>
          <p className="text-lg text-gray-700 text-center mb-12 max-w-2xl mx-auto">
            Our mentorship platform follows a simple yet effective process to
            help you achieve your career goals
          </p>

          <div className="relative h-[500px] flex items-center justify-center">
            {/* First Card */}
            <div className="journey-card">
              <div className="bg-white rounded-xl p-6 shadow-xl w-[25rem] h-[17rem] hover:shadow-2xl transition-all duration-300 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-gray-200 p-3 rounded-full inline-block">
                    <BookOpen size={30} className="text-[#3730A3]" />
                  </div>
                  <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-600">Step 1</span>
                </div>
                <h4 className="font-bold text-lg mb-3">1. Discover</h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Browse our curated network of experts who match your career goals.
                </p>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={16} className="text-gray-500" />
                    <span>500+ Verified Mentors</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Tech Leaders</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Product</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Design</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Second Card */}
            <div className="journey-card">
              <div className="bg-white rounded-xl p-6 shadow-xl w-[25rem] h-[17rem] hover:shadow-2xl transition-all duration-300 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-gray-200 p-3 rounded-full inline-block">
                    <Clock size={30} className="text-[#3730A3]" />
                  </div>
                  <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-600">Step 2</span>
                </div>
                <h4 className="font-bold text-lg mb-3">2. Connect</h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Schedule personalized sessions that fit your calendar.
                </p>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} className="text-gray-500" />
                    <span>Flexible Scheduling</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">1:1 Sessions</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Group Sessions</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Chat</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Third Card */}
            <div className="journey-card">
              <div className="bg-white rounded-xl p-6 shadow-xl w-[25rem] h-[17rem] hover:shadow-2xl transition-all duration-300 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-gray-200 p-3 rounded-full inline-block">
                    <Coffee size={30} className="text-[#3730A3]" />
                  </div>
                  <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-600">Step 3</span>
                </div>
                <h4 className="font-bold text-lg mb-3">3. Transform</h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Gain insights through interactive sessions with industry leaders.
                </p>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star size={16} className="text-gray-500" />
                    <span>4.9/5 Average Rating</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Live Sessions</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Resources</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Recordings</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fourth Card */}
            <div className="journey-card">
              <div className="bg-white rounded-xl p-6 shadow-xl w-[25rem] h-[17rem] hover:shadow-2xl transition-all duration-300 border border-gray-200">
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-gray-200 p-3 rounded-full inline-block">
                    <Award size={30} className="text-[#3730A3]" />
                  </div>
                  <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-600">Step 4</span>
                </div>
                <h4 className="font-bold text-lg mb-3">4. Succeed</h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  Track your progress and celebrate achievements.
                </p>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Trophy size={16} className="text-gray-500" />
                    <span>Track Your Growth</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Goals</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Progress</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">Milestones</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Card remains unchanged */}
            <div className="journey-center-card w-[400px] bg-white rounded-2xl shadow-2xl p-8 border border-gray-200">
              <div
                className={`h-40 bg-gradient-to-r from-[#4937e8] to-[#4338ca] rounded-xl mb-6 overflow-hidden relative p-4 flex items-center justify-center`}
              >
                <div className="absolute inset-0 opacity-30 bg-white/95"></div>
                <div className="relative z-10 transform hover:scale-105 transition-transform">
                  {centerCardContent.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-3 bg-gradient-to-r from-[#4937e8] via-[#4937e8] to-[#4338ca] bg-clip-text text-transparent [text-shadow:_0_1px_1px_rgb(0_0_0_/_10%)]">
                {centerCardContent.title}
              </h3>
              <p className="text-gray-700 text-center mb-6 text-base leading-relaxed">
                {centerCardContent.description}
              </p>
              <div className="flex justify-center">
                <button onClick={() => navigate('/mentors')} className="px-6 py-3 bg-black hover:bg-gray-800 text-white rounded-full text-base font-medium transition-all transform hover:scale-105">
                  {centerCardContent.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>

        <div className="relative z-10 mx-auto text-center">
          <h2 className="text-5xl leading-normal font-bold bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
            Still looking? Try our AI Search
          </h2>
          <p className="text-gray-700 mb-10 text-lg">
            Just type who you are looking for. Be as specific as you want & see
            our AI do the magic
          </p>

          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="I am looking for Software engineering leader for tech insights"
                className="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-lg"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white px-6 py-2 rounded-xl transition-all duration-300 flex items-center gap-2">
                <Search size={20} />
                Search
              </button>
            </div>
          </div>

          <div className="relative w-full overflow-hidden">
            <div
              ref={sliderRef}
              className="flex gap-4 overflow-x-auto scroll-smooth cursor-grab active:cursor-grabbing touch-pan-x pb-4"
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {suggestions.map((suggestion) => (
                <div key={suggestion.id} className="flex-none w-[300px]">
                  <div
                    className="bg-white rounded-2xl p-6 shadow-lg h-[160px] flex flex-col
          hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 
          border border-gray-200 select-none"
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">{suggestion.icon}</span>
                      <span className="text-sm text-[#3730A3] font-medium">
                        {suggestion.category}
                      </span>
                    </div>
                    <p className="text-left text-gray-800 font-medium line-clamp-3">
                      {suggestion.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
}

export default App;
