'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/Input';
import { Mail, Lock, User, ArrowRight, Github, Chrome, PenTool } from 'lucide-react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      
      {/* LEFT SIDE: Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-12 xl:p-16 relative z-10">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900 w-fit">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <PenTool className="w-5 h-5 text-white" />
          </div>
          SketchFlow
        </Link>

        {/* Main Form Container */}
        <div className="max-w-md w-full mx-auto my-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-slate-500">
              {isLogin 
                ? 'Enter your details to access your workspace.' 
                : 'Start collaborating with your team in seconds.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode='popLayout'>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                >
                  <Input 
                    label="Full Name" 
                    placeholder="John Doe" 
                    leftIcon={<User className="w-4 h-4" />} 
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <Input 
              label="Email" 
              type="email" 
              placeholder="name@company.com" 
              leftIcon={<Mail className="w-4 h-4" />} 
            />

            <div className="space-y-1">
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                leftIcon={<Lock className="w-4 h-4" />} 
              />
              {isLogin && (
                <div className="flex justify-end">
                  <Link href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </Link>
                </div>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              size="lg" 
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Social Auth Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              <Github className="mr-2 h-4 w-4" /> Github
            </Button>
            <Button variant="outline" className="w-full">
              <Chrome className="mr-2 h-4 w-4" /> Google
            </Button>
          </div>

          {/* Toggle Login/Signup */}
          <p className="mt-8 text-center text-sm text-slate-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              {isLogin ? 'Sign up' : 'Log in'}
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-center text-slate-400">
          © 2024 SketchFlow Inc. All rights reserved.
        </p>
      </div>

      {/* RIGHT SIDE: Decorative Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 relative overflow-hidden items-center justify-center p-12">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-full h-full bg-slate-900 overflow-hidden">
             <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-3xl" />
             <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl" />
        </div>

        {/* Testimonial / Product Preview Card */}
        <motion.div 
          key={isLogin ? 'login-img' : 'signup-img'}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl max-w-lg"
        >
          <div className="mb-6 space-y-2">
            <div className="flex gap-2 mb-4">
               {[...Array(3)].map((_, i) => (
                 <div key={i} className="w-3 h-3 rounded-full bg-white/30" />
               ))}
            </div>
            <div className="h-2 w-3/4 bg-white/20 rounded-full" />
            <div className="h-2 w-1/2 bg-white/20 rounded-full" />
            <div className="h-32 mt-6 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
               <span className="text-white/50 font-mono text-sm">Preview: {isLogin ? 'Dashboard' : 'Onboarding'}</span>
            </div>
          </div>
          
          <blockquote className="text-lg text-white font-medium mb-4">
            "SketchFlow transformed how we brainstorm remotely. It feels like we are all in the same room."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400" />
            <div>
              <div className="text-white font-semibold text-sm">Alex Morgan</div>
              <div className="text-white/50 text-xs">Product Lead @ TechCorp</div>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  );
}