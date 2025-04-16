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
  MessageCircle,
  Users2,
  // Search,
  Trophy,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { getUserData } from '../utils/auth';
import img from "../image.webp";
import mentor1 from "../MentoImg/mentor1.jpg";
import mentor2 from "../MentoImg/mentor2.jpg";
import mentor3 from "../MentoImg/mentor3.jpg";
import mentor4 from "../MentoImg/mentor4.jpg";
import mentor5 from "../MentoImg/mentor5.jpg";
import mentor6 from "../MentoImg/mentor6.jpg";
import mentor7 from "../MentoImg/mentor7.jpg";
import mentor8 from "../MentoImg/mentor8.jpg";
import { API_URL } from "../utils/api";

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
  created_at?: string; // Adding optional created_at
}

interface Mentor {
  userId: string;
  name: string;
  bio: string;
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
  created_at?: string; // Adding optional created_at
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
  created_at?: string; // Adding optional created_at
}

function App() {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const journeySectionRef = useRef<HTMLDivElement>(null);
  const [isJourneySectionInView, setIsJourneySectionInView] = useState(false);
  // Removed unused emojis state

  const navigate = useNavigate();
  // const [activeTab, setActiveTab] = useState("mentee");

  const [allMentors, setAllMentors] = useState<Mentor[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [amaSessions, setAmaSessions] = useState<AMASession[]>([]);
  const [womenTechSessions, setWomenTechSessions] = useState<AMASession[]>([]);

  const sessionCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSessionCards, setVisibleSessionCards] = useState<boolean[]>([]);

  const [oneOnOneSessions, setOneOnOneSessions] = useState<Session[]>([]);
  const [groupSessions, setGroupSessions] = useState<Session[]>([]);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const oneOnOneScrollContainerRef = useRef<HTMLDivElement>(null);
  const groupSessionsScrollContainerRef = useRef<HTMLDivElement>(null);

  // Create separate handling functions for each container
  const handleOneOnOneMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (oneOnOneScrollContainerRef.current) {
      setStartX(e.pageX - oneOnOneScrollContainerRef.current.offsetLeft);
      setScrollLeft(oneOnOneScrollContainerRef.current.scrollLeft);
    }
  };

  const handleGroupSessionsMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (groupSessionsScrollContainerRef.current) {
      setStartX(e.pageX - groupSessionsScrollContainerRef.current.offsetLeft);
      setScrollLeft(groupSessionsScrollContainerRef.current.scrollLeft);
    }
  };

  const handleOneOnOneMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !oneOnOneScrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - oneOnOneScrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    oneOnOneScrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleGroupSessionsMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !groupSessionsScrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - groupSessionsScrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    groupSessionsScrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
    allMentors.length,
  ]);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await fetch(`${API_URL}/mentors/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch mentors");
        }
        const data = await response.json();
        if (data.status === "success") {
          setAllMentors(data.mentors);
          setVisibleCards(new Array(data.mentors.length).fill(false));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load mentors");
      } finally {
        setLoading(false);
      }
    };

    const fetchOneOnOneSessions = async () => {
      try {
        const response = await fetch(`${API_URL}/sessions/one-on-one/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const data = await response.json();
        if (data.status === "success") {
          setOneOnOneSessions(data.sessions);
          setMentors(data.mentors);
        }
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchGroupSessions = async () => {
      try {
        const response = await fetch(`${API_URL}/sessions/group-session/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch group sessions");
        }
        const data = await response.json();
        if (data.status === "success") {
          setGroupSessions(data.sessions);
        }
      } catch (error) {
        console.error("Error fetching group sessions:", error);
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
          fetch(`${API_URL}/ama-sessions?is_woman_tech=true`),
        ]);

        if (!amaResponse.ok || !womenTechResponse.ok) {
          throw new Error("Failed to fetch sessions");
        }

        const amaData = await amaResponse.json();
        const womenTechData = await womenTechResponse.json();

        setAmaSessions(amaData);
        setWomenTechSessions(womenTechData);
      } catch (error) {
        console.error("Error fetching sessions:", error);
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

      <div className="hero-section relative overflow-hidden bg-gradient-to-b from-gray-50 via-gray-50 to-white">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/40 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-purple-100/20 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>

        {/* Background profile images - keep existing code but with enhanced animations */}
        <div className="absolute inset-0 overflow-hidden">
          {/* We'll keep existing profile images but add animation classes */}
          <img
            src={mentor1}
            alt="Mentor1"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110 animate-float"
            style={{ left: "2%", top: "23%" }}
          />
          <img
            src={mentor2}
            alt="Mentor2"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110 animate-float animation-delay-2000"
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center flex-col relative z-[2] pt-20 pb-24 md:pt-28 md:pb-32">
          {/* Subtle top badge */}
          <div className="mb-6 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-indigo-100 flex items-center">
            <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            <span className="text-sm font-medium text-gray-600">
              500+ Mentors Available Now
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 max-w-5xl text-center mx-auto leading-tight tracking-tight">
            Unlock Your{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
                Dream Career
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="10"
                viewBox="0 0 280 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5C21 1.5 109 -1.5 279 5"
                  stroke="url(#paint0_linear)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear"
                    x1="1"
                    y1="5"
                    x2="279"
                    y2="5"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4937e8" stopOpacity="0" />
                    <stop offset="0.5" stopColor="#4937e8" />
                    <stop offset="1" stopColor="#4338ca" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <br />
            with Expert Mentor Guidance
          </h1>

          <p className="text-lg md:text-xl mb-12 text-gray-700 text-center max-w-2xl mx-auto leading-relaxed">
            Navigate your academic journey and accelerate your career with
            personalized 1:1 mentorship from industry leaders.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 items-center">
            <button
              onClick={() => navigate("/mentors")}
              className="relative px-8 py-4 bg-gradient-to-r from-[#4937e8] to-[#4338ca] text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1 flex items-center gap-3 group overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#4338ca] to-[#4937e8] transition-all duration-300 transform translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100"></span>
              <span className="relative z-10">Find a Mentor</span>
              <ArrowRight
                size={20}
                className="relative z-10 transform group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-8 py-4 bg-white border border-gray-200 text-gray-800 rounded-xl font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all group flex items-center gap-2"
            >
              <span>Join as Mentor</span>
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center transform group-hover:rotate-45 transition-transform">
                <span className="text-indigo-500 font-bold text-xs">+</span>
              </div>
            </button>
          </div>

          <div className="mt-16 flex flex-col items-center justify-center">
            <div className="flex -space-x-3 mb-3">
              {[mentor1, mentor2, mentor3, mentor4].map((img, i) => (
                <div key={i} className="relative">
                  <div
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  ></div>
                  <img
                    src={img}
                    alt="Mentor"
                    className="relative w-12 h-12 rounded-full border-2 border-white object-cover shadow-md"
                  />
                </div>
              ))}
              <div className="w-12 h-12 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-indigo-500 font-bold text-sm shadow-md">
                500+
              </div>
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Join{" "}
              <span className="font-semibold text-indigo-700">
                thousands of mentees
              </span>{" "}
              already growing their careers
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
            <span className="text-xs text-gray-400 mb-2">
              Scroll to explore
            </span>
            <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center p-1">
              <div className="w-1 h-2 bg-gray-300 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="expert-mentors-section py-20 md:py-28 bg-white relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <div>
              <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-3 border border-indigo-100">
                Vetted & Verified
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
                Our Expert Mentors
              </h2>
              <p className="text-gray-600 max-w-xl leading-relaxed">
                Connect with industry leaders who've been where you want to go.
                Our mentors are hand-picked for their expertise and passion for
                helping others grow.
              </p>
            </div>
            <button
              className="hidden md:flex items-center gap-2 mt-4 md:mt-0 group"
              onClick={() => navigate("/mentors")}
            >
              <span className="text-indigo-600 font-medium">
                View All Mentors
              </span>
              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center transform group-hover:translate-x-1 transition-all">
                <ArrowRight size={16} className="text-indigo-600" />
              </div>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-red-50 rounded-xl border border-red-100">
              <div className="text-red-500 font-medium">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-white border border-red-200 rounded-lg text-red-600 text-sm hover:bg-red-50"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {allMentors
                .sort((a, b) => {
                  const dateA = a.created_at
                    ? new Date(a.created_at).getTime()
                    : 0;
                  const dateB = b.created_at
                    ? new Date(b.created_at).getTime()
                    : 0;
                  return dateB - dateA;
                })
                .slice(0, 8)
                .map((mentor, index) => (
                  <div
                    key={mentor.userId}
                    ref={(el) => (cardsRef.current[index] = el)}
                    className={`mentor-card bg-white rounded-xl p-5 border border-gray-100 hover:border-indigo-100 shadow-sm hover:shadow-xl transition-all duration-300 group ${
                      visibleCards[index] ? "visible" : ""
                    }`}
                    onClick={() => navigate(`/profile/${mentor.userId}`)}
                  >
                    <div className="relative mb-5">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 rounded-xl -m-1"></div>
                      <div className="absolute right-2 top-2">
                        <div className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">
                          {mentor.totalExperience?.years || 0}+ yrs
                        </div>
                      </div>
                      <div className="flex items-center gap-3 relative">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-[#4937e8]/20 to-[#4338ca]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          <img
                            src={
                              mentor.profilePhoto ||
                              (mentor.name
                                ? `https://ui-avatars.com/api/?name=${mentor.name}&background=random&size=200`
                                : `https://ui-avatars.com/api/?name=new&background=random&size=200`)
                            }
                            alt={mentor.name}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-white group-hover:ring-indigo-50 shadow-md transition-all"
                          />
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                            {mentor.name}
                          </h3>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {mentor.headline || mentor.primaryExpertise}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {mentor.disciplines
                        ?.slice(0, 3)
                        .map((discipline, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors"
                          >
                            {discipline}
                          </span>
                        ))}
                      {(mentor.disciplines?.length || 0) > 3 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors">
                          +{(mentor.disciplines?.length || 0) - 3} more
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                      {mentor.bio}
                    </p>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} fill="currentColor" />
                        <span className="text-xs font-medium">
                          {mentor.rating || "4.9"}
                        </span>
                      </div>
                      <div className="flex items-center text-indigo-600 text-sm font-medium group-hover:text-indigo-700">
                        View Profile
                        <ArrowRight
                          size={14}
                          className="ml-1 transform group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="text-center md:hidden">
            <button
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2 mx-auto"
              onClick={() => navigate("/mentors")}
            >
              <Users size={18} />
              View All Mentors
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions Section */}
      <section className="bg-gradient-to-b from-white to-gray-50 py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-50 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-50 rounded-full filter blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium mb-3">
                <Clock size={14} className="text-indigo-500" />
                <span>1:1 Personalized</span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-bold mb-4 bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
                One-on-One Sessions
              </h2>
              <p className="text-gray-600 text-lg max-w-xl leading-relaxed">
                Get undivided attention and personalized guidance from industry
                experts tailored to your specific needs and goals.
              </p>
            </div>
            <button
              onClick={() => navigate("/mentors?tab=one-on-one")}
              className="mt-6 md:mt-0 px-6 py-3 bg-white text-indigo-600 border border-indigo-100 rounded-xl hover:bg-indigo-50 flex items-center gap-2 transform transition-all hover:-translate-y-1 shadow-sm hover:shadow-md group"
            >
              <span>View All Sessions</span>
              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center transform group-hover:rotate-45 transition-all">
                <ArrowRight size={14} className="text-indigo-600" />
              </div>
            </button>
          </div>

          <div className="relative">
            {/* Navigation arrows */}
            <button
              onClick={() =>
                oneOnOneScrollContainerRef.current?.scrollBy({
                  left: -300,
                  behavior: "smooth",
                })
              }
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-colors hidden md:flex"
            >
              <ArrowRight size={18} className="transform rotate-180" />
            </button>

            <button
              onClick={() =>
                oneOnOneScrollContainerRef.current?.scrollBy({
                  left: 300,
                  behavior: "smooth",
                })
              }
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-colors hidden md:flex"
            >
              <ArrowRight size={18} />
            </button>

            <div
              ref={oneOnOneScrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-8 cursor-grab active:cursor-grabbing scroll-smooth hide-scrollbar snap-x"
              onMouseDown={handleOneOnOneMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleOneOnOneMouseMove}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {oneOnOneSessions
                .sort((a, b) => {
                  const dateA = a.created_at
                    ? new Date(a.created_at).getTime()
                    : 0;
                  const dateB = b.created_at
                    ? new Date(b.created_at).getTime()
                    : 0;
                  return dateB - dateA;
                })
                .map((session) => {
                  const mentor = mentors.find(
                    (m) => m.userId === session.userId
                  );
                  if (!mentor) return null;

                  return (
                    <div
                      key={session.sessionId}
                      className="flex-none w-[270px] md:w-[320px] select-none bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-indigo-100 group overflow-hidden snap-start"
                    >
                      <div className="h-1.5 bg-gradient-to-r from-[#4937e8] to-[#4338ca] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#4937e8]/20 to-[#4338ca]/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <img
                              src={
                                mentor.profilePhoto ||
                                (mentor.name
                                  ? `https://ui-avatars.com/api/?name=${mentor.name}&background=random&size=200`
                                  : `https://ui-avatars.com/api/?name=new&background=random&size=200`)
                              }
                              alt={mentor.name}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-indigo-100 transition-all"
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-700 transition-colors">
                              {session.sessionName}
                            </h3>
                            <p className="text-xs text-gray-500 line-clamp-1">
                              {mentor.headline || mentor.bio}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock size={14} className="text-indigo-500" />
                            <span className="text-gray-700">
                              {session.duration} min session
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {session.topics.slice(0, 2).map((topic, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>

                          <p className="text-xs text-gray-500 line-clamp-2 min-h-[2rem]">
                            {session.description ||
                              "Personalized mentorship session to help you achieve your career goals."}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-lg font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">
                            {session.isPaid ? `₹${session.price}` : "Free"}
                          </span>
                          <button
                            onClick={() =>
                              navigate(`/booking/${session.sessionId}`)
                            }
                            className="px-4 py-2 bg-black text-white rounded-lg text-sm hover:bg-gray-800 group-hover:bg-indigo-600 transition-colors flex items-center gap-1"
                          >
                            Book Now
                            <ArrowRight
                              size={14}
                              className="transform group-hover:translate-x-0.5 transition-transform"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Mobile scroll indicator */}
          <div className="flex items-center justify-center gap-1 mt-6 md:hidden">
            <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-200"></div>
          </div>
        </div>
      </section>

      {/* Upcoming Sessions Section */}
      <section className="group-sessions-section py-24 bg-gradient-to-b from-white to-indigo-50/20 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.04]"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-100/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-40 left-10 w-72 h-72 bg-purple-100/20 rounded-full filter blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center md:text-left mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium mb-3 border border-indigo-100 shadow-sm">
              <Users2 size={14} className="text-indigo-500" />
              <span>Group Learning</span>
            </div>

            <div className="md:flex md:justify-between md:items-end">
              <div className="mb-6 md:mb-0">
                <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-bold mb-4 bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
                  Upcoming Group Sessions
                </h2>
                <p className="text-gray-600 text-lg max-w-xl leading-relaxed">
                  Learn with peers in expert-led group mentorship sessions
                  designed to accelerate your career growth
                </p>
              </div>

              <button
                onClick={() => navigate("/mentors?tab=group-session")}
                className="relative inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden group"
              >
                <span className="relative z-10">View All Sessions</span>
                <ArrowRight
                  size={18}
                  className="relative z-10 transform group-hover:translate-x-1 transition-transform"
                />
                <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-indigo-600 to-indigo-800 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>
          </div>

          {/* Navigation arrows - only shown on desktop */}
          <div className="relative">
            <button
              onClick={() =>
                groupSessionsScrollContainerRef.current?.scrollBy({
                  left: -330,
                  behavior: "smooth",
                })
              }
              className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-colors hidden md:flex"
              aria-label="Scroll left"
            >
              <ArrowRight size={20} className="transform rotate-180" />
            </button>

            <button
              onClick={() =>
                groupSessionsScrollContainerRef.current?.scrollBy({
                  left: 330,
                  behavior: "smooth",
                })
              }
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100 flex items-center justify-center text-gray-600 hover:text-indigo-600 transition-colors hidden md:flex"
              aria-label="Scroll right"
            >
              <ArrowRight size={20} />
            </button>

            <div
              ref={groupSessionsScrollContainerRef}
              className="flex overflow-x-auto gap-6 pb-8 pt-2 cursor-grab active:cursor-grabbing scroll-smooth hide-scrollbar snap-x"
              onMouseDown={handleGroupSessionsMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onMouseMove={handleGroupSessionsMouseMove}
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {groupSessions
                .sort((a, b) => {
                  const dateA = a.created_at
                    ? new Date(a.created_at).getTime()
                    : 0;
                  const dateB = b.created_at
                    ? new Date(b.created_at).getTime()
                    : 0;
                  return dateB - dateA;
                })
                .map((session, index) => {
                  const mentor = mentors.find(
                    (m) => m.userId === session.userId
                  );

                  // Calculate a random accent color for each card
                  const accentColors = [
                    "from-indigo-500 to-blue-500",
                    "from-purple-500 to-indigo-500",
                    "from-blue-500 to-cyan-500",
                    "from-violet-500 to-purple-500",
                  ];
                  const accentColor = accentColors[index % accentColors.length];

                  return (
                    <div
                      key={session.sessionId}
                      className="flex-none w-[280px] md:w-[320px] select-none bg-white rounded-xl shadow-md hover:shadow-xl 
                  transition-all duration-300 border border-gray-100 hover:border-indigo-100 group overflow-hidden card-hover-effect snap-start"
                    >
                      {/* Colored header */}
                      <div className="relative h-[80px] bg-gradient-to-r overflow-hidden p-3 flex justify-between items-start">
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${accentColor} opacity-10`}
                        ></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.07]"></div>

                        {/* Badge */}
                        <div className="relative">
                          <div className="px-3 py-1 bg-white/80 backdrop-blur-sm text-gray-800 text-xs rounded-full shadow-sm border border-gray-100 font-medium">
                            {session.numberOfSessions !== "1"
                              ? `${session.numberOfSessions} Sessions`
                              : "1 Session"}
                          </div>
                        </div>

                        {/* Price badge */}
                        <div className="relative z-10">
                          <div className="px-3 py-1 bg-black/80 backdrop-blur-sm text-white text-xs rounded-full font-semibold shadow-sm">
                            {session.price === "0"
                              ? "Free"
                              : `₹${session.price}`}
                          </div>
                        </div>

                        {/* Avatar positioned at the bottom of the header */}
                        <div className="absolute -bottom-7 left-4">
                          <div className="p-1 bg-white rounded-full shadow-md">
                            <div className="relative w-14 h-14 rounded-full overflow-hidden">
                              <div
                                className={`absolute inset-0 bg-gradient-to-br ${accentColor} opacity-20 group-hover:opacity-30 transition-opacity`}
                              ></div>
                              <img
                                src={
                                  session?.sessionName
                                    ? `https://ui-avatars.com/api/?name=${session?.sessionName}&background=random&size=200`
                                    : `https://ui-avatars.com/api/?name=new&background=random&size=200`
                                }
                                alt={mentor?.name || "Session"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-10">
                        <div className="mb-4">
                          <h3 className="font-bold text-lg text-gray-800 line-clamp-1 group-hover:text-indigo-700 transition-colors">
                            {session.sessionName}
                          </h3>
                          {mentor && (
                            <p className="text-gray-500 text-sm flex items-center gap-1.5">
                              <Users size={14} className="text-indigo-400" />
                              <span className="line-clamp-1">
                                by {mentor.name}
                              </span>
                            </p>
                          )}
                        </div>

                        <div className="space-y-3 mb-5">
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                              <Calendar size={15} className="text-indigo-600" />
                            </div>
                            <span className="text-sm">
                              {new Date(
                                session.created_at || new Date()
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                              <Clock size={15} className="text-indigo-600" />
                            </div>
                            <span className="text-sm">
                              {session.duration} mins each session
                            </span>
                          </div>

                          {/* Topics section */}
                          <div className="pt-3 border-t border-gray-100">
                            <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                              Topics covered
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {session.topics
                                .slice(0, 3)
                                .map((topic, topicIndex) => (
                                  <span
                                    key={topicIndex}
                                    className="text-xs px-2 py-1 bg-gray-50 border border-gray-100 text-gray-700 rounded-full group-hover:bg-indigo-50 group-hover:text-indigo-700 group-hover:border-indigo-100 transition-colors"
                                  >
                                    {topic}
                                  </span>
                                ))}
                              {session.topics.length > 3 && (
                                <span className="text-xs px-2 py-1 bg-gray-50 border border-gray-100 text-gray-700 rounded-full">
                                  +{session.topics.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            navigate(`/booking/${session.sessionId}`)
                          }
                          className="w-full py-3 bg-black text-white text-sm rounded-xl hover:bg-gray-800 group-hover:bg-indigo-600 transition-all flex items-center justify-center gap-1.5 shine-effect"
                        >
                          Book Your Spot
                          <ArrowRight
                            size={14}
                            className="transform group-hover:translate-x-1 transition-transform"
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}

              {/* Add an "Explore more" card at the end */}
              <div
                className="flex-none w-[240px] md:w-[270px] select-none bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-md border border-indigo-100 overflow-hidden snap-start flex items-center justify-center group cursor-pointer"
                onClick={() => navigate("/mentors?tab=group-session")}
              >
                <div className="text-center p-8">
                  <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4 transform group-hover:rotate-12 transition-transform">
                    <ArrowRight
                      size={24}
                      className="text-indigo-600 transform group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                  <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-indigo-700 transition-colors">
                    Explore More Sessions
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Browse our full catalog of group learning experiences
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile scroll indicator dots */}
          <div className="md:hidden flex justify-center mt-4">
            <div className="scroll-indicator-dots">
              <div className="scroll-indicator-dot active"></div>
              <div className="scroll-indicator-dot"></div>
              <div className="scroll-indicator-dot"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Ask Me Anything Sessions Section - Creative Showcase */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-br from-gray-50 via-amber-50/20 to-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/inspiration-geometry.png')] opacity-[0.03]"></div>
        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-amber-100/30 filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rose-100/20 mix-blend-multiply filter blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4 border border-amber-100 shadow-sm">
              <MessageCircle size={16} className="text-amber-600" />
              <span>Learn From The Best</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
              Ask Me Anything Sessions
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              Join interactive live sessions with industry experts who share
              their insights and answer your burning questions in real-time
            </p>

            <button
              onClick={() => navigate("/ama")}
              className="inline-flex items-center gap-2 px-6 py-3 border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-full text-amber-800 hover:text-amber-900 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/40 transition-all group mb-16"
            >
              <span className="font-medium">View All AMA Sessions</span>
              <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center transform group-hover:translate-x-0.5 transition-all">
                <ArrowRight size={14} className="text-amber-700" />
              </div>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
            </div>
          ) : (
            <div className="relative p-1">
              {/* Highlight ring animation */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-200 via-rose-200 to-amber-200 animate-pulse opacity-70 blur-xl"></div>

              {/* Main AMA showcase */}
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-1 shadow-xl overflow-hidden border border-amber-100">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>

                {/* Featured session - larger display */}
                {amaSessions.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 relative">
                    <div className="bg-gradient-to-br from-white to-amber-50 p-8 md:p-10 rounded-tl-2xl rounded-bl-2xl md:rounded-bl-none md:rounded-tr-none relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
                      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-500 md:hidden"></div>

                      {/* Animated spotlight effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-radial-gradient pointer-events-none"></div>

                      <div className="flex items-start gap-5 mb-6">
                        <div className="relative flex-shrink-0">
                          <div className="p-1 bg-white rounded-full shadow-md ring-2 ring-amber-100 z-10 relative">
                            <div className="w-20 h-20 rounded-full overflow-hidden">
                              <img
                                src={
                                  amaSessions[0]?.mentor.image ||
                                  "https://randomuser.me/api/portraits/men/1.jpg"
                                }
                                alt={amaSessions[0]?.mentor.name || "Mentor"}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="absolute top-0 left-0 w-full h-full bg-amber-200 rounded-full filter blur-xl opacity-30 animate-pulse"></div>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                              Featured
                            </span>
                            <span className="text-amber-600 text-sm">
                              Live Session
                            </span>
                          </div>
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 line-clamp-2">
                            {amaSessions[0]?.title || "Loading session..."}
                          </h3>
                          <p className="text-gray-600 flex items-center gap-2 mb-4">
                            <span className="font-medium">
                              {amaSessions[0]?.mentor.name || "Expert Mentor"}
                            </span>
                            <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                            <span>
                              {amaSessions[0]?.mentor.role || "Industry Expert"}
                            </span>
                          </p>

                          <div className="mb-5 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                                <Calendar
                                  size={16}
                                  className="text-amber-600"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-700">
                                  {amaSessions[0]?.date || "Upcoming"} •{" "}
                                  {amaSessions[0]?.time || "7:00 PM IST"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {amaSessions[0]?.duration || "60 minutes"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                                <Users2 size={16} className="text-amber-600" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium text-gray-700">
                                    {amaSessions[0]?.registrants || 0}/
                                    {amaSessions[0]?.maxRegistrants || 50}{" "}
                                    registered
                                  </p>
                                  <p className="text-xs text-amber-600 font-medium">
                                    {(amaSessions[0]?.maxRegistrants || 50) -
                                      (amaSessions[0]?.registrants || 0)}{" "}
                                    spots left
                                  </p>
                                </div>
                                <div className="w-full mt-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                  <div
                                    className="h-1.5 rounded-full bg-amber-500"
                                    style={{
                                      width: `${
                                        ((amaSessions[0]?.registrants || 0) /
                                          (amaSessions[0]?.maxRegistrants ||
                                            50)) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() =>
                              navigate(`/questions/${amaSessions[0]?._id}`)
                            }
                            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg shadow-amber-200/50 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                          >
                            Register for Session
                            <ArrowRight
                              size={16}
                              className="transform group-hover:translate-x-0.5 transition-transform"
                            />
                          </button>
                        </div>
                      </div>

                      <div className="bg-amber-50/70 rounded-xl p-5 border border-amber-100/50">
                        <h4 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                          <MessageCircle size={16} className="text-amber-600" />
                          <span>Topics You'll Explore</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(
                            amaSessions[0]?.questions || [
                              "Career growth in tech",
                              "Building successful products",
                              "Leadership skills",
                            ]
                          )
                            .slice(0, 4)
                            .map((question, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                                <p className="text-sm text-gray-700">
                                  {question}
                                </p>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Right side - upcoming sessions list */}
                    <div className="bg-white rounded-tr-2xl rounded-br-2xl md:rounded-bl-2xl md:rounded-tl-none p-8 relative">
                      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-rose-400 to-rose-500"></div>
                      <div className="mb-5">
                        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                          <Calendar size={18} className="text-rose-500" />
                          Upcoming Sessions
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Don't miss these exciting opportunities
                        </p>
                      </div>

                      <div className="space-y-0.5">
                        {amaSessions.slice(1, 4).map((session, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-xl hover:bg-rose-50/50 transition-colors border border-transparent hover:border-rose-100 group cursor-pointer"
                            onClick={() =>
                              navigate(`/questions/${session._id}`)
                            }
                          >
                            <div className="flex items-start gap-4">
                              <div className="relative">
                                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white">
                                  <img
                                    src={session.mentor.image}
                                    alt={session.mentor.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>

                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-800 line-clamp-1 mb-1 group-hover:text-rose-700 transition-colors">
                                  {session.title}
                                </h4>
                                <p className="text-xs text-gray-500 mb-2">
                                  with{" "}
                                  <span className="text-gray-700">
                                    {session.mentor.name}
                                  </span>
                                </p>

                                <div className="flex justify-between items-center text-xs">
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <Calendar
                                      size={12}
                                      className="text-rose-500"
                                    />
                                    <span>{session.date}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <Clock
                                      size={12}
                                      className="text-rose-500"
                                    />
                                    <span>{session.time}</span>
                                  </div>
                                  <div className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full font-medium">
                                    {session.maxRegistrants -
                                      session.registrants}{" "}
                                    spots
                                  </div>
                                </div>
                              </div>

                              <div className="ml-2 transition-transform transform translate-x-0 group-hover:translate-x-1 flex-shrink-0">
                                <ArrowRight
                                  size={16}
                                  className="text-rose-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 flex justify-center">
                        <button
                          onClick={() => navigate("/ama")}
                          className="inline-flex items-center gap-1.5 px-4 py-2 border border-rose-200 bg-rose-50 rounded-lg text-rose-700 hover:bg-rose-100 transition-colors text-sm font-medium"
                        >
                          <span>See all AMA sessions</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Women in Tech Section - Creative Carousel */}
      <section className="py-24 relative overflow-hidden bg-white">
        {/* Background elements */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-[0.02]"></div>
        <div className="absolute top-0 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-rose-100/40 to-transparent filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-rose-50/30 to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-sm font-medium mb-4 border border-rose-100 shadow-sm">
              <span className="w-1.5 h-1.5 bg-rose-600 rounded-full"></span>
              <span>Featured Series</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-rose-600 to-fuchsia-600 bg-clip-text text-transparent">
              Empowering Women in Technology
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
              Join exclusive sessions with accomplished women leaders in
              technology sharing their journey, insights, and strategies for
              success in the tech industry
            </p>

            {/* Decorative avatars */}
            <div className="flex justify-center -space-x-4 mb-10">
              {womenTechSessions.slice(0, 5).map((session, idx) => (
                <div
                  key={idx}
                  className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-rose-300 opacity-30 group-hover:opacity-0 transition-opacity"></div>
                  <img
                    src={session.mentor.image}
                    alt={session.mentor.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              <div className="w-14 h-14 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-rose-600 font-bold text-sm shadow-md">
                15+
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            </div>
          ) : (
            <div className="relative">
              {/* Interactive timeline/showcase */}
              <div className="relative rounded-2xl overflow-hidden border border-rose-100 shadow-xl bg-white">
                <div className="flex flex-col md:flex-row h-full">
                  {/* Left side: Featured mentor profile */}
                  <div className="w-full md:w-[40%] relative group overflow-hidden">
                    {womenTechSessions.length > 0 && (
                      <>
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>

                        {/* Background image */}
                        <div className="absolute inset-0 bg-rose-100 overflow-hidden">
                          <img
                            src={womenTechSessions[0].mentor.image}
                            alt={womenTechSessions[0].mentor.name}
                            className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-rose-600/40 to-fuchsia-600/40 mix-blend-multiply"></div>
                        </div>

                        {/* Content overlay */}
                        <div className="relative z-20 p-8 h-full flex flex-col justify-end">
                          <span className="text-xs font-semibold text-white/80 mb-2 uppercase tracking-wider">
                            Featured Speaker
                          </span>
                          <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                            {womenTechSessions[0].mentor.name}
                          </h3>
                          <p className="text-rose-200 font-medium mb-3">
                            {womenTechSessions[0].mentor.role}
                          </p>
                          <p className="text-white/80 text-sm mb-5 line-clamp-3">
                            {womenTechSessions[0].title}
                          </p>

                          <button
                            onClick={() =>
                              navigate(`/questions/${womenTechSessions[0]._id}`)
                            }
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-rose-700 rounded-lg font-medium hover:bg-rose-50 transition-colors self-start group/btn"
                          >
                            <span>Join Session</span>
                            <ArrowRight
                              size={16}
                              className="transform group-hover/btn:translate-x-0.5 transition-transform"
                            />
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right side: Session details in tabs/accordion */}
                  <div className="w-full md:w-[60%] bg-white p-8">
                    <div className="border-b border-gray-200 mb-5 flex items-center justify-between">
                      <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Calendar size={18} className="text-rose-500" />
                        <span>Upcoming Women in Tech Sessions</span>
                      </h3>
                      <button
                        onClick={() => navigate("/womentech")}
                        className="text-rose-600 text-sm font-medium flex items-center gap-1 hover:text-rose-700 transition-colors"
                      >
                        <span>View all</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                    <div className="space-y-6">
                      {womenTechSessions.slice(0, 3).map((session, idx) => (
                        <div
                          key={idx}
                          className="group cursor-pointer"
                          onClick={() => navigate(`/questions/${session._id}`)}
                        >
                          <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl border border-gray-100 hover:border-rose-100 hover:bg-rose-50/30 transition-all">
                            {/* Session date badge */}
                            <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
                              <div className="bg-rose-100 text-rose-800 rounded-lg p-3 w-16 h-16 flex flex-col items-center justify-center font-medium">
                                <span className="text-2xl font-bold">
                                  {session.date.split(" ")[0]}
                                </span>
                                <span className="text-xs uppercase">
                                  {session.date.split(" ")[1]}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500 font-medium sm:mt-2">
                                {session.time}
                                <br />
                                {session.duration}
                              </div>
                            </div>

                            {/* Session details */}
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-rose-700 transition-colors line-clamp-1">
                                {session.title}
                              </h4>

                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                  <img
                                    src={session.mentor.image}
                                    alt={session.mentor.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-800">
                                    {session.mentor.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {session.mentor.role}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-2 mb-3">
                                {session.questions
                                  .slice(0, 2)
                                  .map((topic, tidx) => (
                                    <span
                                      key={tidx}
                                      className="text-xs px-2 py-1 bg-white border border-rose-100 text-rose-700 rounded-full"
                                    >
                                      {topic.split(" ").slice(0, 3).join(" ")}
                                      ...
                                    </span>
                                  ))}
                                {session.questions.length > 2 && (
                                  <span className="text-xs px-2 py-1 bg-white text-gray-500 rounded-full">
                                    +{session.questions.length - 2} more
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Users2 size={14} className="text-rose-500" />
                                  <div className="w-24 bg-gray-100 rounded-full h-1.5">
                                    <div
                                      className="bg-rose-500 h-1.5 rounded-full"
                                      style={{
                                        width: `${
                                          (session.registrants /
                                            session.maxRegistrants) *
                                          100
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {session.maxRegistrants -
                                      session.registrants}{" "}
                                    spots left
                                  </span>
                                </div>

                                <div className="text-rose-600 flex items-center gap-1 text-sm font-medium">
                                  <span>Register</span>
                                  <ArrowRight
                                    size={14}
                                    className="transform group-hover:translate-x-1 transition-transform"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom testimonial */}
              <div className="mt-16 relative">
                <div className="absolute inset-0 bg-rose-50 rounded-2xl transform rotate-1 opacity-70"></div>
                <div className="absolute inset-0 bg-white rounded-2xl"></div>
                <div className="relative rounded-2xl border border-rose-100 shadow-md px-8 py-10 bg-white overflow-hidden">
                  {/* Decorative quotes */}
                  <div className="absolute top-6 left-6 text-rose-100 opacity-70">
                    <svg
                      width="100"
                      height="80"
                      viewBox="0 0 100 80"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M40 0H0V40L40 80V0Z M100 0H60V40L100 80V0Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>

                  <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xl md:text-2xl text-gray-700 font-medium mb-8 relative z-10">
                      "These Women in Tech sessions have been instrumental in my
                      career growth. Hearing from successful women leaders
                      who've navigated similar challenges has given me both
                      practical strategies and the confidence to pursue my
                      goals."
                    </p>

                    <div className="flex items-center justify-center">
                      <div className="mr-4 w-16 h-16 rounded-full overflow-hidden ring-4 ring-rose-100">
                        <img
                          src="https://randomuser.me/api/portraits/women/44.jpg"
                          alt="Sarah Johnson"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-900 text-lg">
                          Sarah Johnson
                        </p>
                        <p className="text-rose-600">
                          Senior Software Engineer
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        ref={journeySectionRef}
        className={`journey-section py-24 md:py-32 bg-gradient-to-b from-white via-indigo-50/10 to-white relative overflow-hidden min-h-[650px] ${
          isJourneySectionInView ? "in-view" : ""
        }`}
      >
        {/* Background elements with more dynamic animation */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.05]"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-100/30 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-100/20 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-blue-100/10 to-purple-100/10 rounded-full opacity-60"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium mb-4 border border-indigo-100 animate-pulse">
              <Award size={16} className="text-indigo-500" />
              <span>Career Transformation</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
              Roadmap to Your Dream Career
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Our mentorship ecosystem is designed to transform your career
              trajectory through personalized guidance and expert-led growth
              opportunities
            </p>
          </div>

          <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
            {/* Journey cards with enhanced content and animation */}
            <div className="journey-card">
              <div className="bg-white rounded-xl p-6 shadow-xl w-[18rem] md:w-[22rem] h-[17rem] hover:shadow-2xl transition-all duration-300 border border-indigo-50 group hover:border-indigo-200">
                <div className="flex justify-between items-start mb-5">
                  <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-3.5 rounded-xl inline-block group-hover:scale-110 transition-transform">
                    <BookOpen size={28} className="text-indigo-600" />
                  </div>
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-full text-xs font-medium">
                    Phase 1
                  </span>
                </div>
                <h4 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-indigo-700 transition-colors">
                  Find Your Perfect Match
                </h4>
                <p className="text-gray-600 leading-relaxed mb-5">
                  Our AI matching algorithm connects you with industry leaders
                  whose expertise aligns perfectly with your career goals and
                  learning style.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users size={15} className="text-indigo-500" />
                    <span>500+ Elite Industry Experts</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      FAANG Leaders
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      Tech Pioneers
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      CXOs
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="journey-card">
              <div className="bg-white rounded-xl p-6 shadow-xl w-[18rem] md:w-[22rem] h-[17rem] hover:shadow-2xl transition-all duration-300 border border-indigo-50 group hover:border-indigo-200">
                <div className="flex justify-between items-start mb-5">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3.5 rounded-xl inline-block group-hover:scale-110 transition-transform">
                    <Clock size={28} className="text-indigo-600" />
                  </div>
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-full text-xs font-medium">
                    Phase 2
                  </span>
                </div>
                <h4 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-indigo-700 transition-colors">
                  Personalized Learning Path
                </h4>
                <p className="text-gray-600 leading-relaxed mb-5">
                  Experience tailored learning journeys designed by your mentor
                  to accelerate your growth through targeted skill development.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={15} className="text-indigo-500" />
                    <span>Flexible Learning Formats</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      1:1 Coaching
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      Group Masterminds
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      AMAs
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="journey-card">
              <div className="bg-white rounded-xl p-6 shadow-xl w-[18rem] md:w-[22rem] h-[17rem] hover:shadow-2xl transition-all duration-300 border border-indigo-50 group hover:border-indigo-200">
                <div className="flex justify-between items-start mb-5">
                  <div className="bg-gradient-to-br from-indigo-50 to-cyan-50 p-3.5 rounded-xl inline-block group-hover:scale-110 transition-transform">
                    <Coffee size={28} className="text-indigo-600" />
                  </div>
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-full text-xs font-medium">
                    Phase 3
                  </span>
                </div>
                <h4 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-indigo-700 transition-colors">
                  Accelerated Growth
                </h4>
                <p className="text-gray-600 leading-relaxed mb-5">
                  Leverage insider knowledge to overcome challenges, build
                  industry connections, and gain access to exclusive
                  opportunities.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Star size={15} className="text-indigo-500" />
                    <span>Proven Success Methods</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      Skill Mastery
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      Network Building
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      Fast-track Growth
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="journey-card">
              <div className="bg-white rounded-xl p-6 shadow-xl w-[18rem] md:w-[22rem] h-[17rem] hover:shadow-2xl transition-all duration-300 border border-indigo-50 group hover:border-indigo-200">
                <div className="flex justify-between items-start mb-5">
                  <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 p-3.5 rounded-xl inline-block group-hover:scale-110 transition-transform">
                    <Trophy size={28} className="text-indigo-600" />
                  </div>
                  <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-full text-xs font-medium">
                    Phase 4
                  </span>
                </div>
                <h4 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-indigo-700 transition-colors">
                  Career Elevation
                </h4>
                <p className="text-gray-600 leading-relaxed mb-5">
                  Transform theory into real-world success with breakthrough
                  career opportunities, promotions, and industry recognition.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Award size={15} className="text-indigo-500" />
                    <span>Tangible Career Outcomes</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      Job Offers
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      Promotions
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      Leadership Roles
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Center Card with more interactive elements */}
            <div className="journey-center-card w-[300px] md:w-[380px] bg-white rounded-2xl shadow-2xl p-7 border border-indigo-100 overflow-hidden hover:border-indigo-300 transition-colors">
              <div className="h-40 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-xl mb-6 overflow-hidden relative p-5 flex items-center justify-center group bg-[length:200%_200%] animate-gradient">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                {/* Added animated particles */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                  <div className="absolute w-2 h-2 bg-white/30 rounded-full top-[20%] left-[10%] animate-float"></div>
                  <div className="absolute w-1.5 h-1.5 bg-white/40 rounded-full top-[70%] left-[20%] animate-float animation-delay-2000"></div>
                  <div className="absolute w-3 h-3 bg-white/20 rounded-full top-[40%] left-[80%] animate-float animation-delay-1000"></div>
                  <div className="absolute w-2 h-2 bg-white/30 rounded-full top-[60%] left-[85%] animate-float animation-delay-3000"></div>
                  <div className="absolute w-2 h-2 bg-white/30 rounded-full top-[10%] left-[60%] animate-float animation-delay-4000"></div>
                </div>

                <div className="relative z-10 transform group-hover:scale-110 transition-transform duration-500 shine-effect">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/6009/6009939.png"
                    alt="Mentor Connect"
                    className="h-32 w-32 object-contain drop-shadow-lg"
                  />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-3 text-gray-800">
                Start Your Success Journey
              </h3>
              <p className="text-gray-600 text-center mb-7 text-base leading-relaxed">
                Join thousands of professionals who have transformed their
                careers through personalized mentorship from industry leaders.
              </p>
              <div className="flex justify-center">
                <button
                  onClick={() => navigate("/mentors")}
                  className="group px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1 flex items-center gap-2 relative overflow-hidden"
                >
                  <span className="relative z-10">Explore Mentors</span>
                  <ArrowRight
                    size={18}
                    className="relative z-10 transform group-hover:translate-x-1 transition-transform"
                  />
                  <div className="absolute inset-0 h-full w-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                </button>
              </div>

              {/* Added success metrics */}
              <div className="flex justify-between mt-6 pt-5 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">93%</p>
                  <p className="text-xs text-gray-500">Career Growth</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">3.2x</p>
                  <p className="text-xs text-gray-500">Skill Improvement</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">45+</p>
                  <p className="text-xs text-gray-500">Industries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
