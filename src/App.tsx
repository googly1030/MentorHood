import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Star, Phone, Users, Coffee, BookOpen, Award, Clock } from 'lucide-react';

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
  ];

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
  
    // Randomize positions within the section's dimensions
    const offsetX = Math.random() * rect.width; // Random horizontal position
    const offsetY = Math.random() * rect.height; // Random vertical position
  
    // Create a unique ID for this emoji
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
  
  useEffect(() => {
    let rafId: number;
    
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const position = window.scrollY;
        setScrollPosition(position);
        
        // Background parallax opacity
        const maxScroll = 500;
        const opacity = Math.max(0.1, 1 - (position / maxScroll));
        setScrollOpacity(opacity);
  
        // Check if journey section is in view
        if (journeySectionRef.current) {
          const rect = journeySectionRef.current.getBoundingClientRect();
          const isInView = rect.top <= window.innerHeight * 0.5 && rect.bottom >= window.innerHeight * 0.5;
          
          if (isInView !== isJourneySectionInView) {
            setIsJourneySectionInView(isInView);
          }
          
          if (isInView) {
            journeySectionRef.current.classList.add('in-view');
            
            // Apply scroll-based transform to center card
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
  
        // Optimize mentor card visibility checks
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
      });
    };
  
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [visibleCards, isJourneySectionInView, mentors.length]);

  return (
    <div className="min-h-screen">
      {/* Floating Emojis */}
      {emojis.map(({ id, emoji, left, top }) => (
        <div
          key={id}
          className="emoji-container"
          style={{
            position: 'absolute',
            left: `${left}px`,
            top: `${top}px`,
            zIndex: 50,
            fontSize: '24px'
          }}
        >
          {emoji}
        </div>
      ))}

      {/* Background Image */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/src/image.webp")',
          opacity: scrollOpacity,
          transform: `translateY(${scrollPosition * 0.5}px)`, // Use scrollPosition instead of window.scrollY
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
      <div className="knowledge-buddies-section py-24 bg-white/95">
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

      {/* Journey Section */}
      <section 
        ref={journeySectionRef}
        className={`journey-section py-24 relative overflow-hidden bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 min-h-screen ${
          isJourneySectionInView ? 'in-view' : ''
        }`}
      >
        {/* Background grid pattern */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid.png')] opacity-20"></div>
        
        {/* Animated floating shapes */}
        <div className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-yellow-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-6xl mx-auto px-8 relative z-10">
          <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Your Growth Journey</h2>
          <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">Our mentorship platform follows a simple yet effective process to help you achieve your career goals</p>
          
          {/* Cards container */}
          <div className="relative h-[800px] flex items-center justify-center">
            {/* Journey cards */}
            <div className="journey-card transform hover:scale-105 transition-transform" onClick={() => handleCardClick('discover-card')}>
              <div className="bg-white rounded-xl p-8 shadow-xl w-80 hover:shadow-2xl transition-all duration-300 border border-indigo-50">
                <div className="bg-indigo-100 p-4 rounded-full mb-4 inline-block">
                  <BookOpen size={40} className="text-indigo-600" />
                </div>
                <h4 className="font-bold text-xl mb-3">1. Discover</h4>
                <p className="text-gray-600 leading-relaxed">Browse our curated network of industry experts and find mentors who match your career aspirations.</p>
              </div>
            </div>

            <div className="journey-card transform hover:scale-105 transition-transform" onClick={() => handleCardClick('connect-card')}>
              <div className="bg-white rounded-xl p-8 shadow-xl w-80 hover:shadow-2xl transition-all duration-300 border border-purple-50">
                <div className="bg-purple-100 p-4 rounded-full mb-4 inline-block">
                  <Clock size={40} className="text-purple-600" />
                </div>
                <h4 className="font-bold text-xl mb-3">2. Connect</h4>
                <p className="text-gray-600 leading-relaxed">Schedule 20-45 minute personalized sessions that fit your calendar and learning pace.</p>
              </div>
            </div>

            <div className="journey-card transform hover:scale-105 transition-transform">
              <div className="bg-white rounded-xl p-8 shadow-xl w-80 hover:shadow-2xl transition-all duration-300 border border-pink-50">
                <div className="bg-pink-100 p-4 rounded-full mb-4 inline-block">
                  <Coffee size={40} className="text-pink-600" />
                </div>
                <h4 className="font-bold text-xl mb-3">3. Transform</h4>
                <p className="text-gray-600 leading-relaxed">Gain insights through interactive video sessions and actionable feedback from industry leaders.</p>
              </div>
            </div>

            <div className="journey-card transform hover:scale-105 transition-transform">
              <div className="bg-white rounded-xl p-8 shadow-xl w-80 hover:shadow-2xl transition-all duration-300 border border-blue-50">
                <div className="bg-blue-100 p-4 rounded-full mb-4 inline-block">
                  <Award size={40} className="text-blue-600" />
                </div>
                <h4 className="font-bold text-xl mb-3">4. Succeed</h4>
                <p className="text-gray-600 leading-relaxed">Apply your new knowledge, track your progress, and celebrate achievements with your mentor.</p>
              </div>
            </div>

            {/* Center card */}
            <div className="journey-center-card w-[450px] bg-white rounded-2xl shadow-2xl p-10 border border-purple-100">
              <div className={`h-56 bg-gradient-to-br ${centerCardContent.bgColor} rounded-xl mb-8 overflow-hidden relative p-6 flex items-center justify-center`}>
                <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="relative z-10 transform hover:scale-105 transition-transform">
                  {centerCardContent.icon}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-center mb-4 text-gray-800 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {centerCardContent.title}
              </h3>
              <p className="text-gray-600 text-center mb-8 text-lg leading-relaxed">
                {centerCardContent.description}
              </p>
              <div className="flex justify-center">
                <button className={`px-8 py-4 bg-gradient-to-r ${centerCardContent.bgColor} text-white rounded-full text-lg font-medium transition-all hover:shadow-lg hover:shadow-purple-200 transform hover:scale-105`}>
                  {centerCardContent.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;