import { useRef, useEffect, useState } from "react";
import { ArrowRight, Clock, Calendar } from "lucide-react";
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
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const [isRow1Hovered, setIsRow1Hovered] = useState(false);
  const [isRow2Hovered, setIsRow2Hovered] = useState(false);

  // Modify the useEffect hook for smooth infinite scrolling
  useEffect(() => {
    const animateScroll = () => {
      if (row1Ref.current && !isRow1Hovered) {
        if (row1Ref.current.scrollLeft >= row1Ref.current.scrollWidth / 3) {
          row1Ref.current.scrollLeft = 0;
        } else {
          row1Ref.current.scrollLeft += 1;
        }
      }

      if (row2Ref.current && !isRow2Hovered) {
        if (row2Ref.current.scrollLeft <= 0) {
          row2Ref.current.scrollLeft = row2Ref.current.scrollWidth / 3;
        } else {
          row2Ref.current.scrollLeft -= 1;
        }
      }
    };

    const intervalId = setInterval(animateScroll, 30);
    return () => clearInterval(intervalId);
  }, [isRow1Hovered, isRow2Hovered]);

  // Prepare session data
  const sortedSessions = [...oneOnOneSessions].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  // Create two rows with different sessions for better visual effect
  const row1Sessions = sortedSessions.filter((_, i) => i % 2 === 0);
  const row2Sessions = sortedSessions.filter((_, i) => i % 2 === 1);

  return (
    <section className="relative py-24 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02]"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      
      {/* Remove these two div elements
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full filter opacity-50"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full filter opacity-40"></div>
      */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20">
          <div data-aos="fade-up" className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 text-gray-100 rounded-full text-sm font-medium mb-3 border border-gray-800 shadow-sm">
              <Clock size={14} className="text-gray-100" />
              <span>1:1 Personalized Sessions</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent leading-tight">
              Accelerate Your Growth with<br className="hidden md:block" /> One-on-One Mentorship
            </h2>
            <p className="text-gray-600 max-w-xl leading-relaxed text-lg">
              Get undivided attention and personalized guidance from industry
              experts tailored to your specific needs and career goals.
            </p>
          </div>
          
          <button
            onClick={() => navigate("/mentors?tab=one-on-one")}
            className="mt-6 md:mt-0 group relative px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="relative z-10 flex items-center gap-3">
              <span className="font-medium">View All Sessions</span>
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                <ArrowRight size={14} className="text-white transform group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
              </div>
            </div>
          </button>
        </div>

        {/* Auto-scrolling rows */}
        <div className="space-y-16">
          {/* Row 1 - Left to Right */}
          <div 
            className="relative py-8" // Added vertical padding
            data-aos="fade-up" 
            data-aos-delay="300"
            onMouseEnter={() => setIsRow1Hovered(true)}
            onMouseLeave={() => setIsRow1Hovered(false)}
          >
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
            
            <div 
              ref={row1Ref}
              className="flex gap-6 overflow-x-auto overflow-y-visible hide-scrollbar px-5" // Removed pb-4 and added overflow-y-visible
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {generateCardRows(row1Sessions, mentors, navigate, false)}
              {generateCardRows(row1Sessions, mentors, navigate, false)}
              {generateCardRows(row1Sessions, mentors, navigate, false)}
            </div>
          </div>

          {/* Row 2 - Right to Left */}
          <div 
            className="relative py-8" // Added vertical padding
            data-aos="fade-up" 
            data-aos-delay="400"
            onMouseEnter={() => setIsRow2Hovered(true)}
            onMouseLeave={() => setIsRow2Hovered(false)}
          >
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
            
            <div 
              ref={row2Ref}
              className="flex gap-6 overflow-x-auto overflow-y-visible hide-scrollbar px-5" // Removed pb-4 and added overflow-y-visible
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {generateCardRows(row2Sessions, mentors, navigate, true)}
              {generateCardRows(row2Sessions, mentors, navigate, true)}
              {generateCardRows(row2Sessions, mentors, navigate, true)}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center" data-aos="fade-up" data-aos-delay="500">
          <p className="text-gray-600 mb-4 max-w-2xl mx-auto">
            Looking for a specific expertise? Explore our curated list of expert mentors.
          </p>
          <button
            onClick={() => navigate("/mentors")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-800 hover:bg-gray-50 hover:shadow-md transition-all group"
          >
            <span className="font-medium">Find Your Perfect Mentor</span>
            <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center transform group-hover:translate-x-0.5 transition-all">
              <ArrowRight size={14} className="text-gray-800" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

// Helper function to generate card rows
function generateCardRows(
  sessions: Session[], 
  mentors: Mentor[], 
  navigate: ReturnType<typeof useNavigate>, 
  reverse: boolean
) {
  return sessions.map((session) => {
    const mentor = mentors.find((m) => m.userId === session.userId);
    if (!mentor) return null;

    return (
      <div
        key={`${session.sessionId}-${reverse ? 'reverse' : 'normal'}`}
        className={`
          flex-none w-[300px] select-none bg-white rounded-xl 
          shadow-lg hover:shadow-2xl transition-all duration-500 
          border border-gray-200 hover:border-indigo-200 
          group overflow-visible relative 
          transform-gpu 
          scale-100 hover:scale-105
          z-0 hover:z-50
          my-4 
          ${reverse ? '' : ''}
        `}
      >
      
        
        {/* Popular tag - for some sessions */}
        {session.isPaid && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-gray-900/90 text-gray-100 text-xs font-medium rounded-md z-10 shadow-md">
            Popular
          </div>
        )}
        
        {/* Card content */}
        <div className="p-6">
          {/* Mentor info */}
          <div className="flex items-start gap-4 mb-5">
            <div className="relative flex-shrink-0">
              <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-gray-100 group-hover:ring-indigo-200 transition-all duration-300 shadow-md">
                <img
                  src={
                    mentor.profilePhoto ||
                    `https://ui-avatars.com/api/?name=${mentor.name}&background=random&size=200`
                  }
                  alt={mentor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-gray-800 transition-colors text-lg">
                {mentor.name}
              </h3>
              <p className="text-sm text-gray-500 line-clamp-1">
                {mentor.headline || mentor.primaryExpertise}
              </p>
              {/* Removed the ratings/reviews section */}
            </div>
          </div>
          
          {/* Session details */}
          <div className="mb-5">
            <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-indigo-700 transition-colors line-clamp-1">
              {session.sessionName}
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  {session.duration} min session
                </span>
              </div>

              {/* Session topics */}
              <div className="flex flex-wrap gap-1.5">
                {session.topics.slice(0, 2).map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-700 transition-colors"
                  >
                    {topic}
                  </span>
                ))}
                {session.topics.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-lg group-hover:bg-gray-200 transition-colors">
                    +{session.topics.length - 2}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
                {session.description ||
                  "Personalized mentorship session to help you achieve your career goals."}
              </p>
            </div>
          </div>

          {/* Pricing and booking */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div>
              <span className="text-xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                {session.isPaid ? `₹${session.price}` : "Free"}
              </span>
              {session.isPaid && (
                <p className="text-xs text-gray-500">One-time payment</p>
              )}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/booking/${session.sessionId}`);
              }}
              className="relative overflow-hidden px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800 group-hover:bg-indigo-600 transition-colors flex items-center gap-2 shadow-md"
            >
              <Calendar size={14} className="text-white/80" />
              <span>Book Now</span>
            </button>
          </div>
        </div>
        
        {/* Hover overlay with gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    );
  });
}

export default OneOneSession;