import Link from 'next/link';
import { PenTool, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
            <PenTool className="w-5 h-5" />
            SketchFlow
          </Link>
          <p className="text-sm text-slate-400">
            The collaborative whiteboard for brainstorming and diagramming.
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold text-white mb-4">Product</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white transition">Features</Link></li>
            <li><Link href="#" className="hover:text-white transition">Security</Link></li>
            <li><Link href="#" className="hover:text-white transition">Enterprise</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Resources</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white transition">Documentation</Link></li>
            <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
            <li><Link href="#" className="hover:text-white transition">Community</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="#" className="hover:text-white transition">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-white transition">Terms of Service</Link></li>
          </ul>
          <div className="flex gap-4 mt-6">
            <Github className="w-5 h-5 cursor-pointer hover:text-white" />
            <Twitter className="w-5 h-5 cursor-pointer hover:text-white" />
            <Linkedin className="w-5 h-5 cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>
    </footer>
  );
}