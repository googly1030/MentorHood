import { Calendar, Clock, ArrowRight, MessageCircle, Users2, Loader2 } from "lucide-react";
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

interface AskMeAnythingProps {
  amaSessions: AMASession[];
  loading: boolean;
}

const AskMeAnything = ({ amaSessions, loading }: AskMeAnythingProps) => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden bg-white">
      {/* Background elements with enhanced depth */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/inspiration-geometry.png')] opacity-[0.02]"></div>
      <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-indigo-100/20 filter blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gray-100/20 mix-blend-multiply filter blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-900 text-gray-100 rounded-full text-sm font-medium mb-4 border border-gray-800 shadow-md hover:shadow-lg transition-all duration-300">
            <span className="w-1.5 h-1.5 bg-gray-100 rounded-full animate-pulse"></span>
            <span>Learn From The Best</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight bg-gradient-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
            Ask Me Anything Sessions
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Join interactive live sessions with industry experts who share
            their insights and answer your burning questions in real-time
          </p>

          <button
            onClick={() => navigate("/ama")}
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-full text-gray-800 hover:text-gray-900 hover:border-gray-300 hover:shadow-lg transition-all group mb-16"
          >
            <span className="font-medium">View All AMA Sessions</span>
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center transform group-hover:translate-x-0.5 transition-all">
              <ArrowRight size={14} className="text-gray-700" />
            </div>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-700" />
          </div>
        ) : (
          <div className="relative p-1">
            {/* Highlight ring animation */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gray-200 via-indigo-100/30 to-gray-200 animate-pulse opacity-70 blur-xl"></div>

            {/* Main AMA showcase with premium shadow */}
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-[0_10px_40px_-15px_rgba(15,23,42,0.15)] hover:shadow-[0_20px_60px_-15px_rgba(15,23,42,0.25)] border border-gray-200 transition-all duration-500">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>

              {/* Featured session with premium styling */}
              {amaSessions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-1 relative">
                  {/* Left side - featured session */}
                  <div className="bg-gradient-to-br from-white to-indigo-50/30 p-8 md:p-10 rounded-tl-2xl rounded-bl-2xl md:rounded-bl-none md:rounded-tr-none relative overflow-hidden group border-r border-gray-200">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-indigo-600 md:hidden"></div>

                    {/* Animated spotlight effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-radial-gradient pointer-events-none"></div>

                    <div className="flex items-start gap-5 mb-6">
                      <div className="relative flex-shrink-0">
                        <div className="p-1 bg-white rounded-full shadow-md ring-2 ring-indigo-100 z-10 relative">
                          <div className="w-20 h-20 rounded-full overflow-hidden">
                            <img
                              src={
                                amaSessions[0]?.mentor.image ||
                                "https://randomuser.me/api/portraits/men/1.jpg"
                              }
                              alt={amaSessions[0]?.mentor.name || "Mentor"}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full bg-indigo-200 rounded-full filter blur-xl opacity-30 animate-pulse"></div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-3 py-1 bg-gray-900 text-gray-100 rounded-full text-xs font-semibold shadow-sm">
                            Featured
                          </span>
                          <span className="text-indigo-600 text-sm">
                            Live Session
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                          {amaSessions[0]?.title || "Loading session..."}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2 mb-4">
                          <span className="font-medium">
                            {amaSessions[0]?.mentor.name || "Expert Mentor"}
                          </span>
                          <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                          <span>
                            {amaSessions[0]?.mentor.role || "Industry Expert"}
                          </span>
                        </p>

                        <div className="mb-5 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                              <Calendar
                                size={16}
                                className="text-gray-700"
                              />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                {amaSessions[0]?.date || "Upcoming"} •{" "}
                                {amaSessions[0]?.time || "7:00 PM IST"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {amaSessions[0]?.duration || "60 minutes"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shadow-sm">
                              <Users2 size={16} className="text-gray-700" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-700">
                                  {amaSessions[0]?.registrants || 0}/
                                  {amaSessions[0]?.maxRegistrants || 50}{" "}
                                  registered
                                </p>
                                <p className="text-xs text-indigo-600 font-medium">
                                  {(amaSessions[0]?.maxRegistrants || 50) -
                                    (amaSessions[0]?.registrants || 0)}{" "}
                                  spots left
                                </p>
                              </div>
                              <div className="w-full mt-1 bg-gray-100 rounded-full h-1.5 overflow-hidden shadow-inner">
                                <div
                                  className="h-1.5 rounded-full bg-gray-700"
                                  style={{
                                    width: `${
                                      ((amaSessions[0]?.registrants || 0) /
                                        (amaSessions[0]?.maxRegistrants ||
                                          50)) *
                                      100
                                    }%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            navigate(`/questions/${amaSessions[0]?._id}`)
                          }
                          className="px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg font-medium hover:shadow-lg shadow-gray-200/50 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                        >
                          Register for Session
                          <ArrowRight
                            size={16}
                            className="transform group-hover:translate-x-0.5 transition-transform"
                          />
                        </button>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 shadow-sm">
                      <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                        <MessageCircle size={16} className="text-indigo-600" />
                        <span>Topics You'll Explore</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(
                          amaSessions[0]?.questions || [
                            "Career growth in tech",
                            "Building successful products",
                            "Leadership skills",
                          ]
                        )
                          .slice(0, 4)
                          .map((question, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-gray-500 flex-shrink-0"></span>
                              <p className="text-sm text-gray-700">
                                {question}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Right side - upcoming sessions list */}
                  <div className="bg-white rounded-tr-2xl rounded-br-2xl md:rounded-bl-2xl md:rounded-tl-none p-8 relative border-l border-gray-200">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-gray-600 to-gray-800"></div>
                    <div className="mb-5">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Calendar size={18} className="text-gray-700" />
                        Upcoming Sessions
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Don't miss these exciting opportunities
                      </p>
                    </div>

                    <div className="space-y-8">
                      {amaSessions.slice(1, 4).map((session, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl hover:bg-gray-50 transition-colors border border-gray-200 group cursor-pointer shadow-sm hover:shadow-md"
                          onClick={() =>
                            navigate(`/questions/${session._id}`)
                          }
                        >
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shadow-sm">
                                <img
                                  src={session.mentor.image}
                                  alt={session.mentor.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 line-clamp-1 mb-1 group-hover:text-gray-900 transition-colors">
                                {session.title}
                              </h4>
                              <p className="text-xs text-gray-500 mb-2">
                                with{" "}
                                <span className="text-gray-700">
                                  {session.mentor.name}
                                </span>
                              </p>

                              <div className="flex justify-between items-center text-xs">
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Calendar
                                    size={12}
                                    className="text-gray-500"
                                  />
                                  <span>{session.date}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Clock
                                    size={12}
                                    className="text-gray-500"
                                  />
                                  <span>{session.time}</span>
                                </div>
                                <div className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full font-medium shadow-sm">
                                  {session.maxRegistrants -
                                    session.registrants}{" "}
                                  spots
                                </div>
                              </div>
                            </div>

                            <div className="ml-2 transition-transform transform translate-x-0 group-hover:translate-x-1 flex-shrink-0">
                              <ArrowRight
                                size={16}
                                className="text-gray-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={() => navigate("/ama")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                      >
                        <span>See all AMA sessions</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AskMeAnything;