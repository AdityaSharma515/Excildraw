'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

export default function CollaborationFeature() {
  return (
    <section 
      id="features" 
      className="py-24 bg-gradient-to-br from-slate-50 via-white to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-hidden relative transition-colors duration-300"
    >
      
      {/* Background decoration: Light Mode Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-30 dark:hidden" 
        style={{ backgroundImage: 'radial-gradient(#6366f1 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}
      />
      {/* Background decoration: Dark Mode Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-10 hidden dark:block" 
        style={{ backgroundImage: 'radial-gradient(#818cf8 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-semibold text-sm mb-8 transition-colors">
              <Zap className="w-4 h-4 fill-current" />
              <span>Real-Time Engine</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight transition-colors">
              Collaboration that feels <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">instant.</span>
            </h2>
            
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed transition-colors">
              Forget "syncing...". See every stroke, cursor movement, and idea as it happens. Our conflict-free replicated data types (CRDTs) ensure everyone is always on the same page.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6 mb-10">
              {[
                { title: 'Zero Latency', desc: 'Changes reflect instantly across all devices.' },
                { title: 'Multi-Cursor', desc: 'See who is doing what with named cursors.' },
                { title: 'Version History', desc: 'Rewind and replay the entire drawing session.' },
                { title: 'Team Permissions', desc: 'Granular control over who views or edits.' },
              ].map((item, index) => (
                <div key={index} className="flex gap-3 group">
                  <div className="mt-1 bg-white dark:bg-slate-900 p-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 group-hover:border-indigo-200 dark:group-hover:border-indigo-500/50 group-hover:shadow-md transition-all">
                    <Sparkles className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 dark:text-white font-bold mb-1 transition-colors">{item.title}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/signup"
              className="group inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-xl shadow-slate-200 dark:shadow-none hover:shadow-2xl hover:-translate-y-1"
            >
              Start Collaborating 
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Image/Demo Section with Light & Dark Mode Effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group perspective-1000 mt-10 lg:mt-0"
          >
            {/* 1. Colorful "Aurora" Glow Behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 rounded-full blur-3xl opacity-60 group-hover:opacity-80 transition-opacity duration-700 animate-pulse" />
            
            {/* 2. Floating container */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-200/50 dark:shadow-black/50 border border-white/60 dark:border-white/10 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm z-10"
            >
              {/* Glossy reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 dark:from-white/5 to-transparent z-20 pointer-events-none" />

              {/* IMAGE */}
              <Image
                src="/collaboration-demo.png" 
                alt="Real-time collaboration demo interface"
                width={1000}
                height={600}
                className="w-full h-auto dark:opacity-90 transition-opacity"
              />
              
              {/* Fake UI: Active Users Bar */}
              <div className="absolute bottom-4 left-4 right-4 h-14 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-xl border border-white/50 dark:border-slate-700/50 shadow-lg z-30 flex items-center px-4 justify-between transition-colors">
                 <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                     {[...Array(4)].map((_,i) => (
                       <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm transition-colors">
                         U{i+1}
                       </div>
                     ))}
                   </div>
                   <span className="text-slate-600 dark:text-slate-300 text-xs font-semibold transition-colors">Editing now...</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <span className="text-xs text-green-600 dark:text-green-400 font-bold uppercase tracking-wider transition-colors">Live</span>
                 </div>
              </div>

            </motion.div>
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}