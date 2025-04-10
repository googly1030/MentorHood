import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Briefcase, TrendingUp, Building2, Rocket, Grid, Search } from 'lucide-react';
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
  // Most Visited Category
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

  // Service Based Category
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
  // Add 4 more service-based mentors...

  // Company Experts Category
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
  // Add 4 more company experts...

  // Venture Capital Category
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
  },
  // Add 4 more venture capital mentors...
];

// Add this array of group sessions
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
  },
  // Add more group sessions...
];

const AllMentors = () => {
  const navigate = useNavigate();
  const [activeCategory] = useState<string>('most-visited');
  const [activeTab, setActiveTab] = useState<'all-mentors' | 'group-sessions'>('all-mentors');


  const categories = [
    { id: 'most-visited', name: 'Most Visited', icon: TrendingUp },
    { id: 'service-based', name: 'Service Based', icon: Building2 },
    { id: 'company-experts', name: 'Company Experts', icon: Briefcase },
    { id: 'venture-capital', name: 'Venture Capital', icon: Rocket }
  ];


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
          <button className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50">
            <span className="flex items-center gap-2">
              <Grid className="w-4 h-4" /> Filters
            </span>
          </button>
          <button className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50">Sort by</button>
          <button className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50">All</button>
          <button className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 border border-purple-200">Premium Picks ⭐️</button>
          <button className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50">Referred in 15 mins</button>
          <button className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50">Mock Interview</button>
          <button className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50">100% Avg Attendance</button>
          <button className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50">Most Visited</button>
          <button className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50">Service Based Company Experts</button>
          <button className="px-4 py-2 rounded-full border border-gray-300 bg-white hover:bg-gray-50">Venture Capital</button>
          <button className="px-4 py-2 rounded-full bg-orange-100 text-orange-700 border border-orange-200">Hot Sellers 🔥</button>
        </div>

          <div className="flex justify-center space-x-8 mb-12 relative w-full border-b border-gray-200">
            <button
              className={`text-xl font-medium px-4 py-2 relative ${
                activeTab === "all-mentors" ? "text-gray-800" : "text-gray-500"
              }`}
              onClick={() => setActiveTab("all-mentors")}
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
              onClick={() => setActiveTab("group-sessions")}
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
            {categories.map(({ id, name }) => (
              <div
                key={id}
                className={`${activeCategory === id ? 'block' : 'hidden'}`}
              >
                <h2 className="text-2xl font-bold mb-8 bg-gradient-to-r from-gray-700 to-gray-800 bg-clip-text text-transparent">
                  {name}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {mentors
                    .filter(mentor => mentor.category === id)
                    .map(mentor => (
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
            ))}
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