import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Star, Clock, BookOpen, Users2 } from 'lucide-react';

export interface Service {
  id: number;
  title: string;
  rating: number;
  duration: string;
  price: string;
  type: string;
  isPopular?: boolean;
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  userImage: string;
}

export const services: Service[] = [
  {
    id: 1,
    title: "1:1 Mentorship",
    rating: 5,
    duration: "30 mins",
    price: "₹800",
    type: "Video Meeting",
    isPopular: true
  },
  {
    id: 2,
    title: "Mock Interview - System Design",
    rating: 5,
    duration: "60 mins",
    price: "₹800",
    type: "Video Meeting"
  },
  {
    id: 3,
    title: "Mock Interview - Managerial",
    rating: 5,
    duration: "60 mins",
    price: "₹800",
    type: "Video Meeting"
  },
  {
    id: 4,
    title: "Resume Review",
    rating: 4.8,
    duration: "15 mins",
    price: "₹100",
    type: "Video Meeting"
  }
];

const UserProfile = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  console.log("User ID from URL:", id); // Use the id for debugging or further logic

  // Mock data - in a real app, you would fetch this based on the ID
  const mentorData = {
    id: 1,
    name: "Sarah Johnson",
    role: "Senior Product Manager at Google",
    experience: "8+ years",
    rating: 4.8,
    totalReviews: 156,
    sessionsCompleted: 1228,
    hourlyRate: 150,
    about: "Passionate about helping people transition into product management roles. With 8+ years of experience at Google, I've helped launch multiple successful products and mentored numerous PMs.",
    expertise: ["Product Strategy", "Career Transitions", "Technical Product Management", "User Research", "Agile Methodologies"],
    education: [
      {
        degree: "MBA",
        school: "Stanford University",
        year: "2015"
      },
      {
        degree: "BS Computer Science",
        school: "MIT",
        year: "2012"
      }
    ],
    availableTimes: [
      "Mon-Fri: 6:00 PM - 9:00 PM PST",
      "Sat: 10:00 AM - 2:00 PM PST"
    ],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    reviews: [
      {
        id: 1,
        user: "Alex Chen",
        rating: 5,
        comment: "Sarah provided invaluable insights for my PM interview preparation. Her practical examples and feedback were extremely helpful.",
        date: "March 15, 2024",
        userImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50"
      },
      {
        id: 2,
        user: "Emily Rodriguez",
        rating: 5,
        comment: "Great session! Sarah helped me understand product prioritization frameworks better.",
        date: "March 10, 2024",
        userImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50"
      }
    ]
  };

  const ReviewCard = ({ review }: { review: Review }) => (
    <div className="bg-white rounded-xl p-6 shadow-md">
      <div className="flex items-start gap-4 mb-4">
        <img src={review.userImage} alt={review.user} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <h4 className="font-medium">{review.user}</h4>
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < review.rating ? "text-yellow-500 fill-current" : "text-gray-300"} 
                />
              ))}
            </div>
            <span className="text-gray-500 text-sm">{review.date}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-600">{review.comment}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <div className="flex items-start gap-6">
                <img 
                  src={mentorData.image} 
                  alt={mentorData.name}
                  className="w-32 h-32 rounded-xl object-cover"
                />
                <div>
                  <h1 className="text-3xl font-bold mb-2">{mentorData.name}</h1>
                  <p className="text-gray-600 mb-4">{mentorData.role}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-500 fill-current" size={20} />
                      <span className="font-medium">{mentorData.rating}</span>
                      <span className="text-gray-500">({mentorData.totalReviews} reviews)</span>
                    </div>
                    <div className="text-gray-500">|</div>
                    <div className="flex items-center gap-1">
                      <Users2 size={20} className="text-purple-600" />
                      <span>{mentorData.sessionsCompleted}+ sessions</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-gray-600 mb-6">{mentorData.about}</p>
              
              <h3 className="font-bold mb-3">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {mentorData.expertise.map((skill, index) => (
                  <span 
                    key={index}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <h3 className="font-bold mb-3">Education</h3>
              <div className="space-y-2">
                {mentorData.education.map((edu, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <BookOpen size={16} className="text-purple-600" />
                    <span>{edu.degree} - {edu.school}, {edu.year}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-2xl font-bold mb-6">Reviews</h2>
              <div className="space-y-4">
                {mentorData.reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Services & Availability */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md sticky top-6">
              <h3 className="text-xl font-bold mb-6">Services Offered</h3>
              <div className="space-y-4">
                {services.map((service) => (
                  <div 
                    key={service.id} 
                    className="p-4 border rounded-xl hover:border-purple-400 transition-colors cursor-pointer relative"
                  >
                    {service.isPopular && (
                      <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
                        Popular
                      </span>
                    )}
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{service.title}</h4>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">{service.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-purple-600" />
                        <span>{service.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen size={14} className="text-purple-600" />
                        <span>{service.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-600">{service.price}</span>
                      <button 
                        onClick={() => navigate(`/booking/${service.id}`)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t">
                <h4 className="font-medium mb-3">Available Times</h4>
                <div className="space-y-2">
                  {mentorData.availableTimes.map((time, index) => (
                    <div key={index} className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} className="text-purple-600" />
                      <span>{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;