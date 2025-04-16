import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  Star,
  Users,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import OneOneSession from "./one-one-Session";
import UpcomingSessions from "./upcomingsessions";
import AskMeAnything from "./AskMeAnything";
import  WomenInTech  from './WomenInTech';

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

  // Create separate handling functions for each container

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
        </div>
      </div>
      <div className="expert-mentors-section py-20 md:py-28 bg-white relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
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
      <OneOneSession oneOnOneSessions={oneOnOneSessions} mentors={mentors} />
      <UpcomingSessions groupSessions={groupSessions} mentors={mentors} />
      <AskMeAnything amaSessions={amaSessions} loading={loading} />
      <WomenInTech womenTechSessions={womenTechSessions} loading={loading} />


    </div>
  );
}

export default App;
