'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Product Designer',
    content: 'SketchFlow has completely replaced our physical whiteboard. The hand-drawn feel makes diagrams look less intimidating and more collaborative.',
    avatar: 'SC'
  },
  {
    name: 'Mark Davis',
    role: 'Tech Lead',
    content: 'The real-time collaboration features are best in class. No lag, simple UI, and it just works. Highly recommended for remote teams.',
    avatar: 'MD'
  },
  {
    name: 'Jessica Lee',
    role: 'Scrum Master',
    content: 'We use this for every retrospective. It’s intuitive enough that non-technical team members jump right in without training.',
    avatar: 'JL'
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Loved by teams everywhere</h2>
          <p className="text-lg text-slate-600">Don't just take our word for it.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow"
            >
              <div className="flex gap-1 mb-4 text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" className="w-4 h-4" />)}
              </div>
              <p className="text-slate-700 mb-6 leading-relaxed">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{t.name}</div>
                  <div className="text-sm text-slate-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}