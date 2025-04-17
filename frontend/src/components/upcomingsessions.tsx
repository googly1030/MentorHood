import { useRef, useState, useEffect } from "react";
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
const MENTOR_AVATARS = [
"https://guvi-mentorhood.s3.ap-south-1.amazonaws.com/profile-photos/5bf97dd0-22cc-43ca-9f29-b36dd47ba388-praveen.jpg",
"https://guvi-mentorhood.s3.ap-south-1.amazonaws.com/profile-photos/22130ebb-f59c-404a-a1c9-e3308c55cfeb-arun bro.jpg",
];

interface UpcomingSessionsProps {
  groupSessions: Session[];
  mentors: Mentor[];
}

const UpcomingSessions = ({ groupSessions, mentors }: UpcomingSessionsProps) => {
  const navigate = useNavigate();
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  
  const groupSessionsScrollContainerRef = useRef<HTMLDivElement>(null);

  // Simplified scroll handler
  const handleScroll = () => {
    if (groupSessionsScrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = groupSessionsScrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 0);
      const isAtEnd = Math.ceil(scrollLeft) >= scrollWidth - clientWidth - 1;
      setShowRightScroll(!isAtEnd);
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [groupSessions]);

  return (
    <section className="group-sessions-section py-24 bg-white relative overflow-hidden">
      {/* Subtle pattern for texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
      
      {/* Light decorative elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-100/20 rounded-full filter blur-3xl"></div>
      <div className="absolute bottom-40 left-10 w-72 h-72 bg-indigo-100/20 rounded-full filter blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center md:text-left mb-16">
          {/* Changed from indigo to black styling */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 text-gray-100 rounded-full text-sm font-medium mb-3 border border-gray-800 shadow-sm">
            <Users2 size={14} className="text-gray-100" />
            <span>Group Learning</span>
          </div>

          <div className="md:flex md:justify-between md:items-end">
            <div className="mb-6 md:mb-0">
              {/* Changed gradient colors to gray/black */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl leading-tight font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
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
          {showLeftScroll && (
            <button
              onClick={() =>
                groupSessionsScrollContainerRef.current?.scrollBy({
                  left: -330,
                  behavior: "smooth",
                })
              }
              className="absolute -left-4 top-1/2 transform -translate-y-1/2 z-10 
                w-12 h-12 rounded-full bg-black shadow-lg 
                flex items-center justify-center text-white
                transition-all hover:shadow-xl hover:bg-gray-900 hidden md:flex"
              aria-label="Scroll left"
            >
              <ArrowRight size={20} className="transform rotate-180" />
            </button>
          )}

          {showRightScroll && (
            <button
              onClick={() =>
                groupSessionsScrollContainerRef.current?.scrollBy({
                  left: 330,
                  behavior: "smooth",
                })
              }
              className="absolute -right-4 top-1/2 transform -translate-y-1/2 z-10 
                w-12 h-12 rounded-full bg-black shadow-lg
                flex items-center justify-center text-white
                transition-all hover:shadow-xl hover:bg-gray-900 hidden md:flex"
              aria-label="Scroll right"
            >
              <ArrowRight size={20} />
            </button>
          )}

          <div
            ref={groupSessionsScrollContainerRef}
            className="flex overflow-x-hidden gap-8 py-8 px-4 
        scroll-smooth hide-scrollbar snap-x snap-mandatory"
            onScroll={handleScroll}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              scrollBehavior: "smooth",
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
              .slice(0, 5)
              .map((session, index) => {
                const mentor = mentors.find(
                  (m) => m.userId === session.userId
                );



                return (
                  <div
                    key={session.sessionId}
                    className="flex-none w-[320px] md:w-[360px] select-none bg-white rounded-2xl 
                      shadow-lg hover:shadow-xl will-change-transform
                      transition-all duration-300 border-2 border-gray-200/80 
                      hover:border-gray-300 group overflow-visible 
                      relative snap-start transform-gpu hover:scale-[1.02]"
                    style={{
                      perspective: '1000px',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    {/* Session image - full width at top */}
                    <div className="relative h-[200px] rounded-t-2xl overflow-hidden">
                      <img
                        src={mentor?.profilePhoto || MENTOR_AVATARS[index % MENTOR_AVATARS.length]}
                        alt={mentor?.name || "Session"}
                        className="w-full h-full object-cover transform 
                          group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Session badges - positioned at bottom right of image */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-3 z-20">
                        <div className="px-3 py-1.5 bg-white/95 backdrop-blur-sm shadow-md text-gray-800 
                          text-xs rounded-full border border-gray-200/50 font-medium 
                          group-hover:border-indigo-200 transition-all duration-300"
                        >
                          {session.numberOfSessions !== "1" ? `${session.numberOfSessions} Sessions` : "1 Session"}
                        </div>

                        <div className="px-3 py-1.5 bg-black/90 backdrop-blur-sm text-white 
                          text-xs rounded-full font-semibold shadow-md"
                        >
                          {session.price === "0" ? "Free" : `₹${session.price}`}
                        </div>
                      </div>

                      {/* Optional: Add a gradient overlay for better text visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>

                    {/* Card content */}
                    <div className="p-6">
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
              className="flex-none w-[240px] md:w-[270px] select-none bg-gradient-to-br 
    from-indigo-50 to-white rounded-2xl shadow-md 
    border border-black/10 hover:border-black/20
    overflow-hidden snap-start flex items-center justify-center 
    group cursor-pointer transition-all duration-300"
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