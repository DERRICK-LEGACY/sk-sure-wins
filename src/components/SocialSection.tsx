import { motion } from 'framer-motion';
import Link from 'next/link';
import { FaWhatsapp, FaTelegram, FaFacebookF, FaInstagram, FaXTwitter, FaTiktok } from 'react-icons/fa6';
import { SiThreads } from 'react-icons/si';

export default function SocialSection() {
  const socials = [
    {
      name: "WhatsApp",
      url: "https://wa.me/256785478399",
      icon: <FaWhatsapp size={24} />,
      hoverColor: "hover:text-green-500 hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.5)]"
    },
    {
      name: "Telegram",
      url: "https://t.me/+Gd917QQhofRiZGVk",
      icon: <FaTelegram size={24} />,
      hoverColor: "hover:text-blue-500 hover:border-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
    },
    {
      name: "Facebook",
      url: "https://www.facebook.com/share/19AvsAsvh6/",
      icon: <FaFacebookF size={24} />,
      hoverColor: "hover:text-blue-600 hover:border-blue-600 hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/sk_mapesa?igsi=OGlsZmMxdTl2eWJr",
      icon: <FaInstagram size={24} />,
      hoverColor: "hover:text-pink-500 hover:border-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]"
    },
    {
      name: "X (Twitter)",
      url: "https://x.com/shakurnectorgm2",
      icon: <FaXTwitter size={24} />,
      hoverColor: "hover:text-white hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@sk_mapesa",
      icon: <FaTiktok size={24} />,
      hoverColor: "hover:text-white hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
    },
    {
      name: "Threads",
      url: "https://www.threads.com/@sk_mapesa_kuwangula?invite=0",
      icon: <SiThreads size={24} />,
      hoverColor: "hover:text-white hover:border-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
    }
  ];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: true, margin: "-50px" }} 
      className="w-full max-w-5xl mx-auto py-16 px-6 relative z-10"
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-8 border-y border-white/5">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-light text-white/90 tracking-wide mb-2">
            Connect with <span className="font-semibold text-white">SK Sure Wins</span>
          </h2>
          <p className="text-white/50 text-sm">
            Join our community across all platforms for daily updates.
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4">
          {socials.map((social) => (
            <Link href={social.url} key={social.name} target="_blank" rel="noopener noreferrer">
              <motion.div 
                whileHover={{ y: -4, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 transition-all duration-300 backdrop-blur-md ${social.hoverColor}`}
                title={social.name}
              >
                {social.icon}
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
