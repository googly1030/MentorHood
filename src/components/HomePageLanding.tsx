import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Star, Phone, Users, Coffee, BookOpen, Award, Clock, Calendar, DollarSign, MessageCircle, Users2, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import img from "../image.webp"

interface Suggestion {
  id: number;
  category: string;
  title: string;
  icon: string;
}

const suggestions: Suggestion[] = [
  {
    id: 1,
    category: "LinkedIn-based",
    title: "Data scientists at FAANG who transitioned from CS backgrounds.",
    icon: "🔍"
  },
  {
    id: 2,
    category: "Career development",
    title: "Top mentors for negotiating higher salaries in tech.",
    icon: "📈"
  },
  {
    id: 3,
    category: "Job search",
    title: "Hiring managers who give resume feedback for job switchers.",
    icon: "💼"
  },
  {
    id: 4,
    category: "Networking",
    title: "Best LinkedIn influencers for growing a strong tech network.",
    icon: "🤝"
  },
  {
    id: 5,
    category: "Unconventional careers",
    title: "Non-traditional career paths for professionals with Python skills.",
    icon: "🚀"
  },
  {
    id: 6,
    category: "Leadership",
    title: "Executives mentoring first-time managers in tech.",
    icon: "👥"
  }
];

function App() {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const journeySectionRef = useRef<HTMLDivElement>(null);
  const [isJourneySectionInView, setIsJourneySectionInView] = useState(false);
  const [emojis, setEmojis] = useState<{ id: number; emoji: string; left: number; top: number }[]>([]);
  const [centerCardContent, setCenterCardContent] = useState({
    icon: <img src="https://cdn-icons-png.flaticon.com/512/6009/6009939.png" alt="Growth Icon" className="h-32 w-32 object-contain drop-shadow-lg" />,
    title: "MentorConnect Platform",
    description: "Our AI-powered platform matches you with the perfect mentor based on your goals, experience, and learning style.",
    buttonText: "Start Your Journey",
    bgColor: "from-indigo-600 to-purple-600"
  });
  const [searchQuery, setSearchQuery] = useState("");
  const sliderRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const navigate = useNavigate();

  const mentors = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 4.8,
      role: "Senior Product Manager at Google",
      experience: "8+ years",
      specialization: "Product Management, Career Transitions",
      bookings: 1228,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      calendlyLink: "/booking/1"
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 4.9,
      role: "Engineering Manager at Meta",
      experience: "10+ years",
      specialization: "Software Architecture, Leadership",
      bookings: 956,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      calendlyLink: "/booking/2"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 4.7,
      role: "Tech Lead at Amazon",
      experience: "7+ years",
      specialization: "Frontend Development, System Design",
      bookings: 843,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      calendlyLink: "/booking/3"
    }
  ];

  const upcomingSessions = [
    {
      tag: "Career Mentorship",
      title: "Career Transition to Product Management",
      mentor: {
        name: "Priya Sharma",
        role: "Senior PM, Amazon",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
      },
      date: "May 15, 2023",
      time: "6:00 PM",
      duration: "45 min",
      price: 1200
    },
    {
      tag: "Tech Guidance",
      title: "React Performance Optimization",
      mentor: {
        name: "Rahul Mehta",
        role: "Full Stack Developer, Microsoft",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
      },
      date: "May 16, 2023",
      time: "5:30 PM",
      duration: "30 min",
      price: 800
    },
    {
      tag: "Design Mentorship",
      title: "Design System Architecture",
      mentor: {
        name: "Ananya Patel",
        role: "Lead Designer, Flipkart",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
      },
      date: "May 17, 2023",
      time: "4:30 PM",
      duration: "45 min",
      price: 1500
    }
  ];

  const amaSessions = [
    {
      title: "Building Scalable Systems",
      mentor: {
        name: "Alex Chen",
        role: "Principal Engineer, Netflix",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
      },
      date: "May 20, 2023",
      time: "7:00 PM",
      duration: "60 min",
      registrants: 42,
      maxRegistrants: 100,
      questions: [
        "How do you handle database scaling?",
        "Best practices for microservices architecture?",
        "Strategies for handling high traffic loads"
      ]
    },
    {
      title: "Product Management Insights",
      mentor: {
        name: "Sarah Wilson",
        role: "Director of Product, Spotify",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
      },
      date: "May 22, 2023",
      time: "6:30 PM",
      duration: "60 min",
      registrants: 35,
      maxRegistrants: 75,
      questions: [
        "How to prioritize feature requests?",
        "Techniques for user research",
        "Managing stakeholder expectations"
      ]
    }
  ];

  const sessionCardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleSessionCards, setVisibleSessionCards] = useState<boolean[]>([]);

  const handleCardClick = (cardId: string) => {
    if (cardId === 'discover-card') {
      setCenterCardContent({
        icon: <BookOpen size={80} className="text-indigo-600" />,
        title: "1. Discover",
        description: "Browse our curated network of industry experts and find mentors who match your career aspirations.",
        buttonText: "Browse Mentors",
        bgColor: "from-indigo-600 to-purple-600"
      });
    } else if (cardId === 'connect-card') {
      setCenterCardContent({
        icon: <Clock size={80} className="text-purple-600" />,
        title: "2. Connect",
        description: "Schedule 20-45 minute personalized sessions that fit your calendar and learning pace.",
        buttonText: "Schedule Session",
        bgColor: "from-purple-600 to-violet-600"
      });
    }
  };

  const addEmoji = () => {
    const section = document.querySelector('.knowledge-buddies-section');
    if (!section) return;
  
    const rect = section.getBoundingClientRect();
    const emojiList = ['❤️', '😊', '🌟', '✨', '🎉', '👏', '🚀', '💫'];
    const emoji = emojiList[Math.floor(Math.random() * emojiList.length)];
  
    const offsetX = Math.random() * rect.width;
    const offsetY = Math.random() * rect.height;
  
    const uniqueId = Date.now() + Math.random();
  
    setEmojis(prev => [
      ...prev,
      {
        id: uniqueId,
        emoji,
        left: rect.left + offsetX,
        top: rect.top + offsetY,
      },
    ]);
  
    setTimeout(() => {
      setEmojis(prev => prev.filter(e => e.id !== uniqueId));
    }, 1500);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    let rafId: number;
    
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const position = window.scrollY;
        setScrollPosition(position);
        
        const maxScroll = 500;
        const opacity = Math.max(0.1, 1 - (position / maxScroll));
        setScrollOpacity(opacity);
  
        if (journeySectionRef.current) {
          const rect = journeySectionRef.current.getBoundingClientRect();
          const isInView = rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
          
          if (isInView !== isJourneySectionInView) {
            setIsJourneySectionInView(isInView);
          }
          
          if (isInView) {
            journeySectionRef.current.classList.add('in-view');
            
            const centerCard = journeySectionRef.current.querySelector('.journey-center-card') as HTMLElement;
            if (centerCard) {
              const progress = Math.min(1, Math.max(0, 1 - (rect.top / window.innerHeight)));
              const scale = 0.8 + (progress * 0.2);
              centerCard.style.transform = `translate(-50%, -50%) scale(${scale})`;
            }
          } else {
            journeySectionRef.current.classList.remove('in-view');
          }
        }
  
        cardsRef.current.forEach((card, index) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const isVisible = rect.top <= window.innerHeight - 100;
          
          if (isVisible !== visibleCards[index]) {
            setVisibleCards(prev => {
              const newState = [...prev];
              newState[index] = isVisible;
              if (!prev[index] && isVisible) {
                addEmoji();
              }
              return newState;
            });
          }
        });

        sessionCardsRef.current.forEach((card, index) => {
          if (!card) return;
          const rect = card.getBoundingClientRect();
          const isVisible = rect.top <= window.innerHeight - 100;
          
          if (isVisible !== visibleSessionCards[index]) {
            setVisibleSessionCards(prev => {
              const newState = [...prev];
              newState[index] = isVisible;
              return newState;
            });
          }

          if (isVisible) {
            const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
            const yOffset = Math.min(50, scrollProgress * 100); // Max 50px offset
            card.style.transform = `translateY(${-yOffset}px)`;
          }
        });
      });
    };
  
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [visibleCards, visibleSessionCards, isJourneySectionInView, mentors.length]);

  return (
    <div className="min-h-screen">
      {emojis.map(({ id, emoji, left, top }) => (
        <div
          key={id}
          className="emoji-container"
          style={{
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
            zIndex: 5,
            fontSize: '24px'
          }}
        >
          {emoji}
        </div>
      ))}

        <img 
          src={img}
          alt="Background"
          className="fixed inset-0 w-full h-full object-cover z-[-1] transition-opacity duration-300"
          style={{
            opacity: scrollOpacity,
            transform: `translateY(${scrollPosition * 0.5}px)`,
          }}
        />
      
      <div className="hero-section ">
        <div className="max-w-6xl mx-auto px-8 pt-48 flex justify-center items-center flex-col">
          <div className="trusted-badge mb-8">
            <div className="avatar-stack">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" alt="User" />
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop" alt="User" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop" alt="User" />
            </div>
            Learn from the best! 
          </div>

          <h1 className="text-6xl font-bold mb-4 max-w-3xl text-center mx-auto">
            Connect with Top Tech
            <br />
            Mentors in 1-on-1 Sessions
          </h1>
          <p className="text-xl mb-8 text-gray-700 text-center max-w-2xl mx-auto">
            Book personalized 20-45 minute mentoring sessions with industry experts. Get career guidance, technical advice, and actionable insights.
          </p>
          <div className="flex justify-center">
            <button 
              className="get-started-btn"
              onClick={() => navigate('/mentors')}
            >
              SCHEDULE A CALL NOW
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="knowledge-buddies-section py-24 bg-white">
        <div className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">Your Knowledge Buddies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {mentors.map((mentor, index) => (
              <div
                key={index}
                ref={el => cardsRef.current[index] = el}
                className={`mentor-card bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow ${
                  visibleCards[index] ? 'visible' : ''
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={mentor.image} 
                    alt={mentor.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{mentor.name}</h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star size={16} fill="currentColor" />
                      <span>{mentor.rating}/5</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{mentor.role}</p>
                <p className="text-gray-600 mb-2">Experience: {mentor.experience}</p>
                <p className="text-gray-600 mb-2">Specialization: {mentor.specialization}</p>
                <p className="text-gray-700 font-medium mb-6">{mentor.bookings}+ sessions conducted</p>
                <div className="flex gap-3">
                  <a 
                    href={mentor.calendlyLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-black text-white py-2 rounded-full flex items-center justify-center gap-2"
                  >
                    <Phone size={16} />
                    Schedule Call
                  </a>
                  <button 
                    onClick={() => navigate(`/profile/${index}`)} 
                    className="flex-1 bg-[#F4FFD6] text-black py-2 rounded-full flex items-center justify-center gap-2"
                  >
                    <Users size={16} />
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button 
              className="view-all-btn"
              onClick={() => navigate('/mentors')}
            >
              <Users size={20} />
              View All Mentors
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions Section */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <div>
              <h2 className="text-5xl leading-normal font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Upcoming Sessions
              </h2>
              <p className="text-gray-600 text-lg max-w-xl">
                Book targeted mentorship sessions with industry experts and accelerate your career growth
              </p>
            </div>
            <button className="view-all-btn bg-gradient-to-r from-purple-600 to-blue-500 text-white mt-4 md:mt-0 hover:from-blue-500 hover:to-purple-600">
              View All Sessions
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sessions-grid">
            {upcomingSessions.map((session, index) => (
              <div
                key={index}
                ref={el => sessionCardsRef.current[index] = el}
                className={`session-card bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl 
                  transition-all duration-700 group ${visibleSessionCards[index] ? 'visible' : ''}`}
                style={{ '--card-index': index } as React.CSSProperties}
              >
                <div className="transform transition-transform duration-700 group-hover:scale-[1.02]">
                  <span className="inline-block px-3 py-1 bg-[#F4FFD6] text-black rounded-full text-sm font-medium mb-4">
                    {session.tag}
                  </span>
                  <h3 className="text-2xl font-bold mb-6 text-gray-800">{session.title}</h3>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={session.mentor.image}
                      alt={session.mentor.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#F4FFD6]"
                    />
                    <div>
                      <h4 className="font-medium text-gray-800">{session.mentor.name}</h4>
                      <p className="text-gray-600 text-sm">{session.mentor.role}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-gray-600">
                      <Calendar size={18} className="text-purple-600" />
                      <span>{session.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <Clock size={18} className="text-purple-600" />
                      <span>{session.time} • {session.duration}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center text-xl font-bold text-gray-800">
                      <DollarSign size={18} className="text-purple-600" />
                      {session.price}
                    </span>
                    
                    <button  onClick={() => navigate('/booking/1')} className="px-4 py-2 bg-black text-white rounded-full flex items-center gap-2 
                      hover:bg-gray-800 transition-all transform hover:scale-105 hover:shadow-lg">
                      Book Now
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ask Me Anything Sessions Section */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>

        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 leading-normal bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Ask Me Anything Sessions
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Join interactive group sessions where industry experts answer your burning questions live
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {amaSessions.map((session, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-[#F4FFD6] group">
                <div className="flex items-start gap-6 mb-8">
                  <img 
                    src={session.mentor.image}
                    alt={session.mentor.name}
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-[#F4FFD6]"
                  />
                  <div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-800">{session.title}</h3>
                    <p className="text-purple-600 font-medium">{session.mentor.name}</p>
                    <p className="text-gray-600">{session.mentor.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-purple-100/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <Calendar size={18} />
                      <span className="font-medium">Date & Time</span>
                    </div>
                    <p className="text-gray-600">{session.date}</p>
                    <p className="text-gray-600">{session.time} • {session.duration}</p>
                  </div>
                  <div className="bg-purple-100/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-purple-600 mb-1">
                      <Users2 size={18} />
                      <span className="font-medium">Registrants</span>
                    </div>
                    <p className="text-gray-600">{session.registrants}/{session.maxRegistrants}</p>
                    <div className="w-full bg-[#F4FFD6]/70 rounded-full h-2 mt-2">
                      <div 
                        className="bg-gradient-to-r from-purple-600 to-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(session.registrants / session.maxRegistrants) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F4FFD6]/20 rounded-xl p-6 mb-8">
                  <div className="flex items-center gap-2 text-purple-600 mb-4">
                    <MessageCircle size={18} />
                    <span className="font-medium">Sample Questions</span>
                  </div>
                  <ul className="space-y-3">
                    {session.questions.map((question, qIndex) => (
                      <li key={qIndex} className="flex items-start gap-3 text-gray-600">
                        <span className="w-2 h-2 mt-2 rounded-full bg-purple-600"></span>
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-4 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-200 hover:from-blue-500 hover:to-purple-600 transition-all duration-300 flex items-center justify-center gap-2">
                  Register Now
                  <ArrowRight size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section 
        ref={journeySectionRef}
        className={`journey-section py-16 pb-32 bg-white relative overflow-hidden min-h-[600px] ${
          isJourneySectionInView ? 'in-view' : ''
        }`}
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>
        
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-purple-300 to-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-[#F4FFD6] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-5xl mx-auto px-8 relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Your Growth Journey</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">Our mentorship platform follows a simple yet effective process to help you achieve your career goals</p>
          
          <div className="relative h-[500px] flex items-center justify-center">
            {/* First Card */}
            <div className="journey-card" onClick={() => handleCardClick('discover-card')}>
              <div className="bg-white rounded-xl p-6 shadow-xl w-[25rem] h-[16rem] hover:shadow-2xl transition-all duration-300 border border-[#F4FFD6]">
                <div className="bg-[#F4FFD6] p-3 rounded-full mb-3 inline-block">
                  <BookOpen size={30} className="text-purple-600" />
                </div>
                <h4 className="font-bold text-lg mb-2">1. Discover</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Browse our curated network of experts who match your career goals.</p>
              </div>
            </div>

            {/* Second Card */}
            <div className="journey-card" onClick={() => handleCardClick('connect-card')}>
              <div className="bg-white rounded-xl p-6 shadow-xl w-[25rem] h-[16rem] hover:shadow-2xl transition-all duration-300 border border-[#F4FFD6]">
                <div className="bg-[#F4FFD6] p-3 rounded-full mb-3 inline-block">
                  <Clock size={30} className="text-purple-600" />
                </div>
                <h4 className="font-bold text-lg mb-2">2. Connect</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Schedule personalized sessions that fit your calendar.</p>
              </div>
            </div>

            {/* Third Card */}
            <div className="journey-card">
              <div className="bg-white rounded-xl p-6 shadow-xl w-[25rem] h-[16rem] hover:shadow-2xl transition-all duration-300 border border-[#F4FFD6]">
                <div className="bg-[#F4FFD6] p-3 rounded-full mb-3 inline-block">
                  <Coffee size={30} className="text-purple-600" />
                </div>
                <h4 className="font-bold text-lg mb-2">3. Transform</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Gain insights through interactive sessions with industry leaders.</p>
              </div>
            </div>

            {/* Fourth Card */}
            <div className="journey-card">
              <div className="bg-white rounded-xl p-6 shadow-xl w-[25rem] h-[16rem] hover:shadow-2xl transition-all duration-300 border border-[#F4FFD6]">
                <div className="bg-[#F4FFD6] p-3 rounded-full mb-3 inline-block">
                  <Award size={30} className="text-purple-600" />
                </div>
                <h4 className="font-bold text-lg mb-2">4. Succeed</h4>
                <p className="text-gray-600 text-sm leading-relaxed">Track your progress and celebrate achievements.</p>
              </div>
            </div>

            {/* Center Card remains unchanged */}
            <div className="journey-center-card w-[400px] bg-white rounded-2xl shadow-2xl p-8 border border-[#F4FFD6]">
              <div className={`h-40 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl mb-6 overflow-hidden relative p-4 flex items-center justify-center`}>
                <div className="absolute inset-0 opacity-30 bg-white/95"></div>
                <div className="relative z-10 transform hover:scale-105 transition-transform">
                  {centerCardContent.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-3 text-gray-800 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                {centerCardContent.title}
              </h3>
              <p className="text-gray-600 text-center mb-6 text-base leading-relaxed">
                {centerCardContent.description}
              </p>
              <div className="flex justify-center">
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-full text-base font-medium transition-all hover:shadow-lg hover:shadow-purple-200 hover:from-blue-500 hover:to-purple-600 transform hover:scale-105">
                  {centerCardContent.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <h2 className="text-5xl leading-normal font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Still looking? Try our AI Search
          </h2>
          <p className="text-gray-600 mb-10 text-lg">
            Just type who you are looking for. Be as specific as you want & see our AI do the magic
          </p>

          {/* Search Input */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="I am looking for Software engineering leader for tech insights"
                className="w-full px-6 py-4 rounded-2xl border border-[#F4FFD6] focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent text-lg shadow-lg"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-600 to-blue-500 text-white px-6 py-2 rounded-xl hover:from-blue-500 hover:to-purple-600 transition-all duration-300 flex items-center gap-2">
                <Search size={20} />
                Search
              </button>
            </div>
          </div>

     {/* Suggestion Cards */}
<div className="relative w-full overflow-hidden">
  <div
    ref={sliderRef}
    className="flex gap-4 overflow-x-auto scroll-smooth cursor-grab active:cursor-grabbing touch-pan-x pb-4"
    onMouseDown={handleMouseDown}
    onMouseLeave={handleMouseLeave}
    onMouseUp={handleMouseUp}
    onMouseMove={handleMouseMove}
  >
    {suggestions.map((suggestion) => (
      <div
        key={suggestion.id}
        className="flex-none w-[300px]"
      >
        <div className="bg-white rounded-2xl p-6 shadow-lg h-[160px] flex flex-col
          hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 
          border border-[#F4FFD6] select-none"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">{suggestion.icon}</span>
            <span className="text-sm text-purple-600 font-medium">{suggestion.category}</span>
          </div>
          <p className="text-left text-gray-800 font-medium line-clamp-3">
            {suggestion.title}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
        </div>
      </section>
    </div>
  );
}

export default App;