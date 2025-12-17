'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { IconCircleInfo } from 'nucleo-glass';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className='absolute top-2 right-10'>
        <Link href="$" target='_blank'>
          <div className='w-fit h-fit rounded-full bg-neutral-300 flex justify-center items-center'>
            <IconCircleInfo className='text-black' size={20} />
          </div>
        </Link>
      </div>
      <Navbar />
      <Hero />
      <BottomSection />
    </main>
  );
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const links = ["Stories", "Creators", "Community", "Subscribe"];
  return (
    <nav className="flex items-center justify-between py-8 max-w-4xl mx-auto px-2 relative">
      <div className="font-serif text-3xl font-medium tracking-tight z-50 relative">Lens</div>

      <ul className="hidden md:flex items-center space-x-8 text-sm font-regular text-neutral-600">
        {links.map((link) => (
          <li key={link}>
            <Link href={`#${link.toLowerCase()}`} className="hover:text-black transition-colors">
              {link}
            </Link>
          </li>
        ))}
      </ul>

      <button
        className="md:hidden z-50 relative p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center space-y-8 md:hidden animate-in fade-in duration-200">
          {links.map((link) => (
            <Link
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-2xl font-serif text-gray-900 hover:text-gray-600 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="px-6 mb-20">
      <div className="max-w-7xl mx-auto bg-neutral-100/80 rounded-[10px] px-6 py-32 md:py-40 text-center relative overflow-hidden">

        <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mb-8">
          Welcome to Lens
        </p>

        <h1 className="font-serif text-2xl md:text-6xl lg:text-[4vw] leading-[1.2] text-gray-900 max-w-5xl mx-auto">
          Creator stories that{" "}
          <span className="inline-flex items-center mx-1 align-middle">
            <GlassRocket  />
          </span>
          {" "}
          <span className="relative inline-block border-b-2 border-dashed border-red-300 pb-1 hover:border-red-500 transition-colors cursor-pointer">
            inspire
          </span>
          ,{" "}
          <br className="hidden md:block" />
          <span className="inline-flex items-center mx-1 align-middle">
            <GlassEasel />
          </span>
          <span className="relative inline-block border-b-2 border-dashed group border-blue-300 pb-1 hover:border-blue-500 transition-colors cursor-pointer">
            inform
          </span>
          , and{" "}
          <span className="inline-flex items-center mx-1 align-middle">
            <GlassRobot />
          </span>
          <span className="relative inline-block border-b-2 border-dashed border-purple-300 pb-1 hover:border-purple-500 transition-colors cursor-pointer">
            entertain
          </span>
        </h1>
      </div>
    </section>
  );
};

const BottomSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

        <div className="md:col-span-3">
          <p className="text-[10px] font-bold tracking-[0.1em] text-gray-500 uppercase mb-4">
            Get Started
          </p>
          <h2 className="font-serif text-3xl tracking-[0.01em] text-gray-900">
            Dive in by topic, series, or creator
          </h2>
          <div className="h-px w-full bg-gray-200 mt-8"></div>
        </div>

        <div className="md:col-span-9">
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-serif text-3xl text-neutral-900">Latest</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="#art" className="group cursor-pointer block">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-gray-200">
                <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200 via-yellow-100 to-blue-200 opacity-80 group-hover:scale-105 transition-transform duration-500"></div>
                <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')]"></div>
              </div>
              <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">Art & Design</p>
              <h3 className="font-serif text-xl font-medium text-neutral-600 group-hover:underline decoration-gray-300 underline-offset-4">
                The resurgence of abstract expressionism in digital media
              </h3>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};


const GlassRocket = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block w-8 h-8 lg:w-14 lg:h-14 -mt-2 mr-1 bg-red-300 rounded-sm -rotate-20 p-1 hover:rotate-0 transform duration-300 ease-inOut shadow-neutral-600/50 shadow-sm">
    <defs>
      <linearGradient id="rocketGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FECACA" />
        <stop offset="1" stopColor="#EF4444" />
      </linearGradient>
    </defs>
    <path d="M12 2C12 2 11 8 6 12C6 12 4 14 4 16C4 18.2091 5.79086 20 8 20C10 20 12 18 12 18C16 13 22 12 22 12C22 12 18 6 12 2Z" fill="url(#rocketGrad)" fillOpacity="0.4" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 12L18 18" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GlassEasel = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block w-8 h-8 lg:w-14 lg:h-14 -mt-2 mr-1 bg-blue-300 rounded-sm p-1 rotate-15 hover:rotate-0 transform duration-300 ease-inOut shadow-neutral-600/50 shadow-sm">
    <defs>
      <linearGradient id="easelGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#BFDBFE" />
        <stop offset="1" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <path d="M4 6H20" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6 6V18C6 18.5523 6.44772 19 7 19H17C17.5523 19 18 18.5523 18 18V6" fill="url(#easelGrad)" fillOpacity="0.4" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 22L8 19" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 22L16 19" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="2" fill="#3B82F6" fillOpacity="0.2" />
  </svg>
);

const GlassRobot = () => (
  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block w-8 h-8 lg:w-14 lg:h-14 -mt-2 mr-1 bg-purple-300 rounded-sm -rotate-10 p-1 hover:rotate-0 transform duration-300 ease-inOut shadow-neutral-600/50 shadow-sm">
    <defs>
      <linearGradient id="robotGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E9D5FF" />
        <stop offset="1" stopColor="#A855F7" />
      </linearGradient>
    </defs>
    <rect x="4" y="8" width="16" height="12" rx="2" fill="url(#robotGrad)" fillOpacity="0.4" stroke="#9333EA" strokeWidth="1.5" />
    <path d="M8 4L12 8L16 4" stroke="#9333EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9 13H10" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 13H15" stroke="#9333EA" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 17C10 17 11 18 12 18C13 18 14 17 14 17" stroke="#9333EA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 2L12 8" stroke="#9333EA" strokeWidth="1.5" />
    <path d="M2 12H4" stroke="#9333EA" strokeWidth="1.5" />
    <path d="M20 12H22" stroke="#9333EA" strokeWidth="1.5" />
  </svg>
);
