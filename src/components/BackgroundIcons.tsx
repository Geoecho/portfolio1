import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  PenTool, Figma, Image as ImageIcon, Layers, Palette, Crop, 
  Frame, Type, Pencil, Brush, Eraser, Scissors, PaintBucket, 
  Wand2, MousePointer2, Move, LayoutTemplate, Component, 
  BoxSelect, Grid, Ruler, Eye, Lock, Focus, Globe
} from 'lucide-react';

const ALL_ICONS = [
  PenTool, Figma, ImageIcon, Layers, Palette, Crop, 
  Frame, Type, Pencil, Brush, Eraser, Scissors, PaintBucket, 
  Wand2, MousePointer2, Move, LayoutTemplate, Component, 
  BoxSelect, Grid, Ruler, Eye, Lock, Focus
];

const GRID_SIZE = 50;
const MAIN_CONTENT_MAX_WIDTH = 1280; // max-w-7xl
const ICON_SIZE = 24;

type IconPosition = {
  id: string;
  x: number;
  y: number;
  Icon: React.ElementType;
  delay: number;
  opacity?: number;
  rainDuration?: number;
  rainDelay?: number;
};

// Simple seeded RNG
function mulberry32(a: number) {
  return function() {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}

export default function BackgroundIcons() {
  const [icons, setIcons] = useState<IconPosition[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [scrollOpacity, setScrollOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth < 1024) {
        // Fade out over the first 600px of scroll for a smoother transition
        // Use a curve to make the fade "smooth" (ease-out feel)
        const scrollRatio = Math.min(1, window.scrollY / 600);
        const opacity = 1 - Math.pow(scrollRatio, 1.5); // Non-linear fade
        setScrollOpacity(Math.max(0, opacity));
      } else {
        setScrollOpacity(1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const calculateIcons = () => {
      const width = window.innerWidth;
      const mobile = width < 1024; // Extended to include tablets
      setIsMobile(mobile);

      // Adjust grid size for mobile to get more icons/better spacing
      // 30 was too tight, 50 is too sparse. 40 is a good balance.
      const gridSize = mobile ? 40 : 50;

      // Use a fixed seed for determinism
      const seed = 123456;
      const random = mulberry32(seed);
      
      const rows = Math.ceil(window.innerHeight / gridSize);
      const cols = Math.ceil(width / gridSize);
      
      // Calculate safe zone (main content)
      const centerX = width / 2;
      const centerY = window.innerHeight / 2;
      const safeZoneHalf = Math.min(width, MAIN_CONTENT_MAX_WIDTH) / 2;
      
      // Desktop: Filter columns that overlap with content
      const availableCols: number[] = [];
      if (!mobile) {
        for (let c = 0; c < cols; c++) {
          const colX = c * gridSize;
          const colCenter = colX + gridSize / 2;
          if (colCenter < centerX - safeZoneHalf || colCenter > centerX + safeZoneHalf) {
              availableCols.push(c);
          }
        }
      } else {
        // Mobile: All columns are available, we filter by ROW (Vertical Safe Zone)
        for (let c = 0; c < cols; c++) availableCols.push(c);
      }

      if (availableCols.length === 0) {
        setIcons([]);
        return;
      }

      // Create a deterministic sequence of columns
      const shuffle = (array: number[], rng: () => number) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
          const j = Math.floor(rng() * (i + 1));
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
      };

      const generatedIcons: IconPosition[] = [];
      let currentPool: number[] = [];
      let prevCol = -1;

      for (let r = 0; r < rows; r++) {
        const rowY = r * gridSize;
        const rowCenter = rowY + gridSize / 2;

        // Mobile Vertical Safe Zone Check
        // Exclude the middle 40% of the screen (30% to 70%)
        // This ensures icons are only at the very top and bottom, ending before the heading
        if (mobile) {
           const safeTop = window.innerHeight * 0.30;
           const safeBottom = window.innerHeight * 0.70;
           if (rowCenter > safeTop && rowCenter < safeBottom) {
             continue; // Skip this row
           }
        }

        if (currentPool.length === 0) {
          currentPool = shuffle(availableCols, random);
        }
        
        // Pick a column
        // Try to avoid same column as previous row to prevent stacking
        let colIndex = currentPool.length - 1;
        let col = currentPool[colIndex];
        
        if (col === prevCol && currentPool.length > 1) {
            // Swap with previous element in pool if strictly repeating
            colIndex = currentPool.length - 2;
            col = currentPool[colIndex];
            
            // Remove the selected one
            currentPool.splice(colIndex, 1);
        } else {
            currentPool.pop();
        }
        
        prevCol = col;
        
        const Icon = ALL_ICONS[col % ALL_ICONS.length];
        
        let baseOpacity = 0;

        if (mobile) {
            // Mobile Opacity: Vertical Gradient from Edge (100%) to Safe Zone (0%)
            // "more visible starting from 100% at top and gradually going down and ending before the heading"
            
            const distFromEdge = Math.min(rowCenter, window.innerHeight - rowCenter);
            const fadeZoneSize = window.innerHeight * 0.30; // Size of the area with icons
            
            // Linear fade: 0 at edge -> 1 at fadeZone limit? No, 1 at edge -> 0 at limit.
            let opacity = 1 - (distFromEdge / fadeZoneSize);
            
            // Clamp 0-1 and ensure it hits 1.0
            baseOpacity = Math.max(0, Math.min(1, opacity));
        } else {
            // Desktop Opacity: Based on distance from center X (Existing logic)
            const dist = Math.abs(col * gridSize + gridSize / 2 - centerX);
            const maxDist = width / 2;
            const minDist = safeZoneHalf;
            let opacityFactor = (dist - minDist) / (maxDist - minDist);
            opacityFactor = Math.max(0, Math.min(1, opacityFactor));
            baseOpacity = 0.15 + (0.45 * Math.pow(opacityFactor, 1.2));
        }
        
        // Generate random rain parameters
        // Faster: 2s to 5s (was 4s to 8s)
        const rainDuration = 2 + random() * 3; 
        const rainDelay = random() * 5;

        generatedIcons.push({
          id: `icon-${r}-${col}`,
          x: col * gridSize + (gridSize - ICON_SIZE) / 2,
          y: r * gridSize + (gridSize - ICON_SIZE) / 2,
          Icon,
          delay: 1.5, 
          opacity: baseOpacity,
          rainDuration,
          rainDelay
        });
      }
      
      setIcons(generatedIcons);
    };

    calculateIcons();
    window.addEventListener('resize', calculateIcons);
    return () => window.removeEventListener('resize', calculateIcons);
  }, []);

  return (
    <div 
      className="fixed inset-0 z-0 overflow-hidden transition-opacity duration-300 ease-out"
      style={{ opacity: isMobile ? scrollOpacity : 1 }}
    >
      {icons.map(({ id, x, y, Icon, opacity, rainDuration, rainDelay }) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 0 }}
          animate={isMobile ? { 
            y: [-50, 140], 
            opacity: [0, opacity, 0] 
          } : { 
            opacity 
          }} 
          transition={isMobile ? {
            duration: rainDuration,
            repeat: Infinity,
            ease: "linear",
            delay: rainDelay
          } : { 
            delay: 1.5, 
            duration: 1.5, 
            ease: "easeOut" 
          }}
          // Desktop-only hover spin
          whileHover={
            isMobile
              ? undefined
              : { rotate: 360, transition: { duration: 0.6, ease: "easeInOut" } }
          }
          whileTap={isMobile ? undefined : { scale: 0.98 }}
          className="absolute text-primary pointer-events-auto"
          style={{ left: x, top: y }}
        >
          <Icon size={ICON_SIZE} />
        </motion.div>
      ))}
    </div>
  );
}
