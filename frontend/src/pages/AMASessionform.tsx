import { 
  ArrowRight, Clock, Users, MessageSquare, Calendar, User, Sparkles, 
  Plus, Minus, CheckCircle, Star, Info, Video, Globe, ArrowLeft, HelpCircle, AlertTriangle
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    sessionName?: string;
    sessionType?: string;
    isPaid?: boolean;
    price?: number;
    topics: string[];
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
  const [customQuestion, setCustomQuestion] = useState('');

  const addQuestion = () => {
    if (customQuestion.trim()) {
      setFormData({
        ...formData,
        questions: [...formData.questions, customQuestion.trim()]
      });
      setCustomQuestion('');
    } else {
      setFormData({
        ...formData,
        questions: [...formData.questions, '']
      });
    }
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
    <div className="p-8 lg:p-10 bg-white rounded-2xl relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/40 rounded-full filter blur-3xl opacity-60 z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/40 rounded-full filter blur-3xl opacity-50 z-0"></div>
      
      <div className="relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-3 border border-indigo-100/50 shadow-sm">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium text-indigo-700">Session Details</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Create Your AMA Session
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Set up an engaging Ask Me Anything session to connect with mentees and share your expertise
          </p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-8 max-w-4xl mx-auto">
          {/* Session Title with Modern Styling */}
          <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start mb-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="ml-4">
                <label htmlFor="title" className="block text-base font-medium text-gray-800">
                  Session Title
                </label>
                <p className="text-sm text-gray-500">Create an engaging title that captures attention</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                  focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                  hover:border-gray-300 pl-12 text-gray-800 placeholder-gray-400 group-hover:shadow-sm group-hover:bg-white"
                placeholder="e.g., 'Breaking into Tech: AMA with a Senior Engineer'"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Session Description */}
          <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start mb-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="ml-4">
                <label htmlFor="description" className="block text-base font-medium text-gray-800">
                  Session Description
                </label>
                <p className="text-sm text-gray-500">Describe what mentees will learn from this session</p>
              </div>
            </div>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl
                focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                hover:border-gray-300 h-32 resize-none group-hover:shadow-sm group-hover:bg-white"
              placeholder="Explain what you'll cover, who this session is ideal for, and what outcomes mentees can expect..."
            />
            <div className="mt-2 text-right">
              <span className="text-xs text-gray-500">{formData.description?.length || 0} characters</span>
            </div>
          </div>

          {/* Mentor Information */}
          <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start mb-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-base font-medium text-gray-800">Mentor Information</h3>
                <p className="text-sm text-gray-500">Share details about yourself as the host</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mentorName" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <div className="relative">
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
                      focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                      hover:border-gray-300 pl-10"
                    placeholder="Your full name"
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div>
                <label htmlFor="mentorRole" className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Role
                </label>
                <div className="relative">
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
                      focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                      hover:border-gray-300 pl-10"
                    placeholder="e.g., Senior Software Engineer"
                  />
                  <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <label htmlFor="mentorImage" className="block text-sm font-medium text-gray-700 mb-2">
                Profile Image URL
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="mentorImage"
                  value={formData.mentor.image}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    mentor: { ...formData.mentor, image: e.target.value } 
                  })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                    focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                    hover:border-gray-300 pl-10"
                  placeholder="https://example.com/your-image.jpg"
                />
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Leave blank to use your profile picture from your account
              </p>
            </div>
          </div>

          {/* Date and Time with Card Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-start mb-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <label htmlFor="date" className="block text-base font-medium text-gray-800">
                    Session Date
                  </label>
                  <p className="text-sm text-gray-500">When will your session take place?</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="date"
                  id="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl
                    focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                    hover:border-gray-300 pl-12 group-hover:shadow-sm group-hover:bg-white"
                />
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-start mb-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <label htmlFor="time" className="block text-base font-medium text-gray-800">
                    Session Time
                  </label>
                  <p className="text-sm text-gray-500">What time will the session start?</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="time"
                  id="time"
                  required
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl
                    focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                    hover:border-gray-300 pl-12 group-hover:shadow-sm group-hover:bg-white"
                />
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Duration and Max Attendees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-start mb-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                  <Video className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <label htmlFor="duration" className="block text-base font-medium text-gray-800">
                    Duration (minutes)
                  </label>
                  <p className="text-sm text-gray-500">How long will the session last?</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  id="duration"
                  required
                  min="15"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl
                    focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                    hover:border-gray-300 pl-12 group-hover:shadow-sm group-hover:bg-white"
                  placeholder="e.g., 60"
                />
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
              </div>
              <div className="mt-3 flex gap-2 justify-start">
                {[30, 45, 60, 90].map(mins => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration: mins.toString() })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      formData.duration === mins.toString() 
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-start mb-5">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <label htmlFor="maxRegistrants" className="block text-base font-medium text-gray-800">
                    Maximum Attendees
                  </label>
                  <p className="text-sm text-gray-500">How many mentees can join?</p>
                </div>
              </div>
              <div className="relative">
                <input
                  type="number"
                  id="maxRegistrants"
                  required
                  min="1"
                  value={formData.maxRegistrants}
                  onChange={(e) => setFormData({ ...formData, maxRegistrants: parseInt(e.target.value) })}
                  className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl
                    focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                    hover:border-gray-300 pl-12 group-hover:shadow-sm group-hover:bg-white"
                  placeholder="e.g., 50"
                />
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 w-5 h-5" />
              </div>
              <div className="mt-3 flex gap-2 justify-start">
                {[10, 25, 50, 100].map(attendees => (
                  <button
                    key={attendees}
                    type="button"
                    onClick={() => setFormData({ ...formData, maxRegistrants: attendees })}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      formData.maxRegistrants === attendees 
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                        : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                    }`}
                  >
                    {attendees} attendees
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Questions List with Enhanced UI */}
          <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start mb-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-base font-medium text-gray-800">Suggested Questions</h3>
                <p className="text-sm text-gray-500">Add topics that mentees might want to ask during the session</p>
              </div>
            </div>
            
            {formData.questions.length > 0 && (
              <div className="mb-6 space-y-3">
                {formData.questions.map((question, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 group/item hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-500">
                      {index + 1}
                    </div>
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => updateQuestion(index, e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-gray-800 placeholder-gray-400"
                      placeholder="Enter a question..."
                    />
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover/item:opacity-100"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-3">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                  focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                  hover:border-gray-300"
                placeholder="Type a question mentees might ask..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customQuestion.trim()) {
                    e.preventDefault();
                    setFormData({
                      ...formData,
                      questions: [...formData.questions, customQuestion.trim()]
                    });
                    setCustomQuestion('');
                  }
                }}
              />
              <button
                type="button"
                onClick={addQuestion}
                className={`px-5 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                  customQuestion.trim() ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-100 text-gray-400'
                }`}
                disabled={!customQuestion.trim()}
              >
                <Plus size={18} />
                <span>Add</span>
              </button>
            </div>
            
            {formData.questions.length === 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 text-center">
                <HelpCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No questions added yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Suggested questions help mentees know what topics you're comfortable discussing
                </p>
              </div>
            )}
          </div>

          {/* Women in Tech Option with Enhanced UI */}
          <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start mb-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-base font-medium text-gray-800">Special Categories</h3>
                <p className="text-sm text-gray-500">Highlight your session with special designations</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 overflow-hidden shadow-sm">
              <div className="flex items-center gap-5 p-5">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4V20M18 6L6 18M20 12H4M18 18L6 6" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-purple-800">Women in Tech</span>
                    <p className="text-sm text-purple-600 mt-1">
                      Mark this session as part of our Women in Tech initiative to highlight and support women in the technology industry.
                    </p>
                  </div>
                </div>
                <div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isWomanTech}
                      onChange={(e) => setFormData({ ...formData, isWomanTech: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-200 rounded-full peer 
                      peer-focus:ring-4 peer-focus:ring-purple-300 
                      peer-checked:after:translate-x-full 
                      peer-checked:after:border-white 
                      after:content-[''] 
                      after:absolute 
                      after:top-0.5 
                      after:left-[4px] 
                      after:bg-white 
                      after:border-gray-300 
                      after:border 
                      after:rounded-full 
                      after:h-6 
                      after:w-6
                      after:transition-all
                      peer-checked:bg-purple-600"
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex justify-end pt-8 mt-8 border-t border-gray-100">
            <button
              type="submit"
              className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-medium 
                transition-all duration-300 flex items-center gap-2 hover:shadow-lg relative overflow-hidden"
            >
              <span className="relative z-10">Continue to Availability</span>
              <ArrowRight size={18} className="relative z-10 transform group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-indigo-700 to-indigo-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface AvailabilityFormProps {
  timeSlots: TimeSlot[];
  setTimeSlots: (slots: TimeSlot[]) => void;
  onBack: () => void;
  onNext: () => void;
}

// AvailabilityForm component with enhanced styling
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
    <div className="p-8 lg:p-10 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/40 rounded-full filter blur-3xl opacity-60 z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/40 rounded-full filter blur-3xl opacity-50 z-0"></div>

      <div className="relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-3 border border-indigo-100/50 shadow-sm">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium text-indigo-700">Set Your Schedule</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Choose Your Availability
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Define when you're available for mentoring sessions. Add multiple time slots for maximum flexibility.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Info Card */}
          <div className="mb-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-indigo-900 mb-1">Timezone: Asia/Singapore</h3>
                <p className="text-indigo-700/80 text-sm">
                  All times are shown in your local timezone. Add multiple slots per day to give mentees more options.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {timeSlots.map((slot, dayIndex) => (
              <div 
                key={slot.day}
                className={`rounded-2xl border transition-all duration-300
                  ${slot.available 
                    ? 'border-indigo-200 bg-white shadow-md hover:shadow-lg' 
                    : 'border-gray-200 bg-gray-50'
                  }`}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={slot.available}
                          onChange={() => toggleDayAvailability(dayIndex)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-300/20 
                          rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-indigo-600
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                          after:bg-white after:border-gray-300 after:border after:rounded-full 
                          after:h-5 after:w-5 after:transition-all"
                        ></div>
                      </label>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{slot.day}</h3>
                        {slot.available && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-sm text-gray-600">
                              {slot.timeRanges.length} {slot.timeRanges.length === 1 ? 'time slot' : 'time slots'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {slot.available && (
                      <button
                        type="button"
                        onClick={() => addTimeRange(dayIndex)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl
                          hover:bg-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-sm font-medium">Add Time Slot</span>
                      </button>
                    )}
                  </div>

                  {slot.available && (
                    <div className="space-y-4">
                      {slot.timeRanges.map((range, rangeIndex) => (
                        <div 
                          key={rangeIndex}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200
                            hover:border-indigo-200 hover:bg-indigo-50/50 transition-all duration-200"
                        >
                          <div className="flex-1 grid grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Start Time</p>
                              <div className="relative">
                                <input
                                  type="time"
                                  value={range.start}
                                  onChange={(e) => updateTimeRange(dayIndex, rangeIndex, 'start', e.target.value)}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg
                                    focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 
                                    transition-all duration-200 pl-10"
                                />
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">End Time</p>
                              <div className="relative">
                                <input
                                  type="time"
                                  value={range.end}
                                  onChange={(e) => updateTimeRange(dayIndex, rangeIndex, 'end', e.target.value)}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg
                                    focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 
                                    transition-all duration-200 pl-10"
                                />
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              </div>
                            </div>
                          </div>
                          
                          {slot.timeRanges.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTimeRange(dayIndex, rangeIndex)}
                              className="p-2 rounded-lg hover:bg-red-50 text-gray-400 
                                hover:text-red-500 transition-colors duration-200"
                            >
                              <Minus size={20} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900
                rounded-xl font-medium transition-all duration-200 hover:bg-gray-50 border border-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Details
            </button>
            
            <button
              type="button"
              onClick={onNext}
              className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl
                font-medium transition-all duration-300 hover:bg-indigo-700 shadow-md hover:shadow-xl"
            >
              Continue to Review
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
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

// ReviewForm component with enhanced styling
function ReviewForm({ formData , onBack, onSubmit, finalText }: ReviewFormProps) {
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
    <div className="p-8 lg:p-10 bg-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/40 rounded-full filter blur-3xl opacity-60 z-0"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-50/40 rounded-full filter blur-3xl opacity-50 z-0"></div>

      <div className="relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-3 border border-indigo-100/50 shadow-sm">
            <CheckCircle className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium text-indigo-700">Final Review</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Review Your Session
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Double-check all details before creating your AMA session
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Session Details Card */}
            <div className="bg-white rounded-2xl border border-indigo-100 shadow-md overflow-hidden">
              <div className="p-6 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border-b border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Session Details</h3>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Title */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Session Title</p>
                  <p className="text-base text-gray-900">{formData.title || 'Not specified'}</p>
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Description</p>
                  <p className="text-base text-gray-900 whitespace-pre-line">
                    {formData.description || 'No description provided'}
                  </p>
                </div>

                {/* Time & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-500 mb-1">Date & Time</p>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Calendar className="w-4 h-4 text-indigo-500" />
                      <span>{formData.date} at {formData.time}</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-500 mb-1">Duration</p>
                    <div className="flex items-center gap-2 text-gray-900">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      <span>{formData.duration} minutes</span>
                    </div>
                  </div>
                </div>

                {/* Attendees */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-1">Maximum Attendees</p>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Users className="w-4 h-4 text-indigo-500" />
                    <span>{formData.maxRegistrants} participants</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mentor & Questions Card */}
            <div className="space-y-6">
              {/* Mentor Info */}
              <div className="bg-white rounded-2xl border border-indigo-100 shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mentor Information</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden">
                    <img 
                      src={formData.mentor.image || `https://ui-avatars.com/api/?name=${formData.mentor.name}`}
                      alt={formData.mentor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{formData.mentor.name}</h4>
                    <p className="text-gray-600">{formData.mentor.role}</p>
                  </div>
                </div>
              </div>

              {/* Questions */}
              <div className="bg-white rounded-2xl border border-indigo-100 shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Questions</h3>
                {formData.questions.length > 0 ? (
                  <div className="space-y-3">
                    {formData.questions.map((question, index) => (
                      <div 
                        key={index}
                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200"
                      >
                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center text-indigo-600 text-sm">
                          {index + 1}
                        </div>
                        <p className="text-gray-800">{question}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No questions added</p>
                )}
              </div>
            </div>
          </div>

          {/* Final Confirmation Box */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-medium text-indigo-900 mb-2">Ready to Create Your Session?</h3>
                <p className="text-indigo-700/80">
                  Your session will be visible to potential mentees once created. You can edit these details anytime from your dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900
                rounded-xl font-medium transition-all duration-200 hover:bg-gray-50 border border-gray-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Availability
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl
                font-medium transition-all duration-300 hover:bg-indigo-700 shadow-md hover:shadow-xl
                ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">↻</span>
                  Creating...
                </>
              ) : (
                <>
                  {finalText} Session
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
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