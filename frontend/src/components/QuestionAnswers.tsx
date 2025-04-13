import { useState, useEffect } from "react";
import { ArrowLeft, ArrowUp } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { Question, Answer } from "../types/question";
import { API_URL } from '../utils/api';

export default function QuestionAnswers() {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [upvotedAnswers, setUpvotedAnswers] = useState<string[]>([]);
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load upvoted answers from localStorage on component mount
  useEffect(() => {
    const storedUpvotes = localStorage.getItem('upvotedAnswers');
    if (storedUpvotes) {
      setUpvotedAnswers(JSON.parse(storedUpvotes));
    }
  }, []);

  useEffect(() => {
    const fetchQuestionAndAnswers = async () => {
      try {
        setIsLoading(true);

        // Fetch question from API
        const questionResponse = await fetch(`${API_URL}/questionnaires/${questionId}`);
        if (!questionResponse.ok) {
          throw new Error("Failed to fetch question");
        }
        const questionData = await questionResponse.json();
        setQuestion(questionData);

        // Fetch answers from API
        const answersResponse = await fetch(`${API_URL}/questionnaires/${questionId}/answers`);
        if (!answersResponse.ok) {
          throw new Error("Failed to fetch answers");
        }
        const answersData = await answersResponse.json();
        setAnswers(answersData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load question and answers");
      } finally {
        setIsLoading(false);
      }
    };

    if (questionId) {
      fetchQuestionAndAnswers();
    }
  }, [questionId]);

  const handleUpvoteAnswer = async (answerId: string) => {
    try {
      // Call the upvote API
      const response = await fetch(
        `${API_URL}/questionnaires/${questionId}/answers/${answerId}/upvote/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upvote answer");
      }

      const updatedAnswer = await response.json();

      // Update the answers state with the updated answer
      setAnswers((prev) =>
        prev.map((a) => (a._id === answerId ? updatedAnswer : a))
      );

      // Update the upvotedAnswers state and localStorage
      let newUpvotedAnswers: string[];
      if (upvotedAnswers.includes(answerId)) {
        newUpvotedAnswers = upvotedAnswers.filter((id) => id !== answerId);
      } else {
        newUpvotedAnswers = [...upvotedAnswers, answerId];
      }
      setUpvotedAnswers(newUpvotedAnswers);
      localStorage.setItem('upvotedAnswers', JSON.stringify(newUpvotedAnswers));
    } catch (error) {
      console.error("Error upvoting answer:", error);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim() || !questionId) return;

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_URL}/questionnaires/${questionId}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newAnswer,
          author: {
            id: JSON.parse(localStorage.getItem("user") || "{}").userId,
            name: JSON.parse(localStorage.getItem("user") || "{}").username,
            initials: JSON.parse(localStorage.getItem("user") || "{}")
              .username.substring(0, 2)
              .toUpperCase(),
          },
          question_id: questionId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }

      const newAnswerData = await response.json();
      setAnswers((prev) => [newAnswerData, ...prev]);
      setNewAnswer("");

      // Update question's answer count
      if (question) {
        setQuestion({
          ...question,
          answers: question.answers + 1,
        });
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
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
            onClick={() => navigate("/questions")}
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
          <span>{new Date(question.timestamp).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Answers List */}
      <div className="space-y-6">
        {answers.length > 0 ? (
          answers.map((answer) => (
            <div
              key={answer._id}
              className="bg-white rounded-lg shadow-sm border p-6"
            >
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
                  <div className="text-sm text-gray-500">
                    {new Date(answer.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{answer.content}</p>

              <div className="flex items-center justify-between">
                <button
                  className={`flex items-center space-x-2 px-3 py-1 text-sm border rounded-md
                    ${
                      upvotedAnswers.includes(answer._id)
                        ? "text-purple-600 border-purple-200 bg-purple-50"
                        : "text-gray-700 border-gray-200 hover:bg-gray-50"
                    }`}
                  onClick={() => handleUpvoteAnswer(answer._id)}
                  disabled={upvotedAnswers.includes(answer._id)}
                >
                  <ArrowUp size={16} />
                  <span>
                    Upvote {answer.upvotes > 0 && `(${answer.upvotes})`}
                  </span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm border">
            <p className="text-gray-500">
              No answers yet. Be the first to answer!
            </p>
          </div>
        )}
      </div>

      {/* Answer Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8 mt-8">
        <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
        <textarea
          value={newAnswer}
          onChange={(e) => setNewAnswer(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          rows={4}
          placeholder="Type your answer here..."
        />
        <button
          onClick={handleSubmitAnswer}
          disabled={isSubmitting || !newAnswer.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Answer"}
        </button>
      </div>
    </div>
  );
}
