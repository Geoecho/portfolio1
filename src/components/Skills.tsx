import { useRef } from 'react';
import { Figma, Image, PenTool, Camera, Code2, Sparkles } from './AnimatedIcons';
import { SectionIntro } from './SectionIntro';
import { useSectionMotion } from '../hooks/useSectionMotion';

const tools = [
  { name: 'Figma', role: 'Interfaces & systems', note: 'From early flows to reusable components and ready-to-build screens.', icon: Figma },
  { name: 'Illustrator', role: 'Identity & illustration', note: 'Marks, icons, and the visual details that make a product its own.', icon: PenTool },
  { name: 'Photoshop', role: 'Image making', note: 'Compositing, retouching, and a little visual experimentation.', icon: Image },
  { name: 'Lightroom', role: 'Photography & color', note: 'A consistent visual tone, from a single image to a whole collection.', icon: Camera },
  { name: 'HTML & CSS', role: 'Design in the browser', note: 'Responsive layouts and the details that only become clear in code.', icon: Code2 },
  { name: 'Claude', role: 'Rapid prototyping', note: 'Working prototypes to test an idea before committing to it.', icon: Sparkles },
];

export default function Skills() {
  const section = useRef<HTMLElement>(null);
  useSectionMotion(section, '.tool-row');
  return <section ref={section} id="skills" className="editorial-section">
    <SectionIntro title="Tools." />
    <div className="tool-grid">{tools.map(({ name, role, note, icon: Icon }) => <div key={name} className="tool-row">
      <div className="tool-icon"><Icon size={25} strokeWidth={1.6} /></div>
      <div className="tool-copy"><div><h3>{name}</h3><span>{role}</span></div><p>{note}</p></div>
    </div>)}</div>
  </section>;
}
