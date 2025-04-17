import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MentorProfileForm from '../components/MentorProfileForm';
import { getUserData } from '../utils/auth';
import { Toaster } from 'sonner';

const EditMentorProfile = () => {
  const { mentorId } = useParams();
  const navigate = useNavigate();
  const userData = getUserData();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if the current user is allowed to edit this profile
    const checkAuthorization = () => {
      if (!userData || !mentorId) {
        setIsAuthorized(false);
        return;
      }

      // User can edit their own profile or if they are an admin
      if (userData.userId === mentorId || userData.role === 'admin') {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
      
      setLoading(false);
    };

    checkAuthorization();
  }, [userData, mentorId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500 mb-4">Unauthorized</h1>
        <p className="text-gray-600 mb-4">You don't have permission to edit this profile.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <MentorProfileForm mentorId={mentorId} />
    </div>
  );
};

export default EditMentorProfile; 