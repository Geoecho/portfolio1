import { useEffect, useRef, useState, type RefObject } from 'react';
import { animate, motion, useMotionValue } from 'framer-motion';
import { ArrowDown, ArrowRight, Check, RotateCcw } from './AnimatedIcons';
import { useMotionPreference } from '../hooks/useMotionPreference';
import posterFont from '@fontsource-variable/work-sans/files/work-sans-latin-wght-normal.woff2?url';

type Word = { x: number; y: number; size: number; angle: number };
const briefs = [
  { id: 'after-hours', title: 'After hours.', prompt: 'An exhibition after dark. Make it feel unexpected.', words: ['AFTER', 'HOURS'], footer: 'ART AFTER DARK / DOORS OPEN LATE' },
  { id: 'make-noise', title: 'Make some noise.', prompt: 'One night. All volume. Give a music poster its own rhythm.', words: ['MAKE', 'SOME', 'NOISE'], footer: 'ONE NIGHT ONLY / SOUND ON' },
  { id: 'less-better', title: 'Room to think.', prompt: 'A gathering for curious people. Let the space do some talking.', words: ['LESS', 'BUT', 'BETTER'], footer: 'A GATHERING OF IDEAS / ALL WELCOME' },
];
const themes = [
  { name: 'White', background: '#ffffff', ink: '#000000', accent: '#d60000' },
  { name: 'Red', background: '#d60000', ink: '#ffffff', accent: '#ffffff' },
  { name: 'Black', background: '#000000', ink: '#ffffff', accent: '#d60000' },
];
const composition = (count: number, layout: number): Word[] => Array.from({ length: count }, (_, index) => {
  if (layout % 3 === 1) return { x: 8, y: 19 + index * (count === 2 ? 28 : 22), size: 1.12, angle: 0 };
  if (layout % 3 === 2) return { x: index % 2 ? 12 : 7, y: 19 + index * (count === 2 ? 30 : 23), size: 1.05, angle: index % 2 ? 9 : -10 };
  return { x: index % 2 ? 7 : 9, y: (count === 2 ? 27 : 17) + index * (count === 2 ? 28 : 23), size: index % 2 ? 1.16 : 1.08, angle: index % 2 ? 2 : -7 };
});

function PosterWord({ text, word, width, height, canvas, selected, color, onSelect, onChange }: {
  text: string; word: Word; width: number; height: number; canvas: RefObject<HTMLDivElement>; selected: boolean; color: string;
  onSelect: () => void; onChange: (value: Partial<Word>) => void;
}) {
  const x = useMotionValue(word.x * width / 100);
  const y = useMotionValue(word.y * height / 100);
  const reduced = useMotionPreference();
  useEffect(() => {
    const movement = { duration: reduced ? 0 : .5, ease: [.22, 1, .36, 1] as [number, number, number, number] };
    const ax = animate(x, word.x * width / 100, movement);
    const ay = animate(y, word.y * height / 100, movement);
    return () => { ax.stop(); ay.stop(); };
  }, [word.x, word.y, width, height, reduced, x, y]);
  return <motion.button type="button" className="poster-word" aria-label={`Move word ${text}`} aria-pressed={selected} aria-describedby="poster-keyboard-help" data-selected={selected} style={{ x, y, color, fontSize: width * .19 * word.size }} animate={{ rotate: word.angle }} transition={{ duration: reduced ? 0 : .4, ease: [.22, 1, .36, 1] }} drag dragConstraints={canvas} dragElastic={.08} dragMomentum={false} onPointerDown={() => { x.stop(); y.stop(); onSelect(); }} onFocus={onSelect} onDragEnd={() => onChange({ x: x.get() / width * 100, y: y.get() / height * 100 })} whileDrag={{ zIndex: 5 }} onKeyDown={event => {
    const delta: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    const direction = delta[event.key];
    if (!direction) return;
    event.preventDefault();
    const step = event.shiftKey ? 3 : .5;
    onChange({ x: Math.max(0, Math.min(80, word.x + direction[0] * step)), y: Math.max(6, Math.min(85, word.y + direction[1] * step)) });
  }}>{text}</motion.button>;
}

export default function PosterJam() {
  const [briefIndex, setBriefIndex] = useState(0);
  const [layout, setLayout] = useState(0);
  const [words, setWords] = useState<Word[]>(() => composition(briefs[0].words.length, 0));
  const [selected, setSelected] = useState(0);
  const [themeIndex, setThemeIndex] = useState(0);
  const [finished, setFinished] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const canvas = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({ width: 360, height: 450 });
  const reduced = useMotionPreference();
  const brief = briefs[briefIndex];
  const theme = themes[themeIndex];
  const selectedWord = words[selected];
  useEffect(() => {
    const resize = () => { const rect = canvas.current!.getBoundingClientRect(); if (rect.width && rect.height) setBounds({ width: rect.width, height: rect.height }); };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.current!);
    return () => observer.disconnect();
  }, []);
  const editWord = (index: number, value: Partial<Word>) => { setFinished(false); setWords(current => current.map((word, i) => i === index ? { ...word, ...value } : word)); };
  const remix = () => { const next = layout + 1; setLayout(next); setFinished(false); setWords(composition(brief.words.length, next)); };
  const nextBrief = () => { const next = (briefIndex + 1) % briefs.length; setBriefIndex(next); setSelected(0); setLayout(0); setFinished(false); setSaveError(''); setWords(composition(briefs[next].words.length, 0)); };
  const savePoster = async () => {
    setSaving(true); setSaveError('');
    try {
      const response = await fetch(posterFont);
      if (!response.ok) throw new Error('Font unavailable');
      const bytes = new Uint8Array(await response.arrayBuffer());
      const fontData = btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''));
      const measurement = document.createElement('canvas').getContext('2d')!;
      const type = words.map((word, index) => {
        const size = 190 * word.size, x = word.x * 10, y = word.y * 12.5;
        measurement.font = `750 ${size}px "Work Sans Variable"`;
        const textWidth = measurement.measureText(brief.words[index]).width - (brief.words[index].length - 1) * size * .065;
        return `<text x="${x}" y="${y + size * .78}" transform="rotate(${word.angle} ${x + textWidth / 2} ${y + size * .45})" fill="${index === words.length - 1 ? theme.accent : theme.ink}" font-family="PosterWorkSans,Arial,sans-serif" font-size="${size}" font-weight="750" letter-spacing="${size * -.065}">${brief.words[index]}</text>`;
      }).join('');
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1250" viewBox="0 0 1000 1250"><defs><style>@font-face{font-family:PosterWorkSans;src:url(data:font/woff2;base64,${fontData}) format('woff2');font-weight:100 900}</style><clipPath id="poster"><rect width="1000" height="1250"/></clipPath></defs><g clip-path="url(#poster)"><rect width="1000" height="1250" fill="${theme.background}"/><circle cx="${820 - (layout % 2 ? 35000 / bounds.width : 0)}" cy="${290 + (layout % 2 ? 31250 / bounds.height : 0)}" r="210" fill="none" stroke="${theme.accent}" stroke-width="3"/><path d="M80 116H920" stroke="${theme.ink}" stroke-width="2"/><text x="80" y="89" fill="${theme.ink}" font-family="PosterWorkSans,Arial,sans-serif" font-size="22" letter-spacing="2">POSTER JAM / YOUR TAKE</text>${type}<path d="M80 1112H920" stroke="${theme.ink}" stroke-width="2"/><text x="80" y="1157" fill="${theme.ink}" font-family="PosterWorkSans,Arial,sans-serif" font-size="20" letter-spacing="1">${brief.footer}</text></g></svg>`;
      const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
      const link = document.createElement('a');
      link.href = url; link.download = `poster-jam-${brief.id}.svg`; link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { setSaveError('Couldn’t save the poster. Try again.'); }
    finally { setSaving(false); }
  };

  return <div className="study-stage poster-jam-stage">
    <div className="poster-workspace"><div ref={canvas} className="poster-artboard" data-finished={finished} style={{ background: theme.background, color: theme.ink }}>
      <div className="poster-edition" aria-hidden="true"><span>POSTER JAM</span><span>YOUR TAKE</span></div>
      <motion.div className="poster-orbit" aria-hidden="true" style={{ borderColor: theme.accent }} animate={{ x: layout % 2 ? -35 : 0, y: layout % 2 ? 25 : 0 }} transition={{ duration: reduced ? 0 : .7, ease: [.22, 1, .36, 1] }} />
      {brief.words.map((text, index) => <PosterWord key={`${brief.id}-${text}`} text={text} word={words[index]} width={bounds.width} height={bounds.height} canvas={canvas} selected={!finished && selected === index} color={index === brief.words.length - 1 ? theme.accent : theme.ink} onSelect={() => setSelected(index)} onChange={value => editWord(index, value)} />)}
      <div className="poster-colophon" aria-hidden="true">{brief.footer}</div>
      {finished && <motion.div className="poster-finished-stamp" initial={reduced ? false : { opacity: 0, y: 18, rotate: -12 }} animate={{ opacity: 1, y: 0, rotate: -7 }} transition={{ duration: reduced ? 0 : .5, ease: [.22, 1, .36, 1] }}>MADE BY YOU.</motion.div>}
    </div><p id="poster-keyboard-help" className="poster-help">Drag the words. Arrow keys move the selected word.</p></div>
    <div className="poster-direction">
      <span className="poster-brief-label">The brief</span><h3>{brief.title}</h3><p className="poster-prompt">{brief.prompt}</p>
      <div className="poster-word-picker" role="group" aria-label="Select a word">{brief.words.map((text, index) => <button type="button" key={text} aria-pressed={selected === index} onClick={() => setSelected(index)}>{text}</button>)}</div>
      <div className="poster-dials"><label><span>Scale <span>{Math.round(selectedWord.size * 100)}%</span></span><input type="range" min="65" max="130" value={Math.round(selectedWord.size * 100)} onChange={event => editWord(selected, { size: +event.target.value / 100 })} aria-label="Selected word scale" /></label><label><span>Angle <span>{Math.round(selectedWord.angle)}°</span></span><input type="range" min="-20" max="20" value={selectedWord.angle} onChange={event => editWord(selected, { angle: +event.target.value })} aria-label="Selected word angle" /></label></div>
      <div className="poster-palette" role="group" aria-label="Poster background">{themes.map((item, index) => <button type="button" key={item.name} className="poster-swatch" style={{ background: item.background }} aria-label={`${item.name} poster`} aria-pressed={themeIndex === index} onClick={() => { setThemeIndex(index); setFinished(false); }} />)}<button type="button" className="text-link poster-remix" onClick={remix}>Remix layout <RotateCcw size={17} /></button></div>
      <div className="poster-actions"><button type="button" className="hero-cta" disabled={saving} onClick={() => finished ? void savePoster() : setFinished(true)}>{saving ? 'Saving…' : finished ? 'Save poster' : 'Make it yours'}{finished ? <ArrowDown size={18} /> : <Check size={18} />}</button><button type="button" className="text-link" onClick={nextBrief}>New brief <ArrowRight size={18} /></button></div>
      <p className="poster-outcome" role="status">{saveError || (finished ? 'Your composition. Ready to keep as an SVG.' : 'A few ingredients. Your point of view.')}</p>
    </div>
  </div>;
}
