import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Briefcase, TrendingUp, Building2, Rocket , Search, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
interface Mentor {
  id: number;
  name: string;
  rating: number;
  role: string;
  experience: string;
  specialization: string;
  bookings: number;
  location: string;
  languages: string[];
  image: string;
  availability: string;
  price: string;
  category: 'most-visited' | 'service-based' | 'company-experts' | 'venture-capital';
  companyLogo?: string;
}

// Add this interface for group sessions
interface GroupSession {
  id: number;
  title: string;
  topic: string;
  mentor: {
    name: string;
    role: string;
    image: string;
  };
  date: string;
  time: string;
  duration: string;
  participants: number;
  maxParticipants: number;
  price: string;
}



const mentors: Mentor[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    rating: 4.9,
    role: "Senior Product Manager at Google",
    experience: "8+ years",
    specialization: "Product Management",
    bookings: 1228,
    location: "San Francisco, CA",
    languages: ["English", "Spanish"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    availability: "Next available: Today",
    price: "₹800/session",
    category: "most-visited",
    companyLogo: "/company-logos/google.png"
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 4.8,
    role: "Engineering Manager at Meta",
    experience: "10+ years",
    specialization: "Software Architecture",
    bookings: 956,
    location: "Seattle, WA",
    languages: ["English", "Mandarin"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    availability: "Next available: Tomorrow",
    price: "₹1000/session",
    category: "most-visited",
    companyLogo: "/company-logos/meta.png"
  },
  {
    id: 3,
    name: "Emma Wilson",
    rating: 4.9,
    role: "Tech Lead at Amazon",
    experience: "12+ years",
    specialization: "System Design",
    bookings: 1432,
    location: "New York, NY",
    languages: ["English", "French"],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    availability: "Next available: Today",
    price: "₹900/session",
    category: "most-visited",
    companyLogo: "/company-logos/amazon.png"
  },
  {
    id: 4,
    name: "David Park",
    rating: 4.7,
    role: "Staff Engineer at Netflix",
    experience: "9+ years",
    specialization: "Frontend Architecture",
    bookings: 876,
    location: "Los Angeles, CA",
    languages: ["English", "Korean"],
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    availability: "Next available: Tomorrow",
    price: "₹850/session",
    category: "most-visited",
    companyLogo: "/company-logos/netflix.png"
  },
  {
    id: 5,
    name: "Priya Sharma",
    rating: 4.9,
    role: "Tech Lead at Microsoft",
    experience: "7+ years",
    specialization: "Cloud Architecture",
    bookings: 785,
    location: "Bangalore, India",
    languages: ["English", "Hindi"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    availability: "Next available: Today",
    price: "₹600/session",
    category: "most-visited",
    companyLogo: "/company-logos/microsoft.png"
  },
  {
    id: 6,
    name: "Alex Rodriguez",
    rating: 4.8,
    role: "Lead Developer at Salesforce",
    experience: "8+ years",
    specialization: "CRM Development",
    bookings: 645,
    location: "Austin, TX",
    languages: ["English", "Spanish"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    availability: "Next available: Today",
    price: "₹750/session",
    category: "service-based",
    companyLogo: "/company-logos/salesforce.png"
  },
  {
    id: 11,
    name: "Jennifer Lee",
    rating: 4.9,
    role: "Principal Engineer at Apple",
    experience: "15+ years",
    specialization: "iOS Development",
    bookings: 1567,
    location: "Cupertino, CA",
    languages: ["English", "Mandarin"],
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
    availability: "Next available: Today",
    price: "₹1200/session",
    category: "company-experts",
    companyLogo: "/company-logos/apple.png"
  },
  {
    id: 16,
    name: "Mark Thompson",
    rating: 4.9,
    role: "Partner at Sequoia Capital",
    experience: "12+ years",
    specialization: "Startup Funding",
    bookings: 423,
    location: "San Francisco, CA",
    languages: ["English"],
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7",
    availability: "Next available: Tomorrow",
    price: "₹2000/session",
    category: "venture-capital",
    companyLogo: "/company-logos/sequoia.png"
  }
];
const groupSessions: GroupSession[] = [
  {
    id: 1,
    title: "5 Things You Didn't Know About Getting into UX",
    topic: "UX Design",
    mentor: {
      name: "Sarah Johnson",
      role: "Senior UX Designer at Google",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    date: "May 15, 2023",
    time: "10:00 AM",
    duration: "60 min",
    participants: 25,
    maxParticipants: 50,
    price: "₹500/session"
  }
];

const AllMentors = () => {
  const navigate = useNavigate();
  const [activeCategory] = useState<string>('most-visited');
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

  // Get the tab from URL parameters
  const searchParams = new URLSearchParams(window.location.search);
  const defaultTab = searchParams.get('tab') === 'group-sessions' ? 'group-sessions' : 'all-mentors';
  
  const [activeTab, setActiveTab] = useState<'all-mentors' | 'group-sessions'>(defaultTab);

  // Modify the setActiveTab function to update the URL
  const handleTabChange = (tab: 'all-mentors' | 'group-sessions') => {
    setActiveTab(tab);
    navigate(`/mentors?tab=${tab}`, { replace: true });
  };

  const categories = [
    { id: 'most-visited', name: 'Most Visited', icon: TrendingUp },
    { id: 'service-based', name: 'Service Based', icon: Building2 },
    { id: 'company-experts', name: 'Company Experts', icon: Briefcase },
    { id: 'venture-capital', name: 'Venture Capital', icon: Rocket }
  ];

  // Add this filtering logic function
  const filterMentors = (mentors: Mentor[]) => {
    const filtered = mentors.filter(mentor => {
      // Search query filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
          mentor.name.toLowerCase().includes(searchLower) ||
          mentor.role.toLowerCase().includes(searchLower) ||
          mentor.specialization.toLowerCase().includes(searchLower) ||
          mentor.location.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Filter buttons logic
      if (filters.isPremium && mentor.rating < 4.8) return false;
      if (filters.quickResponse && mentor.availability !== "Next available: Today") return false;
      if (filters.mostVisited && mentor.category !== 'most-visited') return false;
      if (filters.serviceBasedExperts && mentor.category !== 'service-based') return false;
      if (filters.ventureCapital && mentor.category !== 'venture-capital') return false;
      if (filters.hotSeller && mentor.bookings < 1200) return false;

      return true;
    });

    // Apply sorting
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return b.rating - a.rating;
          case 'price':
            return parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, ''));
          case 'bookings':
            return b.bookings - a.bookings;
          default:
            return 0;
        }
      });
    }

    return filtered;
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
                activeTab === "group-sessions" ? "text-[#4937e8]" : "text-gray-500"
              }`}
              onClick={() => handleTabChange("group-sessions")}
            >
              Group Sessions
              {activeTab === "group-sessions" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#4937e8]"></div>
              )}
            </button>
          </div>
      </div>

      {/* Content Section */}
      {activeTab === 'all-mentors' ? (
        // Mentors Grid
        <>
          <div className="max-w-6xl mx-auto px-4 pb-16">
            {categories.map(({ id, name }) => {
              const filteredMentors = filterMentors(mentors.filter(m => m.category === id));
              
              return filteredMentors.length > 0 ? (
                <div key={id} className={`${activeCategory === id ? 'block' : 'hidden'}`}>
                  <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent">
                    {name}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredMentors.map(mentor => (
                      <div
                        key={mentor.id}
                        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={mentor.image}
                            alt={mentor.name}
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-gray-200"
                          />
                          {mentor.companyLogo && (
                            <img
                              src={mentor.companyLogo}
                              alt="Company"
                              className="w-6 h-6 rounded-full absolute top-4 right-4"
                            />
                          )}
                        </div>

                        <h3 className="font-semibold text-lg mb-1">{mentor.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{mentor.role}</p>

                        <div className="flex items-center gap-2 mb-4">
                          <Star size={16} className="text-gray-700 fill-current" />
                          <span className="font-medium">{mentor.rating}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-600">{mentor.bookings}+ sessions</span>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin size={14} className="text-gray-700" />
                            <span>{mentor.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock size={14} className="text-gray-700" />
                            <span>{mentor.availability}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                          <span className="text-lg font-bold text-gray-700">{mentor.price}</span>
                          <span className="text-sm text-gray-500">{mentor.experience}</span>
                        </div>

                        <button
                          onClick={() => navigate(`/profile/${mentor.id}`)}
                          className="w-full bg-black text-white py-2 rounded-xl hover:bg-gray-800 transition-colors"
                        >
                          View Profile
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null;
            })}
          </div>
        </>
      ) : (
        // Group Sessions Grid
        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupSessions.map(session => (
              <div
                key={session.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium mb-4">
                  {session.topic}
                </span>
                
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  {session.title}
                </h3>

                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={session.mentor.image}
                    alt={session.mentor.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {session.mentor.name}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      {session.mentor.role}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Date & Time</span>
                    <span className="font-medium text-gray-900">
                      {session.date}, {session.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Duration</span>
                    <span className="font-medium text-gray-900">{session.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Participants</span>
                    <span className="font-medium text-gray-900">
                      {session.participants}/{session.maxParticipants}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-bold text-gray-700">
                    {session.price}
                  </span>
                  <span className="text-sm text-gray-500">
                    {((session.participants / session.maxParticipants) * 100).toFixed(0)}% filled
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/book-session/${session.id}`)}
                  className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Join Session
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllMentors;