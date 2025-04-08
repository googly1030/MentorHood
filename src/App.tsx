import React, { useEffect, useState, useRef } from 'react';
import { ArrowRight, Star, Phone, Users, Coffee, BookOpen, Award, Clock } from 'lucide-react';

function App() {
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [visibleCards, setVisibleCards] = useState<boolean[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [sectionOffsetTop, setSectionOffsetTop] = useState(0);
  const [scrollIsInSection, setScrollIsInSection] = useState(false);
  const journeySectionRef = useRef<HTMLDivElement>(null);
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [centerCardContent, setCenterCardContent] = useState({
    icon: <img src="https://cdn-icons-png.flaticon.com/512/6009/6009939.png" alt="Growth Icon" className="h-32 w-32 object-contain drop-shadow-lg" />,
    title: "MentorConnect Platform",
    description: "Our AI-powered platform matches you with the perfect mentor based on your goals, experience, and learning style.",
    buttonText: "Start Your Journey",
    bgColor: "from-indigo-600 to-purple-600"
  });

  const mentors = [
    {
      name: "Sarah Johnson",
      rating: 4.8,
      role: "Senior Product Manager at Google",
      experience: "8+ years",
      specialization: "Product Management, Career Transitions",
      bookings: 1228,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      calendlyLink: "https://calendly.com/sarah-johnson/mentor-session"
    },
    {
      name: "Michael Chen",
      rating: 4.9,
      role: "Engineering Manager at Meta",
      experience: "10+ years",
      specialization: "Software Architecture, Leadership",
      bookings: 956,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      calendlyLink: "https://calendly.com/michael-chen/mentor-session"
    },
    {
      name: "Emily Rodriguez",
      rating: 4.7,
      role: "Tech Lead at Amazon",
      experience: "7+ years",
      specialization: "Frontend Development, System Design",
      bookings: 843,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      calendlyLink: "https://calendly.com/emily-rodriguez/mentor-session"
    }
    // Add 7 more mentors here with similar structure
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Get scroll position for new parallax effects
      const position = window.scrollY;
      setScrollPosition(position);
      
      // Background parallax opacity
      const maxScroll = 500;
      const opacity = Math.max(0.1, 1 - (position / maxScroll));
      setScrollOpacity(opacity);

      // Card visibility - existing code
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight - 100;
        
        setVisibleCards(prev => {
          const newState = [...prev];
          newState[index] = isVisible;
          return newState;
        });
      });

      // Track journey section visibility
      if (journeySectionRef.current) {
        const rect = journeySectionRef.current.getBoundingClientRect();
        setSectionOffsetTop(rect.top + window.scrollY);
        
        // Check if we're scrolled into the section
        const isInSection = rect.top < window.innerHeight / 2 && rect.bottom > 0;
        setScrollIsInSection(isInSection);
        
        // Update CSS variables for smooth animations
        journeySectionRef.current.style.setProperty('--scroll-offset', `${scrollPosition * 0.12}px`);
        journeySectionRef.current.style.setProperty('--scroll-rotate', `${scrollPosition * 0.01}deg`);
      }
    };

    // Initialize visibility array
    setVisibleCards(new Array(mentors.length).fill(false));
    
    window.addEventListener('scroll', handleScroll);
    // Trigger initial check
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to handle card click and update center card
  const handleCardClick = (cardId: string) => {
    // If clicking the same card again, just toggle active state
    if (activeCardId === cardId) {
      setActiveCardId(null);
      // Reset center card to default
      setCenterCardContent({
        icon: <img src="https://cdn-icons-png.flaticon.com/512/6009/6009939.png" alt="Growth Icon" className="h-32 w-32 object-contain drop-shadow-lg" />,
        title: "MentorConnect Platform",
        description: "Our AI-powered platform matches you with the perfect mentor based on your goals, experience, and learning style.",
        buttonText: "Start Your Journey",
        bgColor: "from-indigo-600 to-purple-600"
      });
      return;
    }

    // Update active card state
    setActiveCardId(cardId);
    
    // Update center card content based on which card was clicked
    switch(cardId) {
      case 'discover-card':
        setCenterCardContent({
          icon: <BookOpen size={80} className="text-indigo-600" />,
          title: "1. Discover",
          description: "Browse our curated network of industry experts and find mentors who match your career aspirations.",
          buttonText: "Find Mentors",
          bgColor: "from-indigo-600 to-blue-600"
        });
        break;
      case 'connect-card':
        setCenterCardContent({
          icon: <Clock size={80} className="text-purple-600" />,
          title: "2. Connect",
          description: "Schedule 20-45 minute personalized sessions that fit your calendar and learning pace.",
          buttonText: "Schedule Session",
          bgColor: "from-purple-600 to-violet-600"
        });
        break;
      case 'transform-card':
        setCenterCardContent({
          icon: <Coffee size={80} className="text-pink-600" />,
          title: "3. Transform",
          description: "Gain insights through interactive video sessions and actionable feedback from industry leaders.",
          buttonText: "Meet Mentor",
          bgColor: "from-pink-600 to-rose-600"
        });
        break;
      case 'succeed-card':
        setCenterCardContent({
          icon: <Award size={80} className="text-blue-600" />,
          title: "4. Succeed",
          description: "Apply your new knowledge, track your progress, and celebrate achievements with your mentor.",
          buttonText: "Track Progress",
          bgColor: "from-blue-600 to-cyan-600"
        });
        break;
      default:
        // Reset to default
        setCenterCardContent({
          icon: <img src="https://cdn-icons-png.flaticon.com/512/6009/6009939.png" alt="Growth Icon" className="h-32 w-32 object-contain drop-shadow-lg" />,
          title: "MentorConnect Platform",
          description: "Our AI-powered platform matches you with the perfect mentor based on your goals, experience, and learning style.",
          buttonText: "Start Your Journey",
          bgColor: "from-indigo-600 to-purple-600"
        });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/src/image.webp")',
          opacity: scrollOpacity,
          transform: `translateY(${window.scrollY * 0.5}px)`,
        }}
      />
      {/* Navigation */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white/90 sticky top-0 z-50">
      <div className="flex items-center gap-12">
      <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent hover:from-blue-500 hover:to-purple-600 transition-all duration-300 cursor-pointer">
        Mentor<span className="text-black">Hood</span>
      </h1>
    </div>
        <div className="flex gap-4">
          <button className="nav-button start-now-btn">Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
      <div className="max-w-6xl mx-auto px-8 pt-48 flex justify-center items-center flex-col">
          {/* Trusted Badge */}
          <div className="trusted-badge mb-8">
            <div className="avatar-stack">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" alt="User" />
              <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop" alt="User" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop" alt="User" />
            </div>
            Learn from the best! 
          </div>

          {/* Hero Content */}
          <h1 className="text-6xl font-bold mb-4 max-w-3xl text-center mx-auto">
            Connect with Top Tech
            <br />
            Mentors in 1-on-1 Sessions
          </h1>
          <p className="text-xl mb-8 text-gray-700 text-center max-w-2xl mx-auto">
            Book personalized 20-45 minute mentoring sessions with industry experts. Get career guidance, technical advice, and actionable insights.
          </p>
          <div className="flex justify-center">
            <button className="get-started-btn">
              SCHEDULE A CALL NOW
              <ArrowRight size={20} />
            </button>
          </div>

        </div>
      </div>

      {/* Knowledge Buddies Section */}
      <div className="py-24 bg-white/95">
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
                <p className="text-gray-600 mb-4">Specialization: {mentor.specialization}</p>
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
                  <button className="flex-1 bg-[#F4FFD6] text-black py-2 rounded-full flex items-center justify-center gap-2">
                    <Users size={16} />
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* View All Mentors Button */}
          <div className="text-center">
            <button className="view-all-btn">
              <Users size={20} />
              View All Mentors
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

        {/* How It Works Section - Row to Centered Parallax */}
        <section 
          ref={journeySectionRef}
          className={`py-24 relative overflow-hidden bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 ${scrollIsInSection ? 'active-section' : ''}`}
        >
          {/* Background grid pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid.png')] opacity-20"></div>
          
          {/* Animated floating shapes */}
          <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
          
          <div className="max-w-6xl mx-auto px-8 relative z-10">
            <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Your Growth Journey</h2>
            <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">Our mentorship platform follows a simple yet effective process to help you achieve your career goals</p>
            
            {/* Cards container with dynamic layout */}
            <div 
              className="relative h-[700px] flex items-center justify-center"
              ref={(el) => {
                if (el) {
                  const observer = new IntersectionObserver(
                    (entries) => {
                      entries.forEach(entry => {
                        if (entry.isIntersecting) {
                          el.classList.add('active-section');
                        } else {
                          el.classList.remove('active-section');
                          // Reset active card when scrolling away
                          setActiveCardId(null);
                        }
                      });
                    },
                    { threshold: 0.3 }
                  );
                  observer.observe(el);
                  return () => observer.disconnect();
                }
              }}
            >
              {/* Center card */}
              <div 
                className="absolute z-20 w-96 bg-white rounded-2xl shadow-2xl p-8 transform transition-all duration-700 hover:shadow-purple-200/50 border border-purple-100 journey-center-card"
                style={{
                  transform: `scale(${Math.min(1, 0.8 + (scrollPosition - sectionOffsetTop) / 500)})`,
                }}
              >
                <div className={`h-48 bg-gradient-to-br ${centerCardContent.bgColor} rounded-xl mb-6 overflow-hidden relative p-4 flex items-center justify-center`}>
                  <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                  {centerCardContent.icon}
                </div>
                <h3 className="text-2xl font-bold text-center mb-3 text-gray-800">{centerCardContent.title}</h3>
                <p className="text-gray-600 text-center mb-6">{centerCardContent.description}</p>
                <div className="flex justify-center">
                  <button className={`px-6 py-3 bg-gradient-to-r ${centerCardContent.bgColor} text-white rounded-full text-sm font-medium transition-all hover:shadow-lg hover:shadow-purple-200`}>
                    {centerCardContent.buttonText}
                  </button>
                </div>
              </div>
              
              {/* Top Card */}
              <div 
                id="discover-card"
                onClick={() => handleCardClick('discover-card')}
                className={`absolute rounded-xl bg-white p-6 shadow-xl w-80 flex flex-col items-center border border-purple-100 hover:shadow-purple-200/50 transition-all duration-700 journey-card journey-top-card cursor-pointer ${activeCardId === 'discover-card' ? 'active-journey-card' : ''}`}
                style={{ 
                  top: '20px',
                  transform: activeCardId === 'discover-card' 
                    ? 'translate(0, 250px) scale(1.1) rotate(0deg)' 
                    : scrollIsInSection 
                      ? `translateY(${scrollPosition * 0.12}px) rotate(${scrollPosition * 0.01}deg)` 
                      : 'translateX(-275px) translateY(200px)',
                  opacity: activeCardId && activeCardId !== 'discover-card' ? 0.5 : ''
                }}
              >
                <div className="bg-indigo-100 p-4 rounded-full mb-4">
                  <BookOpen size={40} className="text-indigo-600" />
                </div>
                <h4 className="font-bold text-xl text-center mb-3">1. Discover</h4>
                <p className="text-gray-600 text-center">Browse our curated network of industry experts and find mentors who match your career aspirations.</p>
              </div>
              
              {/* Right Card */}
              <div 
                id="connect-card"
                onClick={() => handleCardClick('connect-card')}
                className={`absolute rounded-xl bg-white p-6 shadow-xl w-80 flex flex-col items-center border border-purple-100 hover:shadow-purple-200/50 transition-all duration-700 journey-card journey-right-card cursor-pointer ${activeCardId === 'connect-card' ? 'active-journey-card' : ''}`}
                style={{ 
                  right: '20px',
                  transform: activeCardId === 'connect-card' 
                    ? 'translate(-275px, 250px) scale(1.1) rotate(0deg)' 
                    : scrollIsInSection 
                      ? `translateX(${-scrollPosition * 0.12}px) rotate(${-scrollPosition * 0.01}deg)` 
                      : 'translateX(-100px) translateY(200px)',
                  opacity: activeCardId && activeCardId !== 'connect-card' ? 0.5 : ''
                }}
              >
                <div className="bg-purple-100 p-4 rounded-full mb-4">
                  <Clock size={40} className="text-purple-600" />
                </div>
                <h4 className="font-bold text-xl text-center mb-3">2. Connect</h4>
                <p className="text-gray-600 text-center">Schedule 20-45 minute personalized sessions that fit your calendar and learning pace.</p>
              </div>
              
              {/* Bottom Card */}
              <div 
                id="transform-card"
                onClick={() => handleCardClick('transform-card')}
                className={`absolute rounded-xl bg-white p-6 shadow-xl w-80 flex flex-col items-center border border-purple-100 hover:shadow-purple-200/50 transition-all duration-700 journey-card journey-bottom-card cursor-pointer ${activeCardId === 'transform-card' ? 'active-journey-card' : ''}`}
                style={{ 
                  bottom: '20px',
                  transform: activeCardId === 'transform-card' 
                    ? 'translate(0, -250px) scale(1.1) rotate(0deg)' 
                    : scrollIsInSection 
                      ? `translateY(${-scrollPosition * 0.12}px) rotate(${-scrollPosition * 0.01}deg)` 
                      : 'translateX(100px) translateY(200px)',
                  opacity: activeCardId && activeCardId !== 'transform-card' ? 0.5 : ''
                }}
              >
                <div className="bg-pink-100 p-4 rounded-full mb-4">
                  <Coffee size={40} className="text-pink-600" />
                </div>
                <h4 className="font-bold text-xl text-center mb-3">3. Transform</h4>
                <p className="text-gray-600 text-center">Gain insights through interactive video sessions and actionable feedback from industry leaders.</p>
              </div>
              
              {/* Left Card */}
              <div 
                id="succeed-card"
                onClick={() => handleCardClick('succeed-card')}
                className={`absolute rounded-xl bg-white p-6 shadow-xl w-80 flex flex-col items-center border border-purple-100 hover:shadow-purple-200/50 transition-all duration-700 journey-card journey-left-card cursor-pointer ${activeCardId === 'succeed-card' ? 'active-journey-card' : ''}`}
                style={{ 
                  left: '20px',
                  transform: activeCardId === 'succeed-card' 
                    ? 'translate(275px, 250px) scale(1.1) rotate(0deg)' 
                    : scrollIsInSection 
                      ? `translateX(${scrollPosition * 0.12}px) rotate(${scrollPosition * 0.01}deg)` 
                      : 'translateX(275px) translateY(200px)',
                  opacity: activeCardId && activeCardId !== 'succeed-card' ? 0.5 : ''
                }}
              >
                <div className="bg-blue-100 p-4 rounded-full mb-4">
                  <Award size={40} className="text-blue-600" />
                </div>
                <h4 className="font-bold text-xl text-center mb-3">4. Succeed</h4>
                <p className="text-gray-600 text-center">Apply your new knowledge, track your progress, and celebrate achievements with your mentor.</p>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}

export default App;