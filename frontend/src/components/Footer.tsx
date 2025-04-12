import { Icon } from '@iconify/react';

const Footer = () => {
  const socialLinks = [
    { name: 'twitter', icon: 'mdi:twitter', color: '#1DA1F2', link: '#twitter' },
    { name: 'linkedin', icon: 'mdi:linkedin', color: '#0A66C2', link: '#linkedin' },
    { name: 'github', icon: 'mdi:github', color: '#ffffff', link: '#github' },
    { name: 'instagram', icon: 'mdi:instagram', color: '#E4405F', link: '#instagram' }
  ];

  return (
    <footer className="bg-black text-white py-16 relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent"></div>
      </div>

      {/* Footer content */}
      <div className="max-w-6xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#3730A3] to-blue-500 bg-clip-text text-transparent">
              Mentor<span className="text-white">Hood</span>
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Connect with industry experts and accelerate your career growth through personalized mentorship.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.link}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center 
                    hover:bg-gradient-to-r hover:from-[#3730A3] hover:to-blue-500 
                    transform hover:scale-110 transition-all duration-300 group"
                >
                  <span className="sr-only">{social.name}</span>
                  <Icon 
                    icon={social.icon} 
                    className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors"
                    style={{ color: social.color }}
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-[#3730A3] to-blue-500 bg-clip-text text-transparent">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {['Find a Mentor', 'Become a Mentor', 'Browse Sessions', 'Success Stories'].map((link) => (
                <li key={link}>
                  <a
                    href={`#${link}`}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3730A3] transform scale-0 group-hover:scale-100 transition-transform duration-200" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-[#3730A3] to-blue-500 bg-clip-text text-transparent">
              Resources
            </h3>
            <ul className="space-y-4">
              {['Blog', 'Guides', 'FAQ', 'Community'].map((resource) => (
                <li key={resource}>
                  <a
                    href={`#${resource}`}
                    className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3730A3] transform scale-0 group-hover:scale-100 transition-transform duration-200" />
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-[#3730A3] to-blue-500 bg-clip-text text-transparent">
              Stay Updated
            </h3>
            <div className="space-y-4">
              <p className="text-gray-400">Subscribe to our newsletter for the latest updates and insights.</p>
              <div className="relative group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3730A3] focus:border-transparent transition-all duration-300"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#3730A3] to-blue-500 text-white px-4 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 MentorHood. All rights reserved.
            </p>
            <div className="flex gap-8">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
                <a
                  key={item}
                  href={`#${item}`}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#3730A3]/20 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/20 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
    </footer>
  );
};

export default Footer;