import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, X, ChevronDown, ChevronUp, Briefcase, FolderOpen, BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { API_URL } from '../utils/api';

// Interface remains the same
interface MentorProfile {
  userId: string;
  name: string;
  headline: string;
  membership: string;
  totalExperience: {
    years: number;
    months: number;
  };
  linkedinUrl: string;
  githubUrl: string;
  primaryExpertise: string;
  disciplines: string[];
  skills: string[];
  mentoringTopics: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    description: string;
  }[];
  projects: {
    title: string;
    description: string;
  }[];
  resources: {
    title: string;
    description: string;
    linkText: string;
  }[];
  services: {
    id: number;
    title: string;
    duration: string;
    type: string;
    frequency: string;
    sessions: number;
    price: number;
    rating: number;
  }[];
  groupSessions: {
    id: number;
    title: string;
    date: string;
    time: string;
    participants: number;
    maxParticipants: number;
    price: number;
  }[];
  achievements: {
    id: number;
    title: string;
    description: string;
    date: string;
  }[];
  reviews: {
    id: number;
    user: {
      name: string;
      image: string;
      role: string;
    };
    rating: number;
    comment: string;
    date: string;
  }[];
  testimonials: {
    name: string;
    image: string;
    comment: string;
  }[];
}

export default function EditProfile() {
  const navigate = useNavigate();
  const { mentorId } = useParams();
  const [profile, setProfile] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    basicInfo: true,
    experience: true,
    projects: true,
    resources: true
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          navigate('/login');
          return;
        }

        const { role, userId } = JSON.parse(userData);

        if (role !== 'mentor' || userId !== mentorId) {
          navigate('/');
          return;
        }

        const response = await fetch(`${API_URL}/api/mentors/${mentorId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        if (data.status === 'success') {
          setProfile(data.mentor);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      const response = await fetch(`${API_URL}/api/mentors/${mentorId}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      if (data.status === 'success') {
        navigate(`/profile/${profile.userId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleAddExperience = () => {
    setProfile(prev => ({
      ...prev!,
      experience: [
        ...prev!.experience,
        { title: '', company: '', duration: '', description: '' }
      ]
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setProfile(prev => ({
      ...prev!,
      experience: prev!.experience.filter((_, i) => i !== index)
    }));
  };

  const handleAddProject = () => {
    setProfile(prev => ({
      ...prev!,
      projects: [
        ...prev!.projects,
        { title: '', description: '' }
      ]
    }));
  };

  const handleRemoveProject = (index: number) => {
    setProfile(prev => ({
      ...prev!,
      projects: prev!.projects.filter((_, i) => i !== index)
    }));
  };

  const handleAddResource = () => {
    setProfile(prev => ({
      ...prev!,
      resources: [
        ...prev!.resources,
        { title: '', description: '', linkText: '' }
      ]
    }));
  };

  const handleRemoveResource = (index: number) => {
    setProfile(prev => ({
      ...prev!,
      resources: prev!.resources.filter((_, i) => i !== index)
    }));
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-800 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <X size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-center mb-2">Error Loading Profile</h3>
          <p className="text-gray-600 text-center">{error}</p>
          <button 
            onClick={() => navigate(-1)}
            className="w-full mt-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-md text-center">
          <h3 className="text-xl font-bold mb-2">Profile Not Found</h3>
          <p className="text-gray-600 mb-6">We couldn't find the profile you're looking for.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Your Profile</h1>
            <p className="text-gray-600">Customize how others see you in the platform</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
            >
              <X size={18} />
              <span className="hidden sm:inline">Cancel</span>
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2 bg-black text-white rounded-xl hover:bg-gray-800 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-2"
            >
              <Save size={18} />
              <span className="hidden sm:inline">Save Changes</span>
            </button>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div 
              className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('basicInfo')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              </div>
              {expandedSections.basicInfo ? 
                <ChevronUp size={20} className="text-gray-500" /> : 
                <ChevronDown size={20} className="text-gray-500" />
              }
            </div>
            
            {expandedSections.basicInfo && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200
                        hover:border-gray-300"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Professional Headline</label>
                    <input
                      type="text"
                      value={profile.headline}
                      onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200
                        hover:border-gray-300"
                      placeholder="e.g. Senior Software Engineer at Google"
                    />
                  </div>
                </div>
                
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Membership Type</label>
                    <select
                      value={profile.membership}
                      onChange={(e) => setProfile({ ...profile, membership: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200
                        hover:border-gray-300 appearance-none"
                      style={{backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M5 8l5 5 5-5\" fill=\"none\" stroke=\"%23666\" stroke-width=\"1.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>')", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center'}}
                    >
                      <option value="free">Free</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Expertise</label>
                    <input
                      type="text"
                      value={profile.primaryExpertise}
                      onChange={(e) => setProfile({ ...profile, primaryExpertise: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200
                        hover:border-gray-300"
                      placeholder="e.g. Machine Learning, Web Development"
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years)</label>
                    <input
                      type="number"
                      value={profile.totalExperience?.years || 0}
                      onChange={(e) => setProfile({
                        ...profile,
                        totalExperience: {
                          ...profile.totalExperience,
                          years: parseInt(e.target.value)
                        }
                      })}
                      min="0"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200
                        hover:border-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Months)</label>
                    <input
                      type="number"
                      value={profile.totalExperience?.months || 0}
                      onChange={(e) => setProfile({
                        ...profile,
                        totalExperience: {
                          ...profile.totalExperience,
                          months: parseInt(e.target.value)
                        }
                      })}
                      min="0"
                      max="11"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200
                        hover:border-gray-300"
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
                    <input
                      type="text"
                      value={profile.linkedinUrl}
                      onChange={(e) => {
                        let url = e.target.value;
                        url = url.replace(/^https?:\/\//, '');
                        setProfile({ ...profile, linkedinUrl: url });
                      }}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200
                        hover:border-gray-300"
                      placeholder="www.linkedin.com/in/username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
                    <input
                      type="text"
                      value={profile.githubUrl}
                      onChange={(e) => {
                        let url = e.target.value;
                        url = url.replace(/^https?:\/\//, '');
                        setProfile({ ...profile, githubUrl: url });
                      }}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                        focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200
                        hover:border-gray-300"
                      placeholder="github.com/username"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Disciplines (comma-separated)</label>
                  <input
                    type="text"
                    value={profile.disciplines?.join(', ')}
                    onChange={(e) => setProfile({
                      ...profile,
                      disciplines: e.target.value.split(',').map(item => item.trim())
                    })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                      focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200
                      hover:border-gray-300"
                    placeholder="e.g. Web Development, Machine Learning, Data Science"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={profile.skills?.join(', ')}
                    onChange={(e) => setProfile({
                      ...profile,
                      skills: e.target.value.split(',').map(item => item.trim())
                    })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                      focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200
                      hover:border-gray-300"
                    placeholder="e.g. JavaScript, Python, React, Node.js"
                  />
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mentoring Topics (comma-separated)</label>
                  <input
                    type="text"
                    value={profile.mentoringTopics?.join(', ')}
                    onChange={(e) => setProfile({
                      ...profile,
                      mentoringTopics: e.target.value.split(',').map(item => item.trim())
                    })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl 
                      focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all duration-200
                      hover:border-gray-300"
                    placeholder="e.g. Career Guidance, Technical Skills, Leadership"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Experience */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div 
              className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('experience')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Briefcase size={20} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Professional Experience</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddExperience();
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium py-1 px-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                  Add
                </button>
                {expandedSections.experience ? 
                  <ChevronUp size={20} className="text-gray-500" /> : 
                  <ChevronDown size={20} className="text-gray-500" />
                }
              </div>
            </div>
            
            {expandedSections.experience && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6"
              >
                {profile.experience.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <Briefcase size={32} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No experience added yet</p>
                    <button
                      type="button"
                      onClick={handleAddExperience}
                      className="mt-3 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mx-auto"
                    >
                      <Plus size={16} />
                      Add your first experience
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {profile.experience.map((exp, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-medium text-gray-800 flex items-center gap-2">
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-black text-white text-xs">
                              {index + 1}
                            </span>
                            {exp.title || 'New Experience'}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(index)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Position/Title</label>
                            <input
                              type="text"
                              value={exp.title}
                              onChange={(e) => {
                                const newExperience = [...profile.experience];
                                newExperience[index] = { ...exp, title: e.target.value };
                                setProfile({ ...profile, experience: newExperience });
                              }}
                              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg 
                                focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                              placeholder="e.g. Senior Developer"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                            <input
                              type="text"
                              value={exp.company}
                              onChange={(e) => {
                                const newExperience = [...profile.experience];
                                newExperience[index] = { ...exp, company: e.target.value };
                                setProfile({ ...profile, experience: newExperience });
                              }}
                              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg 
                                focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                              placeholder="e.g. Google"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                          <input
                            type="text"
                            value={exp.duration}
                            onChange={(e) => {
                              const newExperience = [...profile.experience];
                              newExperience[index] = { ...exp, duration: e.target.value };
                              setProfile({ ...profile, experience: newExperience });
                            }}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg 
                              focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="e.g. Jan 2020 - Present"
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={exp.description}
                            onChange={(e) => {
                              const newExperience = [...profile.experience];
                              newExperience[index] = { ...exp, description: e.target.value };
                              setProfile({ ...profile, experience: newExperience });
                            }}
                            rows={3}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg 
                              focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="Describe your role and responsibilities"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Projects */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div 
              className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('projects')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <FolderOpen size={20} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddProject();
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium py-1 px-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                  Add
                </button>
                {expandedSections.projects ? 
                  <ChevronUp size={20} className="text-gray-500" /> : 
                  <ChevronDown size={20} className="text-gray-500" />
                }
              </div>
            </div>
            
            {expandedSections.projects && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6"
              >
                {profile.projects.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <FolderOpen size={32} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No projects added yet</p>
                    <button
                      type="button"
                      onClick={handleAddProject}
                      className="mt-3 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mx-auto"
                    >
                      <Plus size={16} />
                      Add your first project
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {profile.projects.map((project, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-medium text-gray-800 flex items-center gap-2">
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-black text-white text-xs">
                              {index + 1}
                            </span>
                            {project.title || 'New Project'}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleRemoveProject(index)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                            <input
                              type="text"
                              value={project.title}
                              onChange={(e) => {
                                const newProjects = [...profile.projects];
                                newProjects[index] = { ...project, title: e.target.value };
                                setProfile({ ...profile, projects: newProjects });
                              }}
                              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg 
                                focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                              placeholder="e.g. E-commerce Website"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={project.description}
                            onChange={(e) => {
                              const newProjects = [...profile.projects];
                              newProjects[index] = { ...project, description: e.target.value };
                              setProfile({ ...profile, projects: newProjects });
                            }}
                            rows={3}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg 
                              focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="Describe the project"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* Resources */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div 
              className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection('resources')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <BookOpen size={20} className="text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Resources</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddResource();
                  }}
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium py-1 px-2 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                  Add
                </button>
                {expandedSections.resources ? 
                  <ChevronUp size={20} className="text-gray-500" /> : 
                  <ChevronDown size={20} className="text-gray-500" />
                }
              </div>
            </div>
            
            {expandedSections.resources && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="px-6 pb-6"
              >
                {profile.resources.length === 0 ? (
                  <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <BookOpen size={32} className="mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">No resources added yet</p>
                    <button
                      type="button"
                      onClick={handleAddResource}
                      className="mt-3 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 mx-auto"
                    >
                      <Plus size={16} />
                      Add your first resource
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {profile.resources.map((resource, index) => (
                      <motion.div 
                        key={index} 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="p-5 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="font-medium text-gray-800 flex items-center gap-2">
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-black text-white text-xs">
                              {index + 1}
                            </span>
                            {resource.title || 'New Resource'}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleRemoveResource(index)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Resource Title</label>
                            <input
                              type="text"
                              value={resource.title}
                              onChange={(e) => {
                                const newResources = [...profile.resources];
                                newResources[index] = { ...resource, title: e.target.value };
                                setProfile({ ...profile, resources: newResources });
                              }}
                              className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg 
                                focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                              placeholder="e.g. React Documentation"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={resource.description}
                            onChange={(e) => {
                              const newResources = [...profile.resources];
                              newResources[index] = { ...resource, description: e.target.value };
                              setProfile({ ...profile, resources: newResources });
                            }}
                            rows={3}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg 
                              focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="Describe the resource"
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Link Text</label>
                          <input
                            type="text"
                            value={resource.linkText}
                            onChange={(e) => {
                              const newResources = [...profile.resources];
                              newResources[index] = { ...resource, linkText: e.target.value };
                              setProfile({ ...profile, resources: newResources });
                            }}
                            className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg 
                              focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                            placeholder="e.g. Read more"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
}