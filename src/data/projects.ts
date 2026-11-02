import scribblyThumb from '../assets/scribbly-thumb.png';
import scribbly1 from '../assets/scribbly-1.png';
import scribbly2 from '../assets/scribbly-2.png';
import scribbly3 from '../assets/scribbly-3.png';
import cinepickThumb from '../assets/cinepick-thumb.png';
import cinepick1 from '../assets/cinepick-1.png';
import cinepick2 from '../assets/cinepick-2.png';
import cinepick3 from '../assets/cinepick-3.png';
import labThumb from '../assets/lab-thumb.png';

import lab2 from '../assets/lab-2.png';
import lab3 from '../assets/lab-3.png';

import labNew1 from '../assets/lab-new-1.png';
import hootlinkThumb from '../assets/hootlink-thumb.png';
import hootlink1 from '../assets/hootlink-1.png';
import hootlink2 from '../assets/hootlink-2.png';
import hootlink3 from '../assets/hootlink-3.png';
import intecNewThumb from '../assets/intec-new-thumb.png';
import intecNew1 from '../assets/intec-new-1.png';
import intecNew2 from '../assets/intec-new-2.png';

import gridlineThumb from '../assets/gridline-thumb.png';
import gridline1 from '../assets/gridline-1.png';
import gridline2 from '../assets/gridline-2.png';
import gridline3 from '../assets/gridline-3.png';
import anitaHome from '../assets/anita-home.jpg';
import anitaWork from '../assets/anita-work.jpg';
import anitaDetail from '../assets/anita-detail.jpg';
import tempoAdmin from '../assets/tempo/admin.webp';
import tempoShifts from '../assets/tempo/shifts.webp';
import tempoTime from '../assets/tempo/time.webp';
import tempoWelcome from '../assets/tempo/welcome.webp';

export const projects = [
    {
      id: 7,
      name: 'Tempo',
      description: 'A workforce app for planning shifts, coordinating crews, and reviewing hours and estimated pay. Clear views for admins and employees.',
      longDescription: 'Tempo brings shift planning, teams, QR check-ins, and time review into one workforce app. Admins coordinate assignments and review hours and estimated pay; workers see their shifts and check in at their sites. The experience connects a responsive workspace with a clear introduction to the platform, keeping people and their working day in sync.',
      image: tempoWelcome,
      detailImages: [tempoWelcome, tempoAdmin, tempoShifts, tempoTime],
      category: 'App Design',
      url: 'https://tempo-workforce.vercel.app/',
      thumbPadded: true,
    },
    {
      id: 6,
      name: 'Anita Ognjanovska',
      description: 'An art portfolio that gives the paintings room to speak. A personal introduction, an image-led gallery, and a connection to collectors.',
      longDescription: 'A digital home for painter Anita Ognjanovska. The experience moves from an atmospheric introduction into a gallery of paintings, with space to discover the work and the artist behind it. Artwork in real interiors brings scale and context to the collection, while a collector’s list helps visitors stay connected to new releases and exhibitions.',
      image: anitaHome,
      detailImages: [anitaHome, anitaWork, anitaDetail],
      category: 'Website Design',
      url: 'https://www.anitaognjanovska.art/',
      thumbPadded: true,
    },
    {
      id: 0,
      name: 'InTec System',
      description: 'A full redesign of intecsystem.com — modernising an existing IT solutions provider into a conversion-focused platform for enterprise decision-makers.',
      longDescription:
        'InTec System is a live redesign of the existing intecsystem.com website. The goal was to modernise a dated IT services presence into a credible, conversion-focused platform. The redesign clarifies the user journey for complex offerings — virtualization, system integration, and managed infrastructure — through a clean card-based layout, confident typography, and a trusted-partner showcase featuring Cisco, Oracle, AWS, and HP. The responsive result turns a technical offering into an approachable, authoritative digital presence.',
      image: intecNewThumb,
      detailImages: [intecNew1, intecNew2],
      category: 'Website Redesign',
      url: 'https://intecsystems.gridlinelabs.com',
      thumbPadded: true,
    },
    {
      id: -1,
      name: 'Gridline Labs',
      description: 'The studio website for Gridline Labs — a design-led digital agency focused on building purposeful digital products.',
      longDescription:
        'Gridline Labs is the agency behind the design work in this portfolio. The website needed to communicate a clear design-led identity while remaining functional as a business platform — showcasing services, work, and values without unnecessary noise. The design uses confident typography, restrained color, and deliberate whitespace to let the work speak. Every section is built to establish trust quickly and move visitors toward a conversation.',
      image: gridlineThumb,
      detailImages: [gridline1, gridline2, gridline3],
      category: 'Website Design',
      url: 'https://gridlinelabs.com',
      thumbPadded: true,
    },
    {
      id: 2,
      name: 'Scribbly',
      description: 'An AI-powered note-taking app designed for quick capture — blending typed notes and freehand scribbles in one minimal space.',
      longDescription:
        'Scribbly is an AI-powered note and scribble-taking app built for the way people actually think — messy, fast, and non-linear. The interface keeps friction low so capturing an idea feels instant, whether it\'s typed text or a quick handwritten scrawl. AI assists in organizing and surfacing notes without getting in the way. The design prioritizes a calm, minimal aesthetic that lets the content breathe, making it easy to focus on thinking rather than managing a tool.',
      image: scribblyThumb,
      detailImages: [scribbly1, scribbly2, scribbly3],
      category: 'App Design'
    },
    {
      id: 3,
      name: 'Cinepick',
      description: 'A smart movie generator app that helps users find their next favorite watch through mood-based filtering and personalized discovery.',
      longDescription:
        'Cinepick is a mobile application designed to solve the "what should I watch" paralysis. Instead of endless scrolling, users can generate tailored movie recommendations based on their current mood, preferred genre, and specific filters like year or rating. The interface features a sleek dark mode aesthetic with vibrant accent colors, focusing on high-quality imagery and intuitive controls. It turns the passive act of searching into an engaging, interactive discovery process.',
      image: cinepickThumb,
      detailImages: [cinepick1, cinepick2, cinepick3],
      category: 'App Design'
    },
    {
      id: 4,
      name: 'Laboratorium',
      description: 'A visual identity for a cultural education center in Macedonia, blending industrial grit with retro-educational aesthetics.',
      longDescription:
        'Laboratorium is a cultural education center in Macedonia that bridges the gap between formal and informal learning. The visual identity reflects this mission by combining raw, industrial textures with a retro-educational aesthetic. Using collage-style imagery, bold typography, and a distinct red-and-black color palette, the design captures the spirit of experimentation and hands-on creativity. It’s a space where ideas are tested, and arts and crafts meet practical skills.',
      image: labThumb,
      detailImages: [labNew1, lab2, lab3],
      category: 'Website Design'
    },
    {
      id: 5,
      name: 'Hootlink',
      description: 'A friendly login flow design featuring a playful owl mascot that reacts to user interaction.',
      longDescription:
        'Hootlink is an exploration into emotional design for utility screens. The goal was to transform a standard login process into a moment of delight. The owl mascot serves as a friendly guide, reacting in real-time—peeking when you type your email and covering its eyes when you enter your password. This conceptual flow demonstrates how micro-interactions and character design can build brand affection even in the most functional parts of an application.',
      image: hootlinkThumb,
      detailImages: [hootlink1, hootlink2, hootlink3],
      category: 'Login Screen'
    },
  ];
