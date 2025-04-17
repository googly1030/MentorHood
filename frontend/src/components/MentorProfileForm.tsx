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
  headline: string;
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
    headline: '',
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
    
    // Headline validation
    if (!formData.headline.trim()) {
      errors.push('Headline is required');
    } else if (formData.headline.trim().length < 5) {
      errors.push(`Headline should be at least 5 characters (currently: ${formData.headline.trim().length} characters)`);
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
    return true;
  };
  
  // Update the handleNext function to include better debugging
  const handleNext = () => {
    const isValid = validateStep1();
  
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
  const lastProject = formData.projects[formData.projects.length - 1];
  if (!lastProject || (lastProject.title.trim() !== '' || lastProject.description.trim() !== '')) {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects.filter(p => p.title.trim() !== '' || p.description.trim() !== ''), 
        { title: '', description: '' }]
    }));
  }
};

// Handle adding a new experience
const addExperience = () => {
  const lastExperience = formData.experience[formData.experience.length - 1];
  if (!lastExperience || (lastExperience.title.trim() !== '' || lastExperience.company.trim() !== '' || 
      lastExperience.description.trim() !== '' || lastExperience.duration.trim() !== '')) {
    setFormData(prev => ({
      ...prev,
      experience: [...prev.experience.filter(e => 
        e.title.trim() !== '' || e.company.trim() !== '' || 
        e.description.trim() !== '' || e.duration.trim() !== ''), 
        { title: '', company: '', description: '', duration: '' }]
    }));
  }
};

// Handle adding a new resource
const addResource = () => {
  const lastResource = formData.resources[formData.resources.length - 1];
  if (!lastResource || (lastResource.title.trim() !== '' || lastResource.description.trim() !== '' || 
      lastResource.linkText.trim() !== '')) {
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources.filter(r => 
        r.title.trim() !== '' || r.description.trim() !== '' || r.linkText.trim() !== ''),
        { title: '', description: '', linkText: '' }]
    }));
  }
};

// Handle adding a new achievement
const addAchievement = () => {
  const lastAchievement = formData.achievements[formData.achievements.length - 1];
  if (!lastAchievement || (lastAchievement.title.trim() !== '' || lastAchievement.description.trim() !== '' || 
      lastAchievement.date.trim() !== '')) {
    setFormData(prev => ({
      ...prev,
      achievements: [...prev.achievements.filter(a => 
        a.title.trim() !== '' || a.description.trim() !== '' || a.date.trim() !== ''),
        { title: '', description: '', date: '' }]
    }));
  }
};

// Update functions with empty string filtering
const updateProject = (index: number, field: 'title' | 'description', value: string) => {
  setFormData(prev => {
    const updatedProjects = [...prev.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    return { ...prev, projects: updatedProjects.filter(p => 
      p.title.trim() !== '' || p.description.trim() !== ''
    )};
  });
};

const updateExperience = (index: number, field: 'title' | 'company' | 'description' | 'duration', value: string) => {
  setFormData(prev => {
    const updatedExperiences = [...prev.experience];
    updatedExperiences[index] = { ...updatedExperiences[index], [field]: value };
    return { ...prev, experience: updatedExperiences.filter(e => 
      e.title.trim() !== '' || e.company.trim() !== '' || 
      e.description.trim() !== '' || e.duration.trim() !== ''
    )};
  });
};

const updateResource = (index: number, field: 'title' | 'description' | 'linkText', value: string) => {
  setFormData(prev => {
    const updatedResources = [...prev.resources];
    updatedResources[index] = { ...updatedResources[index], [field]: value };
    return { ...prev, resources: updatedResources.filter(r => 
      r.title.trim() !== '' || r.description.trim() !== '' || r.linkText.trim() !== ''
    )};
  });
};

const updateAchievement = (index: number, field: 'title' | 'description' | 'date', value: string) => {
  setFormData(prev => {
    const updatedAchievements = [...prev.achievements];
    updatedAchievements[index] = { ...updatedAchievements[index], [field]: value };
    return { ...prev, achievements: updatedAchievements.filter(a => 
      a.title.trim() !== '' || a.description.trim() !== '' || a.date.trim() !== ''
    )};
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
            <div className="p-8 lg:p-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-3">
                <span className="text-sm font-medium text-indigo-700">Step 1 of 3</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Your Mentor Profile
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Share your expertise and experience to help mentees understand how you can support them
              </p>
            </div>
            
            <div className="space-y-7 max-w-4xl mx-auto">
              {/* Profile Photo Upload */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start mb-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                    <Upload className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <label className="block text-base font-medium text-gray-800">
                      Profile Photo
                    </label>
                    <p className="text-sm text-gray-500">Upload a professional photo to make your profile more personable</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 rounded-full bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden group-hover:border-indigo-200 transition-all">
                    {formData.profilePhoto ? (
                      <img
                        src={formData.profilePhoto || (getUserData()?.username ? `https://ui-avatars.com/api/?name=${getUserData()?.username}&background=random&size=200` : `https://ui-avatars.com/api/?name=new&background=random&size=200`)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="text-gray-400 group-hover:text-indigo-400 transition-colors" size={32} />
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
                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </label>
                  <p className="text-xs text-gray-500">Make sure the file is below 2MB</p>
                </div>
              </div>
        
              {/* Experience */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start mb-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16V12M12 8H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <label className="block text-base font-medium text-gray-800">
                      Your Experience
                    </label>
                    <p className="text-sm text-gray-500">Share your professional experience level</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Years of Experience <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={formData.totalExperience.years}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          totalExperience: { ...prev.totalExperience, years: parseInt(e.target.value) || 0 }
                        }))}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                          focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                          hover:border-gray-300 pl-10 group-hover:shadow-sm group-hover:bg-white"
                        placeholder="Years"
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2 justify-start">
                      {[1, 3, 5, 10].map(years => (
                        <button
                          key={years}
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            totalExperience: { ...prev.totalExperience, years }
                          }))}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                            formData.totalExperience.years === years 
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {years} yr
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Months
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="11"
                        value={formData.totalExperience.months}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          totalExperience: { ...prev.totalExperience, months: parseInt(e.target.value) || 0 }
                        }))}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                          focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                          hover:border-gray-300 pl-10 group-hover:shadow-sm group-hover:bg-white"
                        placeholder="Months"
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2 justify-start">
                      {[0, 3, 6, 9].map(months => (
                        <button
                          key={months}
                          type="button"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            totalExperience: { ...prev.totalExperience, months }
                          }))}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                            formData.totalExperience.months === months 
                              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                              : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {months} mo
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
        
              {/* LinkedIn URL */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start mb-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                    <Linkedin className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <label className="block text-base font-medium text-gray-800">
                      LinkedIn Profile <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500">Add your professional profile for mentees to learn more about you</p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                      focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                      hover:border-gray-300 pl-12 group-hover:shadow-sm group-hover:bg-white"
                    placeholder="linkedin.com/in/username"
                    required
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Linkedin className="w-5 h-5" />
                  </div>
                </div>
              </div>
        
              {/* Primary Expertise */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start mb-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.258 9.77251 19.9887C9.5799 19.7194 9.31074 19.5143 9 19.4C8.69838 19.2669 8.36381 19.2272 8.03941 19.286C7.71502 19.3448 7.41568 19.4995 7.18 19.73L7.12 19.79C6.93425 19.976 6.71368 20.1235 6.47088 20.2241C6.22808 20.3248 5.96783 20.3766 5.705 20.3766C5.44217 20.3766 5.18192 20.3248 4.93912 20.2241C4.69632 20.1235 4.47575 19.976 4.29 19.79C4.10405 19.6043 3.95653 19.3837 3.85588 19.1409C3.75523 18.8981 3.70343 18.6378 3.70343 18.375C3.70343 18.1122 3.75523 17.8519 3.85588 17.6091C3.95653 17.3663 4.10405 17.1457 4.29 16.96L4.35 16.9C4.58054 16.6643 4.73519 16.365 4.794 16.0406C4.85282 15.7162 4.81312 15.3816 4.68 15.08C4.55324 14.7842 4.34276 14.532 4.07447 14.3543C3.80618 14.1766 3.49179 14.0813 3.17 14.08H3C2.46957 14.08 1.96086 13.8693 1.58579 13.4942C1.21071 13.1191 1 12.6104 1 12.08C1 11.5496 1.21071 11.0409 1.58579 10.6658C1.96086 10.2907 2.46957 10.08 3 10.08H3.09C3.42099 10.0723 3.742 9.96512 4.0113 9.77251C4.28059 9.5799 4.48572 9.31074 4.6 9C4.73312 8.69838 4.77282 8.36381 4.714 8.03941C4.65519 7.71502 4.50054 7.41568 4.27 7.18L4.21 7.12C4.02405 6.93425 3.87653 6.71368 3.77588 6.47088C3.67523 6.22808 3.62343 5.96783 3.62343 5.705C3.62343 5.44217 3.67523 5.18192 3.77588 4.93912C3.87653 4.69632 4.02405 4.47575 4.21 4.29C4.39575 4.10405 4.61632 3.95653 4.85912 3.85588C5.10192 3.75523 5.36217 3.70343 5.625 3.70343C5.88783 3.70343 6.14808 3.75523 6.39088 3.85588C6.63368 3.95653 6.85425 4.10405 7.04 4.29L7.1 4.35C7.33568 4.58054 7.63502 4.73519 7.95941 4.794C8.28381 4.85282 8.61838 4.81312 8.92 4.68H9C9.29577 4.55324 9.54802 4.34276 9.72569 4.07447C9.90337 3.80618 9.99872 3.49179 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <label className="block text-base font-medium text-gray-800">
                      Primary Expertise <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500">What's your main area of expertise?</p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.primaryExpertise}
                    onChange={(e) => setFormData(prev => ({ ...prev, primaryExpertise: e.target.value }))}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                      focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                      hover:border-gray-300 pl-10 group-hover:shadow-sm group-hover:bg-white"
                    placeholder="e.g., Frontend Development, UX Design"
                    required
                  />
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 justify-start">
                  {["Frontend Development", "UX Design", "Product Management", "Data Science"].map(expertise => (
                    <button
                      key={expertise}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, primaryExpertise: expertise }))}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                        formData.primaryExpertise === expertise 
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                          : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                      }`}
                    >
                      {expertise}
                    </button>
                  ))}
                </div>
              </div>
        
              {/* Disciplines */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start mb-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11L12 14L22 4M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <label className="block text-base font-medium text-gray-800">
                      Disciplines <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500">Select disciplines where you have expertise</p>
                  </div>
                </div>
                <CustomSelect
                  label=""
                  options={DISCIPLINES}
                  selectedValues={formData.disciplines.filter(Boolean)}
                  onChange={(values) => setFormData(prev => ({
                    ...prev,
                    disciplines: values.filter(value => value.trim() !== '')
                  }))}
                  placeholder="Select disciplines"
                />
              </div>
        
              {/* Tools */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start mb-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14.7 6.3C14.1 6.9 14.1 7.7 14.7 8.3C15.3 8.9 16.1 8.9 16.7 8.3C17.3 7.7 17.3 6.9 16.7 6.3C16.1 5.7 15.3 5.7 14.7 6.3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M20 14V17C20 18.1 20 18.65 19.82 19.09C19.66 19.5 19.4 19.84 19 20.27C18.6 20.7 18.04 21.07 16.93 21.79L13.66 23.76C12.47 24.54 11.88 24.93 11.24 25.05C10.67 25.15 10.08 25.06 9.55 24.79C8.95 24.5 8.45 23.96 7.44 22.89L2.7 17.97C1.96 17.19 1.59 16.8 1.35 16.35C1.14 15.96 1.02 15.54 1 15.1C0.98 14.61 1.14 14.1 1.47 13.08L3.44 7.6C4.04 6.08 4.35 5.32 4.89 4.77C5.38 4.28 5.98 3.92 6.66 3.74C7.42 3.53 8.28 3.62 10 3.8L13.95 4.25C15.5 4.41 16.27 4.49 16.89 4.81C17.43 5.1 17.88 5.54 18.19 6.07C18.54 6.68 18.63 7.47 18.8 9.05L19 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <label className="block text-base font-medium text-gray-800">
                      Tools <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500">Select tools you have experience with</p>
                  </div>
                </div>
                <CustomSelect
                  label=""
                  options={TOOLS}
                  selectedValues={formData.tools.filter(tool => tool && tool.trim() !== '')} // Enhanced filtering
                  onChange={(values) => setFormData(prev => ({
                    ...prev,
                    tools: values.filter(value => typeof value === 'string' && value.trim().length > 0) // Stricter filtering
                  }))}
                  placeholder="Select tools"
                />
              </div>
        
              {/* Skills */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start mb-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 5L21 12M21 12L14 19M21 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <label className="block text-base font-medium text-gray-800">
                      Skills <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500">Select your key professional skills</p>
                  </div>
                </div>
                <CustomSelect
                  label=""
                  options={SKILLS}
                  selectedValues={formData.skills.filter(skill => skill && skill.trim() !== '')} // Enhanced filtering
                  onChange={(values) => setFormData(prev => ({
                    ...prev,
                    skills: values.filter(value => typeof value === 'string' && value.trim().length > 0) // Stricter filtering
                  }))}
                  placeholder="Select skills"
                />
              </div>
        
              {/* Headline */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start mb-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <label className="block text-base font-medium text-gray-800">
                      Headline <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500">A short professional headline that describes you</p>
                  </div>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
                      focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                      hover:border-gray-300 group-hover:shadow-sm group-hover:bg-white"
                    placeholder="e.g., Senior Frontend Developer at Company"
                    required
                  />
                </div>
              </div>
        
              {/* Bio */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start mb-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 12H15M9 16H15M9 8H15M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <label className="block text-base font-medium text-gray-800">
                      Bio <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500">Tell mentees about yourself and your expertise</p>
                  </div>
                </div>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-xl
                    focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
                    hover:border-gray-300 h-36 resize-none group-hover:shadow-sm group-hover:bg-white"
                  rows={4}
                  placeholder="Introduce yourself and share your relevant experience (minimum 100 characters)"
                  required
                  minLength={100}
                />
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-gray-500">
                    {formData.bio.length} / 100 characters minimum
                  </p>
                 
                </div>
              </div>
        
              {/* Footer Action Buttons */}
              <div className="flex justify-end pt-8 mt-8 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleNext}
                  className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-medium 
                    transition-all duration-300 flex items-center gap-2 hover:shadow-lg relative overflow-hidden"
                >
                  <span className="relative z-10">Continue to Mentoring Preferences</span>
                  <ArrowRight size={18} className="relative z-10 transform group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-indigo-700 to-indigo-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
              </div>
            </div>
          </div>
          ) : step === 2 ? (
            <div className="p-8 lg:p-10">
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-3">
                <span className="text-sm font-medium text-indigo-700">Step 2 of 3</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Mentoring Preferences
              </h2>
              <p className="text-gray-600 max-w-xl mx-auto">
                Tell us how you want to help others and what topics you're most comfortable mentoring
              </p>
            </div>
            
            <div className="space-y-7 max-w-4xl mx-auto">
              {/* Target Mentees */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start mb-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <label className="block text-base font-medium text-gray-800">
                      Target Mentees <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500">Select which type of mentees you prefer to work with</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { value: "junior", label: "Junior", desc: "Early career" },
                    { value: "mid-level", label: "Mid-level", desc: "Some experience" },
                    { value: "senior", label: "Senior", desc: "Experienced" },
                    { value: "no-preference", label: "No Preference", desc: "Open to all levels" }
                  ].map(option => (
                    <label 
                      key={option.value}
                      className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all
                        ${formData.relationshipType === option.value 
                          ? 'bg-indigo-50 border-2 border-indigo-200 ring-2 ring-indigo-100'
                          : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'}`}
                      onClick={() => setFormData(prev => ({ ...prev, relationshipType: option.value }))}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        formData.relationshipType === option.value ? 'bg-indigo-100' : 'bg-gray-100'
                      }`}>
                        <svg className={`w-5 h-5 ${formData.relationshipType === option.value ? 'text-indigo-600' : 'text-gray-500'}`} 
                          viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="text-center">
                        <span className={`text-sm font-medium ${formData.relationshipType === option.value ? 'text-indigo-700' : 'text-gray-700'}`}>
                          {option.label}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{option.desc}</p>
                      </div>
                      <input 
                        type="radio" 
                        name="relationshipType" 
                        value={option.value}
                        className="sr-only"
                        checked={formData.relationshipType === option.value}
                        onChange={() => {}}
                      />
                    </label>
                  ))}
                </div>
              </div>
        
              {/* Mentoring Topics */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start mb-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 16v-4M12 8h.01M22 12c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <label className="block text-base font-medium text-gray-800">
                      Mentoring Topics <span className="text-red-500">*</span>
                    </label>
                    <p className="text-sm text-gray-500">Select topics you're comfortable mentoring others in</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mb-4">
                  {MENTORING_TOPICS.map((topic) => (
                    <div
                      key={topic}
                      onClick={() => {
                        if (formData.mentoringTopics?.includes(topic)) {
                          setFormData(prev => ({
                            ...prev,
                            mentoringTopics: prev.mentoringTopics.filter(t => t && t.trim() !== '' && t !== topic)
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            mentoringTopics: [...(prev.mentoringTopics || []).filter(t => t && t.trim() !== ''), topic]
                          }));
                        }
                      }}
                      className={`
                        px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                        flex items-center gap-2.5
                        ${formData.mentoringTopics?.includes(topic)
                          ? 'bg-indigo-50 border-2 border-indigo-200 text-indigo-700 shadow-sm'
                          : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'}
                      `}
                    >
                      <div className={`
                        w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center border
                        ${formData.mentoringTopics?.includes(topic)
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-gray-300'}
                      `}>
                        {formData.mentoringTopics?.includes(topic) && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium truncate">{topic}</span>
                    </div>
                  ))}
                </div>
                
                {/* Add visualization of selected topics */}
                {(formData.mentoringTopics?.length || 0) > 0 && (
                  <div className="mt-5 border-t border-gray-100 pt-5">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <span>Selected Topics</span>
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
                          {formData.mentoringTopics?.filter(t => t && t.trim() !== '').length || 0}
                        </span>
                      </h4>
                      {(formData.mentoringTopics?.length || 0) > 0 && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({...prev, mentoringTopics: []}))}
                          className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                    {/* Topic tags */}
                    <div className="flex flex-wrap gap-2">
                      {(formData.mentoringTopics || [])
                        .filter(topic => topic && topic.trim() !== '')
                        .map(topic => (
                          <div key={topic} className="bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 text-xs font-medium text-indigo-800 flex items-center gap-2">
                            {topic}
                            <button 
                              className="w-4 h-4 rounded-full flex items-center justify-center bg-indigo-200 text-indigo-700 hover:bg-indigo-300"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData(prev => ({
                                  ...prev,
                                  mentoringTopics: (prev.mentoringTopics || []).filter(t => t && t.trim() !== '' && t !== topic)
                                }));
                              }}
                            >×</button>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
        
              {/* AI Tools */}
              <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
  <div className="flex items-start mb-5">
    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
      <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 18h.01M8 21h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <div className="ml-4">
      <label className="block text-base font-medium text-gray-800">
        AI Tools <span className="text-red-500">*</span>
      </label>
      <p className="text-sm text-gray-500">Which AI tools do you use in your work or can help mentees with?</p>
    </div>
  </div>
  
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
    {AI_TOOLS.map((tool) => {
      const validTools = (formData.aiTools || []).filter(t => t && t.trim() !== '');
      const isSelected = validTools.includes(tool);

      return (
        <div
          key={tool}
          onClick={() => {
            if (isSelected) {
              setFormData(prev => ({
                ...prev,
                aiTools: (prev.aiTools || [])
                  .filter(t => t && t.trim() !== '') // Remove empty strings
                  .filter(t => t !== tool) // Remove selected tool
              }));
            } else {
              setFormData(prev => ({
                ...prev,
                aiTools: [
                  ...(prev.aiTools || []).filter(t => t && t.trim() !== ''), // Keep only valid tools
                  tool
                ]
              }));
            }
          }}
          className={`
            px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200
            flex items-center gap-2
            ${isSelected
              ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 shadow-sm'
              : 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'}
          `}
        >
          <div className={`
            w-4 h-4 rounded-sm flex-shrink-0 flex items-center justify-center border
            ${isSelected
              ? 'bg-indigo-600 border-indigo-600 text-white'
              : 'bg-white border-gray-300'}
          `}>
            {isSelected && (
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <span className="text-xs font-medium truncate">{tool}</span>
        </div>
      );
    })}
  </div>
  
  {/* Selected AI tools */}
  {((formData.aiTools || []).filter(t => t && t.trim() !== '').length > 0) && (
    <div className="mt-5 border-t border-gray-100 pt-5">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <span>Selected AI Tools</span>
          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">
            {(formData.aiTools || []).filter(t => t && t.trim() !== '').length}
          </span>
        </h4>
        <button
          type="button"
          onClick={() => setFormData(prev => ({...prev, aiTools: []}))}
          className="text-xs text-gray-500 hover:text-red-500 transition-colors"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {(formData.aiTools || [])
          .filter(t => t && t.trim() !== '')
          .map(tool => (
            <div 
              key={tool} 
              className="bg-indigo-50 border border-indigo-100 rounded-full px-3 py-1 text-xs font-medium text-indigo-800 flex items-center gap-2"
            >
              {tool}
              <button 
                className="w-4 h-4 rounded-full flex items-center justify-center bg-indigo-200 text-indigo-700 hover:bg-indigo-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setFormData(prev => ({
                    ...prev,
                    aiTools: (prev.aiTools || [])
                      .filter(t => t && t.trim() !== '') // Remove empty strings
                      .filter(t => t !== tool) // Remove selected tool
                  }));
                }}
              >
                ×
              </button>
            </div>
          ))
        }
      </div>
    </div>
  )}
</div>
        
              {/* Footer Action Buttons */}
              <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-6 py-3 
                    rounded-xl font-medium transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back to Profile
                </button>
                <button
                  type="button"
                  onClick={handleNextToStep3}
                  className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-medium 
                    transition-all duration-300 flex items-center gap-2 hover:shadow-lg relative overflow-hidden"
                >
                  <span className="relative z-10">Continue to Additional Details</span>
                  <ArrowRight size={18} className="relative z-10 transform group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-indigo-700 to-indigo-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                </button>
              </div>
            </div>
          </div>
          ) : (
            <div className="p-8 lg:p-10">
    <div className="text-center mb-10">
      <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full mb-3">
        <span className="text-sm font-medium text-indigo-700">Step 3 of 3</span>
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-3">
        Additional Details
      </h2>
      <p className="text-gray-600 max-w-xl mx-auto">
        Share more about your professional experience to help mentees understand your background
      </p>
    </div>
    
    <div className="space-y-7 max-w-4xl mx-auto">
      {/* GitHub URL */}
      <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="flex items-start mb-5">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="ml-4">
            <label className="block text-base font-medium text-gray-800">
              GitHub Profile
            </label>
            <p className="text-sm text-gray-500">Add your GitHub profile to showcase your projects and contributions</p>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            value={formData.githubUrl || ''}
            onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl 
              focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300
              hover:border-gray-300 pl-12 group-hover:shadow-sm group-hover:bg-white"
            placeholder="github.com/username"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Work Experience */}
      <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="ml-4">
              <label className="block text-base font-medium text-gray-800">
                Work Experience
              </label>
              <p className="text-sm text-gray-500">Share your professional work history</p>
            </div>
          </div>
          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Experience
          </button>
        </div>
        
        <div className="space-y-5">
          {formData.experience.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-gray-500">No work experience added yet</p>
              <button
                type="button"
                onClick={addExperience}
                className="mt-3 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
              >
                Add Your First Experience
              </button>
            </div>
          ) : (
            formData.experience.map((exp, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-all"
              >
                <div className="p-5 bg-gradient-to-r from-indigo-50/50 to-purple-50/30 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-800">
                      {exp.title || exp.company 
                        ? `${exp.title || 'Role'} ${exp.company ? `at ${exp.company}` : ''}`
                        : `Experience ${index + 1}`}
                    </span>
                  </div>
                  {formData.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-rose-500 hover:text-rose-700 text-sm font-medium flex items-center gap-1"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={exp.title}
                        onChange={(e) => updateExperience(index, 'title', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl 
                          focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300"
                        placeholder="e.g., Senior Developer"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Company</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl 
                          focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300"
                        placeholder="e.g., Acme Inc."
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Duration</label>
                    <input
                      type="text"
                      value={exp.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300"
                      placeholder="e.g., Jan 2020 - Present"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 resize-none"
                      rows={3}
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Projects */}
      <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="ml-4">
              <label className="block text-base font-medium text-gray-800">
                Projects
              </label>
              <p className="text-sm text-gray-500">Showcase your notable projects and accomplishments</p>
            </div>
          </div>
          <button
            type="button"
            onClick={addProject}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Project
          </button>
        </div>
        
        <div className="space-y-5">
          {formData.projects.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-gray-500">No projects added yet</p>
              <button
                type="button"
                onClick={addProject}
                className="mt-3 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
              >
                Add Your First Project
              </button>
            </div>
          ) : (
            formData.projects.map((project, index) => (
              <div 
                key={index} 
                className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-all"
              >
                <div className="p-5 bg-gradient-to-r from-indigo-50/50 to-purple-50/30 border-b border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                      {index + 1}
                    </div>
                    <span className="font-medium text-gray-800">
                      {project.title || `Project ${index + 1}`}
                    </span>
                  </div>
                  {formData.projects.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeProject(index)}
                      className="text-rose-500 hover:text-rose-700 text-sm font-medium flex items-center gap-1"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="p-5 space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Project Title</label>
                    <input
                      type="text"
                      value={project.title}
                      onChange={(e) => updateProject(index, 'title', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300"
                      placeholder="e.g., E-commerce Platform"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                    <textarea
                      value={project.description}
                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 resize-none"
                      rows={3}
                      placeholder="Describe your project, technologies used, and your role..."
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Resources */}
      <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 14a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 9a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 19a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 9a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 19h-3m8-10h-3m-8 0H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5V3m0 16v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="ml-4">
              <label className="block text-base font-medium text-gray-800">
                Resources
              </label>
              <p className="text-sm text-gray-500">Share helpful resources with your mentees</p>
            </div>
          </div>
          <button
            type="button"
            onClick={addResource}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Resource
          </button>
        </div>
        
        <div className="space-y-5">
          {formData.resources.map((resource, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-all"
            >
              <div className="p-5 bg-gradient-to-r from-indigo-50/50 to-purple-50/30 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-800">
                    {resource.title || `Resource ${index + 1}`}
                  </span>
                </div>
                {formData.resources.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeResource(index)}
                    className="text-rose-500 hover:text-rose-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Remove
                  </button>
                )}
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Resource Title</label>
                  <input
                    type="text"
                    value={resource.title}
                    onChange={(e) => updateResource(index, 'title', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl 
                      focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300"
                    placeholder="e.g., Beginner's Guide to React"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <textarea
                    value={resource.description}
                    onChange={(e) => updateResource(index, 'description', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl 
                      focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 resize-none"
                    rows={2}
                    placeholder="Describe what this resource offers..."
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Resource URL</label>
                  <input
                    type="text"
                    value={resource.linkText}
                    onChange={(e) => updateResource(index, 'linkText', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl 
                      focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300"
                    placeholder="e.g., https://example.com/resource"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {formData.resources.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 14a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 9a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 19a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 9a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 19h-3m8-10h-3m-8 0H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 5V3m0 16v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-gray-500">No resources added yet</p>
              <button
                type="button"
                onClick={addResource}
                className="mt-3 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
              >
                Add Your First Resource
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Achievements */}
      <div className="bg-white p-7 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 15v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2m8-10v2m-8-2v2M9 1h6v4H9V1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="ml-4">
              <label className="block text-base font-medium text-gray-800">
                Achievements
              </label>
              <p className="text-sm text-gray-500">Highlight your awards, certifications, and accomplishments</p>
            </div>
          </div>
          <button
            type="button"
            onClick={addAchievement}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1V11M1 6H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Add Achievement
          </button>
        </div>
        
        <div className="space-y-5">
          {formData.achievements.map((achievement, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden hover:shadow-sm transition-all"
            >
              <div className="p-5 bg-gradient-to-r from-indigo-50/50 to-purple-50/30 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold text-sm">
                    {index + 1}
                  </div>
                  <span className="font-medium text-gray-800">
                    {achievement.title || `Achievement ${index + 1}`}
                  </span>
                </div>
                {formData.achievements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeAchievement(index)}
                    className="text-rose-500 hover:text-rose-700 text-sm font-medium flex items-center gap-1"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Remove
                  </button>
                )}
              </div>
              
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Achievement Title</label>
                  <input
                    type="text"
                    value={achievement.title}
                    onChange={(e) => updateAchievement(index, 'title', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl 
                      focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300"
                    placeholder="e.g., AWS Certified Solutions Architect"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                  <textarea
                    value={achievement.description}
                    onChange={(e) => updateAchievement(index, 'description', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl 
                      focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300 resize-none"
                    rows={2}
                    placeholder="Describe your achievement..."
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                  <input
                    type="text"
                    value={achievement.date}
                    onChange={(e) => updateAchievement(index, 'date', e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl 
                      focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all duration-300"
                    placeholder="e.g., May 2022"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {formData.achievements.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 15v2a2 2 0 01-2 2h-4a2 2 0 01-2-2v-2m8-10v2m-8-2v2M9 1h6v4H9V1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-gray-500">No achievements added yet</p>
              <button
                type="button"
                onClick={addAchievement}
                className="mt-3 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-medium hover:bg-indigo-100 transition-colors"
              >
                Add Your First Achievement
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Action Buttons */}
      <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setStep(2)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 px-6 py-3 
            rounded-xl font-medium transition-all duration-200 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Preferences
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="group bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-medium 
            transition-all duration-300 flex items-center gap-2 hover:shadow-lg relative overflow-hidden"
        >
          <span className="relative z-10">{isEdit ? "Save Changes" : "Complete Profile"}</span>
          <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12l5 5l10 -10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-indigo-700 to-indigo-600 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
        </button>
      </div>
    </div>
  </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorProfileForm;