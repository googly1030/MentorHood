import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  Users,
  User,
  Calendar,
  Plus,
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
        {/* Animated background elements - preserved for all devices */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100/40 rounded-full filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full filter blur-3xl opacity-60 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-purple-100/20 rounded-full filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

        {/* Background pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>

        {/* Background profile images - hide on mobile only */}
        <div className="absolute inset-0 overflow-hidden">
          {/* All mentor images hidden on mobile */}
          <img
            src={mentor1}
            alt="Mentor1"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110 animate-float hidden sm:block"
            style={{ left: "2%", top: "23%" }}
          />
          <img
            src={mentor2}
            alt="Mentor2"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110 animate-float animation-delay-2000 hidden sm:block"
            style={{ right: "2%", top: "23%" }}
          />
          <img
            src={mentor3}
            alt="Mentor3"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110 hidden sm:block"
            style={{ left: "88%", top: "56%" }}
          />
          <img
            src={mentor4}
            alt="Mentor4"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110 hidden sm:block"
            style={{ right: "12%", top: "32%" }}
          />
          <img
            src={mentor5}
            alt="Mentor"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110 hidden sm:block"
            style={{ right: "15%", top: "66%" }}
          />

          {/* Left side images (mirrored) */}
          <img
            src={mentor6}
            alt="Mentor"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110 hidden sm:block"
            style={{ right: "88%", top: "56%" }}
          />
          <img
            src={mentor7}
            alt="Mentor"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110 hidden sm:block"
            style={{ left: "12%", top: "32%" }}
          />
          <img
            src={mentor8}
            alt="Mentor"
            className="absolute w-[80px] h-[80px] object-cover rounded-full opacity-[0.8] hover:opacity-40 transition-all duration-300 transform hover:scale-110 hidden sm:block"
            style={{ left: "15%", top: "66%" }}
          />
        </div>

        {/* Content - improved mobile text sizing and spacing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center items-center flex-col relative z-[2] pt-12 sm:pt-20 pb-16 sm:pb-24 md:pt-28 md:pb-32">
          {/* Subtle top badge - mobile optimized */}
          <div className="mb-4 sm:mb-6 bg-white/70 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-sm border border-indigo-100 flex items-center">
            <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green-500 mr-1.5 sm:mr-2"></span>
            <span className="text-xs sm:text-sm font-medium text-gray-600">
              500+ Mentors Available Now
            </span>
          </div>

          {/* Main heading with better mobile sizing */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold mb-4 sm:mb-6 max-w-5xl text-center mx-auto leading-tight tracking-tight">
            Unlock Your{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
                Dream Career
              </span>
              <svg
                className="absolute -bottom-1 sm:-bottom-2 left-0 w-full"
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

          {/* Paragraph with better mobile spacing */}
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-12 text-gray-700 text-center max-w-2xl mx-auto leading-relaxed">
            Navigate your academic journey and accelerate your career with
            personalized 1:1 mentorship from industry leaders.
          </p>

          {/* Buttons - stacked on mobile */}
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-5 items-center">
            <button
              onClick={() => navigate("/mentors")}
              className="w-full sm:w-auto relative px-6 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-[#4937e8] to-[#4338ca] text-white rounded-xl font-medium shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 group overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[#4338ca] to-[#4937e8] transition-all duration-300 transform translate-x-full group-hover:translate-x-0 opacity-0 group-hover:opacity-100"></span>
              <span className="relative z-10">Find a Mentor</span>
              <ArrowRight
                size={18}
                className="relative z-10 transform group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 bg-white border border-gray-200 text-gray-800 rounded-xl font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all group flex items-center justify-center gap-2"
            >
              <span>Join as Mentor</span>
              <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center transform group-hover:rotate-45 transition-transform">
                <span className="text-indigo-500 font-bold text-xs">+</span>
              </div>
            </button>
          </div>

          {/* Bottom avatars section - mobile optimized */}
          <div className="mt-8 sm:mt-16 flex flex-col items-center justify-center">
            <div className="flex -space-x-2 sm:-space-x-3 mb-2 sm:mb-3">
              {[mentor1, mentor2, mentor3, mentor4].map((img, i) => (
                <div key={i} className="relative">
                  <div
                    className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  ></div>
                  <img
                    src={img}
                    alt="Mentor"
                    className="relative w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 border-white object-cover shadow-md"
                  />
                </div>
              ))}
              <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-indigo-500 font-bold text-xs sm:text-sm shadow-md">
                500+
              </div>
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium text-center">
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
              <div className="inline-block px-3 py-1 bg-gray-900 text-gray-100 rounded-full text-sm font-medium mb-3 border border-gray-800">
                Vetted & Verified
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                Our Expert Mentors
              </h2>
              <p className="text-gray-600 max-w-xl leading-relaxed">
                Connect with industry leaders who've been where you want to go.
                Our mentors are hand-picked for their expertise and passion for
                helping others grow.
              </p>
            </div>
            <button
              className="hidden md:flex items-center gap-3 mt-4 md:mt-0 group relative px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              onClick={() => navigate("/mentors")}
            >
              {/* Button content */}
              <div className="relative z-10 flex items-center gap-3">
                <span className="font-medium">View All Mentors</span>
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                  <ArrowRight 
                    size={16} 
                    className="text-white transform transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" 
                  />
                </div>
              </div>
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-gray-700" />
            </div>
          ) : error ? (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100">
              <div className="text-gray-700 font-medium">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 text-sm hover:bg-gray-50"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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
                .slice(0, 6)
                .map((mentor, index) => (
                  <div
                    key={mentor.userId}
                    ref={(el) => (cardsRef.current[index] = el)}
                    className={`
                      flex-none bg-white rounded-xl select-none
                      shadow-lg hover:shadow-2xl transition-all duration-500
                      border border-gray-200 hover:border-indigo-200
                      group overflow-visible relative
                      transform-gpu
                      scale-100 hover:scale-105
                      z-0 hover:z-50
                      ${visibleCards[index] ? "visible" : ""}
                    `}
                    onClick={() => navigate(`/profile/${mentor.userId}`)}
                  >
                    {/* Profile Header */}
                    <div className="relative">
                      {/* Modern geometric pattern header */}
                      <div className="h-28 relative overflow-hidden bg-gray-50">
                        <div className="absolute inset-0 opacity-[0.03]">
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')]"></div>
                        </div>
                        
                        {/* Decorative shapes */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gray-900/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-16 h-16 bg-indigo-500/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                        
                        {/* Subtle border */}
                        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                      </div>
                      
                      {/* Experience Badge - Updated styling */}
                      <div className="absolute top-4 right-4">
                        <div className="px-3 py-1.5 bg-white/95 text-gray-900 rounded-full text-xs font-medium shadow-sm border border-gray-200/50 backdrop-blur-sm group-hover:bg-gray-900 group-hover:text-white transition-colors duration-300">
                          {mentor.totalExperience?.years || 0}+ years
                        </div>
                      </div>
                      
                      {/* Profile Image - Enhanced styling */}
                      <div className="absolute -bottom-10 left-6">
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full border-4 border-white shadow-lg overflow-hidden group-hover:ring-4 group-hover:ring-indigo-100 transition-all duration-300">
                            <img
                              src={
                                mentor.profilePhoto ||
                                (mentor.name
                                  ? `https://ui-avatars.com/api/?name=${mentor.name}&background=random&size=200`
                                  : `https://ui-avatars.com/api/?name=new&background=random&size=200`)
                              }
                              alt={mentor.name}
                              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                          <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                      </div>
                    </div>

                    {/* Profile Content */}
                    <div className="pt-12 px-6 pb-6">
                      {/* Name and Title */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                          {mentor.name}
                        </h3>
                        <p className="text-gray-600 line-clamp-1">
                          {mentor.headline || mentor.primaryExpertise}
                        </p>
                      </div>

                      {/* Skills */}
                      <div className="space-y-2 mb-6">
                        <div className="flex flex-wrap gap-2">
                          {mentor.disciplines?.slice(0, 2).map((discipline, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium"
                            >
                              {discipline}
                            </span>
                          ))}
                          {mentor.skills?.slice(0, 1).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {((mentor.disciplines?.length || 0) + (mentor.skills?.length || 0)) > 3 && (
                            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium flex items-center gap-1">
                              <Plus size={12} />
                              {((mentor.disciplines?.length || 0) + (mentor.skills?.length || 0)) - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bio/Description */}
                      <p className="text-gray-600 text-sm line-clamp-2 mb-6 h-10">
                        {mentor.bio || `Expert in ${mentor.primaryExpertise} with ${mentor.totalExperience?.years || 0}+ years of experience.`}
                      </p>

                      {/* Action Buttons - Changed book session button to black */}
                      <div className="flex gap-3">
                        <button className="flex-1 bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-black transition-colors duration-200 flex items-center justify-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          Book a Session
                        </button>
                        <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2 text-sm">
                          <User className="w-4 h-4" />
                          View Profile
                        </button>
                      </div>
                    
                    </div>
                  </div>
                ))}
            </div>
          )}

          <div className="flex justify-center items-center w-full px-4 md:hidden">
            <button
              className="w-full sm:w-auto group px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
              onClick={() => navigate("/mentors")}
            >
              <Users size={18} className="text-white/90" />
              <span>View All Mentors</span>
              <ArrowRight 
                size={18} 
                className="transform transition-all duration-300 group-hover:translate-x-1 group-hover:scale-110" 
              />
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
