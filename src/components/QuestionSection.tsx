import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, MessageSquare } from 'lucide-react';

interface Author {
  id: string;
  name: string;
  image?: string;
  initials: string;
}

interface Question {
  id: string;
  title: string;
  content: string;
  authors: Author[];
  upvotes: number;
  answers: number;
  timestamp: string;
  categoryId: string;
}

interface Category {
  id: string;
  label: string;
}

const initialCategories: Category[] = [
  { id: 'all', label: 'All Questions' }
];

const initialQuestions: Question[] = [
  {
    id: '1',
    title: 'What do recruiters/hiring managers look for in a design portfolio?',
    content: 'Recruiters and hiring managers look for several key aspects in a design portfolio, including: Variety: Showcasing a range of projects in different styles and mediums demonstrates your versatility...',
    authors: [{ id: '1', name: 'John Doe', initials: 'JD' }],
    upvotes: 657,
    answers: 381,
    timestamp: '1 year ago',
    categoryId: 'career'
  },
  {
    id: '2',
    title: 'What do recruiters/hiring managers look for in a design portfolio?',
    content: 'Recruiters and hiring managers look for several key aspects in a design portfolio, including: Variety: Showcasing a range of projects in different styles and mediums demonstrates your versatility...',
    authors: [{ id: '1', name: 'John Doe', initials: 'JD' }],
    upvotes: 657,
    answers: 381,
    timestamp: '1 year ago',
    categoryId: 'career'
  },
  {
    id: '3',
    title: 'What do recruiters/hiring managers look for in a design portfolio?',
    content: 'Recruiters and hiring managers look for several key aspects in a design portfolio, including: Variety: Showcasing a range of projects in different styles and mediums demonstrates your versatility...',
    authors: [{ id: '1', name: 'John Doe', initials: 'JD' }],
    upvotes: 657,
    answers: 381,
    timestamp: '1 year ago',
    categoryId: 'career'
  },
];

export default function QuestionSection() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [answer, setAnswer] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [isAnswerModalOpen, setIsAnswerModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [upvotedQuestions, setUpvotedQuestions] = useState<string[]>([]);

  // Filter questions based on active category
  const filteredQuestions = activeCategory === 'all' 
    ? questions 
    : questions.filter(q => q.categoryId === activeCategory);

  const handleUpvote = (questionId: string) => {
    if (upvotedQuestions.includes(questionId)) {
      // Remove upvote
      setUpvotedQuestions(prev => prev.filter(id => id !== questionId));
      setQuestions(prev => prev.map(q => 
        q.id === questionId ? { ...q, upvotes: q.upvotes - 1 } : q
      ));
    } else {
      // Add upvote
      setUpvotedQuestions(prev => [...prev, questionId]);
      setQuestions(prev => prev.map(q => 
        q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
      ));
    }
  };

  const handleAnswer = (question: Question) => {
    setCurrentQuestion(question);
    setIsAnswerModalOpen(true);
  };

  const handleViewAnswers = (question: Question) => {
    // Save question data to localStorage before navigation
    localStorage.setItem(`question_${question.id}`, JSON.stringify(question));
    navigate(`/questions/${question.id}/answers`);
  };

  const submitQuestion = () => {
    if (!title.trim() || !content.trim()) return;

    const newQuestion: Question = {
      id: Date.now().toString(),
      title,
      content,
      authors: [{
        id: 'current-user',
        name: 'Current User',
        initials: 'CU'
      }],
      upvotes: 0,
      answers: 0,
      timestamp: 'Just now',
      categoryId: activeCategory,
    };

    setQuestions(prev => [newQuestion, ...prev]);
    setTitle('');
    setContent('');
    setIsAskModalOpen(false);
  };

  const submitAnswer = () => {
    if (!currentQuestion || !answer.trim()) return;

    const newAnswer = {
      id: Date.now().toString(),
      content: answer,
      author: {
        id: 'current-user',
        name: 'Current User',
        initials: 'CU'
      },
      upvotes: 0,
      timestamp: 'Just now',
      questionId: currentQuestion.id
    };

    // Save the new answer to localStorage
    const existingAnswers = JSON.parse(localStorage.getItem(`answers_${currentQuestion.id}`) || '[]');
    const updatedAnswers = [newAnswer, ...existingAnswers];
    localStorage.setItem(`answers_${currentQuestion.id}`, JSON.stringify(updatedAnswers));

    // Update question's answer count
    setQuestions(prev => prev.map(q => 
      q.id === currentQuestion.id 
        ? { ...q, answers: q.answers + 1 }
        : q
    ));

    // Update localStorage for the question
    localStorage.setItem(`question_${currentQuestion.id}`, JSON.stringify({
      ...currentQuestion,
      answers: currentQuestion.answers + 1
    }));

    setAnswer('');
    setIsAnswerModalOpen(false);
    setCurrentQuestion(null);
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
        </div>

        {/* Category Filter and Ask Question Button */}
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-12 mt-8">
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {initialCategories.map((category) => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full transition-all duration-300 ${
                    activeCategory === category.id 
                    ? "bg-gray-900 text-white" 
                    : "border border-gray-300 bg-white hover:bg-gray-50"
                  }`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span className="flex items-center gap-2">
                     {category.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Ask Question Button - Separated and Prominent */}
            <button
              onClick={() => setIsAskModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 
                transition-all duration-300 transform hover:scale-105 shadow-lg 
                flex items-center gap-2 font-medium min-w-[160px] justify-center"
            >
              <MessageSquare size={18} />
              Ask a Question
            </button>
          </div>
        </div>
      </div>

      {/* Questions Grid - Updated with AllMentors styling */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredQuestions.map(question => (
            <div
              key={question.id}
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
                      upvotedQuestions.includes(question.id)
                        ? "bg-black text-white border-black"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => handleUpvote(question.id)}
                  >
                    <ArrowUp size={16} className={upvotedQuestions.includes(question.id) ? "text-white" : ""} />
                    <span>Upvote {question.upvotes > 0 && `(${question.upvotes})`}</span>
                  </button>
                  
                  <button 
                    className="flex items-center gap-2 px-3 py-1 rounded-full text-sm border border-gray-200 hover:bg-gray-50"
                    onClick={() => handleAnswer(question)}
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
                
                <span className="text-sm text-gray-500">{question.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-2">Answer Question</h2>
            <h3 className="font-medium text-gray-700 mb-4">{currentQuestion.title}</h3>
            
            <div className="mb-4">
              <textarea
                placeholder="Share your knowledge and experience..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-2 border rounded-md min-h-[150px]"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsAnswerModalOpen(false)}
                className="px-4 py-2 border rounded-md text-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={submitAnswer}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Post Answer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}