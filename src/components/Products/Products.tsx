import React, { useState } from 'react'
import AllProducts from './AllProducts';
import AddProduct from './AddProduct';
import "./Products.css"

function Products() {

    const [activeTab, setActiveTab] = useState('All Products');
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className="w-full  h-[65vh] font-semibold font-sans" style={{ fontSize: "20px" }}>
        <div className="w-full py-1" style={{ display: "flex", backgroundColor: "white" }}>
            <div className="w-full" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {['All Products', 'Add Product'].map((tab) => (
                    <div
                        key={tab}
                        className={` w-full cursor-pointer py-2 ${activeTab === tab ? 'border-t-2 text-violet-500' : 'text-black-500'}`}
                        style={{ alignItems: "center", justifyContent: "center", display: "flex", borderColor: "rgba(89, 50, 234, 1)", color: "" }}
                        onClick={() => handleTabChange(tab)}
                    >
                        {tab}
                    </div>
                ))}
            </div>
        </div>

        <div className='container w-full py-4 ' style={{}}>
            {activeTab === "All Products" && <AllProducts handleTabChange={handleTabChange} />}
            {activeTab === "Add Product" && <AddProduct />}
        </div>
    </div >
    )
}

export default Products