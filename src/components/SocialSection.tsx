import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';

export default function SocialSection() {
  const socials = [
    {
      name: "WhatsApp",
      url: "https://wa.me/256785478399",
      color: "from-green-500 to-green-600",
      icon: <MessageCircle size={28} className="text-white" />,
      tag: "Join Community",
      shadow: "hover:shadow-[0_10px_30px_rgba(34,197,94,0.4)]"
    },
    {
      name: "Telegram",
      url: "https://t.me/+Gd917QQhofRiZGVk",
      color: "from-blue-400 to-blue-600",
      icon: <Send size={28} className="text-white" />,
      tag: "Daily Signals",
      shadow: "hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)]"
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/share/19AvsAsvh6/",
      color: "from-blue-600 to-blue-800",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" width="28" height="28" className="text-white">
          <path d="M22.675 0h-21.35C.595 0 0 .595 0 1.325v21.351C0 23.405.595 24 1.325 24h11.495v-9.294H9.691v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.325-.595 1.325-1.324V1.325C24 .595 23.405 0 22.675 0z"/>
        </svg>
      ),
      tag: "Global Network",
      shadow: "hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)]"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/sk_mapesa?igsi=OGlsZmMxdTl2eWJr",
      color: "from-pink-500 via-red-500 to-yellow-500",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" width="28" height="28" className="text-white">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
        </svg>
      ),
      tag: "Daily Tips",
      shadow: "hover:shadow-[0_10px_30px_rgba(236,72,153,0.4)]"
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/shakurnectorgm2",
      color: "from-gray-800 to-black",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" width="28" height="28" className="text-white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      tag: "Latest Updates",
      shadow: "hover:shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
    },
    {
      name: "Threads",
      url: "https://www.threads.com/@sk_mapesa_kuwangula?invite=0",
      color: "from-gray-700 to-gray-900",
      icon: (
        <svg fill="currentColor" viewBox="0 0 24 24" width="28" height="28" className="text-white">
          <path d="M14.28 15.34a4.4 4.4 0 01-2.28.66c-2.4 0-4.34-1.9-4.34-4.3s1.94-4.3 4.34-4.3c1.7 0 3.2.98 3.93 2.44.2.4.38.86.5 1.36H11.53v1.8h7.02c.03-.23.05-.47.05-.72 0-3.95-3.14-7.16-7.01-7.16-3.87 0-7.01 3.2-7.01 7.16s3.14 7.16 7.01 7.16c1.84 0 3.52-.72 4.78-1.89l-2.09-2.21zm-2.28-5.32c.98 0 1.83.65 2.14 1.54h-4.28c.31-.89 1.16-1.54 2.14-1.54z"/>
        </svg>
      ),
      tag: "Live Discussions",
      shadow: "hover:shadow-[0_10px_30px_rgba(255,255,255,0.15)]"
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }} 
      className="w-full max-w-6xl mx-auto py-20 px-6 relative"
    >
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white uppercase">
          Follow <span className="text-primary">SK Sure Wins</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Join our growing community across all platforms for daily free tips, massive ticket updates, and exclusive winning strategies.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
        {socials.map((social) => (
          <Link href={social.url} key={social.name} target="_blank" rel="noopener noreferrer">
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-br border border-white/10 transition-all cursor-pointer h-full ${social.color} ${social.shadow} relative overflow-hidden group`}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none mix-blend-overlay"></div>
              
              <div className="bg-black/20 p-4 rounded-full mb-4 backdrop-blur-sm border border-white/10 group-hover:bg-black/30 transition-colors">
                {social.icon}
              </div>
              
              <h3 className="text-white font-bold text-lg mb-1">{social.name}</h3>
              <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">{social.tag}</p>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}
