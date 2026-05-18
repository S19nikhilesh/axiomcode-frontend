import React from 'react';
import { Terminal, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import networkBg from '../assets/network-bg.jpg';
import Navbar from './Navbar'; // Apne path ke hisab se import check kar lena bhai

const About = ({ setActiveTab, user, handleLogout }) => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat relative flex flex-col justify-between" 
      style={{ backgroundImage: `url(${networkBg})` }}
    >
      {/* Absolute overlay jo poore screen ko (including navbar area) perfect dark tone dega */}
      <div className="absolute inset-0 bg-zinc-950/85 backdrop-blur-[2px] z-0"></div>

      {/* ✨ NAVBAR INJECTED AS TOP OVERLAY LAYER */}
      <div className="relative z-20 w-full">
        <Navbar 
          activeTab="about" 
          setActiveTab={setActiveTab} 
          user={user} 
          handleLogout={handleLogout} 
        />
      </div>

      {/* Main Hero Grid Content Wrapper */}
      <div className="relative z-10 flex-grow flex items-center justify-center px-6 md:px-16 overflow-hidden">
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
          
          {/* LEFT SIDE: High-Impact Typography & CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-white">
              Master Modern <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Coding Challenges.
              </span>
            </h1>
            
            <p className="text-zinc-400 text-lg max-w-lg leading-relaxed">
              Engineered for elite performance. Run complex algorithms, monitor hidden regression test suites, and compile with sub-2-second precision metrics.
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button 
                onClick={() => setActiveTab('problems')}
                className="btn btn-primary btn-md md:btn-lg rounded-xl shadow-lg shadow-primary/20 gap-2 font-bold group"
              >
                Start Coding Now 
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: Platform Feature Specs */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <div className="w-full max-w-md space-y-6 text-left p-2">
              
              {/* Feature 1 */}
              <div className="flex gap-4 group">
                <div className="space-y-1">
                  <h3 className="text-white font-bold text-base tracking-tight transition-colors group-hover:text-primary">
                    Monaco Code Workspace
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
                    Integrated industrial-grade compiler view featuring real-time syntax checking, shortcuts, and instant error linting.
                  </p>
                </div>
              </div>

              {/* Divider Line */}
              <div className="h-[1px] w-full bg-gradient-to-r from-zinc-800 via-zinc-800/40 to-transparent"></div>

              {/* Feature 2 */}
              <div className="flex gap-4 group">
                <div className="space-y-1">
                  <h3 className="text-white font-bold text-base tracking-tight transition-colors group-hover:text-accent">
                    Isolated Environment Routing
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
                    Run operations execute via independent static buffers, bringing dynamic response latency down under 2 seconds.
                  </p>
                </div>
              </div>

              {/* Divider Line */}
              <div className="h-[1px] w-full bg-gradient-to-r from-zinc-800 via-zinc-800/40 to-transparent"></div>

              {/* Feature 3 */}
              <div className="flex gap-4 group">
                <div className="space-y-1">
                  <h3 className="text-white font-bold text-base tracking-tight transition-colors group-hover:text-emerald-400">
                    Regression Suite Mapping
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
                    Submit pipeline channels your code through full hidden edge-cases with direct, secure state persistence.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* MINIMAL FOOTER SECTION */}
      <footer className="relative z-10 w-full border-t border-zinc-800/40 bg-zinc-950/20 backdrop-blur-sm py-4">
        <div className="max-w-7xl mx-auto px-6 md:px-16 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono text-[11px] text-zinc-500 tracking-wider">
          <div>
            &copy; {new Date().getFullYear()} AxiomCode. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5">
            <span>Crafted by</span>
            <span className="text-zinc-400 font-bold hover:text-primary transition-colors cursor-default">Nikhilesh Sharma</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;