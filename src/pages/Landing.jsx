import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, ArrowRight, Star, BookOpen, TrendingUp, ChevronRight } from 'lucide-react';
import Footer from '../components/layout/Footer';

const testimonials = [
  { name: 'Aanya Kapoor', univ: 'IIT Delhi, CSE 4th Year', text: 'Sold 5 books in just 2 days! CampusConnect made it incredibly easy to find buyers within my campus. Got 70% of the original price back.', rating: 5 },
  { name: 'Rohan Verma', univ: 'DTU, Mechanical 3rd Year', text: 'Found all my 3rd semester books for under ₹500. The sellers are all from my university, so meetings are super convenient!', rating: 5 },
  { name: 'Shreya Singh', univ: 'NSUT, Electronics 2nd Year', text: 'The handwritten notes I bought here were absolute lifesavers during exams. Much better than random PDFs online.', rating: 4 },
];

const features = [
  {
    icon: Shield,
    title: 'Campus-Verified Sellers',
    desc: 'Every seller is verified with a college email ID. Trade confidently within your campus community.',
    color: 'bg-blue-100 text-blue-600',
  },
  {
    icon: Zap,
    title: 'Lightning Fast Deals',
    desc: 'Find a book, message the seller, and meet on campus — all within the same day!',
    color: 'bg-amber-100 text-amber-600',
  },
  {
    icon: Users,
    title: 'Campus-Only Community',
    desc: 'Exclusive to your college. Connect with seniors, juniors, and batchmates.',
    color: 'bg-green-100 text-green-600',
  },
  {
    icon: TrendingUp,
    title: 'Save Up to 80%',
    desc: 'Buy used textbooks and notes at a fraction of the retail price. Keep your wallet happy.',
    color: 'bg-purple-100 text-purple-600',
  },
];

const stats = [
  { value: '12,000+', label: 'Books Listed' },
  { value: '5,000+', label: 'Happy Students' },
  { value: '150+', label: 'Colleges' },
  { value: '₹2M+', label: 'Saved by Students' },
];

const fadeInUp = { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } };

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="hero-gradient min-h-screen flex flex-col items-center justify-center relative overflow-hidden pt-16">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-800/10 rounded-full blur-3xl" />
          {/* Grid */}
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-white/10 text-white/90 border border-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Trusted by 5,000+ students across 150+ campuses
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white leading-tight mb-6"
          >
            Buy & Sell Books
            <br />
            <span className="text-transparent bg-clip-text" style={{
              backgroundImage: 'linear-gradient(135deg, #93C5FD 0%, #60A5FA 50%, #FBBF24 100%)'
            }}>
              Within Your Campus
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Stop overpaying for textbooks. Connect with seniors and batchmates to buy or sell books, notes, and study materials at unbeatable prices.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-white text-primary-800 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              <BookOpen size={22} />
              Explore Books
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 bg-accent-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-accent-600 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95"
            >
              Sell Your Book
              <ChevronRight size={18} />
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 mt-14"
          >
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-3xl font-black text-white">{value}</div>
                <div className="text-sm text-blue-200 mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/50">
          <span className="text-xs">Scroll down</span>
          <div className="w-5 h-8 border-2 border-white/30 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50" id="features">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Why CampusConnect</span>
            <h2 className="text-4xl font-black text-slate-900 mt-2">Built for students, by students</h2>
            <p className="text-slate-500 mt-3 text-lg max-w-xl mx-auto">Everything you need to buy and sell books safely within your campus community.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                {...fadeInUp}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon size={24} />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white" id="how-it-works">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">How it works</span>
            <h2 className="text-4xl font-black text-slate-900 mt-2">Three simple steps</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary-200 to-primary-300 z-0" />
            {[
              { step: '01', title: 'Sign Up with College Email', desc: 'Create an account using your college email. We verify you\'re from the same campus.' },
              { step: '02', title: 'Browse or List Books', desc: 'Search for books you need or list books you\'ve finished using with photos and pricing.' },
              { step: '03', title: 'Meet & Exchange on Campus', desc: 'Chat with the seller, agree on a price, and meet conveniently on your campus.' },
            ].map((s, i) => (
              <motion.div key={s.step} {...fadeInUp} transition={{ delay: i * 0.15 }} className="relative z-10 text-center">
                <div className="w-20 h-20 bg-primary-700 text-white rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-5 shadow-lg">
                  {s.step}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <span className="text-primary-600 font-semibold text-sm uppercase tracking-wider">Student Stories</span>
            <h2 className="text-4xl font-black text-slate-900 mt-2">Loved by thousands of students</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                {...fadeInUp}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.univ}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.h2 {...fadeInUp} className="text-4xl font-black text-white mb-4">
            Ready to save on textbooks?
          </motion.h2>
          <motion.p {...fadeInUp} className="text-blue-200 text-lg mb-8">
            Join 5,000+ students who are already saving big on their study materials.
          </motion.p>
          <motion.div {...fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?mode=register" className="inline-flex items-center gap-2 bg-white text-primary-800 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-xl">
              Get Started Free
              <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all">
              Browse Books
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
