import React, { useState } from 'react';
import { ArrowDown, ArrowUpRight, Download, Sparkles, CheckCircle2, Cpu, Layout } from 'lucide-react';
import { useAbout } from '../../../hooks/usePortfolio';
import { SocialIconLink } from '../common/SocialIconLink';
import { SkeletonLoader } from '../common/SkeletonLoader';
import { ExpressjsIcon, JavaIcon, NextjsIcon, NodejsIcon, PostgreSQLIcon, ReactIcon, TailwindIcon, ViteIcon } from '../common/Icons';

/* =========================================================================
   VECTOR ICONS FOR 3D CERAMIC TILES
   ========================================================================= */

// function ReactIcon() {
//   return (
//     <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-6 h-6 text-[#00D8FE] fill-current">
//       <circle cx="0" cy="0" r="2.05" />
//       <g stroke="#00D8FE" strokeWidth="1" fill="none">
//         <ellipse rx="11" ry="4.2" />
//         <ellipse rx="11" ry="4.2" transform="rotate(60)" />
//         <ellipse rx="11" ry="4.2" transform="rotate(120)" />
//       </g>
//     </svg>
//   );
// }

// function TailwindIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#38BDF8]">
//       <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
//     </svg>
//   );
// }

// function ViteIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
//       <path d="M21.447 3.535a.8.8 0 0 0-.918-.118L13.14 7.228 9.99 1.488a.8.8 0 0 0-1.393-.016L.577 17.514a.8.8 0 0 0 .707 1.186h6.12l3.435 4.58a.8.8 0 0 0 1.284 0l9.324-19.745z" fill="#9333EA" />
//       <path d="M12.44 2.628l7.65 15.65h-5.27l-2.38-5.35-2.02 5.35H5.85L12.44 2.628z" fill="#FACC15" />
//     </svg>
//   );
// }

// function NextjsIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#000000]">
//       <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.228 17.155l-6.19-8.498v8.498H9.37V6.845h1.768l6.19 8.528V6.845h1.668v10.31h-1.768z" />
//     </svg>
//   );
// }

// function ExpressIcon() {
//   return (
//     <span className="font-mono font-bold text-sm text-[#141416] tracking-tighter select-none">
//       ex
//     </span>
//   );
// }

// function NodeIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#539E43]">
//       <path d="M12 0l10.392 6v12L12 24 1.608 18V6L12 0zm0 2.31L3.608 7.155v9.69L12 21.69l8.392-4.845v-9.69L12 2.31z" />
//       <path d="M11 7h2v10h-2z" />
//     </svg>
//   );
// }

// function JavaIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
//       <path fill="#5382A1" d="M9 20.5c3.5 0 6.5-.5 8.5-1.5-1 .5-3 1-5.5 1-2 0-3-.5-3-.5zm-1.5-2c3.5.5 8 .5 10.5-.5-1 .5-4 1-6.5 1-2.5 0-4-.5-4-.5z" />
//       <path fill="#E76F00" d="M6 14.5s.5 2 6 2 6.5-2 6.5-2c-.5 1-3.5 2.5-6.5 2.5s-5.5-1.5-6-2.5zm6-5c1 1.5 0 3-1.5 4.5 1.5-1 2.5-2.5 1.5-4.5z" />
//     </svg>
//   );
// }

// function PostgresIcon() {
//   return (
//     <svg viewBox="0 0 24 24" className="w-6 h-6 fill-[#336791]">
//       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0 .83-.67 1.5-1.5 1.5S10 17.33 10 16.5V11h3v5.5zm4-3.5h-2V9.5C15 8.67 14.33 8 13.5 8S12 8.67 12 9.5V11H9V9c0-1.66 1.34-3 3-3s3 1.34 3 3v4z" />
//     </svg>
//   );
// }

/* =========================================================================
   3D CERAMIC TILE SQUIRCLE COMPONENT
   ========================================================================= */

function TactileTile({
  icon,
  title,
  tiltClass = "",
  zIndex = "",
  backgroundColor = "bg-gradient-to-b from-[#f5f5f5] to-[#ffffff]",
}) {
  return (
    <div
      title={title}
      className={`
        group isolate relative inline-flex
        h-14 w-14 sm:h-18 sm:w-18
        items-center justify-center
        cursor-pointer select-none
        rounded-2xl transform-gpu
        transition-all duration-300 ease-out
        hover:-translate-y-2 hover:scale-110 hover:z-30
        ${tiltClass} ${zIndex}
      `}
    >
      {/* Dark extruded base */}
      <div
        aria-hidden="true"
        className={`
          absolute inset-0 z-0
          translate-y-[5px]
          rounded-2xl
          brightness-[0.75]
          ${backgroundColor}
        `}
      />

      {/* Ceramic front face */}
      <div
        className={`
          relative z-10
          flex h-full w-full
          items-center justify-center
          overflow-hidden rounded-2xl
         border border-transparent
          transition-transform duration-300
          group-hover:-translate-y-1
          ${backgroundColor}
        `}
        style={{
boxShadow: `
  0 2px 0 rgba(0,0,0,0.06),
  0 5px 10px -4px rgba(0,0,0,0.18),
  inset 0 -2px 3px rgba(0,0,0,0.07)
`,
        }}
      >
        {/* Lighting overlays stay behind the logo */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-0 z-0
            bg-gradient-to-br
            from-white/35 via-transparent to-black/10
          "
        />

        <span
          aria-hidden="true"
          className="
            pointer-events-none absolute z-0
            inset-x-2 top-px h-px
            rounded-full bg-white/90
          "
        />

        {/* SVG logo — explicitly placed above decorative layers */}
        <span
          className="
            tactile-icon relative z-20
            flex h-full w-full
            items-center justify-center
            [&_svg]:block
            [&_svg]:max-h-full
            [&_svg]:max-w-full
          "
        >
          {icon}
        </span>
      </div>
    </div>
  );
}
/* =========================================================================
   MAIN HERO SECTION COMPONENT
   ========================================================================= */

export function HeroSection() {
  const { data: about, isLoading } = useAbout();

  // Mode state: 'frontend' | 'backend'
  const [mode, setMode] = useState('frontend');
  const isFrontend = mode === 'frontend';

  // if (isLoading) {
  //   return (
  //     <section className="pt-28 pb-16 px-4 max-w-6xl mx-auto">
  //       <SkeletonLoader variant="text" count={3} />
  //     </section>
  //   );
  // }

  const socialLinks = about?.social_links || {};

  const scrollToContact = (e) => {
    e.preventDefault();
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToProjects = (e) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'frontend' ? 'backend' : 'frontend'));
  };

  
  // Stack data depending on mode
  const currentStack = isFrontend
    ? [
        { icon: <ReactIcon className="p-2" />, name: 'React', tilt: '-rotate-6', z: 'z-10', backgroundColor: 'bg-gradient-to-b from-[#f5f5f5] to-[#ffffff]' },
        { icon: <TailwindIcon className="p-2" />, name: 'Tailwind CSS', tilt: 'rotate-3', z: 'z-15', backgroundColor: ' bg-gradient-to-b from-[#E0F2FE] to-[#ffffff]' },
        { icon:  <ViteIcon className="p-2" />, name: 'Vite', tilt: '-rotate-3', z: 'z-20', backgroundColor: 'bg-gradient-to-b from-[#8a60ff] to-[#ffffff]' },
        { icon: <NextjsIcon className="p-2" />, name: 'Next.js', tilt: 'rotate-8', z: 'z-25', backgroundColor: 'bg-gradient-to-b from-[#000000] to-[#ffffff]' },
      ]
    : [
        { icon: <ExpressjsIcon className="p-2" />, name: 'Express', tilt: '-rotate-8', z: 'z-10' },
        { icon: <NodejsIcon className="p-3" />, name: 'Node.js', tilt: 'rotate-4', z: 'z-15' },
        { icon: <JavaIcon className="p-3" />, name: 'Java', tilt: '-rotate-4', z: 'z-20' },
        { icon: <PostgreSQLIcon className="p-3" />, name: 'PostgreSQL', tilt: 'rotate-6', z: 'z-25' },
      ];

  return (
    <section id="about" className="pt-24 sm:pt-28 md:pt-36 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      <div className="flex flex-col items-start space-y-8 sm:space-y-10">
        
        {/* Top Tag: "Hey, I'm Vivek" Greeting & Live Status */}
        <div className="flex flex-wrap items-center gap-3">
          {/* <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E7E2DA] shadow-xs text-xs sm:text-sm font-medium text-[#141416]">
            <span>👋</span>
            <span className="font-semibold">Hey, I'm {about?.name || 'Vivek'}</span>
          </div> */}

          {/* <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-mono font-medium text-[#047857]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#059669]"></span>
            </span>
            <span>Available for contracts & engineering roles</span>
          </div> */}
        </div>

        {/* Catchy Display Headline with Inline 3D Tiles and Tactile Gradient Toggle */}
        <div className="w-full">
          <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] font-semibold text-[#141416] tracking-tight leading-[1.12]">
            
            {/* Line 1: Dual-tone muted embossed intro */}
            <span className="block text-[#78716C] font-normal tracking-[-0.025em] leading-[1.1]">
              Hey, I'm Vivek.
            </span>

            {/* Line 2: Smooth + Floating 3D Tiles + Architecture */}
            <span className="inline-flex flex-wrap items-center gap-x-3 sm:gap-x-4 my-1">
              <span>Turning complex</span>

              {/* 3D Tilted Ceramic Badges Cluster */}
              <span className="inline-flex items-center tran -space-x-1.5 sm:-space-x-1.5  px-1 py-1 align-middle">
                {currentStack.map((item, idx) => (
                  <TactileTile
                    key={`${mode}-${item.name}-${idx}`}
                    icon={item.icon}
                    title={item.name}
                    tiltClass={item.tilt}
                    zIndex={item.z}
                    backgroundColor={item?.backgroundColor}
                  />
                ))}
              </span>

              <span>ideas,</span>
            </span>

            {/* Line 3: Including rock-solid */}
            <span className="block text-[#78716C] font-normal">
              from deep core to
            </span>

            {/* Line 4: Tactile Toggle Switch + Dynamic Mode Word */}
            <span className="inline-flex flex-wrap items-center gap-3 sm:gap-4 mt-1">
              
              {/* Interactive 3D Gradient Pill Switch (Inspired by Reference) */}
              <button
                type="button"
                onClick={toggleMode}
                className="group relative inline-flex items-center w-20 sm:w-24 h-10 sm:h-12 rounded-full p-1 cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#C2410C]/40 bg-gradient-to-r from-[#F97316] via-[#F43F5E] to-[#EC4899] shadow-[0_4px_14px_rgba(192,132,252,0.35),inset_0_2px_4px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_20px_rgba(244,63,94,0.45)]"
                title={`Switch to ${isFrontend ? 'Backend' : 'Frontend'} Mode`}
                aria-label="Toggle between Frontend and Backend stacks"
              >
                {/* Subtle track texture ridges */}
                <span className="absolute left-3 text-white/50 text-[10px] font-mono select-none tracking-widest hidden sm:inline">
                  ═
                </span>

                {/* Tactile Sliding 3D Thumb */}
                <span
                  className={`relative flex items-center justify-center w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-white transition-transform duration-300 ease-out shadow-[0_4px_12px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,1)] ${
                    isFrontend ? 'translate-x-10 sm:translate-x-12' : 'translate-x-0'
                  }`}
                >
                  {isFrontend ? (
                    <Layout className="w-4 h-4 text-[#a855f7]" />
                  ) : (
                    <Cpu className="w-4 h-4 text-[#3b82f6]" />
                  )}
                </span>
              </button>

              {/* Mode Text that flips dynamically */}
              <span className="text-[#141416] transition-all duration-300">
                {isFrontend ? 'frontend architecture.' : 'backend architecture.'}
              </span>
            </span>

          </h1>
        </div>



        {/* Action Cluster (Buttons) */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={scrollToProjects}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#141416] text-[#FAF8F5] text-xs font-semibold shadow-xs hover:bg-[#2A2928] cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Explore Selected Works</span>
            <ArrowDown className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={scrollToContact}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#141416] border border-[#E7E2DA] text-xs font-semibold hover:border-[#D6CFC4] hover:bg-[#FAF8F5] cursor-pointer shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Initiate Inquiry</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>

          {about?.resume_url && (
            <a
              href={about.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-full text-[#44403C] hover:text-[#141416] text-xs font-medium transition-colors"
              title="Download Curriculum Vitae"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Curriculum Vitae</span>
            </a>
          )}
        </div>

        {/* Verified Profiles Channels */}
        <div className="pt-2 flex items-center gap-3 border-t border-[#E7E2DA] w-full max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-wider text-[#78716C]">
            // Verified Channels:
          </span>
          <div className="flex items-center gap-2">
            {socialLinks.github && (
              <SocialIconLink type="github" url={socialLinks.github} label="GitHub" />
            )}
            {socialLinks.linkedin && (
              <SocialIconLink type="linkedin" url={socialLinks.linkedin} label="LinkedIn" />
            )}
            {socialLinks.twitter && (
              <SocialIconLink type="twitter" url={socialLinks.twitter} label="Twitter / X" />
            )}
          </div>
        </div>

      </div>
    </section>
  );
}