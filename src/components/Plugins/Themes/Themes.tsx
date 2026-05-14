'use client';

import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import AllThemes from './AllThemes';
import ThemesConfig from './ThemesConfig';
import NimbusConfig from './NimbusConfig';

function Themes() {
    const router = useRouter();
    const navigate = (path: string) => router.push(path);
    const [activeTab, setActiveTab] = useState('Themes');
    const [configuringTheme, setConfiguringTheme] = useState<string | null>(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (1) {
        }
    }, []);


    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
        setConfiguringTheme(null);
    };

    const handleConfigureTheme = (themeName: string) => {
        setConfiguringTheme(themeName.toLowerCase());
    };

    const handleBackFromConfig = () => {
        setConfiguringTheme(null);
    };

    if (configuringTheme === 'nimbus') {
        return (
            <div className="w-full font-semibold font-sans" style={{ fontSize: "20px" }}>
                <NimbusConfig onBack={handleBackFromConfig} />
            </div>
        );
    }

    return (
        <div className="w-full font-semibold font-sans" style={{ fontSize: "20px" }}>
            <div className="w-full py-1 responsive-tabs">
                <div className="w-full" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {['Themes', 'Theme Configuration'].map((tab) => (
                        <div
                            key={tab}
                            className={`w-full cursor-pointer py-2 responsive-tab ${activeTab === tab ? 'border-t-2 text-violet-500' : 'text-black-500'}`}
                            style={{ alignItems: "center", justifyContent: "center", display: "flex", borderColor: "rgba(89, 50, 234, 1)", color: "" }}
                            onClick={() => handleTabChange(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
            </div>

            <div className='w-full py-4'>
                {activeTab === 'Themes' && <AllThemes onConfigureTheme={handleConfigureTheme} />}
                {activeTab === 'Theme Configuration' && <ThemesConfig />}
            </div>


        </div >
    )
}

export default Themes