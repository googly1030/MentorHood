import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Linkedin, ArrowRight } from 'lucide-react';
import { getUserData } from '../utils/auth';
import { toast, Toaster } from 'sonner';
import CustomSelect from './CustomSelect';
import { setUserData } from '../utils/auth';
import { API_URL } from '../utils/api';

interface MentorProfile {
  profilePhoto: string;
  totalExperience: {
    years: number;
    months: number;
  };
  linkedinUrl: string;
  githubUrl: string;
  primaryExpertise: string;
  disciplines: string[];
  tools: string[];
  skills: string[];
  bio: string;
  targetMentees: string[];
  mentoringTopics: string[];
  relationshipType: string;
  aiTools: string[]; 
  projects: { title: string; description: string }[];
  experience: { title: string; company: string; description: string; duration: string }[];
  resources: { title: string; description: string; linkText: string }[];
  achievements: { title: string; description: string; date: string }[];
}

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

const MentorProfileForm = ({ mentorId }: { mentorId?: string }) => {
  const navigate = useNavigate();
  const params = useParams<{ mentorId?: string }>();
  const userData = getUserData();
  const [step, setStep] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState<MentorProfile>({
    profilePhoto: '',
    totalExperience: {
      years: 0,
      months: 0
    },
    linkedinUrl: '',
    githubUrl: '',
    primaryExpertise: '',
    disciplines: [],
    tools: [],
    skills: [],
    bio: '',
    targetMentees: [],
    mentoringTopics: [],
    relationshipType: '',
    aiTools: [],
    projects: [],
    experience: [],
    resources: [],
    achievements: []
  });

  // Use mentorId from props or from URL params
  const effectiveUserId = mentorId || params.mentorId || userData?.userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/users/profile?userId=${effectiveUserId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Profile fetch error:', errorData);
          throw new Error(`Failed to fetch mentor profile: ${response.status}`);
        } else {
          const data = await response.json();
          console.log('data', data);
          if (data.status === 'success') {
            setFormData(prev => ({
              ...prev,
              ...data.profile
            }));
            // If we are fetching a profile, we're in edit mode
            setIsEdit(true);
          } else {
            throw new Error('Failed to fetch mentor profile');
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    if (effectiveUserId) {
      fetchProfile();
    }
  }, [effectiveUserId]);


  if (!formData || Object.keys(formData).length === 0) {
    return <div>Loading...</div>;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File must be less than 2MB');
        return;
      }
      
      // Create a preview immediately for better UX
      const previewUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        profilePhoto: previewUrl, // Temporary preview
      }));
      
      try {
        // Create FormData for upload
        const uploadData = new FormData();
        uploadData.append('file', file);
        
        // Show loading toast
        const loadingToast = toast.loading('Uploading image...');
        
        // Upload to S3 via backend
        const response = await fetch(`${API_URL}/upload/profile-photo`, {
          method: 'POST',
          body: uploadData,
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Upload error details:', errorData);
          toast.error(`Upload failed: ${errorData.detail || 'Unknown error'}`, { id: loadingToast });
          throw new Error('Failed to upload image');
        }
        
        const data = await response.json();
        
        // Update form with the actual S3 URL
        setFormData(prev => ({
          ...prev,
          profilePhoto: data.url,
        }));
        
        toast.success('Image uploaded successfully!', { id: loadingToast });
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Failed to upload image. Please try again.');
        
        // Keep the preview but add a warning that it's not uploaded
        toast.warning('Using temporary preview only. Please try uploading again.');
      }
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
  
    // Make totalExperience validation more flexible
    if (formData.totalExperience.years === 0 && formData.totalExperience.months === 0) {
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

  // Add function to handle step 2 to step 3 transition
  const handleNextToStep3 = () => {
    if (validateStep2()) {
      localStorage.setItem('mentorFormData', JSON.stringify(formData));
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      toast.success('Mentoring preferences saved! Please complete your additional details.');
    }
  };

  // Handle adding a new project
  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: '', description: '' }]
    }));
  };

  // Handle adding a new experience
  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', description: '', duration: '' }]
    }));
  };

  // Handle adding a new resource
  const addResource = () => {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, { title: '', description: '', linkText: '' }]
    }));
  };

  // Handle adding a new achievement
  const addAchievement = () => {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements, { title: '', description: '', date: '' }]
    }));
  };

  // Handle updating a project field
  const updateProject = (index: number, field: 'title' | 'description', value: string) => {
    setFormData(prev => {
      const updatedProjects = [...prev.projects];
      updatedProjects[index] = { ...updatedProjects[index], [field]: value };
      return { ...prev, projects: updatedProjects };
    });
  };

  // Handle updating an experience field
  const updateExperience = (index: number, field: 'title' | 'company' | 'description' | 'duration', value: string) => {
    setFormData(prev => {
      const updatedExperiences = [...prev.experience];
      updatedExperiences[index] = { ...updatedExperiences[index], [field]: value };
      return { ...prev, experience: updatedExperiences };
    });
  };

  // Handle updating a resource field
  const updateResource = (index: number, field: 'title' | 'description' | 'linkText', value: string) => {
    setFormData(prev => {
      const updatedResources = [...prev.resources];
      updatedResources[index] = { ...updatedResources[index], [field]: value };
      return { ...prev, resources: updatedResources };
    });
  };

  // Handle updating an achievement field
  const updateAchievement = (index: number, field: 'title' | 'description' | 'date', value: string) => {
    setFormData(prev => {
      const updatedAchievements = [...prev.achievements];
      updatedAchievements[index] = { ...updatedAchievements[index], [field]: value };
      return { ...prev, achievements: updatedAchievements };
    });
  };

  // Handle removing a project
  const removeProject = (index: number) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  // Handle removing an experience
  const removeExperience = (index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  // Handle removing a resource
  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  // Handle removing an achievement
  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  // Validate step 3
  const validateStep3 = () => {
    // No mandatory fields in step 3, but you can add validations if needed
    return true;
  };

  // Update the handleSubmit function
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (step === 3 && !validateStep3()) {
      return;
    }
  
    // Show loading toast
    const loadingToast = toast.loading('Saving your profile...');
    
    try {
      // Clean up empty fields
      const cleanedExperience = formData.experience.filter(exp => 
        exp.title.trim() !== '' || exp.company.trim() !== '' || exp.description.trim() !== ''
      );
      
      const cleanedProjects = formData.projects.filter(proj => 
        proj.title.trim() !== '' || proj.description.trim() !== ''
      );
      
      const cleanedResources = formData.resources.filter(res => 
        res.title.trim() !== '' || res.description.trim() !== '' || res.linkText.trim() !== ''
      );

      const cleanedAchievements = formData.achievements.filter(achievement => 
        achievement.title.trim() !== '' || achievement.description.trim() !== '' || achievement.date.trim() !== ''
      );
    
      // Remove empty strings from arrays
      const cleanedDisciplines = formData.disciplines.filter(d => d.trim() !== '');
      const cleanedTools = formData.tools.filter(t => t.trim() !== '');
      const cleanedSkills = formData.skills.filter(s => s.trim() !== '');
      const cleanedMentoringTopics = formData.mentoringTopics.filter(t => t.trim() !== '');
      const cleanedAiTools = formData.aiTools.filter(t => t.trim() !== '');
    
      // Update formData with cleaned arrays
      const updatedFormData = {
        ...formData,
        experience: cleanedExperience,
        projects: cleanedProjects,
        resources: cleanedResources,
        achievements: cleanedAchievements,
        disciplines: cleanedDisciplines,
        tools: cleanedTools,
        skills: cleanedSkills,
        mentoringTopics: cleanedMentoringTopics,
        aiTools: cleanedAiTools,
        targetMentees: [formData.relationshipType].filter(Boolean), // Convert relationshipType to array and remove empty
      };
    
      console.log('Submitting form data:', updatedFormData);
    
      // Choose the correct endpoint based on whether we're creating or updating
      const endpoint = isEdit 
        ? `${API_URL}/users/profile/update?userId=${effectiveUserId}`
        : `${API_URL}/users/mentors/profile`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
        credentials: 'include',
      });
    
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Update error details:', errorData);
        toast.error(`Update failed: ${errorData.detail || 'Unknown error'}`, { id: loadingToast });
        throw new Error(errorData.detail || 'Failed to update profile');
      }
      
      const data = await response.json();
      console.log('Response:', response.status, data);
    
      // Update user role to mentor
      const currentUserData = getUserData();
      if (currentUserData) {
        setUserData({
          ...currentUserData,
          role: 'mentor'
        });
      }
    
      toast.success(isEdit ? 'Profile updated successfully!' : 'Mentor profile created successfully!', { id: loadingToast });
      localStorage.removeItem('mentorFormData');
      
      // Navigate to the appropriate page
      navigate(isEdit ? `/profile/${effectiveUserId}` : '/mentor-dashboard');
      
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update profile', 
        { id: loadingToast });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-12 px-4">
      <Toaster
        position="top-center"
        expand={true}
        richColors
        closeButton
        theme="system"
      />
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-[#4937e8] to-[#4338ca] bg-clip-text text-transparent">
          {isEdit ? "Edit your mentor profile" : "Submit your mentorship application"}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {isEdit 
            ? (step === 1 ? "Update your profile information" : 
               step === 2 ? "Update your mentoring preferences" :
               "Update your additional details")
            : (step === 1 ? "Review your profile and tell us how you would like to mentor the community" : 
              step === 2 ? "Tell us about your mentoring preferences" :
              "Share your additional details to complete your profile")
          }
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
                      src={formData.profilePhoto || (getUserData()?.username ? `https://ui-avatars.com/api/?name=${getUserData()?.username}&background=random&size=200` : `https://ui-avatars.com/api/?name=new&background=random&size=200`)}
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
                    value={formData.totalExperience.years}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      totalExperience: { ...prev.totalExperience, years: parseInt(e.target.value) }
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
                    value={formData.totalExperience.months}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      totalExperience: { ...prev.totalExperience, months: parseInt(e.target.value) }
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
          ) : step === 2 ? (
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
              
              <div className="space-y-6">
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
                  type="button"
                  onClick={handleNextToStep3}
                  className="w-full bg-gradient-to-r from-[#4937e8] to-[#4338ca] text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  Next Step
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ) : (
            // Step 3: Additional Details
            <div className="space-y-6">
              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  Back
                </button>
                <h3 className="text-xl font-semibold">Additional Details</h3>
              </div>

              {/* GitHub URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>
                <input
                  type="text"
                  value={formData.githubUrl || ''}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#4937e8]"
                  placeholder="github.com/username"
                />
              </div>

              {/* Experience */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Work Experience
                  </label>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="text-sm text-[#4937e8] hover:text-[#4338ca]"
                  >
                    + Add Experience
                  </button>
                </div>
                
                {formData.experience.map((exp, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Experience {index + 1}</span>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(index)}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                        placeholder="Job Title"
                      />
                      
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                        placeholder="Company"
                      />
                      
                      <input
                        type="text"
                        value={exp.duration}
                        onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                        placeholder="Duration (e.g., Jan 2020 - Present)"
                      />
                      
                      <textarea
                        value={exp.description}
                        onChange={(e) => updateExperience(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                        rows={2}
                        placeholder="Description"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Projects */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Projects
                  </label>
                  <button
                    type="button"
                    onClick={addProject}
                    className="text-sm text-[#4937e8] hover:text-[#4338ca]"
                  >
                    + Add Project
                  </button>
                </div>
                
                {formData.projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Project {index + 1}</span>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeProject(index)}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) => updateProject(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                        placeholder="Project Title"
                      />
                      
                      <textarea
                        value={project.description}
                        onChange={(e) => updateProject(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                        rows={2}
                        placeholder="Project Description"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Resources */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Resources
                  </label>
                  <button
                    type="button"
                    onClick={addResource}
                    className="text-sm text-[#4937e8] hover:text-[#4338ca]"
                  >
                    + Add Resource
                  </button>
                </div>
                
                {formData.resources.map((resource, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Resource {index + 1}</span>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeResource(index)}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={resource.title}
                        onChange={(e) => updateResource(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                        placeholder="Resource Title"
                      />
                      
                      <textarea
                        value={resource.description}
                        onChange={(e) => updateResource(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                        rows={2}
                        placeholder="Resource Description"
                      />
                      
                      <input
                        type="text"
                        value={resource.linkText}
                        onChange={(e) => updateResource(index, 'linkText', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                        placeholder="Resource URL"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Achievements */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Achievements
                  </label>
                  <button
                    type="button"
                    onClick={addAchievement}
                    className="text-sm text-[#4937e8] hover:text-[#4338ca]"
                  >
                    + Add Achievement
                  </button>
                </div>
                
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">Achievement {index + 1}</span>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeAchievement(index)}
                          className="text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={achievement.title}
                        onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                        placeholder="Achievement Title"
                      />
                      
                      <textarea
                        value={achievement.description}
                        onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                        rows={2}
                        placeholder="Achievement Description"
                      />
                      
                      <input
                        type="text"
                        value={achievement.date}
                        onChange={(e) => updateAchievement(index, 'date', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                        placeholder="Achievement Date"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-[#4937e8] to-[#4338ca] text-white py-3 px-4 rounded-xl font-medium hover:opacity-90 transition-all duration-200"
              >
                {isEdit ? "Save Changes" : "Complete Profile"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorProfileForm;