import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Linkedin, ArrowRight } from 'lucide-react';
import { getUserData } from '../utils/auth';
import { MentorProfile } from '../types/mentor';
import toast from 'react-hot-toast';
import CustomSelect from './CustomSelect';
import { setUserData } from '../utils/auth';
import { API_URL } from '../utils/api';

const DISCIPLINES = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "UI/UX Design",
  "Graphic Design",
  "Product Design",
  "Product Management",
  "Data Science",
  "Machine Learning",
  "DevOps",
  "Cloud Architecture",
  "Mobile Development",
  "Blockchain Development",
  "Game Development",
  "Digital Marketing",
  "Business Analytics"
];

const TOOLS = [
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Python",
  "Java",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Figma",
  "Adobe XD",
  "Sketch",
  "Git",
  "MongoDB",
  "PostgreSQL",
  "Firebase",
  "TensorFlow",
  "PyTorch",
  "Postman"
];

const SKILLS = [
  "Leadership",
  "Project Management",
  "Agile Methodologies",
  "Problem Solving",
  "Communication",
  "Team Building",
  "Strategic Planning",
  "System Design",
  "Code Review",
  "Mentoring",
  "Public Speaking",
  "Technical Writing",
  "Database Design",
  "API Design",
  "UI/UX",
  "Brand Strategy",
  "Data Analysis",
  "Machine Learning",
  "DevOps",
  "Security"
];

const MENTORING_TOPICS = [
  "Career Development",
  "Technical Skills",
  "Leadership",
  "Work-Life Balance",
  "Networking",
  "Interview Preparation",
  "Resume Review",
  "Portfolio Review",
  "Public Speaking",
  "Personal Branding"
];

const AI_TOOLS = [
  "ChatGPT",
  "DALL-E",
  "MidJourney",
  "Stable Diffusion",
  "Copilot",
  "Bard",
  "Claude",
  "Hugging Face",
  "OpenAI API",
  "Google Cloud AI",
  "AWS AI Services",
  "Azure AI",
  "IBM Watson",
  "DataRobot",
  "H2O.ai",
  "RapidMiner",
  "KNIME",
  "Alteryx",
  "BigML",
  "C3.ai"
];

const MentorProfileForm = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<MentorProfile>({
    user_id: userData?.token || '',
    profilePhoto: '',
    experience: {
      years: 0,
      months: 0,
    },
    linkedinUrl: '',
    primaryExpertise: '',
    disciplines: [],
    tools: [],
    skills: [],
    bio: '',
    targetMentees: [],
    mentoringTopics: [],
    relationshipType: '',
    aiTools: [], // Add this line
  });



  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File must be less than 2MB');
        return;
      }
      
      // Handle file upload here
      const formData = new FormData();
      formData.append('file', file);
      setFormData(prev => ({
        ...prev,
        profilePhoto: URL.createObjectURL(file), // Save the file URL for preview
      }));
    }
  };


  // Update the validateStep1 function
  const validateStep1 = () => {
    const errors: string[] = [];
    
    // LinkedIn URL validation - Make it less strict
    if (!formData.linkedinUrl) {
      errors.push('LinkedIn URL is required');
    }

    if (!formData.primaryExpertise.trim() || formData.primaryExpertise.length < 2) {
      errors.push('Please enter a meaningful primary expertise');
    }
  
    // Bio validation - Update minimum length
    if (!formData.bio.trim()) {
      errors.push('Bio is required');
    } else if (formData.bio.trim().length < 10) { // Reduced from 100 for testing
      errors.push(`Bio should be at least 10 characters (currently: ${formData.bio.trim().length} characters)`);
    }
  
    // Keep these validations as they seem to pass
    if (formData.disciplines.length === 0) {
      errors.push('Please select at least one discipline');
    }
  
    if (formData.tools.length === 0) {
      errors.push('Please select at least one tool');
    }
  
    if (formData.skills.length === 0) {
      errors.push('Please select at least one skill');
    }
  
    // Make experience validation more flexible
    if (formData.experience.years === 0 && formData.experience.months === 0) {
      errors.push('Please specify your experience (years or months)');
    }
  
    // Show all errors at once
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error, { 
        duration: 4000,
        position: 'top-center'
      }));
      return false;
    }
  
    // Add debug logging
    console.log('Validation passed with form data:', formData);
    return true;
  };
  
  // Update the handleNext function to include better debugging
  const handleNext = () => {
    console.log('Current form data:', formData);
    const isValid = validateStep1();
    console.log('Validation result:', isValid);
  
    if (isValid) {
      try {
        localStorage.setItem('mentorFormData', JSON.stringify(formData));
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        toast.success('Profile information saved! Please complete your mentoring preferences.');
      } catch (error) {
        console.error('Error saving form data:', error);
        toast.error('Error saving your progress. Please try again.');
      }
    }
  };

  useEffect(() => {
    const savedData = localStorage.getItem('mentorFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error restoring form data:', error);
      }
    }
  }, []);

  const handleBack = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  // Add this validation function
  const validateStep2 = () => {
    const errors: string[] = [];
  
    if (!formData.relationshipType) {
      errors.push('Please select your target mentee preference');
    }
  
    if (formData.mentoringTopics.length === 0) {
      errors.push('Please add at least one mentoring topic');
    }
  
    if (!formData.aiTools || formData.aiTools.length === 0) {
      errors.push('Please select at least one AI tool');
    }
  
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return false;
    }
  
    return true;
  };

  // Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateStep2()) {
      return;
    }
  
    // Add this debug log
    console.log('Submitting form data:', formData);
  
    try {
      // Ensure targetMentees is populated based on relationshipType
      const updatedFormData = {
        ...formData,
        targetMentees: [formData.relationshipType], // Convert relationshipType to array
      };
  
      const response = await fetch(`${API_URL}/users/mentors/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
        credentials: 'include',
      });
  
      // Add this debug log
      const data = await response.json();
      console.log('Response:', response.status, data);
  
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create profile');
      }

      const currentUserData = getUserData();
      if (currentUserData) {
        setUserData({
          ...currentUserData,
          role: 'mentor'
        });
      }
  
      toast.success('Mentor profile created successfully!');
      localStorage.removeItem('mentorFormData');
      navigate('/mentor-dashboard');
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
          Submit your mentorship application
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Review your profile and tell us how you would like to mentor the community
        </p>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {step === 1 ? (
            // Step 1: Basic Information
            <div className="space-y-6">
              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center space-y-4">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                  {formData.profilePhoto ? (
                    <img
                      src={formData.profilePhoto}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <Upload className="text-gray-400" size={32} />
                  )}
                </div>
                <input
                  type="file"
                  id="profile-photo"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="profile-photo"
                  className="cursor-pointer text-[#4937e8] hover:text-[#4338ca]"
                >
                  Upload profile photo
                </label>
                <p className="text-xs text-gray-500">Make sure the file is below 2MB</p>
              </div>

              {/* Experience */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.experience.years}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      experience: { ...prev.experience, years: parseInt(e.target.value) }
                    }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4937e8]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Months
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={formData.experience.months}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      experience: { ...prev.experience, months: parseInt(e.target.value) }
                    }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4937e8]"
                  />
                </div>
              </div>

              {/* LinkedIn URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn URL *
                </label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    className="pl-10 w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4937e8]"
                    placeholder="linkedin.com/in/username"
                    required
                  />
                </div>
              </div>

              {/* Primary Expertise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select primary expertise *
                </label>
                <input
                  type="text"
                  value={formData.primaryExpertise}
                  onChange={(e) => setFormData({ ...formData, primaryExpertise: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4937e8]"
                  placeholder="Eg: Design, Product"
                  required
                />
              </div>

              {/* Disciplines */}
              <CustomSelect
                label="Which disciplines are relevant in your expertise(s)? *"
                options={DISCIPLINES}
                selectedValues={formData.disciplines}
                onChange={(values) => setFormData({ ...formData, disciplines: values })}
                placeholder="Select disciplines"
              />

              {/* Tools */}
              <CustomSelect
                label="Which tools do you have experience in? *"
                options={TOOLS}
                selectedValues={formData.tools}
                onChange={(values) => setFormData({ ...formData, tools: values })}
                placeholder="Select tools"
              />

              {/* Skills */}
              <CustomSelect
                label="Which skills do you have experience in? *"
                options={SKILLS}
                selectedValues={formData.skills}
                onChange={(values) => setFormData({ ...formData, skills: values })}
                placeholder="Select skills"
              />

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4937e8]"
                  rows={4}
                  placeholder="Introduce yourself and give a reason for your request (minimum 100 characters)"
                  required
                  minLength={100}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.bio.length}/100 characters minimum
                </p>
              </div>

              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-[#4937e8] to-[#4338ca] text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
              >
                Next Step
                <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            // Step 2: Mentoring Preferences
            <div className="space-y-6">
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Back
                </button>
                <h3 className="text-xl font-semibold">Mentoring Preferences</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Target Mentees */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Who are your target mentees? *
                  </label>
                  <select
                    value={formData.relationshipType}
                    onChange={(e) => setFormData({ ...formData, relationshipType: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4937e8]"
                    required
                  >
                    <option value="">Select preference</option>
                    <option value="junior">Junior</option>
                    <option value="mid-level">Mid-level</option>
                    <option value="senior">Senior</option>
                    <option value="no-preference">No preference</option>
                  </select>
                </div>

                {/* Mentoring Topics */}
                <CustomSelect
                  label="Which topics are you open to mentoring? *"
                  options={MENTORING_TOPICS}
                  selectedValues={formData.mentoringTopics}
                  onChange={(values) => setFormData({ ...formData, mentoringTopics: values })}
                  placeholder="Select mentoring topics"
                />

                {/* AI Tools */}
                <CustomSelect
                  label="Which AI tools do you use in your workflow? *"
                  options={AI_TOOLS}
                  selectedValues={formData.aiTools || []}
                  onChange={(values) => setFormData({ ...formData, aiTools: values })}
                  placeholder="Select AI tools"
                />

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#4937e8] to-[#4338ca] text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-all duration-200"
                >
                  Complete Profile
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorProfileForm;