import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ArrowRight } from 'lucide-react';
import { getUserData } from '../utils/auth';
import { toast } from 'sonner';

interface FormData {
  sessionName: string;
  description: string;
  duration: string;
  sessionType: string;
  numberOfSessions: string;
  occurrence: string;
  topics: string[];
  allowMenteeTopics: boolean;
  showOnProfile: boolean;
  isPaid: boolean;
  price: string;
}

interface TimeSlot {
  day: string;
  available: boolean;
  timeRanges: { start: string; end: string }[];
}

const TOPICS = [
  'UX Design', 'Product Management', 'Web Development',
  'Mobile Development', 'Data Science', 'Marketing',
  'Leadership', 'Career Development', 'Entrepreneurship'
];

const OCCURRENCE_OPTIONS = [
  'Repeats every week',
  'Repeats every 2 weeks',
  'Repeats every month',
  'Custom'
];

const DAYS = [
  'SUNDAYS', 'MONDAYS', 'TUESDAYS', 'WEDNESDAYS',
  'THURSDAYS', 'FRIDAYS', 'SATURDAYS'
];

export function SessionForm({ formData, setFormData, onNext }: {
    formData: FormData;
    setFormData: (data: FormData) => void;
    onNext: () => void;
  }) {
    return (
      <div className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
            Session Details
          </h2>
          <p className="text-gray-600 mt-2">
            Set up the basic information for your mentoring session
          </p>
        </div>
  
        <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-8">
          {/* Session Name with Icon */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <label htmlFor="sessionName" className="block text-base font-semibold text-gray-800 mb-2">
              Session Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="sessionName"
                value={formData.sessionName}
                onChange={(e) => setFormData({ ...formData, sessionName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                  focus:ring-2 focus:ring-[#4937e8] focus:border-transparent transition-all duration-300
                  hover:border-[#4937e8] pl-12"
                placeholder="Enter a clear name for your session"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                📝
              </span>
            </div>
          </div>
  
          {/* Description with Modern Textarea */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <label htmlFor="description" className="block text-base font-semibold text-gray-800 mb-2">
              Session Description
            </label>
            <textarea
              id="description"
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                focus:ring-2 focus:ring-[#4937e8] focus:border-transparent transition-all duration-300
                hover:border-[#4937e8] h-32 resize-none"
              placeholder="Describe what mentees can expect from this session..."
            />
          </div>
  
          {/* Duration and Session Type Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <label htmlFor="duration" className="block text-base font-semibold text-gray-800 mb-2">
                Session Duration
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="duration"
                  required
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                    focus:ring-2 focus:ring-[#4937e8] focus:border-transparent transition-all duration-300
                    hover:border-[#4937e8] pl-12"
                  placeholder="Duration in minutes"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ⏱️
                </span>
              </div>
            </div>
  
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <label htmlFor="sessionType" className="block text-base font-semibold text-gray-800 mb-2">
                Session Type
              </label>
              <div className="relative">
                <select
                  id="sessionType"
                  value={formData.sessionType}
                  onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                    focus:ring-2 focus:ring-[#4937e8] focus:border-transparent transition-all duration-300
                    hover:border-[#4937e8] pl-12 appearance-none cursor-pointer"
                >
                  <option value="recurring">Recurring sessions</option>
                  <option value="one-time">One-time session</option>
                  <option value="workshop">Workshop</option>
                </select>
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔄
                </span>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <label className="block text-base font-semibold text-gray-800 mb-4">
              Session Pricing
            </label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={!formData.isPaid}
                    onChange={() => setFormData({ ...formData, isPaid: false, price: '0' })}
                    className="w-4 h-4 text-[#4937e8] border-gray-300 focus:ring-[#4937e8]"
                  />
                  <span className="text-gray-700">Free Session</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.isPaid}
                    onChange={() => setFormData({ ...formData, isPaid: true })}
                    className="w-4 h-4 text-[#4937e8] border-gray-300 focus:ring-[#4937e8]"
                  />
                  <span className="text-gray-700">Paid Session</span>
                </label>
              </div>
          
              {formData.isPaid && (
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                          focus:ring-2 focus:ring-[#4937e8] focus:border-transparent transition-all duration-300
                          hover:border-[#4937e8] pl-12"
                        placeholder="Enter price"
                      />
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                       Rs
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Set a fair price that reflects the value of your expertise
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
  
          {/* Topics Selection */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <label htmlFor="topics" className="block text-base font-semibold text-gray-800 mb-4">
              Session Topics
            </label>
            <div className="space-y-4">
              <select
                id="topics"
                multiple
                required
                value={formData.topics}
                onChange={(e) => setFormData({
                  ...formData,
                  topics: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                  focus:ring-2 focus:ring-[#4937e8] focus:border-transparent transition-all duration-300
                  hover:border-[#4937e8] h-40"
              >
                {TOPICS.map((topic) => (
                  <option key={topic} value={topic} className="py-2">{topic}</option>
                ))}
              </select>
              
              <div className="flex items-center gap-2 cursor-pointer p-2">
                <input
                  type="checkbox"
                  checked={formData.allowMenteeTopics}
                  onChange={(e) => setFormData({ ...formData, allowMenteeTopics: e.target.checked })}
                  className="w-5 h-5 text-[#4937e8] border-gray-300 rounded focus:ring-[#4937e8]"
                />
                <span className="text-sm text-gray-700">Allow mentees to suggest additional topics</span>
              </div>
            </div>
          </div>
  
          {/* Settings Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
            <h3 className="text-base font-semibold text-gray-800 mb-4">Additional Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-gray-400">👥</span>
                  <span className="text-sm text-gray-700">Show on public profile</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showOnProfile}
                    onChange={(e) => setFormData({ ...formData, showOnProfile: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer 
                    peer-focus:ring-4 peer-focus:ring-[#4937e8]/20 
                    peer-checked:after:translate-x-full 
                    peer-checked:after:border-white 
                    after:content-[''] 
                    after:absolute 
                    after:top-0.5 
                    after:left-[2px] 
                    after:bg-white 
                    after:border-gray-300 
                    after:border 
                    after:rounded-full 
                    after:h-5 
                    after:w-5 
                    after:transition-all
                    peer-checked:bg-[#4937e8]"
                  ></div>
                </label>
              </div>
            </div>
          </div>
  
          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-medium 
                transition-all duration-300 flex items-center gap-2 hover:transform hover:translate-x-1"
            >
              Next Step
              <ArrowRight size={18} />
            </button>
          </div>
        </form>
      </div>
    );
  }

export function AvailabilityForm({ timeSlots, setTimeSlots, onBack, onNext }: {
  timeSlots: TimeSlot[];
  setTimeSlots: (slots: TimeSlot[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
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
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
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
                ? 'border-[#4937e8]/20 bg-[#4937e8]/5' 
                : 'border-gray-200 bg-gray-50'
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
                    peer-focus:ring-4 peer-focus:ring-[#4937e8]/20
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
                    peer-checked:bg-[#4937e8]"
                  ></div>
                </label>
                <div>
                  <h3 className="font-semibold text-gray-900">{slot.day}</h3>
                  {slot.available && (
                    <p className="text-sm text-[#4937e8]">
                      {slot.timeRanges.length} {slot.timeRanges.length === 1 ? 'time slot' : 'time slots'}
                    </p>
                  )}
                </div>
              </div>
              {slot.available && (
                <button
                  type="button"
                  onClick={() => addTimeRange(dayIndex)}
                  className="p-2 rounded-full hover:bg-[#4937e8]/10 text-[#4937e8] transition-colors duration-200"
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
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                  >
                    <div className="flex-1 flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">Start Time</p>
                        <input
                          type="time"
                          value={range.start}
                          onChange={(e) => updateTimeRange(dayIndex, rangeIndex, 'start', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                            focus:ring-2 focus:ring-[#4937e8] focus:border-transparent transition-all duration-200"
                        />
                      </div>
                      <span className="text-gray-400">to</span>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">End Time</p>
                        <input
                          type="time"
                          value={range.end}
                          onChange={(e) => updateTimeRange(dayIndex, rangeIndex, 'end', e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg 
                            focus:ring-2 focus:ring-[#4937e8] focus:border-transparent transition-all duration-200"
                        />
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
            px-8 py-3 rounded-lg font-medium transition-all duration-200"
        >
          Next Step
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

export function ReviewForm({ formData, timeSlots, onBack, onSubmit, finalText }: {
    formData: FormData;
    timeSlots: TimeSlot[];
    onBack: () => void;
    onSubmit: () => void;
    finalText: string;
  }) {
    return (
      <div className="bg-white p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
            Review Your Session
          </h2>
          <p className="text-gray-600 mt-2">
            Please review your session details before creating
          </p>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Details Card */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#4937e8]/10 rounded-lg">
                <svg
                  className="w-5 h-5 text-[#4937e8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Session Details</h3>
            </div>
  
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Session Name</p>
                <p className="text-base text-gray-900 mt-1">{formData.sessionName}</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Description</p>
                <p className="text-base text-gray-900 mt-1">{formData.description}</p>
              </div>
  
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Duration</p>
                  <p className="text-base text-gray-900 mt-1">{formData.duration} minutes</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100">
                  <p className="text-sm font-medium text-gray-500">Session Type</p>
                  <p className="text-base text-gray-900 mt-1">{formData.sessionType}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Pricing</p>
                <p className="text-base text-gray-900 mt-1">
                    {formData.isPaid ? `$${formData.price}` : 'Free'}
                </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-100">
                <p className="text-sm font-medium text-gray-500">Topics</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-[#4937e8]/10 text-[#4937e8] rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
  
          {/* Availability Card */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#4937e8]/10 rounded-lg">
                <svg
                  className="w-5 h-5 text-[#4937e8]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Availability</h3>
            </div>
  
            <div className="space-y-4">
              {timeSlots.filter(slot => slot.available).map((slot) => (
                <div key={slot.day} className="bg-white p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{slot.day}</h4>
                    <span className="px-2 py-1 bg-[#4937e8]/10 text-[#4937e8] rounded-full text-sm">
                      {slot.timeRanges.length} {slot.timeRanges.length === 1 ? 'slot' : 'slots'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {slot.timeRanges.map((range, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-gray-600 text-sm"
                      >
                        <svg
                          className="w-4 h-4 text-[#4937e8]"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {range.start} - {range.end}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-6 py-2 rounded-lg font-medium transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="flex items-center gap-2 bg-[#4937e8] hover:bg-[#4338ca] text-white px-8 py-3 rounded-lg font-medium transition-all duration-300"
          >
            {finalText} Session
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

function CreateSession() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    sessionName: '1:1 Mentorship with Felix',
    description: '',
    duration: '30',
    sessionType: 'recurring',
    numberOfSessions: '1',
    occurrence: OCCURRENCE_OPTIONS[0],
    topics: [],
    allowMenteeTopics: false,
    showOnProfile: true,
    isPaid: false,
    price: '0'
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    DAYS.map(day => ({
      day,
      available: false,
      timeRanges: []
    }))
  );

  const handleSubmit = async () => {
    try {
      const userData = getUserData();
      if (!userData) {
        toast.error('Please login to create a session');
        navigate('/login');
        return;
      }

      const sessionData = {
        ...formData,
        userId: userData.userId,
        timeSlots: timeSlots
      };

      const response = await fetch('http://localhost:9000/api/sessions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const result = await response.json();
      if (result.status === 'success') {
        toast.success('Session created successfully!');
        navigate('/mentor-dashboard/');
      } else {
        throw new Error('Failed to create session');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create session. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-[#4937e8] mb-6 transition-colors duration-300"
        >
          <ArrowLeft size={20} />
          Back to Calendar
        </button>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent mb-4">
            Create New Session
          </h1>
          <p className="text-gray-600">Set up your mentoring session details and availability</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                ${step === stepNum ? 'bg-[#4937e8] text-white' : 
                  step > stepNum ? 'bg-[#4338ca] text-white' : 'bg-gray-200 text-gray-600'}`}>
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-20 h-1 ${step > stepNum ? 'bg-[#4338ca]' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {step === 1 && (
            <SessionForm
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
              finalText='Create'
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateSession;