import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Trash2, Save, X } from 'lucide-react';

interface MentorProfile {
  userId: string;
  name: string;
  headline: string;
  membership: string;
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

        const response = await fetch(`http://localhost:9000/api/mentors/${mentorId}`);
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
    try {

      const response = await fetch(`http://localhost:9000/api/mentors/${mentorId}/update`, {
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
        navigate(`/profile/${profile?.userId}`);
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

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Profile not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Profile</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Headline</label>
              <input
                type="text"
                value={profile.headline}
                onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Membership</label>
              <input
                type="text"
                value={profile.membership}
                onChange={(e) => setProfile({ ...profile, membership: e.target.value })}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Experience</h2>
            <button
              type="button"
              onClick={handleAddExperience}
              className="text-teal-600 hover:text-teal-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Experience
            </button>
          </div>
          {profile.experience.map((exp, index) => (
            <div key={index} className="space-y-4 mb-4 p-4 border border-gray-100 rounded-lg">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-800">Experience #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={exp.title}
                  onChange={(e) => {
                    const newExperience = [...profile.experience];
                    newExperience[index] = { ...exp, title: e.target.value };
                    setProfile({ ...profile, experience: newExperience });
                  }}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => {
                    const newExperience = [...profile.experience];
                    newExperience[index] = { ...exp, company: e.target.value };
                    setProfile({ ...profile, experience: newExperience });
                  }}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  value={exp.duration}
                  onChange={(e) => {
                    const newExperience = [...profile.experience];
                    newExperience[index] = { ...exp, duration: e.target.value };
                    setProfile({ ...profile, experience: newExperience });
                  }}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => {
                    const newExperience = [...profile.experience];
                    newExperience[index] = { ...exp, description: e.target.value };
                    setProfile({ ...profile, experience: newExperience });
                  }}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Projects</h2>
            <button
              type="button"
              onClick={handleAddProject}
              className="text-teal-600 hover:text-teal-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Project
            </button>
          </div>
          {profile.projects.map((project, index) => (
            <div key={index} className="space-y-4 mb-4 p-4 border border-gray-100 rounded-lg">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-800">Project #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveProject(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={project.title}
                  onChange={(e) => {
                    const newProjects = [...profile.projects];
                    newProjects[index] = { ...project, title: e.target.value };
                    setProfile({ ...profile, projects: newProjects });
                  }}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={project.description}
                  onChange={(e) => {
                    const newProjects = [...profile.projects];
                    newProjects[index] = { ...project, description: e.target.value };
                    setProfile({ ...profile, projects: newProjects });
                  }}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Resources */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Resources</h2>
            <button
              type="button"
              onClick={handleAddResource}
              className="text-teal-600 hover:text-teal-700 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Resource
            </button>
          </div>
          {profile.resources.map((resource, index) => (
            <div key={index} className="space-y-4 mb-4 p-4 border border-gray-100 rounded-lg">
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-gray-800">Resource #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveResource(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={resource.title}
                  onChange={(e) => {
                    const newResources = [...profile.resources];
                    newResources[index] = { ...resource, title: e.target.value };
                    setProfile({ ...profile, resources: newResources });
                  }}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={resource.description}
                  onChange={(e) => {
                    const newResources = [...profile.resources];
                    newResources[index] = { ...resource, description: e.target.value };
                    setProfile({ ...profile, resources: newResources });
                  }}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Link Text</label>
                <input
                  type="text"
                  value={resource.linkText}
                  onChange={(e) => {
                    const newResources = [...profile.resources];
                    newResources[index] = { ...resource, linkText: e.target.value };
                    setProfile({ ...profile, resources: newResources });
                  }}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
} 