import figma from '../assets/software/figma.svg';
import illustrator from '../assets/software/illustrator.svg';
import photoshop from '../assets/software/photoshop.svg';
import lightroom from '../assets/software/lightroom.svg';
import html from '../assets/software/html.svg';
import css from '../assets/software/css.svg';
import claude from '../assets/software/claude.svg';
import type { ToolId } from '../lib/typeRush';

export const softwareLogos: Record<ToolId, { name: string; src: string }> = {
  figma: { name: 'Figma', src: figma }, illustrator: { name: 'Illustrator', src: illustrator },
  photoshop: { name: 'Photoshop', src: photoshop }, lightroom: { name: 'Lightroom', src: lightroom },
  html: { name: 'HTML', src: html }, css: { name: 'CSS', src: css }, claude: { name: 'Claude', src: claude },
};
