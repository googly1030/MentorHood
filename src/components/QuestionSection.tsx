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
  icon: string;
}

const initialCategories: Category[] = [
  { id: 'all', label: 'All Questions', icon: '🌟' },
  { id: 'tech', label: 'Technical', icon: '💻' },
  { id: 'career', label: 'Career', icon: '💼' },
  { id: 'mentorship', label: 'Mentorship', icon: '🤝' },
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
    <div className="container mx-auto px-4 py-8 max-w-screen-xl pt-[5rem] pb-[10rem]">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Neighborhood</h1>
        <button
          onClick={() => setIsAskModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
        >
          Ask a question
        </button>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
        {initialCategories.map((category) => (
          <button
            key={category.id}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === category.id
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Questions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Featured Question - Full Width */}
        {filteredQuestions.slice(0, 1).map((question) => (
          <div key={question.id} className="md:col-span-2 p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold mb-4">{question.title}</h2>
            
            <div className="flex items-center mb-4">
              <div className="flex -space-x-2 mr-2">
                {question.authors.map((author, index) => (
                  <div key={index} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-sm font-medium">
                    {author.image ? (
                      <img src={author.image} alt="Author" className="w-full h-full rounded-full" />
                    ) : (
                      author.initials
                    )}
                  </div>
                ))}
              </div>
              <button className="text-blue-600 font-medium hover:text-blue-700">View Playbook</button>
            </div>
            
            <p className="text-gray-600 mb-6 text-lg">{question.content}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <button 
                  className={`flex items-center space-x-2 px-4 py-2 text-sm border rounded-full transition-colors
                    ${upvotedQuestions.includes(question.id) ? "text-blue-600 border-blue-200 bg-blue-50" : "text-gray-700 border-gray-200 hover:bg-gray-50"}`}
                  onClick={() => handleUpvote(question.id)}
                >
                  <ArrowUp size={18} className={upvotedQuestions.includes(question.id) ? "text-blue-600" : ""} />
                  <span>Upvote {question.upvotes > 0 && `(${question.upvotes})`}</span>
                </button>
                
                <button 
                  className="flex items-center space-x-2 px-4 py-2 text-sm border rounded-full text-gray-700 border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => handleAnswer(question)}
                >
                  <MessageSquare size={18} />
                  <span>Answer {question.answers > 0 && `(${question.answers})`}</span>
                </button>
              </div>
              
              <div className="text-sm text-gray-500">{question.timestamp}</div>
            </div>
          </div>
        ))}

        {/* Regular Questions - Two Columns */}
        {filteredQuestions.slice(1, 3).map((question) => (
          <div key={question.id} className="p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-xl font-semibold mb-4">{question.title}</h2>
            
            <div className="flex items-center mb-4">
              <div className="flex -space-x-2 mr-2">
                {question.authors.map((author, index) => (
                  <div key={index} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium">
                    {author.image ? (
                      <img src={author.image} alt="Author" className="w-full h-full rounded-full" />
                    ) : (
                      author.initials
                    )}
                  </div>
                ))}
              </div>
              <button className="text-blue-600 font-medium hover:text-blue-700">View Playbook</button>
            </div>
            
            <p className="text-gray-600 mb-4">{question.content}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-3">
                <button 
                  className={`flex items-center space-x-1 px-3 py-1 text-sm border rounded-md 
                    ${upvotedQuestions.includes(question.id) ? "text-blue-600 border-blue-200 bg-blue-50" : "text-gray-700 border-gray-200 hover:bg-gray-50"}`}
                  onClick={() => handleUpvote(question.id)}
                >
                  <ArrowUp size={16} className={upvotedQuestions.includes(question.id) ? "text-blue-600" : ""} />
                  <span>Upvote {question.upvotes > 0 && `(${question.upvotes})`}</span>
                </button>
                
                <button 
                  className="flex items-center space-x-1 px-3 py-1 text-sm border rounded-md text-gray-700 border-gray-200 hover:bg-gray-50"
                  onClick={() => handleAnswer(question)}
                >
                  <MessageSquare size={16} />
                  <span>Answer {question.answers > 0 && `(${question.answers})`}</span>
                </button>

                <button 
                  className="flex items-center space-x-1 px-3 py-1 text-sm border rounded-md text-gray-700 border-gray-200 hover:bg-gray-50"
                  onClick={() => handleViewAnswers(question)}
                >
                  <span>View All Answers</span>
                </button>
              </div>
              
              <div className="text-sm text-gray-500">{question.timestamp}</div>
            </div>
          </div>
        ))}
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