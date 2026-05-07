import { Link } from 'react-router-dom';
import { BookOpen, Mail, MapPin, Hash, AtSign, Rss, GitBranch } from 'lucide-react';

const Footer = () => {
  const links = {
    Product: [
      { label: 'Browse Books', to: '/dashboard' },
      { label: 'Sell a Book', to: '/sell' },
      { label: 'How it Works', to: '/#how-it-works' },
      { label: 'Pricing', to: '/' },
    ],
    Support: [
      { label: 'Help Center', to: '/' },
      { label: 'Contact Us', to: '/' },
      { label: 'Report Issue', to: '/' },
      { label: 'Community', to: '/' },
    ],
    Legal: [
      { label: 'Privacy Policy', to: '/' },
      { label: 'Terms of Service', to: '/' },
      { label: 'Cookie Policy', to: '/' },
    ],
  };

  const social = [
    { icon: Hash, href: '#', label: 'Twitter' },
    { icon: AtSign, href: '#', label: 'Instagram' },
    { icon: Rss, href: '#', label: 'LinkedIn' },
    { icon: GitBranch, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                Campus<span className="text-primary-400">Connect</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5 max-w-xs">
              The trusted marketplace for college students to buy and sell books, notes, and study materials within their campus.
            </p>
            <div className="flex gap-3">
              {social.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center hover:bg-primary-700 transition-colors">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item.label}>
                    <Link to={item.to} className="text-sm text-slate-400 hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CampusConnect. Made with ❤️ for students.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5"><Mail size={14} /> support@campusconnect.in</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
