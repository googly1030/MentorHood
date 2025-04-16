import { useRef, useState } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
  created_at?: string;
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
  created_at?: string;
}

interface OneOneSessionProps {
  oneOnOneSessions: Session[];
  mentors: Mentor[];
}

const OneOneSession = ({ oneOnOneSessions, mentors }: OneOneSessionProps) => {
  const navigate = useNavigate();
  const oneOnOneScrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleOneOnOneMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (oneOnOneScrollContainerRef.current) {
      setStartX(e.pageX - oneOnOneScrollContainerRef.current.offsetLeft);
      setScrollLeft(oneOnOneScrollContainerRef.current.scrollLeft);
    }
  };

  const handleOneOnOneMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !oneOnOneScrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - oneOnOneScrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    oneOnOneScrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
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
  );
};

export default OneOneSession;