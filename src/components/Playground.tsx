import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Type, Palette, MousePointer2 } from './AnimatedIcons';
import FeedbackButton from './FeedbackButton';
import { SectionIntro } from './SectionIntro';
import { useSectionMotion } from '../hooks/useSectionMotion';
import { useMotionPreference } from '../hooks/useMotionPreference';

const studies = [
  { title: 'Typography', icon: Type, label: 'Find a comfortable rhythm.' },
  { title: 'Contrast', icon: Palette, label: 'Keep the message readable.' },
  { title: 'Feedback', icon: MousePointer2, label: 'An action deserves a response.' },
];
const palette = [{ name: 'White', color: '#ffffff', text: '#000000' }, { name: 'Red', color: '#d60000', text: '#ffffff' }, { name: 'Black', color: '#000000', text: '#ffffff' }];

export default function Aesthetics() {
  const section = useRef<HTMLElement>(null);
  useSectionMotion(section, '.study-shell');
  const [active, setActive] = useState(0);
  const [space, setSpace] = useState(24);
  const [tone, setTone] = useState(0);
  const reduced = useMotionPreference();

  return <section ref={section} id="aesthetics" className="editorial-section">
    <SectionIntro title="Experiments." />
    <div className="study-shell"><div className="study-tabs" role="tablist" aria-label="Design experiments">{studies.map(({ title, icon: Icon }, i) => <button role="tab" id={`study-tab-${i}`} aria-controls="study-panel" aria-selected={active === i} tabIndex={active === i ? 0 : -1} key={title} onClick={() => setActive(i)} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); const next = (i + (event.key === 'ArrowRight' ? 1 : 2)) % 3; setActive(next); document.getElementById(`study-tab-${next}`)?.focus(); } }} className={active === i ? 'active' : ''}><Icon size={19} /><span>{title}</span></button>)}</div>
      <div className="study-canvas" role="tabpanel" id="study-panel" aria-labelledby={`study-tab-${active}`} tabIndex={0}>
      <AnimatePresence mode="wait" initial={false}><motion.div key={active} className="study-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .18 }}>
        <div className="experiment-poster" style={{ backgroundColor: active === 1 ? palette[tone].color : '#d60000', color: active === 1 ? palette[tone].text : '#ffffff' }}><motion.h3 style={{ letterSpacing: active === 0 ? `${-.065 + (space - 12) / 500}em` : '-.045em' }} initial={reduced ? false : { opacity: 0, filter: 'blur(8px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} transition={{ duration: reduced ? 0 : .4, ease: 'easeOut' }}>{['Make', 'Read', 'Feel'][active]}<br /><span>{['space.', 'clearly.', 'it work.'][active]}</span></motion.h3>
          <motion.div className="experiment-detail" animate={{ marginTop: active === 0 ? space : 24 }} transition={{ duration: reduced ? 0 : .2 }}>{active === 2 ? <FeedbackButton className="experiment-save" /> : <p>{studies[active].label}</p>}</motion.div>
        </div>
        <div className="experiment-controls">{active === 0 ? <label className="space-control"><span>Letter spacing</span><input type="range" min="12" max="44" value={space} onChange={event => setSpace(+event.target.value)} aria-label="Adjust letter spacing" /></label> : active === 1 ? <div className="contrast-controls" role="group" aria-label="Background color">{palette.map(({ name, color, text }, i) => <button type="button" key={name} onClick={() => setTone(i)} style={{ backgroundColor: color, color: text }} aria-pressed={tone === i}>{name}</button>)}</div> : <span>Try it again. Every action gets a response.</span>}</div>
      </motion.div></AnimatePresence></div>
    </div>
  </section>;
}
