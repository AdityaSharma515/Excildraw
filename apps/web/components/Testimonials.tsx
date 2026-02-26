'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    content: 'SketchFlow has completely replaced our physical whiteboard. The hand-drawn feel makes diagrams look less intimidating and more collaborative.',
    avatar: 'SC',
    gradient: 'from-indigo-500 to-purple-500'
  },
  {
    name: 'Mark Davis',
    role: 'Tech Lead',
    content: 'The real-time collaboration features are best in class. No lag, simple UI, and it just works. Highly recommended for remote teams.',
    avatar: 'MD',
    gradient: 'from-rose-400 to-orange-400'
  },
  {
    name: 'Jessica Lee',
    role: 'Scrum Master',
    content: 'We use this for every retrospective. It’s intuitive enough that non-technical team members jump right in without training.',
    avatar: 'JL',
    gradient: 'from-emerald-400 to-cyan-500'
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      
      {/* Subtle Background Glows (Matching the theme) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden opacity-40 dark:opacity-20">
        <div className="absolute top-40 left-0 w-96 h-96 bg-indigo-200 dark:bg-indigo-600 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-[100px] animate-blob" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight transition-colors"
          >
            Loved by teams <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">everywhere</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400 transition-colors"
          >
            Don't just take our word for it. Here's what our users have to say.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative p-8 bg-slate-50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/30 hover:shadow-xl hover:-translate-y-1 transition-all group overflow-hidden"
            >
              {/* Decorative Quote Watermark */}
              <Quote className="absolute top-6 right-6 w-16 h-16 text-slate-200/50 dark:text-slate-800/50 -rotate-12 transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500" />
              
              <div className="relative z-10">
                <div className="flex gap-1 mb-6 text-yellow-400 dark:text-yellow-500">
                  {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-4 h-4" />)}
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed text-lg transition-colors">
                  "{t.content}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.gradient} flex items-center justify-center text-white font-bold text-sm shadow-md ring-2 ring-white dark:ring-slate-900 transition-all group-hover:scale-105`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white transition-colors">{t.name}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{t.role}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}