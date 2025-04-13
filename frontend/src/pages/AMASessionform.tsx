import { ArrowRight, Clock, Users, MessageSquare, Calendar, User, Sparkles, Plus, Minus, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { API_URL } from '../utils/api';

export interface FormData {
    title: string;
    description: string;
    mentor: {
      name: string;
      role: string;
      image: string;
    };
    date: string;
    time: string;
    duration: string;
    registrants: number;
    maxRegistrants: number;
    questions: string[];
    isWomanTech: boolean;
    sessionName?: string; // Added
    sessionType?: string; // Added
    isPaid?: boolean; // Added
    price?: number; // Added
    topics: string[]; // Added
  }

export interface TimeSlot {
  day: string;
  available: boolean;
  timeRanges: { start: string; end: string; }[];
}

export function AMASessionform({ formData, setFormData, onNext }: {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onNext: () => void;
}) {
  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, '']
    });
  };

  const updateQuestion = (index: number, value: string) => {
    const updatedQuestions = [...formData.questions];
    updatedQuestions[index] = value;
    setFormData({
      ...formData,
      questions: updatedQuestions
    });
  };

  const removeQuestion = (index: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-black">
          AMA Session Details
        </h2>
        <p className="text-gray-600 mt-2">
          Set up the basic information for your Ask Me Anything session
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-8">
        {/* Session Title with Icon */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <label htmlFor="title" className="block text-base font-semibold text-gray-800 mb-2">
            Session Title
          </label>
          <div className="relative">
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
                hover:border-gray-400 pl-12"
              placeholder="Enter a clear title for your AMA session"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              📝
            </span>
          </div>
        </div>

        {/* Mentor Information */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-gray-800" />
            <h3 className="text-base font-semibold text-gray-800">Mentor Information</h3>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <label htmlFor="mentorName" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="mentorName"
                required
                value={formData.mentor.name}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  mentor: { ...formData.mentor, name: e.target.value } 
                })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                  focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
                  hover:border-gray-400"
                placeholder="Your full name"
              />
            </div>
            <div className="relative">
              <label htmlFor="mentorRole" className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                id="mentorRole"
                required
                value={formData.mentor.role}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  mentor: { ...formData.mentor, role: e.target.value } 
                })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                  focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
                  hover:border-gray-400"
                placeholder="Your professional title (e.g., Senior Software Engineer)"
              />
            </div>
            <div className="relative">
              <label htmlFor="mentorImage" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image URL
              </label>
              <input
                type="text"
                id="mentorImage"
                value={formData.mentor.image}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  mentor: { ...formData.mentor, image: e.target.value } 
                })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                  focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
                  hover:border-gray-400"
                placeholder="https://example.com/your-image.jpg"
              />
            </div>
          </div>
        </div>

        {/* Date and Time Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <label htmlFor="date" className="block text-base font-semibold text-gray-800 mb-2">
              Session Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                  focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
                  hover:border-gray-400 pl-12"
              />
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <label htmlFor="time" className="block text-base font-semibold text-gray-800 mb-2">
              Session Time
            </label>
            <div className="relative">
              <input
                type="time"
                id="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                  focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
                  hover:border-gray-400 pl-12"
              />
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Duration and Max Registrants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <label htmlFor="duration" className="block text-base font-semibold text-gray-800 mb-2">
              Session Duration (minutes)
            </label>
            <div className="relative">
              <input
                type="number"
                id="duration"
                required
                min="15"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                  focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
                  hover:border-gray-400 pl-12"
                placeholder="e.g., 60"
              />
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <label htmlFor="maxRegistrants" className="block text-base font-semibold text-gray-800 mb-2">
              Maximum Registrants
            </label>
            <div className="relative">
              <input
                type="number"
                id="maxRegistrants"
                required
                min="1"
                value={formData.maxRegistrants}
                onChange={(e) => setFormData({ ...formData, maxRegistrants: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                  focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
                  hover:border-gray-400 pl-12"
                placeholder="e.g., 50"
              />
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-gray-800" />
            <h3 className="text-base font-semibold text-gray-800">Suggested Questions</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Add some suggested questions that mentees might want to ask during the session
          </p>
          <div className="space-y-4">
            {formData.questions.map((question, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={question}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                    focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
                    hover:border-gray-400"
                  placeholder="Enter a question..."
                />
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addQuestion}
              className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-xl
                text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
            >
              + Add Question
            </button>
          </div>
        </div>

        {/* Women in Tech Option */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-gray-800" />
            <h3 className="text-base font-semibold text-gray-800">Special Categories</h3>
          </div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 border border-purple-100 rounded-xl">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isWomanTech}
                onChange={(e) => setFormData({ ...formData, isWomanTech: e.target.checked })}
                className="w-5 h-5 mt-0.5 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
              />
              <div>
                <span className="block font-medium text-gray-800">Women in Tech Session</span>
                <p className="text-sm text-gray-600 mt-1">
                  Mark this session as part of our Women in Tech initiative to highlight and support women in the technology industry.
                </p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100">
          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium 
              transition-all duration-300 flex items-center gap-2 hover:shadow-lg"
          >
            Next Step
            <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}

interface AvailabilityFormProps {
  timeSlots: TimeSlot[];
  setTimeSlots: (slots: TimeSlot[]) => void;
  onBack: () => void;
  onNext: () => void;
}

function AvailabilityForm({ timeSlots, setTimeSlots, onBack, onNext }: AvailabilityFormProps) {
  const addTimeRange = (dayIndex: number) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[dayIndex].timeRanges.push({ start: '09:00', end: '17:00' });
    setTimeSlots(updatedSlots);
  };

  const removeTimeRange = (dayIndex: number, rangeIndex: number) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[dayIndex].timeRanges.splice(rangeIndex, 1);
    setTimeSlots(updatedSlots);
  };

  const updateTimeRange = (dayIndex: number, rangeIndex: number, field: 'start' | 'end', value: string) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[dayIndex].timeRanges[rangeIndex][field] = value;
    setTimeSlots(updatedSlots);
  };

  const toggleDayAvailability = (dayIndex: number) => {
    const updatedSlots = [...timeSlots];
    updatedSlots[dayIndex].available = !updatedSlots[dayIndex].available;
    if (updatedSlots[dayIndex].available && updatedSlots[dayIndex].timeRanges.length === 0) {
      updatedSlots[dayIndex].timeRanges.push({ start: '09:00', end: '17:00' });
    }
    setTimeSlots(updatedSlots);
  };

  return (
    <div className="bg-white p-8">
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-black">
          Set Your Availability
        </h2>
        <p className="text-gray-600 mt-2">
          Define when you're available for mentoring sessions in your local timezone (Asia/Singapore)
        </p>
      </div>

      <div className="grid gap-6">
        {timeSlots.map((slot, dayIndex) => (
          <div 
            key={slot.day}
            className={`rounded-2xl border ${
              slot.available 
                ? 'border-gray-300 bg-gray-50' 
                : 'border-gray-200 bg-gray-50/50'
            } p-6 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={slot.available}
                    onChange={() => toggleDayAvailability(dayIndex)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer 
                    peer-focus:ring-4 peer-focus:ring-black/20
                    peer-checked:after:translate-x-full 
                    peer-checked:after:border-white 
                    after:content-[''] 
                    after:absolute 
                    after:top-[2px] 
                    after:left-[2px] 
                    after:bg-white 
                    after:border-gray-300 
                    after:border 
                    after:rounded-full 
                    after:h-5 
                    after:w-5 
                    after:transition-all
                    peer-checked:bg-black"
                  ></div>
                </label>
                <div>
                  <h3 className="font-semibold text-gray-900">{slot.day}</h3>
                  {slot.available && (
                    <p className="text-sm text-gray-600">
                      {slot.timeRanges.length} {slot.timeRanges.length === 1 ? 'time slot' : 'time slots'}
                    </p>
                  )}
                </div>
              </div>
              {slot.available && (
                <button
                  type="button"
                  onClick={() => addTimeRange(dayIndex)}
                  className="p-2 rounded-full bg-black text-white hover:bg-gray-800 transition-colors duration-200"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>

            {slot.available && (
              <div className="space-y-4">
                {slot.timeRanges.map((range, rangeIndex) => (
                  <div 
                    key={rangeIndex}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm"
                  >
                    <div className="flex-1 flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Start Time</p>
                        <div className="relative">
                          <input
                            type="time"
                            value={range.start}
                            onChange={(e) => updateTimeRange(dayIndex, rangeIndex, 'start', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                              focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-200 pl-8"
                          />
                          <Clock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                      <span className="text-gray-400">to</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">End Time</p>
                        <div className="relative">
                          <input
                            type="time"
                            value={range.end}
                            onChange={(e) => updateTimeRange(dayIndex, rangeIndex, 'end', e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                              focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-200 pl-8"
                          />
                          <Clock className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    {slot.timeRanges.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeRange(dayIndex, rangeIndex)}
                        className="p-2 rounded-full hover:bg-red-50 text-red-400 hover:text-red-500 transition-colors duration-200"
                      >
                        <Minus size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-6 py-2 
            rounded-lg font-medium transition-all duration-200"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white 
            px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
        >
          Next Step
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

interface ReviewFormProps {
  formData: FormData;
  timeSlots: TimeSlot[];
  onBack: () => void;
  onSubmit: () => void;
  finalText: string;
}

function ReviewForm({ formData, timeSlots, onBack, onSubmit, finalText }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit();
    } catch  {
      setError('An error occurred while creating the session. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-black">
          Review Your Session
        </h2>
        <p className="text-gray-600 mt-2">
          Please review your session details before creating
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Session Details Card */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-black/10 rounded-lg">
              <MessageSquare className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Session Details</h3>
          </div>

          <div className="space-y-4">
            {/* Session Name */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Session Name</p>
              <p className="text-base text-gray-900 mt-1">{formData.title || 'Not specified'}</p>
            </div>
            
            {/* Description */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-base text-gray-900 mt-1">{formData.description || 'No description provided'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Duration */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="text-base text-gray-900 mt-1">
                  {formData.duration ? `${formData.duration} minutes` : 'Not specified'}
                </p>
              </div>
              
              {/* Session Type */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Session Type</p>
                <p className="text-base text-gray-900 mt-1">
                  {formData.title || 'General Session'}
                </p>
              </div>
            </div>

            {/* Topics */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Topics</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.topics && formData.topics.length > 0 ? (
                  formData.topics.map((topic: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No topics specified</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Availability Card */}
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-black/10 rounded-lg">
              <Calendar className="w-5 h-5 text-black" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Availability</h3>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {timeSlots.filter(slot => slot.available).map((slot) => (
              <div key={slot.day} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-black"></span>
                    {slot.day}
                  </h4>
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                    {slot.timeRanges.length} {slot.timeRanges.length === 1 ? 'slot' : 'slots'}
                  </span>
                </div>
                <div className="space-y-2">
                  {slot.timeRanges.map((range, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-gray-600 text-sm bg-gray-50 p-2 rounded-lg"
                    >
                      <Clock className="w-4 h-4 text-gray-500" />
                      {range.start} - {range.end}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {timeSlots.filter(slot => slot.available).length === 0 && (
              <div className="text-center p-4 bg-gray-100 rounded-xl">
                <p className="text-gray-500">No availability set</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 border border-gray-200 rounded-xl bg-gray-50">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-gray-800 mt-0.5" />
          <div>
            <p className="font-medium text-gray-800">Almost done!</p>
            <p className="text-gray-600 text-sm">
              Your session will be visible to potential mentees once created. You can edit these details anytime from your dashboard.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-6 py-2 rounded-lg font-medium transition-all duration-300"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex items-center gap-2 bg-black hover:bg-gray-800 text-white 
            px-8 py-3 rounded-lg font-medium transition-all duration-300 
            hover:shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <>
              <span className="animate-spin">↻</span>
              Creating...
            </>
          ) : (
            <>
              {finalText} Session
              <ArrowRight size={20} />
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CreateAMASession() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    mentor: {
      name: '',
      role: '',
      image: ''
    },
    date: '',
    time: '',
    duration: '60',
    registrants: 0,
    maxRegistrants: 50,
    questions: [],
    isWomanTech: false,
    sessionName: '',
    sessionType: '',
    isPaid: false,
    price: 0,
    topics: []
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { day: 'Monday', available: false, timeRanges: [] },
    { day: 'Tuesday', available: false, timeRanges: [] },
    { day: 'Wednesday', available: false, timeRanges: [] },
    { day: 'Thursday', available: false, timeRanges: [] },
    { day: 'Friday', available: false, timeRanges: [] },
    { day: 'Saturday', available: false, timeRanges: [] },
    { day: 'Sunday', available: false, timeRanges: [] }
  ]);
  
  const handleSubmit = async () => {
    try {
      // Format the data according to the API requirements
      const sessionData = {
        title: formData.title,
        description: formData.description,
        mentor: formData.mentor,
        date: formData.date,
        time: formData.time,
        duration: String(formData.duration), // Convert to string
        registrants: formData.registrants,
        maxRegistrants: formData.maxRegistrants,
        questions: formData.questions,
        isWomanTech: formData.isWomanTech,
        sessionName: formData.sessionName,
        sessionType: formData.sessionType,
        isPaid: formData.isPaid,
        price: Number(formData.price),
        topics: formData.topics,
        timeSlots: timeSlots.filter(slot => slot.available)
      };
  

      const response = await fetch(`${API_URL}/ama-sessions`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }
  
      const createdSession = await response.json();
      console.log('Session created successfully:', createdSession);
  
      // Navigate to dashboard after successful creation
      navigate('/mentor-dashboard');
    } catch (error) {
      console.error('Error creating AMA session:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/mentor-dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors duration-300"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-black mb-4">
            Create AMA Session
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Set up your Ask Me Anything session to connect with mentees
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10 px-4">
          <div className="w-full max-w-3xl flex items-center">
            {[
              { num: 1, label: "Session Details" },
              { num: 2, label: "Availability" },
              { num: 3, label: "Review" }
            ].map((stepItem) => (
              <div key={stepItem.num} className="flex-1 flex flex-col items-center relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2
                  ${step === stepItem.num ? 'bg-black text-white' : 
                    step > stepItem.num ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {stepItem.num}
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">{stepItem.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {step === 1 && (
            <AMASessionform
              formData={formData}
              setFormData={setFormData}
              onNext={() => setStep(2)}
            />
          )}

          {step === 2 && (
            <AvailabilityForm
              timeSlots={timeSlots}
              setTimeSlots={setTimeSlots}
              onBack={() => setStep(1)}
              onNext={() => setStep(3)}
            />
          )}

          {step === 3 && (
            <ReviewForm
              formData={formData}
              timeSlots={timeSlots}
              onBack={() => setStep(2)}
              onSubmit={handleSubmit}
              finalText="Create"
            />
          )}
        </div>
      </div>
    </div>
  );
}