// Loader.tsx
import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import { useLoader } from '../../contexts/LoaderContext';

const Loader = () => {
    const { isLoading } = useLoader();

    if (!isLoading) return null;

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <div style={{ color: 'white' }}><CircularProgress disableShrink /></div>
        </div>
    );
};

export default Loader;
