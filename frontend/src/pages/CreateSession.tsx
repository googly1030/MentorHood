import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ArrowRight, CheckCircle, Calendar, Clock, DollarSign, Settings, Users, MessageSquare } from 'lucide-react';
import { getUserData } from '../utils/auth';
import { toast } from 'sonner';
import { API_URL } from '../utils/api';

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
        <h2 className="text-2xl font-bold text-black">
          Session Details
        </h2>
        <p className="text-gray-600 mt-2">
          Set up the basic information for your mentoring session
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-8">
        {/* Session Name with Icon */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
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
                focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
                hover:border-gray-400 pl-12"
              placeholder="Enter a clear name for your session"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              📝
            </span>
          </div>
        </div>

        {/* Description with Modern Textarea */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <label htmlFor="description" className="block text-base font-semibold text-gray-800 mb-2">
            Session Description
          </label>
          <textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
              focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
              hover:border-gray-400 h-32 resize-none"
            placeholder="Describe what mentees can expect from this session..."
          />
        </div>

        {/* Duration and Session Type Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
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
                  focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
                  hover:border-gray-400 pl-12"
                placeholder="Duration in minutes"
              />
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
            <label htmlFor="sessionType" className="block text-base font-semibold text-gray-800 mb-2">
              Session Type
            </label>
            <div className="relative">
              <select
                id="sessionType"
                value={formData.sessionType}
                onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl
                  focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
                  hover:border-gray-400 pl-12 appearance-none cursor-pointer"
              >
                <option value="one-on-one">One-on-One Session</option>
                <option value="group-session">Group Session</option>
              </select>
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-gray-800" />
            <label className="block text-base font-semibold text-gray-800">
              Session Pricing
            </label>
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-xl">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={!formData.isPaid}
                  onChange={() => setFormData({ ...formData, isPaid: false, price: '0' })}
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black"
                />
                <span className="text-gray-700">Free Session</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={formData.isPaid}
                  onChange={() => setFormData({ ...formData, isPaid: true })}
                  className="w-4 h-4 text-black border-gray-300 focus:ring-black"
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
                        focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
                        hover:border-gray-400 pl-12"
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
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-gray-800" />
            <label htmlFor="topics" className="block text-base font-semibold text-gray-800">
              Session Topics
            </label>
          </div>
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <select
                id="topics"
                multiple
                required
                value={formData.topics}
                onChange={(e) => setFormData({
                  ...formData,
                  topics: Array.from(e.target.selectedOptions, option => option.value)
                })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl
                  focus:ring-2 focus:ring-black/25 focus:border-transparent transition-all duration-300
                  hover:border-gray-400 h-40"
              >
                {TOPICS.map((topic) => (
                  <option key={topic} value={topic} className="py-2">{topic}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.topics.map((topic, index) => (
                <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  {topic}
                </span>
              ))}
            </div>
            
            <div className="flex items-center gap-2 cursor-pointer p-2 bg-gray-50 rounded-xl">
              <input
                type="checkbox"
                checked={formData.allowMenteeTopics}
                onChange={(e) => setFormData({ ...formData, allowMenteeTopics: e.target.checked })}
                className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-sm text-gray-700">Allow mentees to suggest additional topics</span>
            </div>
          </div>
        </div>

        {/* Settings Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-5 h-5 text-gray-800" />
            <h3 className="text-base font-semibold text-gray-800">Additional Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-gray-500" />
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
                  peer-focus:ring-4 peer-focus:ring-black/20 
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
                  peer-checked:bg-black"
                ></div>
              </label>
            </div>
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
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Session Name</p>
              <p className="text-base text-gray-900 mt-1">{formData.sessionName}</p>
            </div>
            
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-base text-gray-900 mt-1">{formData.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="text-base text-gray-900 mt-1">{formData.duration} minutes</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Session Type</p>
                <p className="text-base text-gray-900 mt-1">{formData.sessionType}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm font-medium text-gray-500">Pricing</p>
                <p className="text-base text-gray-900 mt-1">
                  {formData.isPaid ? `Rs ${formData.price}` : 'Free'}
                </p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Topics</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
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
          onClick={onSubmit}
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
        >
          {finalText} Session
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

function CreateSession() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    sessionName: '',
    description: '',
    duration: '30',
    sessionType: 'one-on-one',
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

      const response = await fetch(`${API_URL}/sessions/create`, {
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
            Create New Session
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Set up your mentoring session details and availability</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-10 px-4">
          <div className="w-full max-w-3xl flex items-center">
            {[
              { num: 1, label: "Session Details" },
              { num: 2, label: "Availability" },
              { num: 3, label: "Review" }
            ].map((stepItem, i) => (
              <div key={stepItem.num} className="flex-1 flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2
                  ${step === stepItem.num ? 'bg-black text-white' : 
                    step > stepItem.num ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {stepItem.num}
                </div>
                <span className="text-xs text-gray-500 hidden sm:block">{stepItem.label}</span>
                {i < 2 && (
                  <div className={`h-1 w-full ${step > stepItem.num ? 'bg-gray-800' : 'bg-gray-200'} absolute top-5 left-1/2`} 
                       style={{ width: "calc(100% - 2.5rem)", marginLeft: "1.25rem", zIndex: -1 }}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
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