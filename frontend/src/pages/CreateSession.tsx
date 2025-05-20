import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Minus, ArrowRight,User, CheckCircle, Calendar, Clock, DollarSign, Settings, Users, MessageSquare, Sparkles, Tag, Globe } from 'lucide-react';
import { getUserData } from '../utils/auth';
import { toast } from 'sonner';
import { API_URL } from '../utils/api';

interface FormData {
  sessionName: string;
  description: string;
  duration: string;
  sessionType: string;
  numberOfSessions: string;
  topics: string[];
  allowMenteeTopics: boolean;
  showOnProfile: boolean;
  isPaid: boolean;
  price: string;
  tokens : number;
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

const DAYS = [
  'SUNDAYS', 'MONDAYS', 'TUESDAYS', 'WEDNESDAYS',
  'THURSDAYS', 'FRIDAYS', 'SATURDAYS'
];

const TOKEN_CONVERSION_RATE = 10; 

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const calculateTokens = (price: string): number => {
  const numericPrice = parseFloat(price) || 0;
  return Math.round(numericPrice * TOKEN_CONVERSION_RATE);
};

export function SessionForm({ formData, setFormData, onNext }: {
  formData: FormData;
  setFormData: (data: FormData) => void;
  onNext: () => void;
}) {
  const [customTopic, setCustomTopic] = useState('');

  return (
    <div className="p-8 lg:p-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-3">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium text-indigo-700">Step 1 of 3</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Create Your Session
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Define your mentoring session details to help mentees understand what to expect
        </p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onNext(); }} className="space-y-8 max-w-4xl mx-auto">
        {/* Session Name with Modern Styling */}
        <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-start mb-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
              <Tag className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="ml-4">
              <label htmlFor="sessionName" className="block text-base font-medium text-gray-800">
                Session Name
              </label>
              <p className="text-sm text-gray-500">Choose a descriptive name that conveys the value of your session</p>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              id="sessionName"
              required
              value={formData.sessionName}
              onChange={(e) => setFormData({ ...formData, sessionName: e.target.value })}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                hover:border-gray-300 pl-12 text-gray-800 placeholder-gray-400 group-hover:shadow-sm group-hover:bg-white"
              placeholder="e.g., 'Career Transition Strategy Session'"
            />
          </div>
        </div>

        {/* Description with Refined Styling */}
        <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-start mb-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="ml-4">
              <label htmlFor="description" className="block text-base font-medium text-gray-800">
                Session Description
              </label>
              <p className="text-sm text-gray-500">Describe what mentees will gain from this session</p>
            </div>
          </div>
          <textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl
              focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
              hover:border-gray-300 h-36 resize-none group-hover:shadow-sm group-hover:bg-white"
            placeholder="Explain what you'll cover, who this session is ideal for, and what outcomes mentees can expect..."
          />
          <div className="mt-2 text-right">
            <span className="text-xs text-gray-500">{formData.description.length} characters</span>
          </div>
        </div>

        {/* Duration and Session Type with Card Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="flex items-start mb-5">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="ml-4">
                <label htmlFor="duration" className="block text-base font-medium text-gray-800">
                  Session Duration
                </label>
                <p className="text-sm text-gray-500">How long will each session last?</p>
              </div>
            </div>
            <div className="relative">
              <input
                type="number"
                id="duration"
                required
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl
                  focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                  hover:border-gray-300 pl-16 group-hover:shadow-sm group-hover:bg-white"
                placeholder="Minutes"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 font-medium flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span className="text-gray-500">|</span>
              </div>
            </div>
            <div className="mt-3 flex gap-2 justify-start">
              {[30, 45, 60].map(mins => (
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
                <label htmlFor="sessionType" className="block text-base font-medium text-gray-800">
                  Session Type
                </label>
                <p className="text-sm text-gray-500">Choose your preferred session format</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label 
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl cursor-pointer transition-all
                  ${formData.sessionType === 'one-on-one' 
                    ? 'bg-indigo-50 border-2 border-indigo-200 ring-2 ring-indigo-100'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                onClick={() => setFormData({ ...formData, sessionType: 'one-on-one' })}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  formData.sessionType === 'one-on-one' ? 'bg-indigo-100' : 'bg-gray-100'
                }`}>
                  <User className={`w-5 h-5 ${formData.sessionType === 'one-on-one' ? 'text-indigo-600' : 'text-gray-500'}`} />
                </div>
                <div className="text-center">
                  <span className={`text-sm font-medium ${formData.sessionType === 'one-on-one' ? 'text-indigo-700' : 'text-gray-700'}`}>
                    One-on-One
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Individual mentoring</p>
                </div>
                <input 
                  type="radio" 
                  name="sessionType" 
                  className="sr-only"
                  checked={formData.sessionType === 'one-on-one'}
                  onChange={() => {}}
                />
              </label>
              
              <label 
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl cursor-pointer transition-all
                  ${formData.sessionType === 'group-session' 
                    ? 'bg-indigo-50 border-2 border-indigo-200 ring-2 ring-indigo-100'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                onClick={() => setFormData({ ...formData, sessionType: 'group-session' })}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  formData.sessionType === 'group-session' ? 'bg-indigo-100' : 'bg-gray-100'
                }`}>
                  <Users className={`w-5 h-5 ${formData.sessionType === 'group-session' ? 'text-indigo-600' : 'text-gray-500'}`} />
                </div>
                <div className="text-center">
                  <span className={`text-sm font-medium ${formData.sessionType === 'group-session' ? 'text-indigo-700' : 'text-gray-700'}`}>
                    Group Session
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Multiple attendees</p>
                </div>
                <input 
                  type="radio" 
                  name="sessionType" 
                  className="sr-only"
                  checked={formData.sessionType === 'group-session'}
                  onChange={() => {}}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Pricing Section with Enhanced UI */}
        <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-start mb-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium text-gray-800">Session Pricing</h3>
              <p className="text-sm text-gray-500">Decide if your session will be free or paid</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <label 
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl cursor-pointer transition-all
                  ${!formData.isPaid 
                    ? 'bg-green-50 border-2 border-green-200 ring-2 ring-green-100'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                onClick={() => setFormData({ ...formData, isPaid: false, price: '0', tokens: 0 })}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  !formData.isPaid ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Globe className={`w-5 h-5 ${!formData.isPaid ? 'text-green-600' : 'text-gray-500'}`} />
                </div>
                <div className="text-center">
                  <span className={`text-sm font-medium ${!formData.isPaid ? 'text-green-700' : 'text-gray-700'}`}>
                    Free Session
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Available to all mentees</p>
                </div>
                <input 
                  type="radio" 
                  name="isPaid" 
                  className="sr-only"
                  checked={!formData.isPaid}
                  onChange={() => {}}
                />
              </label>
              
              <label 
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-xl cursor-pointer transition-all
                  ${formData.isPaid 
                    ? 'bg-indigo-50 border-2 border-indigo-200 ring-2 ring-indigo-100'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                onClick={() => {
                  const defaultPrice = formData.price || '50';
                  setFormData({ 
                    ...formData, 
                    isPaid: true, 
                    price: defaultPrice,
                    tokens: calculateTokens(defaultPrice)
                  });
                }}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  formData.isPaid ? 'bg-indigo-100' : 'bg-gray-100'
                }`}>
                  <DollarSign className={`w-5 h-5 ${formData.isPaid ? 'text-indigo-600' : 'text-gray-500'}`} />
                </div>
                <div className="text-center">
                  <span className={`text-sm font-medium ${formData.isPaid ? 'text-indigo-700' : 'text-gray-700'}`}>
                    Paid Session
                  </span>
                  <p className="text-xs text-gray-500 mt-1">Charge for your expertise</p>
                </div>
                <input 
                  type="radio" 
                  name="isPaid" 
                  className="sr-only"
                  checked={formData.isPaid}
                  onChange={() => {}}
                />
              </label>
            </div>
        
            {formData.isPaid && (
              <div className="mt-4 bg-indigo-50/50 rounded-xl p-5 border border-indigo-100">
                <div className="mb-2">
                  <label htmlFor="price" className="block text-sm font-medium text-indigo-700 mb-1">
                    Set Your Price
                  </label>
                  <p className="text-xs text-indigo-600/80 mb-3">
                    Choose a price that reflects the value of your expertise
                  </p>
                </div>
                <div className="relative">
                  <input
                    id="price"
                    type="number"
                    min="1"
                    value={formData.price}
                    onChange={(e) => {
                      const newPrice = e.target.value;
                      setFormData({ 
                        ...formData, 
                        price: newPrice,
                        tokens: calculateTokens(newPrice)
                      });
                    }}
                    className="w-full px-4 py-3.5 bg-white border border-indigo-200 rounded-xl
                      focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                      hover:border-indigo-300 pl-16"
                    placeholder="Enter session price"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600 font-medium flex items-center gap-2">
                    <span className="text-indigo-700">Rs</span>
                    <span className="text-gray-300">|</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-indigo-600">
                  <div className="flex items-center gap-1.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-indigo-500">
                      <path d="M12 2L14.4 9.6H22L15.8 14.4L18.2 22L12 17.2L5.8 22L8.2 14.4L2 9.6H9.6L12 2Z" fill="currentColor"/>
                    </svg>
                    <span>
                      Equivalent to <span className="font-semibold">{calculateTokens(formData.price)} tokens</span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {[25, 50, 100, 200].map(price => (
                    <button
                      key={price}
                      type="button"
                      onClick={() => setFormData({ 
                        ...formData, 
                        price: price.toString(),
                        tokens: calculateTokens(price.toString())
                      })}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        formData.price === price.toString() 
                          ? 'bg-indigo-200 text-indigo-700 border border-indigo-300' 
                          : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-100'
                      }`}
                    >
                      Rs {price} ({price * TOKEN_CONVERSION_RATE} tokens)
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Topics Selection with Enhanced UI */}
        <div className="space-y-5">
  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
    <label htmlFor="topics" className="block text-sm font-medium text-gray-700 mb-3">
      Session Topics
    </label>
    
    {/* Custom topic selector */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
      {TOPICS.map((topic) => (
        <div
          key={topic}
          onClick={() => {
            if (formData.topics.includes(topic)) {
              setFormData({
                ...formData,
                topics: formData.topics.filter(t => t !== topic)
              });
            } else {
              setFormData({
                ...formData,
                topics: [...formData.topics, topic]
              });
            }
          }}
          className={`
            px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
            flex items-center gap-2.5
            ${formData.topics.includes(topic)
              ? 'bg-indigo-50 border-2 border-indigo-200 text-indigo-700 shadow-sm'
              : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'}
          `}
        >
          <div className={`
            w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border
            ${formData.topics.includes(topic)
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'bg-white border-gray-300'}
          `}>
            {formData.topics.includes(topic) && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="text-sm font-medium truncate">{topic}</span>
        </div>
      ))}
    </div>
    
    {/* Custom topic input */}
    <div className="mt-4 flex gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={customTopic}
          onChange={(e) => setCustomTopic(e.target.value)}
          placeholder="Add a custom topic..."
          className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl
            focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 
            transition-all duration-300 hover:border-gray-300"
        />
      </div>
      <button
        type="button"
        onClick={() => {
          if (customTopic.trim()) {
            if (!formData.topics.includes(customTopic.trim())) {
              setFormData({
                ...formData,
                topics: [...formData.topics, customTopic.trim()]
              });
            }
            setCustomTopic('');
          }
        }}
        disabled={!customTopic.trim()}
        className={`px-4 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center gap-2
          ${customTopic.trim() 
            ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
      >
        <Plus size={18} />
        <span>Add Topic</span>
      </button>
    </div>

    {/* Optional: Add a note about custom topics */}
    <p className="mt-2 text-xs text-gray-500">
      Don't see your topic? Add it manually above.
    </p>
    
    {/* Selected Topics Section with improved styling */}
    {formData.topics.length > 0 && (
      <div className="mt-5 border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <span>Selected Topics</span>
            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">{formData.topics.length}</span>
          </h4>
          {formData.topics.length > 0 && (
            <button
              type="button"
              onClick={() => setFormData({...formData, topics: []})}
              className="text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {formData.topics.map((topic, index) => (
            <div 
              key={index} 
              className="flex items-center gap-2 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl group hover:bg-indigo-100 transition-all duration-200"
            >
              <div className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border border-indigo-300 bg-white">
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => {
                    setFormData({
                      ...formData,
                      topics: formData.topics.filter((_, i) => i !== index)
                    });
                  }}
                  className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                />
              </div>
              <span className="text-sm font-medium text-indigo-700 truncate flex-1">
                {topic}
              </span>
              <button 
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFormData({
                    ...formData,
                    topics: formData.topics.filter((_, i) => i !== index)
                  });
                }}
                className="w-5 h-5 rounded-full flex items-center justify-center text-indigo-400 hover:text-indigo-600 hover:bg-indigo-200/70 transition-colors opacity-0 group-hover:opacity-100"
              >
                <span className="text-sm leading-none">×</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    )}
    
    {/* Hidden select element for form validation */}
    <select
      id="topics"
      multiple
      required
      value={formData.topics}
      onChange={(e) => setFormData({
        ...formData,
        topics: Array.from(e.target.selectedOptions, option => option.value)
      })}
      className="sr-only" // Hidden but still part of the form
    >
      {TOPICS.map((topic) => (
        <option key={topic} value={topic}>{topic}</option>
      ))}
    </select>
  </div>
  
  <div className="flex items-center gap-3 cursor-pointer p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
    <div className="flex items-center h-5">
      <input
        id="allowMenteeTopics"
        type="checkbox"
        checked={formData.allowMenteeTopics}
        onChange={(e) => setFormData({ ...formData, allowMenteeTopics: e.target.checked })}
        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
      />
    </div>
    <div className="ml-2">
      <label htmlFor="allowMenteeTopics" className="text-sm font-medium text-gray-700">
        Allow mentees to suggest additional topics
      </label>
      <p className="text-xs text-gray-500 mt-0.5">
        Mentees can add their own topics when booking your session
      </p>
    </div>
  </div>
</div>

        {/* Settings Card with Enhanced UI */}
        <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex items-start mb-5">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-base font-medium text-gray-800">Additional Settings</h3>
              <p className="text-sm text-gray-500">Configure advanced options for your session</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-800">Show on public profile</span>
                  <p className="text-xs text-gray-500 mt-0.5">Make this session visible on your public profile</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.showOnProfile}
                  onChange={(e) => setFormData({ ...formData, showOnProfile: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer 
                  peer-focus:ring-4 peer-focus:ring-indigo-300/20 
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
                  peer-checked:bg-indigo-600"
                ></div>
              </label>
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
    <div className="bg-white p-8 lg:p-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-3">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium text-indigo-700">Step 2 of 3</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Set Your Availability
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Define when you're available for mentoring sessions in your local timezone
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="bg-indigo-50 rounded-xl p-5 mb-8 border border-indigo-100/80 flex items-start gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center">
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-medium text-indigo-700">Setup your weekly schedule</h3>
            <p className="text-sm text-indigo-600/80 mt-1">
              Enable the days you're available and add time slots when mentees can book sessions with you.
              You can add multiple time ranges for each day.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {timeSlots.map((slot, dayIndex) => (
            <div 
              key={slot.day}
              className={`rounded-2xl border ${
                slot.available 
                  ? 'border-indigo-200 bg-white shadow-sm' 
                  : 'border-gray-200 bg-gray-50/50'
              } p-6 transition-all duration-300 hover:shadow-md`}
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
                      peer-focus:ring-4 peer-focus:ring-indigo-300/20
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
                      peer-checked:bg-indigo-600"
                    ></div>
                  </label>
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {slot.day}
                      {slot.available && (
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-md text-xs">
                          Available
                        </span>
                      )}
                    </h3>
                    {slot.available && (
                      <p className="text-sm text-gray-600 mt-0.5">
                        {slot.timeRanges.length} {slot.timeRanges.length === 1 ? 'time slot' : 'time slots'}
                      </p>
                    )}
                  </div>
                </div>
                {slot.available && (
                  <button
                    type="button"
                    onClick={() => addTimeRange(dayIndex)}
                    className="p-2.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 shadow-sm hover:shadow flex items-center gap-2"
                  >
                    <Plus size={18} />
                    <span className="text-sm font-medium">Add Slot</span>
                  </button>
                )}
              </div>

              {slot.available && (
                <div className="space-y-4">
                  {slot.timeRanges.map((range, rangeIndex) => (
                    <div 
                      key={rangeIndex}
                      className="flex items-center gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Start Time</p>
                          <div className="relative">
                            <input
                              type="time"
                              value={range.start}
                              onChange={(e) => updateTimeRange(dayIndex, rangeIndex, 'start', e.target.value)}
                              className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg 
                                focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all duration-200 pl-10"
                            />
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">End Time</p>
                          <div className="relative">
                            <input
                              type="time"
                              value={range.end}
                              onChange={(e) => updateTimeRange(dayIndex, rangeIndex, 'end', e.target.value)}
                              className="w-full px-3 py-3 bg-white border border-gray-300 rounded-lg 
                                focus:ring-2 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all duration-200 pl-10"
                            />
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                          </div>
                        </div>
                      </div>
                      {slot.timeRanges.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTimeRange(dayIndex, rangeIndex)}
                          className="p-2.5 rounded-xl hover:bg-red-50 text-red-500 hover:text-red-600 transition-colors duration-200 border border-red-100 hover:border-red-200"
                        >
                          <Minus size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-12 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              scrollToTop();
              onBack();
            }}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-6 py-3 
              rounded-xl font-medium transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back to Details
          </button>
          <button
            type="button"
            onClick={() => {
              scrollToTop();
              onNext();
            }}
            className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-medium 
              transition-all duration-300 flex items-center gap-2 hover:shadow-lg relative overflow-hidden"
          >
            <span className="relative z-10">Continue to Review</span>
            <ArrowRight size={18} className="relative z-10 transform group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-indigo-700 to-indigo-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </button>
        </div>
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
    <div className="bg-white p-8 lg:p-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-3">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium text-indigo-700">Step 3 of 3</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Review Your Session
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Please review all details before creating your session
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Details Card */}
          <div className="bg-white rounded-2xl p-7 border border-indigo-100 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-100 rounded-xl">
                <MessageSquare className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Session Details</h3>
            </div>

            <div className="space-y-5">
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <p className="text-sm font-medium text-indigo-600 mb-1">Session Name</p>
                <p className="text-base text-gray-900">{formData.sessionName || "Untitled Session"}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-1">Description</p>
                <p className="text-base text-gray-800 whitespace-pre-line">{formData.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">Duration</p>
                  <p className="text-base text-gray-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {formData.duration} minutes
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-600 mb-1">Session Type</p>
                  <p className="text-base text-gray-800 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    {formData.sessionType === "one-on-one" ? "One-on-One" : "Group Session"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 col-span-2">
                  <p className="text-sm font-medium text-gray-600 mb-1">Pricing</p>
                  <p className="text-base text-gray-800 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    {formData.isPaid ? (
                      <>
                        Rs {formData.price} <span className="text-indigo-600 text-sm">({formData.tokens} tokens)</span>
                      </>
                    ) : 'Free Session'}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <p className="text-sm font-medium text-gray-600 mb-2">Topics</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-100"
                    >
                      {topic}
                    </span>
                  ))}
                  {formData.topics.length === 0 && (
                    <span className="text-sm text-gray-500">No topics selected</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-800">Show on public profile</span>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  formData.showOnProfile ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {formData.showOnProfile ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Availability Card */}
          <div className="bg-white rounded-2xl p-7 border border-indigo-100 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-indigo-100 rounded-xl">
                <Calendar className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Availability</h3>
            </div>

            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
              {timeSlots.filter(slot => slot.available).map((slot) => (
                <div key={slot.day} className="bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                      {slot.day}
                    </h4>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100">
                      {slot.timeRanges.length} {slot.timeRanges.length === 1 ? 'slot' : 'slots'}
                    </span>
                  </div>
                  <div className="space-y-2 mt-2">
                    {slot.timeRanges.map((range, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-gray-700 text-sm bg-white p-3 rounded-lg border border-gray-200"
                      >
                        <Clock className="w-4 h-4 text-indigo-500" />
                        <span className="font-medium">{range.start}</span>
                        <span className="text-gray-400">to</span>
                        <span className="font-medium">{range.end}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {timeSlots.filter(slot => slot.available).length === 0 && (
                <div className="text-center p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <Calendar className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">No availability set</p>
                  <p className="text-gray-400 text-sm mt-1">You need to set your availability before creating a session</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 border border-indigo-100 rounded-xl bg-indigo-50 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-medium text-indigo-700 text-lg">Almost done!</p>
              <p className="text-indigo-600/80 mt-1">
                Your session will be visible to potential mentees once created. You can edit these details anytime from your dashboard.
              </p>
              
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-indigo-100">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">Session Details Complete</p>
                    <p className="text-gray-500 text-xs mt-0.5">Name, description and configuration</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-indigo-100">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">Availability Configured</p>
                    <p className="text-gray-500 text-xs mt-0.5">Your weekly schedule is set</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              scrollToTop();
              onBack();
            }}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-6 py-3 
              rounded-xl font-medium transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
            Back to Availability
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-medium 
              transition-all duration-300 flex items-center gap-2 hover:shadow-lg relative overflow-hidden"
          >
            <span className="relative z-10">{finalText} Session</span>
            <ArrowRight size={18} className="relative z-10 transform group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-indigo-700 to-indigo-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </button>
        </div>
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
    topics: [],
    allowMenteeTopics: false,
    showOnProfile: true,
    isPaid: false,
    price: '0',
    tokens: 0  
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

      const finalFormData = {
        ...formData,
        tokens: formData.isPaid ? calculateTokens(formData.price) : 0
      };

      const sessionData = {
        ...finalFormData,
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
    <div className="min-h-screen bg-gray-50">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-50/60 rounded-full filter blur-3xl opacity-40 z-0"></div>
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-50/60 rounded-full filter blur-3xl opacity-40 z-0"></div>
      
      <div className="relative z-10 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Create Your Mentoring Session
            </h1>
            <p className="text-gray-600 max-w-3xl">
              Design a personalized mentoring experience by setting up your session details, 
              availability schedule, and review all information before publishing.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center max-w-2xl mx-auto mb-10">
            <div className="w-full flex items-center">
              {[
                { num: 1, label: "Session Details" },
                { num: 2, label: "Availability" },
                { num: 3, label: "Review" }
              ].map((stepItem, i) => (
                <div key={stepItem.num} className="flex-1 relative z-10">
                  <div className="flex flex-col items-center">
                    <button 
                      className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 relative
                        ${step === stepItem.num 
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100' 
                          : step > stepItem.num 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-gray-200 text-gray-500'}
                      `}
                      onClick={() => {
                        if (step > stepItem.num) {
                          scrollToTop();
                          setStep(stepItem.num);
                        }
                      }}
                      disabled={step < stepItem.num}
                    >
                      {step > stepItem.num ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <span className="text-lg font-medium">{stepItem.num}</span>
                      )}
                    </button>
                    
                    <span className={`text-sm ${
                      step >= stepItem.num ? 'text-indigo-700 font-medium' : 'text-gray-500'
                    }`}>{stepItem.label}</span>
                  </div>
                  
                  {i < 2 && (
                    <div className={`absolute top-6 h-0.5 w-full left-1/2 -z-10 ${
                      step > i+1 ? 'bg-indigo-600' : 'bg-gray-200'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {step === 1 && (
              <SessionForm
                formData={formData}
                setFormData={setFormData}
                onNext={() => {
                  scrollToTop();
                  setStep(2);
                }}
              />
            )}

            {step === 2 && (
              <AvailabilityForm
                timeSlots={timeSlots}
                setTimeSlots={setTimeSlots}
                onBack={() => {
                  scrollToTop();
                  setStep(1);
                }}
                onNext={() => {
                  scrollToTop();
                  setStep(3);
                }}
              />
            )}

            {step === 3 && (
              <ReviewForm
                formData={formData}
                timeSlots={timeSlots}
                onBack={() => {
                  scrollToTop();
                  setStep(2);
                }}
                onSubmit={handleSubmit}
                finalText='Create'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateSession;