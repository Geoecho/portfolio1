import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isContrast, setIsContrast] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        const updateMousePosition = (e: MouseEvent) => {
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for interactive elements (hover state)
            const isInteractive = target.tagName === 'A' || target.closest('button') || target.closest('[role="button"]');
            setIsHovering(!!isInteractive);

            // Check for red backgrounds (contrast state)
            let el: HTMLElement | null = target;
            let foundRed = false;
            while (el && el !== document.body) {
                if (el.classList.contains('bg-primary')) {
                    foundRed = true;
                    break;
                }
                el = el.parentElement;
            }
            setIsContrast(foundRed);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', updateMousePosition);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <>
            <style>{`
        @media (pointer: fine) {
          body {
            cursor: none;
          }
          a, button, [role="button"] {
            cursor: none;
          }
        }
      `}</style>
            <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
                {/* Center Red Dot (The "Pointer") */}
                <motion.div
                    className={`absolute w-2 h-2 rounded-full top-0 left-0 transition-colors duration-200 ${isContrast ? 'bg-white' : 'bg-[#FF6B6B]'}`}
                    animate={{
                        x: mousePosition.x - 4,
                        y: mousePosition.y - 4,
                        scale: isClicking ? 0.75 : 1
                    }}
                    transition={{ type: 'tween', ease: 'linear', duration: 0 }}
                />

                {/* Following Circle Radius */}
                <motion.div
                    className={`absolute top-0 left-0 rounded-full border transition-colors duration-200 ${isContrast ? 'border-white' : 'border-[#FF6B6B]'}`}
                    animate={{
                        x: mousePosition.x - 16,
                        y: mousePosition.y - 16,
                        width: 32,
                        height: 32,
                        scale: isHovering ? (isClicking ? 1.2 : 1.5) : (isClicking ? 0.8 : 1),
                        opacity: isHovering ? 0.8 : 0.4
                    }}
                    transition={{ type: 'spring', mass: 0.5, stiffness: 400, damping: 28 }}
                />
            </div>
        </>
    );
};

export default CustomCursor;
