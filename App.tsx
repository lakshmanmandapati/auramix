import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { GlobeScene } from './components/ParticleGlobe';
import { Sections } from './components/Sections';

const App: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-[#030005] text-white font-sans overflow-x-hidden selection:bg-purple-500/30">
        
        {/* Fixed Navbar - Floating at top with high z-index */}
        <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-6 px-4 pointer-events-none">
            <div className="pointer-events-auto w-full max-w-7xl transition-all duration-300">
                <Navbar />
            </div>
        </div>

        {/* Fixed Ambient Background Glows */}
        <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[150px] pointer-events-none z-0" />
        <div className="fixed bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-900/10 blur-[150px] pointer-events-none z-0" />
        
        {/* Scrollable Content Wrapper */}
        <div className="relative w-full z-10 flex flex-col items-center pt-24 sm:pt-28 md:pt-32 px-3 sm:px-5 lg:px-8">
            
            {/* Hero Section Container (Glass) */}
            <div className="relative w-full max-w-[1400px] h-auto md:h-[85vh] min-h-[600px] md:min-h-[700px] bg-white/[0.02] backdrop-blur-2xl rounded-[2rem] sm:rounded-[3rem] border border-white/5 shadow-2xl flex flex-col overflow-hidden mb-10 sm:mb-12 mt-4 -mx-3 sm:-mx-5 lg:-mx-8">
                
                {/* Hero Content Area */}
                <div className="flex-1 flex flex-col md:flex-row items-center relative gap-8 md:gap-0">
                    
                    {/* Text Content (Left) */}
                    <div className="w-full md:w-1/2 h-full flex items-center px-6 sm:px-8 md:pl-20 md:pr-0 py-10 md:py-0 z-20">
                        <Hero />
                    </div>

                    {/* 3D Visualization (Right) */}
                    <div className="w-full md:w-1/2 h-[40vh] sm:h-[45vh] md:h-full relative opacity-80 md:opacity-100 flex items-center justify-center pointer-events-none order-2 md:order-none mt-2 md:mt-0">
                        <div className="w-full h-full scale-100">
                             <GlobeScene />
                        </div>
                    </div>

                </div>
            </div>

            {/* Additional Landing Page Sections */}
            <Sections />

        </div>
    </div>
  );
};

export default App;
