import { motion } from 'framer-motion';
import portrait from '../assets/hristijan-portrait.webp';
import { useMotionPreference } from '../hooks/useMotionPreference';

export default function PortraitMark({ decorative = false }: { decorative?: boolean }) {
  const reduced = useMotionPreference();
  return <motion.svg className="portrait-mark" viewBox="225 146 754 917" role={decorative ? undefined : 'img'} aria-label={decorative ? undefined : 'Illustrated portrait of Hristijan Bristić'} aria-hidden={decorative || undefined} focusable="false"
    initial={reduced ? false : { opacity: 0, y: 8, rotate: -3 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: .3 }}
    whileHover={reduced ? undefined : { rotate: -3, y: -2 }} transition={{ duration: reduced ? 0 : .55, ease: [.22, 1, .36, 1] }}>
    <image href={portrait} width="1254" height="1254" />
  </motion.svg>;
}
