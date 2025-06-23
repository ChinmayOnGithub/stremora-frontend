import React, { useRef, useState } from 'react';
import { 
  Play, 
  Upload, 
  Shield, 
  Zap, 
  Github, 
  ExternalLink, 
  Code, 
  Database, 
  Server, 
  Globe, 
  CheckCircle,
  ArrowRight,
  Monitor,
  Smartphone,
  Cloud
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Landing() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 });

  // Subtle lightning/glow effect on hero section
  const handleMouseMove = (e) => {
    const rect = heroRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setGlow({ x, y, opacity: 1 });
  };
  const handleMouseLeave = () => setGlow({ ...glow, opacity: 0 });

  const techStack = [
    { name: 'MongoDB', icon: Database, color: 'text-orange-400' },
    { name: 'Express.js', icon: Server, color: 'text-orange-300' },
    { name: 'React.js', icon: Code, color: 'text-orange-500' },
    { name: 'Node.js', icon: Globe, color: 'text-orange-300' },
    { name: 'Cloudinary', icon: Cloud, color: 'text-orange-200' },
    { name: 'JWT Auth', icon: Shield, color: 'text-orange-400' }
  ];

  const features = [
    {
      icon: Upload,
      title: 'Drag & Drop Upload',
      description: 'Upload videos easily with drag-and-drop and real-time progress.'
    },
    {
      icon: Zap,
      title: 'Fast & Responsive',
      description: 'Optimized for speed, performance, and seamless experience on any device.'
    },
    {
      icon: Shield,
      title: 'Secure by Design',
      description: 'JWT authentication, secure cloud storage, and best security practices.'
    },
    {
      icon: Monitor,
      title: 'Modern UI/UX',
      description: 'Beautiful, accessible, and responsive interface with premium polish.'
    }
  ];

  const howToUse = [
    'Register or log in to your account',
    'Go to Upload and add your video files',
    'Fill in title, description, and tags',
    'Track upload progress in real-time',
    'Manage and share your videos from your dashboard'
  ];

  const handleSmoothScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/40 to-slate-900 transition-colors">
      {/* Header with Logo, App Name, Nav */}
      <nav className="fixed top-0 w-full bg-black/10 backdrop-blur-md border-b border-orange-200/10 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo and App Name */}
            <div className="flex items-center gap-3">
              <img
                src="https://i.ibb.co/fGMbrcL4/video-collection-svgrepo-com.png"
                alt="Stremora Logo"
                className="h-10 w-auto select-none"
                draggable="false"
              />
              <span className="text-2xl font-semibold tracking-wider uppercase font-merriweather text-gray-100 select-none">Stremora</span>
            </div>
            {/* Nav Links */}
            <div className="hidden md:flex items-center space-x-6">
              <a 
                href="#about" 
                onClick={(e) => handleSmoothScroll(e, 'about')}
                className="text-orange-200 hover:text-white transition-colors duration-200 font-medium"
              >
                About
              </a>
              <a 
                href="#tech-stack" 
                onClick={(e) => handleSmoothScroll(e, 'tech-stack')}
                className="text-orange-200 hover:text-white transition-colors duration-200 font-medium"
              >
                Tech Stack
              </a>
              <a 
                href="#how-to-use" 
                onClick={(e) => handleSmoothScroll(e, 'how-to-use')}
                className="text-orange-200 hover:text-white transition-colors duration-200 font-medium"
              >
                How to Use
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Lightning/Glow Effect */}
      <section
        ref={heroRef}
        onMouseMove={undefined}
        onMouseLeave={undefined}
        className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{ minHeight: 420 }}
      >
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-merriweather tracking-wider">
              Stremora<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-200">.io</span>
            </h1>
            <p className="text-xl md:text-2xl text-orange-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              A modern video platform for creators, built with the MERN stack. Secure, fast, and beautiful.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => navigate('/home')}
              className="group bg-gradient-to-r from-orange-900/80 to-orange-700/80 border border-orange-400/40 text-white px-8 py-4 rounded-full font-semibold shadow-lg flex items-center transition-all duration-200 hover:from-orange-800 hover:to-orange-600 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              Launch Demo App
              <ExternalLink className="ml-2 h-5 w-5" />
            </button>
            <a
              href="https://github.com/ChinmayOnGithub/stremora-backend"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/5 border border-white/20 text-white px-8 py-4 rounded-lg font-semibold flex items-center transition-all duration-200 hover:bg-black/40 hover:border-white/40 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <Github className="mr-2 h-5 w-5" />
              View Source Code
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-orange-200/10 hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-orange-400 mb-2">100%</div>
              <div className="text-orange-100">Full-Stack Implementation</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-orange-200/10 hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-orange-300 mb-2">MERN</div>
              <div className="text-orange-100">Modern Tech Stack</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-orange-200/10 hover:bg-white/10 transition-all duration-300">
              <div className="text-3xl font-bold text-orange-200 mb-2">Secure</div>
              <div className="text-orange-100">JWT Authentication</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-merriweather tracking-wider">About the Project</h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Stremora is a full-stack video platform built to showcase my skills in React, Node.js, MongoDB, and modern UI/UX. It features secure authentication, cloud storage, and a beautiful, responsive interface.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Key Achievements</h3>
              <div className="space-y-4">
                {[
                  'Built robust authentication and protected routes',
                  'Designed a scalable REST API and cloud video storage',
                  'Created a modern, accessible, and responsive UI',
                  'Focused on performance, accessibility, and code quality',
                  'Implemented real-time upload progress and error handling',
                  'Applied security best practices and data validation'
                ].map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-orange-400 mt-0.5 flex-shrink-0" />
                    <span className="text-orange-100">{achievement}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-700/10 to-orange-200/10 rounded-2xl p-8 border border-orange-200/10 backdrop-blur-sm w-full flex flex-col items-center">
              <h3 className="text-2xl font-bold text-white mb-6">Technical Highlights</h3>
              <div className="space-y-4 w-full">
                <div className="bg-white/5 rounded-lg p-4 border border-orange-200/10 w-full">
                  <h4 className="font-semibold text-orange-400 mb-2">Frontend Architecture</h4>
                  <p className="text-orange-100 text-sm">Component-based React, hooks, context API, and responsive design</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-orange-200/10 w-full">
                  <h4 className="font-semibold text-orange-300 mb-2">Backend Development</h4>
                  <p className="text-orange-100 text-sm">RESTful API, middleware, and MongoDB data modeling</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4 border border-orange-200/10 w-full">
                  <h4 className="font-semibold text-orange-200 mb-2">Security & Performance</h4>
                  <p className="text-orange-100 text-sm">JWT auth, input validation, file upload optimization, error handling</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section id="tech-stack" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-merriweather tracking-wider">Tech Stack</h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Built with modern, industry-standard technologies and best practices
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {techStack.map((tech, index) => {
              const IconComponent = tech.icon;
              return (
                <div 
                  key={index} 
                  className="group bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-orange-200/10 hover:bg-orange-100/10 hover:shadow-lg hover:border-orange-300/30 transition-all duration-200 text-center relative overflow-hidden"
                  onMouseMove={e => {
                    const card = e.currentTarget;
                    const rect = card.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width) * 100;
                    const y = ((e.clientY - rect.top) / rect.height) * 100;
                    card.style.setProperty('--glow-x', `${x}%`);
                    card.style.setProperty('--glow-y', `${y}%`);
                    card.style.setProperty('--glow-opacity', 1);
                  }}
                  onMouseLeave={e => {
                    const card = e.currentTarget;
                    card.style.setProperty('--glow-opacity', 0);
                  }}
                  style={{
                    '--glow-x': '50%',
                    '--glow-y': '50%',
                    '--glow-opacity': 0,
                  }}
                >
                  {/* Lightning/Glow Effect */}
                  <div
                    className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-200"
                    style={{
                      opacity: 'var(--glow-opacity, 0)',
                      background: `radial-gradient(120px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255,183,77,0.10), transparent 80%)`,
                    }}
                  />
                  <IconComponent className={`h-12 w-12 ${tech.color} mx-auto mb-4 relative z-10`} />
                  <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors relative z-10">
                    {tech.name}
                  </h3>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <div className="bg-gradient-to-br from-orange-400/10 to-orange-200/10 rounded-2xl p-8 border border-orange-200/10 backdrop-blur-sm w-full flex flex-col items-center">
              <h3 className="text-lg font-semibold text-orange-200 mb-5 text-center tracking-wide">Additional Technologies</h3>
              <div className="flex flex-wrap gap-5 justify-center w-full">
                {[ 'Tailwind CSS', 'Axios', 'Multer', 'Bcrypt.js', 'CORS', 'Dotenv', 'Mongoose', 'Nodemon' ].map((tech, index) => (
                  <div
                    key={index}
                    className="bg-white/10 border border-orange-200/10 rounded-lg px-6 py-2 text-center transition-colors duration-150 hover:bg-orange-100/20"
                  >
                    <span className="text-orange-100 font-medium text-base tracking-wide">
                      {tech}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-merriweather tracking-wider">Key Features</h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Comprehensive functionality demonstrating full-stack development capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div 
                  key={index}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-orange-200/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-lg p-3 w-fit mb-6">
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-orange-100 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="how-to-use" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-merriweather tracking-wider">How to Use</h2>
            <p className="text-xl text-orange-100 max-w-3xl mx-auto">
              Simple, intuitive workflow designed for optimal user experience
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              {howToUse.map((step, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="bg-gradient-to-br from-orange-400 to-orange-500 rounded-full w-8 h-8 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-orange-100 leading-relaxed group-hover:text-white transition-colors">
                      {step}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-br from-orange-400/20 to-orange-200/20 rounded-2xl p-8 border border-orange-200/10 backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-white mb-6">User Experience Features</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-orange-400" />
                  <span className="text-orange-100">Mobile-responsive design</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Zap className="h-5 w-5 text-orange-300" />
                  <span className="text-orange-100">Real-time progress tracking</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-orange-300" />
                  <span className="text-orange-100">Secure file handling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Upload className="h-5 w-5 text-orange-200" />
                  <span className="text-orange-100">Drag & drop functionality</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-900/50 to-orange-200/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-merriweather tracking-wider">Ready to Explore?</h2>
          <p className="text-xl text-orange-100 mb-12 max-w-2xl mx-auto">
            Experience the full-stack application and explore the source code to see the implementation details.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/home')}
              className="group bg-gradient-to-r from-orange-900/80 to-orange-700/80 border border-orange-400/40 text-white px-8 py-4 rounded-lg font-semibold shadow-lg flex items-center transition-all duration-200 hover:from-orange-800 hover:to-orange-600 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <ExternalLink className="mr-3 h-6 w-6" />
              Launch Live Demo
            </button>
            <a
              href="https://github.com/ChinmayOnGithub/stremora-backend"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white/5 border border-white/20 text-white px-8 py-4 rounded-lg font-semibold flex items-center transition-all duration-200 hover:bg-black/40 hover:border-white/40 hover:shadow-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black/40 border-t border-orange-200/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <img
                src="https://i.ibb.co/fGMbrcL4/video-collection-svgrepo-com.png"
                alt="Stremora Logo"
                className="h-8 w-auto select-none"
                draggable="false"
              />
              <span className="text-xl font-bold text-white font-merriweather tracking-wider">Stremora</span>
            </div>
            <div className="flex items-center space-x-6">
              <span className="text-orange-200">Built with MERN Stack</span>
              <div className="flex space-x-4">
                <a href="https://github.com/ChinmayOnGithub/stremora-backend" target="_blank" rel="noopener noreferrer" className="text-orange-200 hover:text-white transition-colors">
                  <Github className="h-6 w-6" />
                </a>
                <a href="https://github.com/ChinmayOnGithub/stremora-backend" target="_blank" rel="noopener noreferrer" className="text-orange-200 hover:text-white transition-colors">
                  <ExternalLink className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-orange-200/10 text-center">
            <p className="text-orange-200">
              Developed to showcase full-stack development skills with modern web technologies
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing; 