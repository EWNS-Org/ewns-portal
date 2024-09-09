// LoaderContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context
interface LoaderContextType {
    isLoading: boolean;
    showLoader: () => void;
    hideLoader: () => void;
}

// Create the context
const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

// Create the provider component
export const LoaderProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const showLoader = () => setIsLoading(true);
    const hideLoader = () => setIsLoading(false);

    return (
        <LoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
            {children}
        </LoaderContext.Provider>
    );
};

// Custom hook to access loader context
export const useLoader = (): LoaderContextType => {
    const context = useContext(LoaderContext);
    if (!context) {
        throw new Error('useLoader must be used within a LoaderProvider');
    }
    return context;
};
