import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaWhatsapp, FaTelegram, FaFacebookF, FaInstagram, FaXTwitter, FaTiktok } from 'react-icons/fa6';
import { SiThreads } from 'react-icons/si';

export default function SocialSection() {
  const socials = [
    {
      name: "WhatsApp",
      url: "https://wa.me/256785478399",
      icon: <FaWhatsapp size={26} />,
      hoverColor: "hover:border-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)]",
      textColor: "group-hover:text-green-400"
    },
    {
      name: "Telegram",
      url: "https://t.me/+Gd917QQhofRiZGVk",
      icon: <FaTelegram size={26} />,
      hoverColor: "hover:border-blue-500 hover:shadow-[0_0_30px_rgba(59,130,246,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)]",
      textColor: "group-hover:text-blue-400"
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/share/19AvsAsvh6/",
      icon: <FaFacebookF size={26} />,
      hoverColor: "hover:border-blue-600 hover:shadow-[0_0_30px_rgba(37,99,235,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)]",
      textColor: "group-hover:text-blue-500"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/sk_mapesa?igsi=OGlsZmMxdTl2eWJr",
      icon: <FaInstagram size={26} />,
      hoverColor: "hover:border-pink-500 hover:shadow-[0_0_30px_rgba(236,72,153,0.4),inset_0_2px_4px_rgba(255,255,255,0.3)]",
      textColor: "group-hover:text-pink-400"
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/shakurnectorgm2",
      icon: <FaXTwitter size={26} />,
      hoverColor: "hover:border-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3),inset_0_2px_4px_rgba(255,255,255,0.3)]",
      textColor: "group-hover:text-white"
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@sk_mapesa",
      icon: <FaTiktok size={26} />,
      hoverColor: "hover:border-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3),inset_0_2px_4px_rgba(255,255,255,0.3)]",
      textColor: "group-hover:text-white"
    },
    {
      name: "Threads",
      url: "https://www.threads.com/@sk_mapesa_kuwangula?invite=0",
      icon: <SiThreads size={26} />,
      hoverColor: "hover:border-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3),inset_0_2px_4px_rgba(255,255,255,0.3)]",
      textColor: "group-hover:text-white"
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 30 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }} 
      className="w-full max-w-6xl mx-auto py-16 px-6 relative z-10"
    >
      <div className="flex flex-col items-center justify-center gap-10 py-12 relative">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[250px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-wide mb-3">
            Connect with SK Sure Wins
          </h2>
          <p className="text-white/60 text-base md:text-lg">
            Join our community across all platforms for daily updates.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-5 md:gap-6 relative z-10">
          {socials.map((social) => (
            <Link href={social.url} key={social.name} target="_blank" rel="noopener noreferrer">
              <motion.div 
                whileHover={{ y: -5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`group flex items-center gap-4 px-8 py-4 rounded-[2.5rem] bg-white/5 border border-white/20 text-white/90 shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_2px_4px_rgba(255,255,255,0.1)] transition-all duration-300 backdrop-blur-xl ${social.hoverColor}`}
                title={social.name}
              >
                <div className={`transition-colors duration-300 text-white/70 ${social.textColor}`}>
                  {social.icon}
                </div>
                <span className="font-semibold text-lg tracking-wide">{social.name}</span>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
