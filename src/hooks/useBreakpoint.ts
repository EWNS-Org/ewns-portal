import { useState, useEffect } from 'react';

// Tailwind breakpoints (based on Tailwind's default values)
const breakpoints = {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
};

// Custom hook to get current media query
function useTailwindBreakpoint() {
    const [breakpoint, setBreakpoint] = useState('');

    useEffect(() => {
        const getBreakpoint = () => {
            if (window.matchMedia(breakpoints['2xl']).matches) {
                setBreakpoint('2xl');
            } else if (window.matchMedia(breakpoints.xl).matches) {
                setBreakpoint('xl');
            } else if (window.matchMedia(breakpoints.lg).matches) {
                setBreakpoint('lg');
            } else if (window.matchMedia(breakpoints.md).matches) {
                setBreakpoint('md');
            } else if (window.matchMedia(breakpoints.sm).matches) {
                setBreakpoint('sm');
            } else {
                setBreakpoint('xs');
            }
        };

        getBreakpoint(); // Set initial breakpoint on load

        // Add event listener for window resize
        window.addEventListener('resize', getBreakpoint);

        // Cleanup the event listener on unmount
        return () => window.removeEventListener('resize', getBreakpoint);
    }, []);

    return breakpoint;
}

export default useTailwindBreakpoint;
