'use client';

import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.5rem] bg-indigo-600 dark:bg-indigo-900/80 border border-transparent dark:border-indigo-500/20 px-8 py-16 md:p-20 text-center shadow-2xl shadow-indigo-200 dark:shadow-none"
        >
          {/* Background Decor (Matching Hero Glows) */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/50 dark:bg-indigo-500/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/50 dark:bg-purple-500/20 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Ready to visualize your ideas?
            </h2>
            <p className="text-indigo-100 dark:text-indigo-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
              Join thousands of developers, designers, and managers who use SketchFlow to communicate better.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center gap-2 bg-white dark:bg-slate-950 text-indigo-600 dark:text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Get Started for Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {/* Trust Markers / Microcopy */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-indigo-100 dark:text-indigo-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 opacity-80" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 opacity-80" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 opacity-80" />
                <span>Real-time collaboration</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}