import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, MessageSquare, Clock, TrendingUp , Check, Video, Calendar as CalendarIcon, X } from 'lucide-react';
import { Question } from '../types/question';

// New interface for session details
interface SessionDetails {
  title: string;
  date: string;
  time: string;
  duration: string;
  host: {
    name: string;
    role: string;
    company: string;
    image: string;
  };
  description: string;
}

export default function QuestionSection() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [answer, setAnswer] = useState('');
  const [activeCategory] = useState('all');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [upvotedQuestions, setUpvotedQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'timestamp' | 'upvotes'>('timestamp');
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  // Sample session details (would come from API in a real app)
  const sessionDetails: SessionDetails = {
    title: "Building Scalable Microservices Architecture",
    date: "April 15, 2025",
    time: "10:00 AM PST",
    duration: "60 minutes",
    host: {
      name: "Michael Chen",
      role: "Engineering Manager",
      company: "Meta",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
    },
    description: "Join us for an insightful Ask Me Anything session where Michael will share his expertise on building scalable microservices architecture. Learn about design patterns, common pitfalls, and best practices from his experience leading engineering teams at Meta."
  };

  // Fetch questions when component mounts, category changes, or sort order changes
  useEffect(() => {
    fetchQuestions();
  }, [activeCategory, sortBy]);

  // Filter questions based on active category
  const filteredQuestions = activeCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category_id === activeCategory);

  const handleUpvote = async (questionId: string) => {
    try {
      // Call the upvote API
      const response = await fetch(`http://localhost:9000/api/questionnaires/${questionId}/upvote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to upvote question');
      }

      const updatedQuestion = await response.json();
      
      // Update the questions state with the updated question
      setQuestions(prev => prev.map(q => 
        q._id === questionId ? updatedQuestion : q
      ));

      // Update the upvotedQuestions state
      if (upvotedQuestions.includes(questionId)) {
        setUpvotedQuestions(prev => prev.filter(id => id !== questionId));
      } else {
        setUpvotedQuestions(prev => [...prev, questionId]);
      }
    } catch (error) {
      console.error('Error upvoting question:', error);
    }
  };

  const handleQuestionClick = (question: Question) => {
    setCurrentQuestion(question);
    setIsAnswerModalOpen(true);
  };

  useEffect(() => {
    const userKey = localStorage.getItem('user');
    if (userKey) {
      // You can use the userKey here for authentication or other purposes
      const userObj = JSON.parse(userKey);
      setEmail(userObj.email);

    }
  }, []);

  const handleViewAnswers = (question: Question) => {
    // Navigate to the answers page
    navigate(`/questions/${question._id}/answers`);
  };

  const submitQuestion = async () => {
    if (!title.trim() || !content.trim()) return;

    const response = await fetch('http://localhost:9000/api/questionnaires', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: title,
        content: content,
        category_id: activeCategory
      })
    });
    const newQuestionnaire = await response.json();

    setQuestions(prev => [newQuestionnaire, ...prev]);
    setTitle('');
    setContent('');
    setIsAskModalOpen(false);
  };

  const submitAnswer = async () => {
    if (!currentQuestion || !answer.trim()) return;

    try {
      // Create the answer object
      const answerData = {
        content: answer,
        author: {
          id: 'current-user',
          name: 'Current User',
          initials: 'CU'
        },
        question_id: currentQuestion._id
      };

      // Call the answer API to store the answer in the database
      const response = await fetch(`http://localhost:9000/api/questionnaires/${currentQuestion._id}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answerData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }

      // Update the questions state to reflect the new answer count
      setQuestions(prev => prev.map(q => 
        q._id === currentQuestion._id ? {...q, answers: q.answers + 1} : q
      ));

      setAnswer('');
      setIsAnswerModalOpen(false);
      setCurrentQuestion(null);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:9000/api/questionnaires?category_id=${activeCategory}&sort_by=${sortBy}`);
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      const questionnaires = await response.json();
      setQuestions(questionnaires);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:9000/api/questionnaires/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsEmailSent(true);
        setTimeout(() => {
          setIsWaitlistModalOpen(false);
          setIsEmailSent(false);
          setEmail('');
        }, 2000);
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsRegistered(true);
      setTimeout(() => {
        setIsRegisterModalOpen(true);
        setIsRegistered(false);
        setRegistrationEmail('');
      }, 2000);
    } catch (error) {
      console.error('Error registering for session:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Reused from AllMentors */}
      <div className="hero-section relative">
        <div className="mx-auto px-8 flex justify-center items-center flex-col relative z-[2] pt-4">
          <h1 className="text-6xl font-bold mb-4 max-w-3xl text-center mx-auto">
          Questions for this AMA
          </h1>
          <p className="text-xl mb-8 text-gray-700 text-center max-w-2xl mx-auto">
            Ask questions, share knowledge, and connect with tech professionals 
            from top companies worldwide.
          </p>
          
          {/* Session Details Card */}
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
            {/* Session Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-4">
                <img 
                  src={sessionDetails.host.image}
                  alt={sessionDetails.host.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{sessionDetails.title}</h2>
                  <p className="text-gray-700 mt-1">
                    Hosted by <span className="font-semibold">{sessionDetails.host.name}</span>, {sessionDetails.host.role} at {sessionDetails.host.company}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Session Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <CalendarIcon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{sessionDetails.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Clock size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{sessionDetails.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <Video size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{sessionDetails.duration}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">{sessionDetails.description}</p>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={(e) => handleWaitlistSubmit(e)}
                  className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 
                    transition-all duration-300 transform hover:scale-105 shadow-lg 
                    flex items-center gap-2 font-medium"
                >
                  <CalendarIcon size={18} />
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* UPDATED: Sort By and Ask Question Button */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12 mt-8">
            {/* Sort Options - Moved to replace All Questions filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Sort by:</span>
              <button
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  sortBy === 'timestamp' 
                    ? "bg-gray-900 text-white" 
                    : "border border-gray-300 bg-white hover:bg-gray-50"
                }`}
                onClick={() => setSortBy('timestamp')}
              >
                <Clock size={14} />
                <span>Latest</span>
              </button>
              <button
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  sortBy === 'upvotes' 
                    ? "bg-gray-900 text-white" 
                    : "border border-gray-300 bg-white hover:bg-gray-50"
                }`}
                onClick={() => setSortBy('upvotes')}
              >
                <TrendingUp size={14} />
                <span>Most Upvoted</span>
              </button>
            </div>

            {/* Add Ask Question Button at right end */}
            <button
              onClick={() => setIsAskModalOpen(true)}
              className="px-6 py-2 rounded-lg bg-black text-white hover:bg-gray-800 
                transition-all duration-200 flex items-center gap-2 font-medium"
            >
              <MessageSquare size={16} />
              Ask a Question
            </button>
          </div>
        </div>
      </div>

      {/* Questions Grid - No changes needed */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No questions found. Be the first to ask a question!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredQuestions.map(question => (
              <div
                key={question._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-200"
              >
                <h2 className="text-xl font-semibold mb-4">{question.title}</h2>
                
                <div className="flex items-center mb-4">
                  <div className="flex -space-x-2 mr-2">
                    {question.authors.map((author, index) => (
                      <div 
                        key={index} 
                        className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-sm font-medium"
                      >
                        {author.initials}
                      </div>
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6">{question.content}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <button 
                      className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${
                        upvotedQuestions.includes(question._id)
                          ? "bg-black text-white border-black"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                      onClick={() => handleUpvote(question._id)}
                    >
                      <ArrowUp size={16} className={upvotedQuestions.includes(question._id) ? "text-white" : ""} />
                      <span>Upvote {question.upvotes > 0 && `(${question.upvotes})`}</span>
                    </button>
                    
                    <button 
                      className="flex items-center gap-2 px-3 py-1 rounded-full text-sm border border-gray-200 hover:bg-gray-50"
                      onClick={() => handleQuestionClick(question)}
                    >
                      <MessageSquare size={16} />
                      <span>Answer {question.answers > 0 && `(${question.answers})`}</span>
                    </button>

                    {question.answers > 0 && (
                      <button 
                        className="flex items-center gap-2 px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
                        onClick={() => handleViewAnswers(question)}
                      >
                        <span>View {question.answers} Answers</span>
                      </button>
                    )}
                  </div>
                  
                  <span className="text-sm text-gray-500">
                    {new Date(question.timestamp).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Ask Question Modal */}
      {isAskModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Ask a question</h2>
            
            <div className="space-y-4 mb-4">
              <div>
                <input
                  type="text"
                  placeholder="What's your question?"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <textarea
                  placeholder="Provide details about your question..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2 border rounded-md min-h-[120px]"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsAskModalOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={submitQuestion}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Post Question
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Answer Modal */}
      {isAnswerModalOpen && currentQuestion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{currentQuestion.title}</h3>
              <button 
                onClick={() => {
                  setIsAnswerModalOpen(false);
                  setCurrentQuestion(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700">{currentQuestion.content}</p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium mb-2">Your Answer</h4>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Type your answer here..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setIsAnswerModalOpen(false);
                  setCurrentQuestion(null);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitAnswer}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                disabled={!answer.trim()}
              >
                Submit Answer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Waitlist Modal */}
      {isWaitlistModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setIsWaitlistModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
            
            {isEmailSent ? (
              <div className="text-center py-8">
                <div className="mb-4 text-green-500">
                  <Check size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  You're on the list!
                </h3>
                <p className="text-gray-600">
                  We'll notify you when the AMA session begins.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">Join the Waitlist</h2>
                <p className="text-gray-600 mb-6">
                  Be the first to know when this AMA session goes live.
                </p>
                
                <form onSubmit={handleWaitlistSubmit}>
                  <div className="mb-6">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-[#4937e8]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-xl bg-[#4937e8] text-white 
                      hover:bg-[#4338ca] transition-all duration-300"
                  >
                    Join Waitlist
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
            
            {isRegistered ? (
              <div className="text-center py-8">
                <div className="mb-4 text-green-500">
                  <Check size={48} className="mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  You're registered!
                </h3>
                <p className="text-gray-600">
                  We'll send you a reminder before the session starts.
                </p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-2">Register for the Session</h2>
                <p className="text-gray-600 mb-6">
                  Enter your email to register for the AMA session.
                </p>
                
                <form onSubmit={handleRegisterSubmit}>
                  <div className="mb-6">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={registrationEmail}
                      onChange={(e) => setRegistrationEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-[#4937e8]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 rounded-xl bg-[#4937e8] text-white 
                      hover:bg-[#4338ca] transition-all duration-300"
                  >
                    Register Now
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}