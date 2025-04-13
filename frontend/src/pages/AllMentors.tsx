import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star , Clock, Briefcase, TrendingUp, Building2, Rocket , Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from '../utils/api';



interface TimeRange {
  start: string;
  end: string;
}

interface TimeSlot {
  day: string;
  available: boolean;
  timeRanges: TimeRange[];
}

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
  mentorId: string | null;
  userId: string;
  timeSlots: TimeSlot[];
  created_at: string;
  updated_at: string;
}

interface MentorProfile {
  userId: string;
  name: string;
  headline: string;
  membership: string;
  role: string;
  rating: number;
  bookings: number;
  location: string;
  availability: string;
  experience: Array<{
    title: string;
    company: string;
    description: string;
    duration: string;
  }>;
  totalExperience: {
    years: number;
    months: number;
  };
  primaryExpertise: string;
  disciplines: string[];
  skills: string[];
  mentoringTopics: string[];
  reviews: Array<{
    id: number;
    user: {
      name: string;
      image: string;
      role: string;
    };
    rating: number;
    comment: string;
    date: string;
  }>;
  image?: string;
  companyLogo?: string;
  services?: Array<{
    price: string;
    rating: number;
  }>;
}



const AllMentors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    isPremium: false,
    quickResponse: false,
    mostVisited: false,
    serviceBasedExperts: false,
    ventureCapital: false,
    hotSeller: false,
  });

  // Add sorting state
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'bookings' | ''>('');

  // Add state for API data
  const [oneOnOneSessions, setOneOnOneSessions] = useState<Session[]>([]);
  const [groupSessions, setGroupSessions] = useState<Session[]>([]);
  const [mentorProfiles, setMentorProfiles] = useState<MentorProfile[]>([]);
  const [loading, setLoading] = useState(true);

  // Get the tab from URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  const defaultTab = searchParams.get('tab') || 'all-mentors';
  const [activeTab, setActiveTab] = useState<'all-mentors' | 'one-on-one' | 'group-session'>(defaultTab as any);

  // Modify the setActiveTab function to update the URL
  const handleTabChange = (tab: 'all-mentors' | 'one-on-one' | 'group-session') => {
    setActiveTab(tab);
    navigate(`/mentors?tab=${tab}`, { replace: true });
  };

  const categories = [
    { id: 'most-visited', name: 'Most Visited', icon: TrendingUp },
    { id: 'service-based', name: 'Service Based', icon: Building2 },
    { id: 'company-experts', name: 'Company Experts', icon: Briefcase },
    { id: 'venture-capital', name: 'Venture Capital', icon: Rocket }
  ];

  // Filter mentors based on search and filters
  const filterMentors = (mentors: MentorProfile[]) => {
    return mentors.filter(mentor => {
      // Search query filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          mentor.name.toLowerCase().includes(searchLower) ||
          mentor.headline.toLowerCase().includes(searchLower) ||
          mentor.primaryExpertise.toLowerCase().includes(searchLower) ||
          mentor.skills.some(skill => skill.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Filter buttons logic
      if (filters.isPremium && !mentor.reviews?.some(review => review.rating >= 4.8)) return false;
      if (filters.quickResponse) return true; // Since we don't have this data, we'll show all
      if (filters.mostVisited && mentor.reviews?.length < 2) return false;
      if (filters.serviceBasedExperts && mentor.services?.length === 0) return false;
      if (filters.ventureCapital) return true; // Since we don't have this data, we'll show all
      if (filters.hotSeller && mentor.services?.some(service => service.rating >= 4.8)) return false;

      return true;
    });
  };

  // Add these handler functions
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterClick = (filterName: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  // Add useEffect for fetching data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch one-on-one sessions
        const oneOnOneResponse = await fetch(`${API_URL}/sessions/one-on-one/all`);
        const oneOnOneData = await oneOnOneResponse.json();
        if (oneOnOneData.status === 'success') {
          setOneOnOneSessions(oneOnOneData.sessions);
          // Create a Set of unique mentor IDs to avoid duplicates
          const uniqueMentors = new Map();
          oneOnOneData.mentors.forEach((mentor: MentorProfile) => {
            uniqueMentors.set(mentor.userId, mentor);
          });
          setMentorProfiles(Array.from(uniqueMentors.values()));
        }

        // Fetch group sessions
        const groupResponse = await fetch(`${API_URL}/sessions/group-session/all`);
        const groupData = await groupResponse.json();
        if (groupData.status === 'success') {
          setGroupSessions(groupData.sessions);
          // Add new mentors without duplicates
          const uniqueMentors = new Map(mentorProfiles.map(m => [m.userId, m]));
          groupData.mentors.forEach((mentor: MentorProfile) => {
            uniqueMentors.set(mentor.userId, mentor);
          });
          setMentorProfiles(Array.from(uniqueMentors.values()));
        }
      } catch (error) {
        console.error('Error fetching sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="hero-section relative">
        <div className=" mx-auto px-8 flex justify-center items-center flex-col relative z-[2] pt-4">
          <h1 className="text-6xl font-bold mb-4 max-w-3xl text-center mx-auto">
            Learn from Industry's
            <br />
            Top 1% Mentors
          </h1>
          <p className="text-xl mb-8 text-gray-700 text-center max-w-2xl mx-auto">
            Access personalized mentorship from tech leaders at Google, Meta, 
            Amazon and more. Get hands-on guidance for your career growth.
          </p>
          <AnimatePresence mode="wait">
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
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search by skills (e.g. 'System Design') or company..."
                    className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center gap-2">
                    <Search size={20} />
                    Search
                  </button>
                </div>
              </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mb-12 mt-8">
          {/* Sort dropdown */}
          <div className="relative group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="appearance-none px-4 py-2 pr-10 rounded-full border border-gray-300 
                bg-white hover:bg-gray-50 cursor-pointer transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#4937e8] focus:border-transparent
                text-gray-700 font-medium min-w-[140px]"
            >
              <option value="" className="text-gray-500">Sort by</option>
              <option value="rating" className="py-2">⭐ Highest Rated</option>
              <option value="price" className="py-2">💰 Price: High to Low</option>
              <option value="bookings" className="py-2">👥 Most Sessions</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none
              transition-transform duration-200 group-hover:text-gray-600">
              <ChevronDown size={18} />
            </div>
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 
              transition-opacity duration-200 pointer-events-none
              bg-gradient-to-r from-[#4937e8]/5 to-transparent"></div>
          </div>

          {/* Filter buttons */}
          <button 
            className={`px-4 py-2 rounded-full ${
              filters.isPremium 
                ? 'bg-purple-100 text-purple-700 border border-purple-200' 
                : 'border border-gray-300 bg-white hover:bg-gray-50'
            }`}
            onClick={() => handleFilterClick('isPremium')}
          >
            Premium Picks ⭐️
          </button>
          
          <button 
            className={`px-4 py-2 rounded-full ${
              filters.quickResponse 
                ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                : 'border border-gray-300 bg-white hover:bg-gray-50'
            }`}
            onClick={() => handleFilterClick('quickResponse')}
          >
            Available Today
          </button>

          <button 
            className={`px-4 py-2 rounded-full ${
              filters.mostVisited 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'border border-gray-300 bg-white hover:bg-gray-50'
            }`}
            onClick={() => handleFilterClick('mostVisited')}
          >
            Most Visited
          </button>

          <button 
            className={`px-4 py-2 rounded-full ${
              filters.serviceBasedExperts 
                ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                : 'border border-gray-300 bg-white hover:bg-gray-50'
            }`}
            onClick={() => handleFilterClick('serviceBasedExperts')}
          >
            Service Based
          </button>

          <button 
            className={`px-4 py-2 rounded-full ${
              filters.ventureCapital 
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                : 'border border-gray-300 bg-white hover:bg-gray-50'
            }`}
            onClick={() => handleFilterClick('ventureCapital')}
          >
            Venture Capital
          </button>

          <button 
            className={`px-4 py-2 rounded-full ${
              filters.hotSeller 
                ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                : 'border border-gray-300 bg-white hover:bg-gray-50'
            }`}
            onClick={() => handleFilterClick('hotSeller')}
          >
            Hot Sellers 🔥
          </button>
        </div>

          <div className="flex justify-center space-x-8 mb-12 relative w-full border-b border-gray-200">
            <button
              className={`text-xl font-medium px-4 py-2 relative ${
                activeTab === "all-mentors" ? "text-gray-800" : "text-gray-500"
              }`}
              onClick={() => handleTabChange("all-mentors")}
            >
              All Mentors
              {activeTab === "all-mentors" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800"></div>
              )}
            </button>
            <button
              className={`text-xl font-medium px-4 py-2 relative ${
                activeTab === "one-on-one" ? "text-[#4937e8]" : "text-gray-500"
              }`}
              onClick={() => handleTabChange("one-on-one")}
            >
              One on One
              {activeTab === "one-on-one" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4937e8]"></div>
              )}
            </button>
            <button
              className={`text-xl font-medium px-4 py-2 relative ${
                activeTab === "group-session" ? "text-[#4937e8]" : "text-gray-500"
              }`}
              onClick={() => handleTabChange("group-session")}
            >
              Group Sessions
              {activeTab === "group-session" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4937e8]"></div>
              )}
            </button>
          </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4937e8]"></div>
        </div>
      ) : activeTab === 'all-mentors' ? (
        // Mentors Grid
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filterMentors(mentorProfiles).map(mentor => (
              <div
                key={mentor.userId}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={mentor.image || `https://ui-avatars.com/?name=${encodeURIComponent(mentor.name)}&background=random`}
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200"
                  />
                </div>

                <h3 className="font-semibold text-lg mb-1">{mentor.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{mentor.headline}</p>

                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="text-gray-700 fill-current" />
                  <span className="font-medium">
                    {mentor.reviews?.length > 0 
                      ? (mentor.reviews.reduce((acc, rev) => acc + rev.rating, 0) / mentor.reviews.length).toFixed(1)
                      : "New"}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-gray-600">{mentor.reviews?.length || 0} reviews</span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase size={14} className="text-gray-700" />
                    <span>{mentor.primaryExpertise}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={14} className="text-gray-700" />
                    <span>{mentor.totalExperience.years}+ years experience</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {mentor.skills.slice(0, 3).map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-700">
                    {mentor.services && mentor.services.length > 0 
                      ? `₹${Math.min(...mentor.services.map(s => Number(s.price)))}/session`
                      : 'Price varies'}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/profile/${mentor.userId}`)}
                  className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  View Profile
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'one-on-one' ? (
        // One on One Sessions Grid
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {oneOnOneSessions.map(session => {
              const mentor = mentorProfiles.find(m => m.userId === session.userId);
              if (!mentor) return null;

              return (
                <div
                  key={session.sessionId}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={mentor.image || `https://ui-avatars.com/?name=${encodeURIComponent(mentor.name)}&background=random`}
                      alt={mentor.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200"
                    />
                  </div>

                  <h3 className="font-semibold text-lg mb-1">{session.sessionName}</h3>
                  <p className="text-gray-600 text-sm mb-2">{mentor.headline}</p>

                  <div className="flex items-center gap-2 mb-4">
                    <Star size={16} className="text-gray-700 fill-current" />
                    <span className="font-medium">{mentor.rating}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{mentor.reviews?.length || 0} reviews</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Duration</span>
                      <span className="font-medium text-gray-900">{session.duration} mins</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Topics</span>
                      <span className="font-medium text-gray-900">{session.topics.join(", ")}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Session Type</span>
                      <span className="font-medium text-gray-900">
                        {session.numberOfSessions} {session.numberOfSessions === "1" ? "Session" : "Sessions"}
                      </span>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 mb-4">
                    <p className="line-clamp-2">{session.description}</p>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-bold text-gray-700">
                      {session.isPaid ? `₹${session.price}` : 'Free'}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/book-session/${session.sessionId}`)}
                    className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Book Session
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        // Group Sessions Grid
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupSessions.map(session => {
              const mentor = mentorProfiles.find(m => m.userId === session.userId);
              if (!mentor) return null;

              return (
                <div
                  key={session.sessionId}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200"
                >
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
                    {session.topics?.[0] || 'No topic specified'}
                  </span>
                  
                  <h3 className="text-xl font-bold mb-4 text-gray-900">
                    {session.sessionName}
                  </h3>

                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={mentor.image || `https://ui-avatars.com/?name=${encodeURIComponent(mentor.name)}&background=random`}
                      alt={mentor.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {mentor.name}
                      </h4>
                      <p className="text-gray-500 text-sm">
                        {mentor.role}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Duration</span>
                      <span className="font-medium text-gray-900">{session.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <span className="text-lg font-bold text-gray-700">
                      {session.isPaid ? `₹${session.price}` : 'Free'}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate(`/book-session/${session.sessionId}`)}
                    className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Join Session
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllMentors;