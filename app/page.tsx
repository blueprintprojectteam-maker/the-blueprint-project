"use client";

import React, { useState, useEffect, useRef } from 'react';

// --- 1. PERFORMANCE COUNT-UP ENGINE WITH SCROLL & HOVER RESET DRIVERS ---
interface CountUpProps {
  target: number;
  duration?: number;
  suffix?: string;
  triggerKey: number; // Used to force-reset animation on hover mutations
}

function AnimatedCounter({ target, duration = 1200, suffix = "", triggerKey }: CountUpProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  // Reset animation states instantly when a hover key changes
  useEffect(() => {
    hasAnimated.current = false;
    setCount(0);
  }, [triggerKey]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        
        if (entry.isIntersecting) {
          // If it comes into view and hasn't animated yet, run the count-up loop
          if (!hasAnimated.current) {
            hasAnimated.current = true;
            let startTimestamp: number | null = null;
            
            const step = (timestamp: number) => {
              if (!startTimestamp) startTimestamp = timestamp;
              const progress = Math.min((timestamp - startTimestamp) / duration, 1);
              const easeProgress = progress * (2 - progress); // easeOutQuad curve
              
              setCount(Math.floor(easeProgress * target));
              
              if (progress < 1) {
                window.requestAnimationFrame(step);
              }
            };
            
            window.requestAnimationFrame(step);
          }
        } else {
          // CRITICAL: When the card leaves the viewport, unlock the animation!
          // This allows it to count up again next time the user scrolls back to it.
          hasAnimated.current = false;
          setCount(0);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [target, duration, triggerKey]);

  return (
    <span ref={elementRef} className="font-mono text-5xl font-black tracking-tighter">
      {count.toLocaleString()}{suffix}
    </span>
  );
}


// --- 2. MAIN APPLICATION LAYER ---
export default function HomePage() {
  // Global App Scroll State Engine
  const [scrolled, setScrolled] = useState(false);
  const [atBottom, setAtBottom] = useState(false);
  const [scrollY, setScrollY] = useState(0); 
  
  // Independent hover reset animation keys for each card block
  const [cardKey1, setCardKey1] = useState(0);
  const [cardKey2, setCardKey2] = useState(0);
  const [cardKey3, setCardKey3] = useState(0);

  // Typewriter Core Loop States
  const words = ["civic network.", "community.", "collective."];
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [blink, setBlink] = useState(true);

  // Scroll Tracking Lifecycle Hook
  useEffect(() => {
    const handleScroll = () => {
      const threshold = 80;
      setScrollY(window.scrollY);
      
      if (window.scrollY > threshold) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const currentScroll = window.scrollY;
      
      if (windowHeight + currentScroll >= documentHeight - 50) {
        setAtBottom(true);
      } else {
        setAtBottom(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Text Cursor blinking simulator hook
  useEffect(() => {
    const cursorTimeout = setTimeout(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearTimeout(cursorTimeout);
  }, [blink]);

  // Typewriter engine string mutation loop
  useEffect(() => {
    if (subIndex === words[index].length + 1 && !isDeleting) {
      const holdTimeout = setTimeout(() => setIsDeleting(true), 2000);
      return () => clearTimeout(holdTimeout);
    }

    if (subIndex === 0 && isDeleting) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const typeTimeout = setTimeout(() => {
      setSubIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, isDeleting ? 40 : 85);

    return () => clearTimeout(typeTimeout);
  }, [subIndex, index, isDeleting]);

  return (
    <div className="bg-[#FCFBF7] text-[#2D2A26] min-h-screen selection:bg-[#FFE066] pb-20">
      
      {/* THE DYNAMIC TRANSITION NAVBAR (TOP REVEAL) */}
      <header className={`fixed top-0 left-0 right-0 h-20 bg-[#FCFBF7]/95 backdrop-blur-md border-b-4 border-[#1E1B18] z-50 transition-all duration-300 transform ${
        scrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="max-w-7xl mx-auto h-full px-6 md:px-12 flex items-center justify-between">
          <div className="font-mono text-sm font-black tracking-widest text-[#1E1B18] uppercase select-none">
            THE BLUEPRINT <span className="font-serif italic lowercase text-[#4F46E5] tracking-normal font-normal ml-0.5">project</span>
          </div>

          <nav className="flex items-center space-x-6 md:space-x-8 font-mono text-xs font-black tracking-widest text-[#1E1B18] uppercase">
            <a href="#why" className="relative py-1 group/link">
              <span>WHY WE EXIST</span>
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FFE066] transform scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left"></span>
            </a>
            <a href="#process" className="relative py-1 group/link">
              <span>OUR INITIATIVES</span>
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#06D6A0] transform scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left"></span>
            </a>
            <a href="#impact" className="relative py-1 group/link">
              <span>IMPACT</span>
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#4F46E5] transform scale-x-0 group-hover/link:scale-x-100 transition-transform origin-left"></span>
            </a>
            <span className="text-[#1E1B18]/20 font-light hidden sm:inline">|</span>
            <a href="https://forms.gle/bQGm7TFNKk7EDegi8" target="_blank" rel="noopener noreferrer" className="bg-[#4F46E5] text-white border-2 border-[#1E1B18] px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_#1E1B18] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#1E1B18] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all duration-70 tracking-wider text-[11px]">
              GET INVOLVED ↗
            </a>
          </nav>
        </div>
      </header>


      {/* 1. CINEMATIC FULL-SCREEN LANDING SECTION */}
      <section className="relative overflow-hidden min-h-screen w-full flex flex-col justify-center items-center px-6 text-center bg-gradient-to-b from-[#FCFBF7] to-[#F4F1EA] py-20">
        
        {/* FIXED PARALLAX LAYER */}
        <div 
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
          className="absolute inset-0 bg-[linear-gradient(to_right,#EAE7DF_1px,transparent_1px),linear-gradient(to_bottom,#EAE7DF_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40 pointer-events-none transform-gpu"
        ></div>

        <div className="max-w-6xl mx-auto relative z-10 w-full flex flex-col items-center justify-center">
          <div className="font-mono text-[10px] md:text-xs font-black tracking-[0.2em] text-[#1E1B18]/50 uppercase max-w-md bg-[#1E1B18]/5 px-3 py-1.5 rounded-md border border-[#1E1B18]/10 mb-8 animate-pulse">
            // [notice]: team page is in progress as we prepare to launch
          </div>

          <h1 className="font-mono text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-[#1E1B18] uppercase leading-none mb-8 select-none flex flex-col items-center">
            <span className="block text-center">THE BLUEPRINT</span>
            <span className="font-serif italic lowercase tracking-tight text-[#4F46E5] font-normal block mt-1">project</span>
          </h1>

          <div className="text-2xl sm:text-3xl md:text-4xl text-[#5C554E] font-mono font-bold tracking-tight max-w-4xl min-h-[4rem] flex flex-wrap justify-center items-center mb-12">
            <span className="text-[#1E1B18]">WE are a student-led&nbsp;</span>
            <span className="text-[#4F46E5] border-b-4 border-[#1E1B18] pb-1">
              {`${words[index].substring(0, subIndex)}`}
              <span className={`font-light text-[#1E1B18] ml-1 ${blink ? 'opacity-100' : 'opacity-0'}`}>|</span>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
            <a href="#why" className="w-full sm:w-auto px-10 py-5 bg-[#4F46E5] text-white font-black tracking-wide rounded-2xl border-2 border-[#1E1B18] shadow-[5px_5px_0px_0px_#1E1B18] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#1E1B18] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all duration-70 text-xl">
              Scroll to Explore ↓
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 flex flex-col items-center space-y-1.5 pointer-events-none opacity-60">
          <span className="font-mono text-[9px] tracking-[0.3em] text-[#A39E93] uppercase">SCROLL</span>
          <div className="w-[2px] h-6 bg-[#1E1B18]/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-[#4F46E5] animate-bounce"></div>
          </div>
        </div>
      </section>


      {/* 2. WHY WE EXIST VALUE BLOCKS */}
      <section id="why" className="py-28 px-6 border-t-4 border-b-4 border-dashed border-[#EAE7DF] bg-[#F4F1EA]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-black uppercase tracking-widest text-[#4F46E5] font-mono">The Big Picture</span>
            <h2 className="text-4xl font-black text-[#1E1B18] mt-2">Why We Exist</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white border-4 border-[#1E1B18] p-8 rounded-3xl shadow-[8px_8px_0px_0px_#1E1B18] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_#1E1B18] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all duration-100">
              <div className="w-12 h-12 rounded-2xl bg-[#4F46E5]/10 flex items-center justify-center text-xl font-bold text-[#4F46E5] mb-6 border-2 border-[#4F46E5]/20 font-mono">01</div>
              <h3 className="text-2xl font-black text-[#1E1B18] mb-3">Everyone Has a Place to Start</h3>
              <p className="text-[#5C554E] leading-relaxed">Most students care about their communities, but many don't know how to get involved. Whether you have a project idea or simply want to contribute to a cause you care about, The Blueprint Project provides a place to begin.</p>
            </div>

            <div className="bg-white border-4 border-[#1E1B18] p-8 rounded-3xl shadow-[8px_8px_0px_0px_#1E1B18] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_#1E1B18] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all duration-100 md:-translate-y-2 md:hover:translate-y-[1px] md:hover:shadow-[5px_7px_0px_0px_#1E1B18]">
              <div className="w-12 h-12 rounded-2xl bg-[#FFE066]/20 flex items-center justify-center text-xl font-bold text-[#1E1B18] mb-6 border-2 border-[#FFE066]/40 font-mono">02</div>
              <h3 className="text-2xl font-black text-[#1E1B18] mb-3">More Than One Cause</h3>
              <p className="text-[#5C554E] leading-relaxed">Unlike other student organizations that focus on one specific niche issue, The Blueprint Project was built differently. Instead of asking students to fit into one cause, we bring together students with different passions under one mission: Empowering students to identify problems, create solutions, and make a real difference in their communities while collaborating with others who share a passion for positive change.</p>
            </div>

            <div className="bg-white border-4 border-[#1E1B18] p-8 rounded-3xl shadow-[8px_8px_0px_0px_#1E1B18] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_#1E1B18] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all duration-100">
              <div className="w-12 h-12 rounded-2xl bg-[#06D6A0]/10 flex items-center justify-center text-xl font-bold text-[#06D6A0] mb-6 border-2 border-[#06D6A0]/20 font-mono">03</div>
              <h3 className="text-2xl font-black text-[#1E1B18] mb-3">A Network Without Boundaries</h3>
              <p className="text-[#5C554E] leading-relaxed">You don't need funding, connections, or a large team to get started. Through local chapters and joining our growing national network, we collaborate, share resources, and support one another in creating impact wherever we are.</p>
            </div>
          </div>
        </div>
      </section>


      {/* 3. THE LAB PROCESS METHODOLOGY */}
      <section id="process" className="py-28 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-sm font-black uppercase tracking-widest text-[#06D6A0] font-mono bg-[#06D6A0]/10 px-3 py-1 rounded-md">Our Initiatives</span>
          <h2 className="text-4xl font-black text-[#1E1B18] mt-4">What We Do (and why you should join us ;))</h2>
        </div>

        <div className="relative border-l-4 border-dashed border-[#1E1B18] pl-8 ml-4 space-y-12">
          <div className="relative group cursor-default">
            <div className="absolute -left-[46px] top-0 w-8 h-8 rounded-full bg-[#FFE066] border-2 border-[#1E1B18] flex items-center justify-center font-mono font-black text-xs shadow-[2px_2px_0px_0px_#1E1B18] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">1</div>
            <h4 className="text-xl font-black text-[#1E1B18] mb-2 relative inline-block">
              Find Your Place
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#FFE066] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </h4>
            <p className="text-[#5C554E] max-w-xl">Not every student wants to start a project. Some want to lead, some want to contribute, and some simply want to learn. The Blueprint Project gives every student a place to get involved, regardless of experience, background, or resources.</p>
          </div>

          <div className="relative group cursor-default">
            <div className="absolute -left-[46px] top-0 w-8 h-8 rounded-full bg-[#A78BFA] border-2 border-[#1E1B18] flex items-center justify-center font-mono font-black text-xs text-white shadow-[2px_2px_0px_0px_#1E1B18] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">2</div>
            <h4 className="text-xl font-black text-[#1E1B18] mb-2 relative inline-block">
              Build Something Bigger
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#A78BFA] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </h4>
            <p className="text-[#5C554E] max-w-xl">Join a community of students who care about making a difference. Whether you're tackling a challenge in your school, your city, or your state, you'll work alongside others who share a commitment to turning ideas into action.</p>
          </div>

          <div className="relative group cursor-default">
            <div className="absolute -left-[46px] top-0 w-8 h-8 rounded-full bg-[#F43F5E] border-2 border-[#1E1B18] flex items-center justify-center font-mono font-black text-xs text-white shadow-[2px_2px_0px_0px_#1E1B18] group-hover:translate-x-[1px] group-hover:translate-y-[1px] group-hover:shadow-none transition-all">3</div>
            <h4 className="text-xl font-black text-[#1E1B18] mb-2 relative inline-block">
              Grow With Us
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#F43F5E] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
            </h4>
            <p className="text-[#5C554E] max-w-xl">The Blueprint Project is on the path of becoming one of the biggest student-led organizations by the end of 2026. By joining now, you'll help shape the future of an organization designed to empower students for years to come.</p>
          </div>
        </div>
      </section>


      {/* 4. HIGH-CONTRAST IMPACT METRICS */}
    <section id="impact" className="relative overflow-hidden py-24 px-6 bg-[#1E1B18] text-[#FCFBF7] border-t-4 border-b-4 border-[#1E1B18]">
        <div className="max-w-6xl mx-auto">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-5 pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-1 text-center lg:text-left">
              <span className="font-mono text-xs font-black tracking-[0.3em] text-[#06D6A0] uppercase bg-[#06D6A0]/10 px-3 py-1 rounded-sm border border-[#06D6A0]/20">
                IMPACT SO FAR
              </span>
              <h2 className="text-4xl md:text-5xl font-mono font-black tracking-tight mt-4 leading-tight uppercase">
                OUR WORK <br /> THE PAST YEAR
              </h2>
              <p className="text-[#A39E93] mt-4 font-medium max-w-md mx-auto lg:mx-0">
                
              </p>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
              
              {/* Stat Block 01 - Volunteers */}
              <div 
                onMouseEnter={() => setCardKey1(prev => prev + 1)}
                className="bg-[#FCFBF7] text-[#1E1B18] border-2 border-[#1E1B18] p-6 rounded-2xl shadow-[5px_5px_0px_0px_#FFE066] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#FFE066] transition-all duration-100 flex flex-col items-center sm:items-start cursor-pointer select-none"
              >
                <span className="text-[#4F46E5]">
                  <AnimatedCounter target={120} suffix="+" triggerKey={cardKey1} />
                </span>
                <span className="font-mono text-[10px] font-black tracking-wider text-[#1E1B18]/40 uppercase mt-2">
                  // RECRUITED
                </span>
                <h4 className="text-lg font-black tracking-tight mt-1">Student Volunteers</h4>
              </div>

              {/* Stat Block 02 - People Impacted */}
              <div 
                onMouseEnter={() => setCardKey2(prev => prev + 1)}
                className="bg-[#FCFBF7] text-[#1E1B18] border-2 border-[#1E1B18] p-6 rounded-2xl shadow-[5px_5px_0px_0px_#06D6A0] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#06D6A0] transition-all duration-100 flex flex-col items-center sm:items-start cursor-pointer select-none"
              >
                <span className="text-[#1E1B18]">
                  <AnimatedCounter target={1100} suffix="+" triggerKey={cardKey2} />
                </span>
                <span className="font-mono text-[10px] font-black tracking-wider text-[#1E1B18]/40 uppercase mt-2">
                  // COMMUNITY REACH
                </span>
                <h4 className="text-lg font-black tracking-tight mt-1">People Impacted</h4>
              </div>

              {/* Stat Block 03 - Active Chapters */}
              <div 
                onMouseEnter={() => setCardKey3(prev => prev + 1)}
                className="bg-[#FCFBF7] text-[#1E1B18] border-2 border-[#1E1B18] p-6 rounded-2xl shadow-[5px_5px_0px_0px_#4F46E5] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#4F46E5] transition-all duration-100 flex flex-col items-center sm:items-start cursor-pointer select-none"
              >
                <span className="text-[#4F46E5]">
                  <AnimatedCounter target={14} suffix="+" triggerKey={cardKey3} />
                </span>
                <span className="font-mono text-[10px] font-black tracking-wider text-[#1E1B18]/40 uppercase mt-2">
                  // BLUEPRINTS LAUNCHED
                </span>
                <h4 className="text-lg font-black tracking-tight mt-1">Active Chapters</h4>
              </div>

            </div>
          </div>

        </div>
      </section>


      {/* 5. COHORT REGISTRATION CONTEXT CARD CONTAINER */}
      <section id="join" className="py-24 px-6 max-w-4xl mx-auto">
        <div className="bg-[#FFE066] border-4 border-[#1E1B18] p-12 rounded-[2rem] text-center shadow-[10px_10px_0px_0px_#1E1B18] relative overflow-hidden">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex space-x-4 opacity-20">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-[#1E1B18]" />
            ))}
          </div>

          <h3 className="text-3xl md:text-5xl font-black text-[#1E1B18] mb-4">Want to be involved?</h3>
          <p className="text-lg text-[#1E1B18]/80 mb-8 max-w-xl mx-auto font-medium">
            Applications are open! Click below for the form, and any inquiries can be directed to our email. 
            We can't wait to meet you all :)
          </p>
          
          <div className="flex flex-col items-center space-y-4">
            <a 
              href="https://forms.gle/bQGm7TFNKk7EDegi8" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-block px-10 py-5 bg-[#1E1B18] text-white border-2 border-[#1E1B18] font-black rounded-2xl shadow-[6px_6px_0px_0px_#4F46E5] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_#4F46E5] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none transition-all duration-70 text-lg select-none"
            >
              Become a Blueprint Project Lead! ↗
            </a>
            
            <a 
              href="mailto:blueprintprojectteam@gmail.com" 
              className="font-mono text-xs md:text-sm font-black text-[#1E1B18] hover:text-[#4F46E5] underline underline-offset-4 tracking-wider transition-colors pt-2 block"
            >
              blueprintprojectteam@gmail.com
            </a>
          </div>
        </div>
      </section>


      {/* 6. FIXED REVEAL FOOTER TAB NAVBAR (BOTTOM REVEAL) */}
      <footer className={`fixed bottom-0 left-0 right-0 h-16 bg-[#FCFBF7]/95 backdrop-blur-md border-t-4 border-[#1E1B18] z-50 transition-all duration-300 transform flex items-center shadow-[0_-8px_30px_rgb(0,0,0,0.03)] ${
        atBottom ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}>
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 flex items-center justify-between font-mono text-[10px] sm:text-xs font-black tracking-wider text-[#1E1B18]">
          
          <div className="uppercase hidden sm:block opacity-60">
            © 2026 The Blueprint Project. All rights reserved.
          </div>

          <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
            <a href="#" className="hover:text-[#4F46E5] transition-colors">↑ BACK TO TOP</a>
            <span className="text-[#1E1B18]/20 font-light">•</span>
            <a href="mailto:blueprintprojectteam@gmail.com" className="hover:text-[#06D6A0] transition-colors">CONTACT US</a>
            <span className="text-[#1E1B18]/20 font-light">•</span>
            <a href="https://forms.gle/bQGm7TFNKk7EDegi8" target="_blank" rel="noopener noreferrer" className="text-[#4F46E5] underline underline-offset-4 decoration-2 font-black">
              APPLY NOW ↗
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}