export interface MentorProfile {
  user_id: string;
  profilePhoto: string;
  totalExperience: {
    years: number;
    months: number;
  };
  linkedinUrl: string;
  primaryExpertise: string;
  disciplines: string[];
  tools: string[];
  skills: string[];
  bio: string;
  targetMentees: string[];
  mentoringTopics: string[];
  relationshipType: string;
  aiTools: string[]; 
}