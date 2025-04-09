import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowUp } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question, Answer } from '../types/question';

export default function QuestionAnswers() {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();
  
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [upvotedAnswers, setUpvotedAnswers] = useState<string[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        setIsLoading(true);
        const questionData = localStorage.getItem(`question_${questionId}`);
        const answersData = localStorage.getItem(`answers_${questionId}`);

        if (!questionData) {
          setError('Question not found');
          return;
        }

        setQuestion(JSON.parse(questionData));
        setAnswers(answersData ? JSON.parse(answersData) : []);
      } catch  {
        setError('Failed to load question and answers');
      } finally {
        setIsLoading(false);
      }
    };

    if (questionId) {
      fetchQuestionAndAnswers();
    }
  }, [questionId]);

  const handleUpvoteAnswer = (answerId: string) => {
    if (upvotedAnswers.includes(answerId)) {
      setUpvotedAnswers(prev => prev.filter(id => id !== answerId));
      setAnswers(prev => prev.map(a => 
        a.id === answerId ? { ...a, upvotes: a.upvotes - 1 } : a
      ));
    } else {
      setUpvotedAnswers(prev => [...prev, answerId]);
      setAnswers(prev => prev.map(a => 
        a.id === answerId ? { ...a, upvotes: a.upvotes + 1 } : a
      ));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center">
            <div className="text-red-700">{error}</div>
          </div>
          <button 
            onClick={() => navigate('/questions')}
            className="text-red-700 hover:text-red-800"
          >
            Go back to questions
          </button>
        </div>
      </div>
    );
  }

  if (!question) return <div>Question not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button 
          onClick={() => navigate(-1)}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">Question Answers</h1>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">{question.title}</h2>
        <p className="text-gray-600 mb-4">{question.content}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span>{question.answers} answers</span>
          <span className="mx-2">•</span>
          <span>{question.timestamp}</span>
        </div>
      </div>

      {/* Answers List */}
      <div className="space-y-6">
        {answers.map((answer) => (
          <div key={answer.id} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                {answer.author.image ? (
                  <img 
                    src={answer.author.image} 
                    alt={answer.author.name} 
                    className="w-full h-full rounded-full"
                  />
                ) : (
                  <span className="text-sm font-medium">
                    {answer.author.initials}
                  </span>
                )}
              </div>
              <div>
                <div className="font-medium">{answer.author.name}</div>
                <div className="text-sm text-gray-500">{answer.timestamp}</div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{answer.content}</p>
            
            <div className="flex items-center justify-between">
              <button 
                className={`flex items-center space-x-2 px-3 py-1 text-sm border rounded-md
                  ${upvotedAnswers.includes(answer.id) 
                    ? "text-purple-600 border-purple-200 bg-purple-50" 
                    : "text-gray-700 border-gray-200 hover:bg-gray-50"}`}
                onClick={() => handleUpvoteAnswer(answer.id)}
              >
                <ArrowUp size={16} />
                <span>Upvote {answer.upvotes > 0 && `(${answer.upvotes})`}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}