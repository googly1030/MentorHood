import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus } from 'lucide-react';

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

function SessionForm({ formData, setFormData, onNext }: {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onNext: () => void;
}) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="bg-white rounded-lg p-8 shadow-sm">
      {/* Session Name */}
      <div className="mb-6">
        <label htmlFor="sessionName" className="block text-sm font-medium text-gray-700 mb-2">
          Session name
        </label>
        <input
          type="text"
          id="sessionName"
          value={formData.sessionName}
          onChange={(e) => setFormData({ ...formData, sessionName: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4937e8] focus:border-transparent"
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Event description or agenda
        </label>
        <textarea
          id="description"
          required
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4937e8] focus:border-transparent h-32"
        />
      </div>

      {/* Duration */}
      <div className="mb-6">
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
          Set the duration of session in minutes
        </label>
        <input
          type="number"
          id="duration"
          required
          min="1"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4937e8] focus:border-transparent"
        />
      </div>

      {/* Session Type */}
      <div className="mb-6">
        <label htmlFor="sessionType" className="block text-sm font-medium text-gray-700 mb-2">
          Session type
        </label>
        <select
          id="sessionType"
          value={formData.sessionType}
          onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4937e8] focus:border-transparent"
        >
          <option value="recurring">Recurring sessions</option>
        </select>
      </div>

      {/* Number of Sessions */}
      <div className="mb-6">
        <label htmlFor="numberOfSessions" className="block text-sm font-medium text-gray-700 mb-2">
          Number of sessions
        </label>
        <select
          id="numberOfSessions"
          required
          value={formData.numberOfSessions}
          onChange={(e) => setFormData({ ...formData, numberOfSessions: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4937e8] focus:border-transparent"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
      </div>

      {/* Occurrence */}
      <div className="mb-6">
        <label htmlFor="occurrence" className="block text-sm font-medium text-gray-700 mb-2">
          Occurrence
        </label>
        <select
          id="occurrence"
          required
          value={formData.occurrence}
          onChange={(e) => setFormData({ ...formData, occurrence: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4937e8] focus:border-transparent"
        >
          {OCCURRENCE_OPTIONS.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Topics */}
      <div className="mb-6">
        <label htmlFor="topics" className="block text-sm font-medium text-gray-700 mb-2">
          Select relevant topics for session
        </label>
        <select
          id="topics"
          multiple
          required
          value={formData.topics}
          onChange={(e) => setFormData({
            ...formData,
            topics: Array.from(e.target.selectedOptions, option => option.value)
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4937e8] focus:border-transparent h-32"
        >
          {TOPICS.map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
      </div>

      {/* Allow Mentee Topics */}
      <div className="mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.allowMenteeTopics}
            onChange={(e) => setFormData({ ...formData, allowMenteeTopics: e.target.checked })}
            className="w-4 h-4 text-[#4937e8] border-gray-300 rounded focus:ring-[#4937e8]"
          />
          <span className="text-sm text-gray-700">Allow mentee to choose topics instead</span>
        </label>
      </div>

      {/* Show on Profile */}
      <div className="mb-8">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.showOnProfile}
            onChange={(e) => setFormData({ ...formData, showOnProfile: e.target.checked })}
            className="w-4 h-4 text-[#4937e8] border-gray-300 rounded focus:ring-[#4937e8]"
          />
          <span className="text-sm text-gray-700">Show session on your public profile</span>
        </label>
      </div>

      {/* Next Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#4937e8] hover:bg-[#4338ca] text-white px-6 py-2 rounded-lg font-medium"
        >
          Next
        </button>
      </div>
    </form>
  );
}

function AvailabilityForm({ timeSlots, setTimeSlots, onBack, onNext }: {
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
    <div className="bg-white rounded-lg p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">When are you available?</h2>
      <p className="text-gray-600 mb-6">
        Define your availability for this session. You will receive bookings in your local timezone Asia/Singapore
      </p>

      {timeSlots.map((slot, dayIndex) => (
        <div key={slot.day} className="mb-6 border-b border-gray-200 pb-6 last:border-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={slot.available}
                  onChange={() => toggleDayAvailability(dayIndex)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#4937e8] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#4937e8]"></div>
              </label>
              <span className="font-medium">{slot.day}</span>
            </div>
            {slot.available && (
              <button
                type="button"
                onClick={() => addTimeRange(dayIndex)}
                className="text-[#4937e8] hover:text-[#4338ca]"
              >
                <Plus size={20} />
              </button>
            )}
          </div>

          {slot.available && slot.timeRanges.map((range, rangeIndex) => (
            <div key={rangeIndex} className="flex items-center gap-4 mb-2 last:mb-0">
              <input
                type="time"
                value={range.start}
                onChange={(e) => updateTimeRange(dayIndex, rangeIndex, 'start', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4937e8] focus:border-transparent"
              />
              <span className="text-gray-500">to</span>
              <input
                type="time"
                value={range.end}
                onChange={(e) => updateTimeRange(dayIndex, rangeIndex, 'end', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4937e8] focus:border-transparent"
              />
              {slot.timeRanges.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTimeRange(dayIndex, rangeIndex)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Minus size={20} />
                </button>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 px-6 py-2 rounded-lg font-medium"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="bg-[#4937e8] hover:bg-[#4338ca] text-white px-6 py-2 rounded-lg font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function ReviewForm({ formData, timeSlots, onBack, onSubmit }: {
  formData: FormData;
  timeSlots: TimeSlot[];
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="bg-white rounded-lg p-8 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Session</h2>

      <div className="space-y-6">
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Session Details</h3>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.sessionName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.description}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Duration</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.duration} minutes</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Topics</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.topics.join(', ')}</dd>
            </div>
          </dl>
        </div>

        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Availability</h3>
          <div className="space-y-4">
            {timeSlots.filter(slot => slot.available).map((slot) => (
              <div key={slot.day}>
                <h4 className="text-sm font-medium text-gray-900">{slot.day}</h4>
                <div className="mt-1 space-y-2">
                  {slot.timeRanges.map((range, index) => (
                    <p key={index} className="text-sm text-gray-600">
                      {range.start} - {range.end}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 px-6 py-2 rounded-lg font-medium"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="bg-[#4937e8] hover:bg-[#4338ca] text-white px-6 py-2 rounded-lg font-medium"
        >
          Create Session
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
    showOnProfile: true
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    DAYS.map(day => ({
      day,
      available: false,
      timeRanges: []
    }))
  );

  const handleSubmit = () => {
    console.log('Form submitted:', { formData, timeSlots });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft size={20} />
          Back to Calendar
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Session</h1>

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
          />
        )}
      </div>
    </div>
  );
}

export default CreateSession;