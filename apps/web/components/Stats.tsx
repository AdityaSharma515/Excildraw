'use client';

import { motion } from 'framer-motion';

const stats = [
  { label: 'Active Users', value: '50K+' },
  { label: 'Drawings Created', value: '1.2M+' },
  { label: 'Teams Collaborating', value: '2,500' },
  { label: 'Uptime', value: '99.9%' },
];

export default function Stats() {
  return (
    <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Added md:gap-0 because we are using borders on desktop for spacing */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-0">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              // Added vertical dividers on desktop
              className="relative text-center md:border-r border-slate-200 dark:border-slate-800 last:border-0 group"
            >
              {/* Subtle hover scale on the numbers */}
              <div className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2 tracking-tight transition-transform duration-300 group-hover:scale-110">
                {stat.value}
              </div>
              <div className="text-slate-600 dark:text-slate-400 font-medium text-sm md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}