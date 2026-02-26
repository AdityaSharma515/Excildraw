import Link from 'next/link';
import { PenTool, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-12 lg:py-16 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Column (Takes up 2 columns on large screens for better balance) */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 dark:text-white mb-4 transition-colors">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <PenTool className="w-5 h-5 text-white" />
              </div>
              SketchFlow
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6">
              The collaborative virtual whiteboard for sketching hand-drawn like diagrams and brainstorming in real-time.
            </p>
            {/* Moved Social Icons here: Standard SaaS placement */}
            <div className="flex gap-4">
              <Link href="https://github.com/AdityaSharma515" className="text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <Github className="w-5 h-5" />
              </Link>
              <Link href="https://x.com/AadityaSharma51" className="text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="https://www.linkedin.com/in/aditya-sharma-b030a8280/" className="text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
          
          {/* Links Columns */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 transition-colors">Product</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Enterprise</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 transition-colors">Resources</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Community</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Help Center</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-white mb-4 transition-colors">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Row */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm transition-colors">
          <p>© {currentYear} SketchFlow Inc. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>All systems operational</span>
          </div>
        </div>

      </div>
    </footer>
  );
}