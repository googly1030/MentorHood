import { useRef, useState } from "react";
import { ArrowRight, Calendar, Clock, Users, Users2 } from "lucide-react";
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

interface UpcomingSessionsProps {
  groupSessions: Session[];
  mentors: Mentor[];
}

const UpcomingSessions = ({ groupSessions, mentors }: UpcomingSessionsProps) => {
  const navigate = useNavigate();
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  const groupSessionsScrollContainerRef = useRef<HTMLDivElement>(null);
  
  const handleGroupSessionsMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    if (groupSessionsScrollContainerRef.current) {
      setStartX(e.pageX - groupSessionsScrollContainerRef.current.offsetLeft);
      setScrollLeft(groupSessionsScrollContainerRef.current.scrollLeft);
    }
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

  return (
    <section className="group-sessions-section py-24 bg-white relative overflow-hidden">
      {/* Subtle pattern for texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
      
      {/* Light decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-100/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-40 left-10 w-72 h-72 bg-indigo-100/20 rounded-full filter blur-3xl"></div>

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
  );
};

export default UpcomingSessions;