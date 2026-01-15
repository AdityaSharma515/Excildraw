import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Testimonials from '../components/Testimonials';
import CTA from '../components/CTA';
import CollaborationFeature from '../components/CollaborationFeature';

import Footer from '../components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Stats />
      <CollaborationFeature/>
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}