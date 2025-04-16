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
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] opacity-[0.02]"></div>
      <div className="absolute top-0 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-rose-100/40 to-transparent filter blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-full h-96 bg-gradient-to-t from-rose-50/30 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-sm font-medium mb-4 border border-rose-100 shadow-sm">
            <span className="w-1.5 h-1.5 bg-rose-600 rounded-full"></span>
            <span>Featured Series</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-rose-600 to-fuchsia-600 bg-clip-text text-transparent">
            Empowering Women in Technology
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-10">
            Join exclusive sessions with accomplished women leaders in
            technology sharing their journey, insights, and strategies for
            success in the tech industry
          </p>

          {/* Decorative avatars */}
          <div className="flex justify-center -space-x-4 mb-10">
            {womenTechSessions.slice(0, 5).map((session, idx) => (
              <div
                key={idx}
                className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-rose-300 opacity-30 group-hover:opacity-0 transition-opacity"></div>
                <img
                  src={session.mentor.image}
                  alt={session.mentor.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            <div className="w-14 h-14 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-rose-600 font-bold text-sm shadow-md">
              15+
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          </div>
        ) : (
          <div className="relative">
            {/* Interactive timeline/showcase */}
            <div className="relative rounded-2xl overflow-hidden border border-rose-100 shadow-xl bg-white">
              <div className="flex flex-col md:flex-row h-full">
                {/* Left side: Featured mentor profile */}
                <div className="w-full md:w-[40%] relative group overflow-hidden">
                  {womenTechSessions.length > 0 && (
                    <>
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10"></div>

                      {/* Background image */}
                      <div className="absolute inset-0 bg-rose-100 overflow-hidden">
                        <img
                          src={womenTechSessions[0].mentor.image}
                          alt={womenTechSessions[0].mentor.name}
                          className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-600/40 to-fuchsia-600/40 mix-blend-multiply"></div>
                      </div>

                      {/* Content overlay */}
                      <div className="relative z-20 p-8 h-full flex flex-col justify-end">
                        <span className="text-xs font-semibold text-white/80 mb-2 uppercase tracking-wider">
                          Featured Speaker
                        </span>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                          {womenTechSessions[0].mentor.name}
                        </h3>
                        <p className="text-rose-200 font-medium mb-3">
                          {womenTechSessions[0].mentor.role}
                        </p>
                        <p className="text-white/80 text-sm mb-5 line-clamp-3">
                          {womenTechSessions[0].title}
                        </p>

                        <button
                          onClick={() =>
                            navigate(`/questions/${womenTechSessions[0]._id}`)
                          }
                          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-rose-700 rounded-lg font-medium hover:bg-rose-50 transition-colors self-start group/btn"
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

                {/* Right side: Session details in tabs/accordion */}
                <div className="w-full md:w-[60%] bg-white p-8">
                  <div className="border-b border-gray-200 mb-5 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <Calendar size={18} className="text-rose-500" />
                      <span>Upcoming Women in Tech Sessions</span>
                    </h3>
                    <button
                      onClick={() => navigate("/womentech")}
                      className="text-rose-600 text-sm font-medium flex items-center gap-1 hover:text-rose-700 transition-colors"
                    >
                      <span>View all</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {womenTechSessions.slice(0, 3).map((session, idx) => (
                      <div
                        key={idx}
                        className="group cursor-pointer"
                        onClick={() => navigate(`/questions/${session._id}`)}
                      >
                        <div className="flex flex-col sm:flex-row gap-5 p-4 rounded-xl border border-gray-100 hover:border-rose-100 hover:bg-rose-50/30 transition-all">
                          {/* Session date badge */}
                          <div className="flex-shrink-0 flex sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
                            <div className="bg-rose-100 text-rose-800 rounded-lg p-3 w-16 h-16 flex flex-col items-center justify-center font-medium">
                              <span className="text-2xl font-bold">
                                {session.date.split(" ")[0]}
                              </span>
                              <span className="text-xs uppercase">
                                {session.date.split(" ")[1]}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 font-medium sm:mt-2">
                              {session.time}
                              <br />
                              {session.duration}
                            </div>
                          </div>

                          {/* Session details */}
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-rose-700 transition-colors line-clamp-1">
                              {session.title}
                            </h4>

                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 rounded-full overflow-hidden">
                                <img
                                  src={session.mentor.image}
                                  alt={session.mentor.name}
                                  className="w-full h-full object-cover"
                                />
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
                                    className="text-xs px-2 py-1 bg-white border border-rose-100 text-rose-700 rounded-full"
                                  >
                                    {topic.split(" ").slice(0, 3).join(" ")}
                                    ...
                                  </span>
                                ))}
                              {session.questions.length > 2 && (
                                <span className="text-xs px-2 py-1 bg-white text-gray-500 rounded-full">
                                  +{session.questions.length - 2} more
                                </span>
                              )}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Users2 size={14} className="text-rose-500" />
                                <div className="w-24 bg-gray-100 rounded-full h-1.5">
                                  <div
                                    className="bg-rose-500 h-1.5 rounded-full"
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

                              <div className="text-rose-600 flex items-center gap-1 text-sm font-medium">
                                <span>Register</span>
                                <ArrowRight
                                  size={14}
                                  className="transform group-hover:translate-x-1 transition-transform"
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

            {/* Bottom testimonial */}
            <div className="mt-16 relative">
              <div className="absolute inset-0 bg-rose-50 rounded-2xl transform rotate-1 opacity-70"></div>
              <div className="absolute inset-0 bg-white rounded-2xl"></div>
              <div className="relative rounded-2xl border border-rose-100 shadow-md px-8 py-10 bg-white overflow-hidden">
                {/* Decorative quotes */}
                <div className="absolute top-6 left-6 text-rose-100 opacity-70">
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
                    "These Women in Tech sessions have been instrumental in my
                    career growth. Hearing from successful women leaders
                    who've navigated similar challenges has given me both
                    practical strategies and the confidence to pursue my
                    goals."
                  </p>

                  <div className="flex items-center justify-center">
                    <div className="mr-4 w-16 h-16 rounded-full overflow-hidden ring-4 ring-rose-100">
                      <img
                        src="https://randomuser.me/api/portraits/women/44.jpg"
                        alt="Sarah Johnson"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-gray-900 text-lg">
                        Sarah Johnson
                      </p>
                      <p className="text-rose-600">
                        Senior Software Engineer
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