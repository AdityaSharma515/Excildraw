'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-indigo-600 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden"
        >
          {/* Background circles */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full opacity-50" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-indigo-500 rounded-full opacity-50" />
          </div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to visualize your ideas?
            </h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-2xl mx-auto">
              Join thousands of developers, designers, and managers who use SketchFlow to communicate better.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/app"
                className="inline-flex items-center justify-center bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors"
              >
                Get Started for Free
              </Link>
            </div>
            <p className="mt-6 text-sm text-indigo-200">No credit card required · Open Source</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}