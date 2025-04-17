import { ArrowRight, Calendar, Users2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AMASession {
  _id: string;
  title: string;
  mentor: {
    name: string;
    role: string;
    image: string;
  };
  date: string;
  time: string;
  duration: string;
  registrants: number;
  maxRegistrants: number;
  questions: string[];
  isWomanTech: boolean;
  tag?: string;
  created_at?: string;
}

interface WomenInTechProps {
  womenTechSessions: AMASession[];
  loading: boolean;
}

const WomenInTech = ({ womenTechSessions, loading }: WomenInTechProps) => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Premium background elements with more subtle black/gray styling */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')] opacity-[0.03]"></div>
      <div className="absolute top-0 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-[#f1f5f9]/40 to-transparent filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-t from-gray-900/5 to-transparent filter blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          {/* Updated badge with black/gray styling */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-gray-100 rounded-full text-sm font-medium mb-4 border border-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
            <span className="w-1.5 h-1.5 bg-gray-100 rounded-full animate-pulse"></span>
            <span>Featured Series</span>
          </div>
          
          {/* Heading with premium styling */}
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-gray-900 relative">
            Empowering Women in Technology
            <div className="h-1 w-24 bg-gray-900/30 mx-auto mt-4 rounded-full"></div>
          </h2>
          
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
            Join exclusive sessions with accomplished women leaders in
            technology sharing their journey, insights, and strategies for
            success in the tech industry
          </p>

          {/* Updated avatars with enhanced styling */}
          <div className="flex justify-center -space-x-4 mb-10">
            {womenTechSessions.slice(0, 5).map((session, idx) => (
              <div
                key={idx}
                className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${idx * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 opacity-30 group-hover:opacity-0 transition-opacity"></div>
                <img
                  src={session.mentor.image}
                  alt={session.mentor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="w-14 h-14 rounded-full bg-gray-900 border-2 border-white flex items-center justify-center text-gray-100 font-bold text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
              15+
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-700" />
          </div>
        ) : (
          <div className="relative">
            {/* Elegant animated highlight ring */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-200 via-indigo-100/30 to-gray-200 animate-pulse opacity-70 blur-xl"></div>

            {/* Updated card with premium black styling */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-[0_10px_40px_-15px_rgba(15,23,42,0.15)] hover:shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] transition-all duration-500 backdrop-blur-sm bg-white/90">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
              <div className="flex flex-col md:flex-row h-full relative">
                {/* Left side with enhanced black gradient */}
                <div className="w-full md:w-[40%] relative group overflow-hidden">
                  {womenTechSessions.length > 0 && (
                    <>
                      {/* Enhanced gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/20 z-10"></div>

                      {/* Background image with animated zoom */}
                      <div className="absolute inset-0 bg-gray-100 overflow-hidden">
                        <img
                          src={womenTechSessions[0].mentor.image}
                          alt={womenTechSessions[0].mentor.name}
                          className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>

                      {/* Enhanced content overlay with subtle animations */}
                      <div className="relative z-20 p-8 h-full flex flex-col justify-end">
                        <div className="absolute left-0 top-0 w-full h-1 bg-gradient-to-r from-gray-500 to-gray-700"></div>
                        <span className="text-xs font-semibold text-white/90 mb-2 uppercase tracking-wider">
                          Featured Speaker
                        </span>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          {womenTechSessions[0].mentor.name}
                        </h3>
                        <p className="text-gray-200 font-medium mb-3">
                          {womenTechSessions[0].mentor.role}
                        </p>
                        <p className="text-white/90 text-sm mb-5 line-clamp-3">
                          {womenTechSessions[0].title}
                        </p>

                        <button
                          onClick={() =>
                            navigate(`/questions/${womenTechSessions[0]._id}`)
                          }
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-50 transition-colors self-start group/btn shadow-md hover:shadow-lg"
                        >
                          <span>Join Session</span>
                          <ArrowRight
                            size={16}
                            className="transform group-hover/btn:translate-x-0.5 transition-transform"
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Right side with enhanced styling */}
                <div className="w-full md:w-[60%] bg-white p-8 relative">
                  <div className="absolute right-0 top-0 w-full h-1 bg-gradient-to-r from-indigo-400/80 to-indigo-600/80"></div>
                  <div className="border-b border-gray-200 mb-5 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Calendar size={18} className="text-gray-700" />
                      <span>Upcoming Women in Tech Sessions</span>
                    </h3>
                    {/* <button
                      onClick={() => navigate("/womentech")}
                      className="text-gray-700 text-sm font-medium flex items-center gap-1 hover:text-gray-900 transition-colors"
                    >
                      <span>View all</span>
                      <ArrowRight size={14} />
                    </button> */}
                  </div>

                  <div className="space-y-4">
                    {womenTechSessions.slice(0, 3).map((session, idx) => (
                      <div
                        key={idx}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/questions/${session._id}`)}
                      >
                        <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl border border-gray-100 hover:border-gray-300 hover:bg-gray-50/80 transition-all shadow-sm hover:shadow-md">
                          {/* Session date badge with updated premium styling */}
                          <div className="flex-shrink-0 sm:pr-2">
                            <div className="flex items-center gap-3 sm:flex-col sm:items-start">
                              <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 sm:gap-1 shadow-sm group-hover:shadow-md transition-all">
                                <span className="text-base font-bold leading-none">{session.date.split(" ")[0]}</span>
                                <div className="flex flex-col sm:flex-row sm:items-center">
                                  <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-300">{session.date.split(" ")[1]}</span>
                                  <span className="hidden sm:block text-gray-400 mx-1">•</span>
                                  <span className="text-[10px] text-gray-300">{session.time}</span>
                                </div>
                              </div>
                            
                              <div className="flex items-center gap-2">
                                <div className="px-2 py-0.5 bg-indigo-50 rounded-full">
                                  <span className="text-[10px] font-medium text-indigo-700">
                                    {session.registrants} joined
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{session.duration}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Session details with premium styling */}
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors line-clamp-1">
                              {session.title}
                            </h4>

                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-sm group-hover:shadow-md transition-all relative">
                                <img
                                  src={session.mentor.image}
                                  alt={session.mentor.name}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-br from-gray-900/0 to-gray-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">
                                  {session.mentor.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {session.mentor.role}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-3">
                              {session.questions
                                .slice(0, 2)
                                .map((topic, tidx) => (
                                  <span
                                    key={tidx}
                                    className="text-xs px-2 py-1 bg-white border border-gray-200 text-gray-700 rounded-full shadow-sm"
                                  >
                                    {topic.split(" ").slice(0, 3).join(" ")}
                                    ...
                                  </span>
                                ))}
                              {session.questions.length > 2 && (
                                <span className="text-xs px-2 py-1 bg-white text-gray-500 rounded-full shadow-sm">
                                  +{session.questions.length - 2} more
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Users2 size={14} className="text-gray-600" />
                                <div className="w-24 bg-gray-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                                  <div
                                    className="bg-gray-700 h-1.5 rounded-full"
                                    style={{
                                      width: `${
                                        (session.registrants /
                                          session.maxRegistrants) *
                                        100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {session.maxRegistrants -
                                    session.registrants}{" "}
                                  spots left
                                </span>
                              </div>

                              <div className="text-gray-800 flex items-center gap-1 text-sm font-medium">
                                <span>Register</span>
                                <ArrowRight
                                  size={14}
                                  className="transform group-hover:translate-x-1 transition-transform text-indigo-600"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom testimonial with enhanced styling */}
            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-indigo-50/20 to-gray-100 rounded-2xl transform rotate-1 opacity-70"></div>
              <div className="absolute inset-0 bg-white rounded-2xl"></div>
              <div className="relative rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 px-8 py-10 bg-white overflow-hidden">
                {/* Decorative quotes with premium styling */}
                <div className="absolute top-6 left-6 text-gray-200 opacity-70">
                  <svg
                    width="100"
                    height="80"
                    viewBox="0 0 100 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M40 0H0V40L40 80V0Z M100 0H60V40L100 80V0Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div className="max-w-4xl mx-auto text-center">
                  <p className="text-xl md:text-2xl text-gray-700 font-medium mb-8 relative z-10">
                    "Education is priceless; no one can steal it from you."
                  </p>

                  <div className="flex items-center justify-center">
                    <div className="mr-4 w-16 h-16 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-md">
                      <img
                        src="https://guvi-mentorhood.s3.ap-south-1.amazonaws.com/profile-photos/5f480fb7-da00-40c9-b36d-2798d649e2b0-ChatGPT_Image_Apr_17_2025_12_04_08_AM_1_optimized_1000.png"
                        alt="Sridevi Arunprakash"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-lg">
                        Sridevi Arunprakash
                      </p>
                      <p className="text-gray-700">
                        Co-founder, GUVI
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WomenInTech;