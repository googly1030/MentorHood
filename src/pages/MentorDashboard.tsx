import { Settings2,  Plus, Share2, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Mentor Dashboard</h1>
        
        <p className="text-gray-700 mb-2">
          Welcome to Mentor-Hood! Manage your mentoring sessions and availability here.
          Help shape the future of aspiring developers.
        </p>

        <div className="flex items-center gap-2 mb-8">
          <p className="text-gray-700">Your current timezone:</p>
          <span className="font-medium text-[#4937e8]">Asia/Singapore</span>
          <button className="text-[#4937e8] hover:text-[#4338ca] font-medium">Change</button>
        </div>

        <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Mentoring Sessions</h2>
        <button 
            onClick={() => navigate('/create-session')}
            className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
            <Plus size={20} />
            Create Session Type
        </button>
        </div>

      

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Technical Mentoring */}
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[#4937e8] text-xl">💻</span>
                <h3 className="font-medium text-gray-800">Technical Mentoring</h3>
              </div>
              <button className="text-gray-400 hover:text-[#4937e8]">
                <Settings2 size={20} />
              </button>
            </div>
            <div className="text-gray-600 mb-4">45 mins • Public</div>
            <a href="#" className="text-[#4937e8] hover:text-[#4338ca] block mb-6">Manage Session</a>
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 text-gray-600 hover:text-[#4937e8]">
                <Copy size={18} />
                Copy Link
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-[#4937e8]">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>

          {/* Career Guidance */}
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[#4937e8] text-xl">🎯</span>
                <h3 className="font-medium text-gray-800">Career Guidance</h3>
              </div>
              <button className="text-gray-400 hover:text-[#4937e8]">
                <Settings2 size={20} />
              </button>
            </div>
            <div className="text-gray-600 mb-4">30 mins • Public</div>
            <a href="#" className="text-[#4937e8] hover:text-[#4338ca] block mb-6">Manage Session</a>
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 text-gray-600 hover:text-[#4937e8]">
                <Copy size={18} />
                Copy Link
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-[#4937e8]">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>

          {/* Code Review */}
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-[#4937e8] text-xl">📝</span>
                <h3 className="font-medium text-gray-800">Code Review Session</h3>
              </div>
              <button className="text-gray-400 hover:text-[#4937e8]">
                <Settings2 size={20} />
              </button>
            </div>
            <div className="text-gray-600 mb-4">60 mins • Private</div>
            <a href="#" className="text-[#4937e8] hover:text-[#4338ca] block mb-6">Manage Session</a>
            <div className="flex items-center justify-between">
              <button className="flex items-center gap-2 text-gray-600 hover:text-[#4937e8]">
                <Copy size={18} />
                Copy Link
              </button>
              <button className="flex items-center gap-2 text-gray-600 hover:text-[#4937e8]">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;