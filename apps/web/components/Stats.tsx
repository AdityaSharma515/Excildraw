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
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-indigo-600 mb-2">
                {stat.value}
              </div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}