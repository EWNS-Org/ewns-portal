import { useState, useEffect, useRef } from 'react';

// Tailwind breakpoints (based on Tailwind's default values)
const breakpoints = {
    sm: '(min-width: 640px)',
    md: '(min-width: 768px)',
    lg: '(min-width: 1024px)',
    xl: '(min-width: 1280px)',
    '2xl': '(min-width: 1536px)',
};

// Function to get the current breakpoint
const getBreakpoint = () => {
    if (window.matchMedia(breakpoints['2xl']).matches) {
        return '2xl';
    } else if (window.matchMedia(breakpoints.xl).matches) {
        return 'xl';
    } else if (window.matchMedia(breakpoints.lg).matches) {
        return 'lg';
    } else if (window.matchMedia(breakpoints.md).matches) {
        return 'md';
    } else if (window.matchMedia(breakpoints.sm).matches) {
        return 'sm';
    } else {
        return 'xs';
    }
};

// Custom hook to get current media query
function useTailwindBreakpoint() {
    const [breakpoint, setBreakpoint] = useState(getBreakpoint);
    const previousBreakpoint = useRef(breakpoint);

    useEffect(() => {
        const handleResize = () => {
            const newBreakpoint = getBreakpoint();
            if (newBreakpoint !== previousBreakpoint.current) {
                previousBreakpoint.current = newBreakpoint; // Update ref to new breakpoint
                setBreakpoint(newBreakpoint); // Only update state if breakpoint changes
            }
        };

        window.addEventListener('resize', handleResize);

        // Initial breakpoint check
        handleResize();

        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // Empty dependency array ensures effect runs only on mount/unmount

    return breakpoint;
}

export default useTailwindBreakpoint;
