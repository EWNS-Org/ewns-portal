import { useState } from "react";
import Services from "./Services";
import Blogs from "./Blogs";

function BlogsAndServices() {
    const [activeTab, setActiveTab] = useState('Blogs');
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };


    return (
        <div className="w-full  h-full font-semibold font-sans ml-1" style={{ fontSize: "20px" }}>
            <div className="w-full h-[10%] py-1" style={{ display: "flex", backgroundColor: "white" }}>
                <div className="w-full h-[90%]" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    {['Blogs', 'Services'].map((tab) => (
                        <div
                            key={tab}
                            className={` w-full h-full cursor-pointer py-2 ${activeTab === tab ? 'border-t-2 text-violet-500' : 'text-black-500'}`}
                            style={{ alignItems: "center", justifyContent: "center", display: "flex", borderColor: "rgba(89, 50, 234, 1)", color: "" }}
                            onClick={() => handleTabChange(tab)}
                        >
                            {tab}
                        </div>
                    ))}
                </div>
            </div>

            <div className='container w-full h-full ml-4' style={{}}>
                {activeTab === "Blogs" && <Blogs />}
                {activeTab === "Services" && <Services />}
            </div>
        </div >
    )
}

export default BlogsAndServices;