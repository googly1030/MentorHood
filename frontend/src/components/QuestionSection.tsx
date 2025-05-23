import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  // ArrowUp,
  MessageSquare,
  Clock,
  TrendingUp,
  Check,
  Video,
  Calendar as CalendarIcon,
  X,
  Mail,
  Coins,
} from "lucide-react";
import { Question } from "../types/question";
import { API_URL } from "../utils/api";
import { toast } from "sonner";
import { getUserData } from "../utils/auth";

// Token data interface
interface TokenData {
  balance: number;
  purchased: number;
  used: number;
  status?: string;
}

// New interface for session details
interface SessionDetails {
  _id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  mentor: {
    name: string;
    role: string;
    company: string;
    image: string;
  };
  description: string;
  registrants: number;
  maxRegistrants: number;
  isWomanTech: boolean;
  tag: string;
  tokenPrice?: number;
  isPaid?: boolean;
  created_at: string;
  updated_at: string;
}

export default function QuestionSection() {
  const navigate = useNavigate();
  const params = useParams();
  const sessionId = params.sessionId;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [answer, setAnswer] = useState("");
  const [activeCategory] = useState(sessionId);
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"timestamp" | "upvotes">("timestamp");
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailSent] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registrationEmail, setRegistrationEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [showRegistrationSuccessModal, setShowRegistrationSuccessModal] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showInsufficientTokensModal, setShowInsufficientTokensModal] = useState<boolean>(false);
  
  // Token-related state
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loadingTokens, setLoadingTokens] = useState(true);
  const [hasEnoughTokens, setHasEnoughTokens] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Load user data when component mounts
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setEmail(userData.email || "");
      setRegistrationEmail(userData.email || "");
      setUserId(userData.userId || null);
    }
  }, []);

  // Fetch token balance from API
  useEffect(() => {
    const fetchUserTokens = async () => {
      if (!userId) {
        setLoadingTokens(false);
        return;
      }

      try {
        setLoadingTokens(true);
        const response = await fetch(`${API_URL}/tokens/balance?user_id=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch token data');
        }
        
        const data = await response.json();
        setTokenData(data);
      } catch (error) {
        console.error('Error fetching token balance:', error);
        toast.error('Could not load your token balance');
      } finally {
        setLoadingTokens(false);
      }
    };

    fetchUserTokens();
  }, [userId]);

  // Fetch session details when component mounts
  useEffect(() => {
    const fetchSessionDetails = async () => {
      if (!sessionId) {
        setSessionError("No session ID provided");
        setSessionLoading(false);
        return;
      }

      try {
        setSessionLoading(true);
        const response = await fetch(`${API_URL}/ama-sessions/${sessionId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setSessionError("Session not found");
          } else {
            setSessionError("Failed to load session details");
          }
          setSessionLoading(false);
          return;
        }

        const data = await response.json();
        setSessionDetails(data);
      } catch (error) {
        console.error("Error fetching session details:", error);
        setSessionError("An error occurred while loading session details");
      } finally {
        setSessionLoading(false);
      }
    };

    fetchSessionDetails();
  }, [sessionId]);

  // Check if user has enough tokens when token data or session details change
  useEffect(() => {
    if (sessionDetails?.isPaid && sessionDetails?.tokenPrice && tokenData) {
      setHasEnoughTokens(tokenData.balance >= sessionDetails.tokenPrice);
    }
  }, [sessionDetails, tokenData]);

  // Check if user is already registered when component mounts
  useEffect(() => {
    const checkRegistrationStatus = async () => {
      if (!sessionId || !email) return;

      try {
        const response = await fetch(
          `${API_URL}/questionnaires/check-registration/${sessionId}/${email}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.is_registered) {
            // User is already registered, update UI accordingly
            setIsRegistered(true);
          }
        }
      } catch (error) {
        console.error("Error checking registration status:", error);
      }
    };

    checkRegistrationStatus();
  }, [sessionId, email]);

  // Fetch questions when component mounts, category changes, or sort order changes
  useEffect(() => {
    fetchQuestions();
  }, [activeCategory, sortBy]);

  // Check if user has enough tokens to register for the session
  const checkUserTokens = () => {
    // Get session token price (default to 0 if free session)
    const tokenPrice = sessionDetails?.tokenPrice || 0;

    if (sessionDetails?.isPaid && tokenPrice > (tokenData?.balance || 0)) {
      setShowInsufficientTokensModal(true);
      return false;
    }
    return true;
  };

  const handleViewAnswers = (question: Question) => {
    // Navigate to the answers page
    navigate(`/questions/${question._id}/answers`);
  };

  const handleQuestionClick = (question: Question) => {
    setCurrentQuestion(question);
    setIsAnswerModalOpen(true);
  };

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/questionnaires/?category_id=${activeCategory}&sort_by=${sortBy}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }
      const questionnaires = await response.json();
      setQuestions(questionnaires);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitQuestion = async () => {
    if (!title.trim() || !content.trim()) return;

    // Get user details from localStorage
    const userData = getUserData();
    if (!userData) {
      toast.error('You must be logged in to ask a question');
      return;
    }
    
    const author = {
      id: userData.userId || "current-user",
      name: userData.username || "Current User",
      initials: userData.username
        ? userData.username.substring(0, 2).toUpperCase()
        : "CU",
    };

    try {
      const response = await fetch(`${API_URL}/questionnaires/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${userData.token}`
        },
        body: JSON.stringify({
          title: title,
          content: content,
          category_id: activeCategory,
          session_id: sessionId,
          author: author,
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to post question");
      }
      
      const newQuestionnaire = await response.json();
      setQuestions((prev) => [newQuestionnaire, ...prev]);
      setTitle("");
      setContent("");
      setIsAskModalOpen(false);
      toast.success("Question posted successfully!");
    } catch (error) {
      console.error("Error posting question:", error);
      toast.error("Failed to post question. Please try again.");
    }
  };

  const submitAnswer = async () => {
    if (!currentQuestion || !answer.trim()) return;

    try {
      const userData = getUserData();
      if (!userData) {
        toast.error('You must be logged in to answer questions');
        return;
      }
      
      // Create the answer object
      const answerData = {
        content: answer,
        author: {
          id: userData.userId,
          name: userData.username || "User",
          initials: userData.username
            ? userData.username.substring(0, 2).toUpperCase()
            : "U",
        },
        question_id: currentQuestion._id,
      };

      // Call the answer API to store the answer in the database
      const response = await fetch(
        `${API_URL}/questionnaires/${currentQuestion._id}/answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userData.token}`
          },
          body: JSON.stringify(answerData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }

      // Update the questions state to reflect the new answer count
      setQuestions((prev) =>
        prev.map((q) =>
          q._id === currentQuestion._id ? { ...q, answers: q.answers + 1 } : q
        )
      );

      setAnswer("");
      setIsAnswerModalOpen(false);
      setCurrentQuestion(null);
      toast.success("Answer submitted successfully!");
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer. Please try again.");
    }
  };

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/questionnaires/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          session_id: sessionId,
        }),
      });

      if (response.ok) {
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
          setIsWaitlistModalOpen(false);
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Registration failed");
      }
    } catch (error) {
      console.error("Error joining waitlist:", error);
      toast.error(error instanceof Error ? error.message : "Registration failed");
    }
  };

// Update the handleRegisterSubmit function with the corrected API call
const handleRegisterSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // First check if the user has enough tokens
  if (!checkUserTokens()) {
    return;
  }

  setIsRegistering(true);
  try {
    const tokenPrice = sessionDetails?.tokenPrice || 0;
    const userData = getUserData();
    
    if (!userData || !userData.userId) {
      toast.error("You need to be logged in to register");
      setIsRegistering(false);
      return;
    }

    // If this is a paid session, spend tokens first
    if (sessionDetails?.isPaid && tokenPrice > 0) {
      try {
        // Properly format the URL with user_id as a query parameter
        const spendResponse = await fetch(`${API_URL}/tokens/spend?user_id=${userData.userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userData.token}`
          },
          body: JSON.stringify({
            amount: tokenPrice,
            description: `Registration for AMA session: ${sessionDetails.title}`,
            usage_type: "ama_sessions"
          })
        });
        
        if (!spendResponse.ok) {
          const errorData = await spendResponse.json();
          throw new Error(errorData.detail || 'Failed to spend tokens');
        }
      } catch (error) {
        console.error('Error spending tokens:', error);
        toast.error('Failed to spend tokens. Please try again.');
        setIsRegistering(false);
        return;
      }
    }

    // Now register for the session
    const response = await fetch(`${API_URL}/registrations/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${userData.token}`
      },
      body: JSON.stringify({
        email: registrationEmail,
        session_id: sessionId,
        tokenPrice: tokenPrice,
        user_id: userData.userId,
        name: userData.username || "",
        company: "",
        role: "",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Registration failed");
    }

    // Refresh token balance after successful registration
    try {
      const tokenResponse = await fetch(`${API_URL}/tokens/balance?user_id=${userData.userId}`);
      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        setTokenData(tokenData);
      }
    } catch (error) {
      console.error("Error refreshing token balance:", error);
    }

    setIsRegistered(true);
    setShowRegistrationSuccessModal(true);
  } catch (error) {
    console.error("Error registering for session:", error);
    toast.error(error instanceof Error ? error.message : "Registration failed");
  } finally {
    setIsRegistering(false);
  }
};

    const filteredQuestions =
    activeCategory === "all"
      ? questions
      : questions.filter((q) => q.category_id === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
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
          {sessionLoading ? (
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 p-8 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : sessionError ? (
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 p-8 text-center">
              <p className="text-red-500 text-xl">{sessionError}</p>
            </div>
          ) : sessionDetails ? (
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-100 mb-8 overflow-hidden">
              {/* Session Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <img
                    src={sessionDetails.mentor.image}
                    alt={sessionDetails.mentor.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
                  />
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {sessionDetails.title}
                    </h2>
                    <p className="text-gray-700 mt-1">
                      Hosted by{" "}
                      <span className="font-semibold">
                        {sessionDetails.mentor.name}
                      </span>
                      , {sessionDetails.mentor.role} at{" "}
                      {sessionDetails.mentor.company}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {/* Add Token Price information if paid session */}
                  {sessionDetails.isPaid && (
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-50 p-2 rounded-full">
                        <Coins size={20} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Price</p>
                        <p className="font-medium">
                          {sessionDetails.tokenPrice} tokens
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-6">
                  {sessionDetails.description}
                </p>

                {/* Token balance display with loading state */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-gray-600">
                    Your token balance:
                  </span>
                  {loadingTokens ? (
                    <div className="animate-pulse bg-gray-200 h-5 w-20 rounded"></div>
                  ) : tokenData ? (
                    <span className="font-medium">{tokenData.balance} tokens</span>
                  ) : (
                    <span className="text-gray-500">Not available</span>
                  )}
                </div>

                {/* Registration Status and Buttons */}
                <div className="flex flex-wrap gap-4">
                  {isRegistered ? (
                    <>
                      <button
                        disabled
                        className="px-6 py-3 rounded-xl bg-gray-300 text-white 
                        transition-all duration-300 transform shadow-lg 
                        flex items-center gap-2 font-medium cursor-not-allowed"
                      >
                        <Check size={18} />
                        Already Registered
                      </button>

                      {/* Enable Ask Question button only after registration */}
                      <button
                        onClick={() => setIsAskModalOpen(true)}
                        className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 
                        transition-all duration-200 flex items-center gap-2 font-medium"
                      >
                        <MessageSquare size={18} />
                        Ask a Question
                      </button>
                    </>
                  ) : loadingTokens ? (
                    <button
                      disabled
                      className="px-6 py-3 rounded-xl bg-gray-300 text-white 
                      transition-all duration-300 transform shadow-lg 
                      flex items-center gap-2 font-medium cursor-not-allowed"
                    >
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Loading...
                    </button>
                  ) : (
                    <button
                      onClick={handleRegisterSubmit}
                      disabled={isRegistering || !hasEnoughTokens}
                      className={`px-6 py-3 rounded-xl text-white 
                        transition-all duration-300 transform hover:scale-105 shadow-lg 
                        flex items-center gap-2 font-medium ${
                          isRegistering || !hasEnoughTokens 
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-black hover:bg-gray-800"
                        }`}
                    >
                      {isRegistering ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                          Registering...
                        </>
                      ) : !hasEnoughTokens ? (
                        <>
                          <Coins size={18} />
                          Insufficient Tokens
                        </>
                      ) : (
                        <>
                          <CalendarIcon size={18} />
                          {sessionDetails.isPaid && sessionDetails.tokenPrice
                            ? `Register (${sessionDetails.tokenPrice} tokens)`
                            : "Register Now (Free)"}
                        </>
                      )}
                    </button>
                  )}
                  
                  {/* Add Buy Tokens button when user doesn't have enough */}
               {!loadingTokens && !hasEnoughTokens && !isRegistered && (
  <a
    href="/purchase-tokens"
    className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 
      transition-all duration-200 flex items-center gap-2 font-medium"
  >
    <Coins size={18} />
    Buy Tokens
  </a>
)}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Sort Section */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12 mt-8">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Sort by:</span>
              <button
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  sortBy === "timestamp"
                    ? "bg-gray-900 text-white"
                    : "border border-gray-300 bg-white hover:bg-gray-50"
                }`}
                onClick={() => setSortBy("timestamp")}
              >
                <Clock size={14} />
                <span>Latest</span>
              </button>
              <button
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                  sortBy === "upvotes"
                    ? "bg-gray-900 text-white"
                    : "border border-gray-300 bg-white hover:bg-gray-50"
                }`}
                onClick={() => setSortBy("upvotes")}
              >
                <TrendingUp size={14} />
                <span>Most Upvoted</span>
              </button>
            </div>

            {!isRegistered && (
              <div className="text-gray-600 italic">
                Please register for this session to ask questions
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Questions Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">
              No questions found. Be the first to ask a question!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredQuestions.map((question) => (
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
                      className="flex items-center gap-2 px-3 py-1 rounded-full text-sm border border-gray-200 hover:bg-gray-50"
                      onClick={() => handleQuestionClick(question)}
                    >
                      <MessageSquare size={16} />
                      <span>
                        Answer {question.answers > 0 && `(${question.answers})`}
                      </span>
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

      {/* Waitlist Modal */}
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

      {/* Registration Success Modal */}
      {showRegistrationSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mb-4">
                <Check size={48} className="mx-auto text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Registration Successful!
              </h3>
              <p className="text-gray-600 mb-6">
                You have successfully registered for this AMA session. A
                confirmation email with all the details has been sent to your
                inbox.
              </p>
              
              {sessionDetails?.isPaid && sessionDetails.tokenPrice && tokenData && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins size={18} className="text-blue-600" />
                    <span className="font-medium text-blue-800">Tokens Used</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Session cost:</span>
                    <span className="font-medium text-blue-800">{sessionDetails.tokenPrice} tokens</span>
                  </div>
                  <div className="flex justify-between items-center mt-1 pt-2 border-t border-blue-200">
                    <span className="text-blue-700">Remaining balance:</span>
                    <span className="font-medium text-blue-800">{tokenData.balance} tokens</span>
                  </div>
                </div>
              )}
              
              <div className="mb-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Mail size={14} />
                <span>{registrationEmail}</span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRegistrationSuccessModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <a
                  href="https://mail.google.com/mail/u/0/#inbox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Check Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Insufficient Tokens Modal */}
      {showInsufficientTokensModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
            <button
              onClick={() => setShowInsufficientTokensModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>

            <div className="text-center">
              <div className="mb-4 text-orange-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Insufficient Tokens
              </h3>
              <p className="text-gray-600 mb-6">
                You don't have enough tokens to register for this session. You
                need {sessionDetails?.tokenPrice} tokens but have {tokenData?.balance || 0} tokens.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowInsufficientTokensModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <a
                  href="/purchase-tokens" 
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Buy Tokens
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}