import { motion } from 'framer-motion';
import { Instagram, Twitter, MessageCircle, Send, Facebook } from 'lucide-react';
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
      icon: <Facebook size={28} className="text-white" />,
      tag: "Global Network",
      shadow: "hover:shadow-[0_10px_30px_rgba(37,99,235,0.4)]"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/sk_mapesa?igsi=OGlsZmMxdTl2eWJr",
      color: "from-pink-500 via-red-500 to-yellow-500",
      icon: <Instagram size={28} className="text-white" />,
      tag: "Daily Tips",
      shadow: "hover:shadow-[0_10px_30px_rgba(236,72,153,0.4)]"
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/shakurnectorgm2",
      color: "from-gray-800 to-black",
      icon: <Twitter size={28} className="text-white fill-current" />,
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
