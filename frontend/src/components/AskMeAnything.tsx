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
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-gray-50 via-amber-50/20 to-white">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/inspiration-geometry.png')] opacity-[0.03]"></div>
      <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full bg-amber-100/30 filter blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rose-100/20 mix-blend-multiply filter blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-50 text-amber-700 rounded-full text-sm font-medium mb-4 border border-amber-100 shadow-sm">
            <MessageCircle size={16} className="text-amber-600" />
            <span>Learn From The Best</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
            Ask Me Anything Sessions
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
            Join interactive live sessions with industry experts who share
            their insights and answer your burning questions in real-time
          </p>

          <button
            onClick={() => navigate("/ama")}
            className="inline-flex items-center gap-2 px-6 py-3 border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-full text-amber-800 hover:text-amber-900 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-100/40 transition-all group mb-16"
          >
            <span className="font-medium">View All AMA Sessions</span>
            <div className="w-6 h-6 rounded-full bg-amber-200 flex items-center justify-center transform group-hover:translate-x-0.5 transition-all">
              <ArrowRight size={14} className="text-amber-700" />
            </div>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="relative p-1">
            {/* Highlight ring animation */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-200 via-rose-200 to-amber-200 animate-pulse opacity-70 blur-xl"></div>

            {/* Main AMA showcase */}
            <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl p-1 shadow-xl overflow-hidden border border-amber-100">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>

              {/* Featured session - larger display */}
              {amaSessions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5 relative">
                  <div className="bg-gradient-to-br from-white to-amber-50 p-8 md:p-10 rounded-tl-2xl rounded-bl-2xl md:rounded-bl-none md:rounded-tr-none relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-amber-500"></div>
                    <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-amber-400 to-amber-500 md:hidden"></div>

                    {/* Animated spotlight effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-radial-gradient pointer-events-none"></div>

                    <div className="flex items-start gap-5 mb-6">
                      <div className="relative flex-shrink-0">
                        <div className="p-1 bg-white rounded-full shadow-md ring-2 ring-amber-100 z-10 relative">
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
                        <div className="absolute top-0 left-0 w-full h-full bg-amber-200 rounded-full filter blur-xl opacity-30 animate-pulse"></div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">
                            Featured
                          </span>
                          <span className="text-amber-600 text-sm">
                            Live Session
                          </span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-1 line-clamp-2">
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
                            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                              <Calendar
                                size={16}
                                className="text-amber-600"
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
                            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center">
                              <Users2 size={16} className="text-amber-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium text-gray-700">
                                  {amaSessions[0]?.registrants || 0}/
                                  {amaSessions[0]?.maxRegistrants || 50}{" "}
                                  registered
                                </p>
                                <p className="text-xs text-amber-600 font-medium">
                                  {(amaSessions[0]?.maxRegistrants || 50) -
                                    (amaSessions[0]?.registrants || 0)}{" "}
                                  spots left
                                </p>
                              </div>
                              <div className="w-full mt-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className="h-1.5 rounded-full bg-amber-500"
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
                          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg shadow-amber-200/50 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                        >
                          Register for Session
                          <ArrowRight
                            size={16}
                            className="transform group-hover:translate-x-0.5 transition-transform"
                          />
                        </button>
                      </div>
                    </div>

                    <div className="bg-amber-50/70 rounded-xl p-5 border border-amber-100/50">
                      <h4 className="font-medium text-amber-800 mb-3 flex items-center gap-2">
                        <MessageCircle size={16} className="text-amber-600" />
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
                              <span className="w-1.5 h-1.5 mt-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                              <p className="text-sm text-gray-700">
                                {question}
                              </p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Right side - upcoming sessions list */}
                  <div className="bg-white rounded-tr-2xl rounded-br-2xl md:rounded-bl-2xl md:rounded-tl-none p-8 relative">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-rose-400 to-rose-500"></div>
                    <div className="mb-5">
                      <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Calendar size={18} className="text-rose-500" />
                        Upcoming Sessions
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Don't miss these exciting opportunities
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      {amaSessions.slice(1, 4).map((session, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-xl hover:bg-rose-50/50 transition-colors border border-transparent hover:border-rose-100 group cursor-pointer"
                          onClick={() =>
                            navigate(`/questions/${session._id}`)
                          }
                        >
                          <div className="flex items-start gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-white">
                                <img
                                  src={session.mentor.image}
                                  alt={session.mentor.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-gray-800 line-clamp-1 mb-1 group-hover:text-rose-700 transition-colors">
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
                                    className="text-rose-500"
                                  />
                                  <span>{session.date}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600">
                                  <Clock
                                    size={12}
                                    className="text-rose-500"
                                  />
                                  <span>{session.time}</span>
                                </div>
                                <div className="px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full font-medium">
                                  {session.maxRegistrants -
                                    session.registrants}{" "}
                                  spots
                                </div>
                              </div>
                            </div>

                            <div className="ml-2 transition-transform transform translate-x-0 group-hover:translate-x-1 flex-shrink-0">
                              <ArrowRight
                                size={16}
                                className="text-rose-500"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-center">
                      <button
                        onClick={() => navigate("/ama")}
                        className="inline-flex items-center gap-1.5 px-4 py-2 border border-rose-200 bg-rose-50 rounded-lg text-rose-700 hover:bg-rose-100 transition-colors text-sm font-medium"
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