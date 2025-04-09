import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Briefcase, TrendingUp, Building2, Rocket } from 'lucide-react';

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

const AllMentors = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<string>('most-visited');

  const categories = [
    { id: 'most-visited', name: 'Most Visited', icon: TrendingUp },
    { id: 'service-based', name: 'Service Based', icon: Building2 },
    { id: 'company-experts', name: 'Company Experts', icon: Briefcase },
    { id: 'venture-capital', name: 'Venture Capital', icon: Rocket }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="h-48 bg-gradient-to-r from-purple-600 to-blue-500 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h1 className="text-4xl font-bold text-white text-center">
            Find Your Perfect Mentor
          </h1>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 mb-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(({ id, name, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveCategory(id)}
                className={`p-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                  activeCategory === id
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-purple-50'
                }`}
              >
                <Icon size={24} />
                <span className="font-medium">{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mentors Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {categories.map(({ id, name }) => (
          <div
            key={id}
            className={`${activeCategory === id ? 'block' : 'hidden'}`}
          >
            <h2 className="text-2xl font-bold mb-8">{name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mentors
                .filter(mentor => mentor.category === id)
                .map(mentor => (
                  <div
                    key={mentor.id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={mentor.image}
                        alt={mentor.name}
                        className="w-16 h-16 rounded-full object-cover ring-2 ring-purple-100"
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
                      <Star size={16} className="text-yellow-500 fill-current" />
                      <span className="font-medium">{mentor.rating}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">{mentor.bookings}+ sessions</span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="text-purple-600" />
                        <span>{mentor.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock size={14} className="text-purple-600" />
                        <span>{mentor.availability}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <span className="text-lg font-bold text-purple-600">{mentor.price}</span>
                      <span className="text-sm text-gray-500">{mentor.experience}</span>
                    </div>

                    <button
                      onClick={() => navigate(`/profile/${mentor.id}`)}
                      className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      View Profile
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMentors;