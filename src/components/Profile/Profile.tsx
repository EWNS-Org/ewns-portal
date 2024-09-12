import { Box, CardContent, CardHeader, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Card } from '@mui/material';
import React, { useState } from 'react';
import { countryList } from '../../utils/country-flag';
import { useNavigate } from 'react-router-dom';

const categories = ["General", "Hospital"];

const PersonalProfile = () => {
    const [activeTab, setActiveTab] = useState('Profile'); // State to control active tab


    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className="container mx-auto p-6">
            {/* Tabs Section */}
            <div className="border-b mb-6">
                <ul className="flex space-x-6">
                    {['Profile', 'About', 'Images', 'Business Hours', 'Address', 'Social Media'].map((tab) => (
                        <li
                            key={tab}
                            className={`cursor-pointer py-2 ${activeTab === tab ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'
                                }`}
                            onClick={() => handleTabChange(tab)}
                        >
                            {tab}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Render content based on active tab */}
            {activeTab === 'Profile' && <ProfileTab />}
            {activeTab === 'About' && <AboutUsTab />}
            {activeTab === 'Images' && <ImagesTab />}
            {activeTab === 'Business Hours' && <BusinessHoursTab />}
            {activeTab === 'Address' && <AddressTab />}
            {activeTab === 'Social Media' && <SocialMediaTab />}
        </div>
    );
};

/* Profile Tab Content */
const ProfileTab = () => {
    const navigate = useNavigate();

    const [profile, setProfile] = useState({
        firstName: 'Anshan',
        lastName: 'Handgun',
        country: 'New York',
        zipcode: '956754',
        bio: "Hello, I'm Anshan Handgun Creative Graphic Designer & User Experience Designer based in Website.",
        experience: 'Start Up',
        phoneNumber: '+1 (865) 423-9581',
        countryCode: '1-876',
        email: 'stebin.ben@gmail.com',
        portfolioURL: 'https://anshan.dh.url',
        address: 'Street 110-B Kalians Bag, Dewan, M.P. New York',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setProfile({ ...profile, [name]: value });
    };

    return (
        <div className="container mx-auto p-6 w-full">
            <div className="flex justify-between items-center border-b pb-3 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">Profile</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md w-full">
                <div className="col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Business Profile Information</h2>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <TextField
                            required
                            id="outlined-required"
                            label={"Business Name"}
                            value={""}
                            //onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                            sx={{ width: "100%", height: "100%" }}
                        />

                        <Box sx={{ minWidth: 120, cursor: "zoom-in" }}>
                            <FormControl sx={{ width: "60%" }}>
                                <InputLabel id="demo-simple-select-label">Business Category</InputLabel>
                                <Select disabled
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={"General"}
                                    label="Business Category"
                                //onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    {categories.map(cat => <MenuItem value={cat}>{cat}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Box>
                    </div>
                    <div className="col-span-1">
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                            <div className="w-full">
                                <div style={{ display: "flex", width: "60%", }}>
                                    <Box sx={{ width: "30%" }}>
                                        <FormControl sx={{ width: "100%", height: "100%" }}>
                                            <InputLabel id="demo-simple-select-label">Country Code</InputLabel>
                                            <Select required
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={""}
                                                label="Country Code"
                                            //onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                            >
                                                {Object.keys(countryList).map(cat => <MenuItem key={countryList[cat].dial_code} value={countryList[cat].dial_code}>
                                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                        <img width={"30px"} height={"30px"} src={countryList[cat].image} />
                                                        <span > &nbsp; &nbsp;{countryList[cat].dial_code + " - " + cat}</span>
                                                    </div></MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label={"Mobile Number"}
                                        value={""}
                                        //onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                        sx={{ marginX: "2%", width: "100%", height: "100%" }}
                                    />

                                </div>
                                <TextField
                                    id="outlined-required"
                                    label={"Business Email"}
                                    value={"business@gmail.com"}
                                    //onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                    sx={{ marginY: "2%", width: "100%", height: "100%" }}
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <TextField
                                disabled={true}
                                id="outlined-required"
                                label={"Business URL"}
                                value={"https://demo.ewns.in"}
                                //onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                sx={{ width: "100%", height: "100%" }}
                            />

                        </div>
                    </div>




                </div>

                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-4">Google Business Profile</h2>

                    <div className="col-span-1 mb-6">
                        <TextField
                            required
                            id="outlined-required"
                            label={"Business Profile URL"}
                            value={""}
                            //onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                            sx={{ width: "100%", height: "100%" }}
                        />
                    </div>


                    <h2 className="text-xl font-semibold mb-4">Subscription Information</h2>
                    <Card sx={{ maxWidth: 345, cursor: "pointer", display: "flex", flexDirection: "column" }} onClick={() => navigate("/subscription")}>
                        <CardHeader
                            title="Basic Subscription"
                            subheader="September 14, 2016"
                        />

                        <CardContent>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                <strong>Days Left : </strong>Unlimited
                            </Typography>
                        </CardContent>
                    </Card>

                </div>
            </div>

            <div className="flex justify-end mt-6">
                <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-3">
                    Cancel
                </button>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                    Update Profile
                </button>
            </div>
        </div >
    );
};

/* About Us Tab Content */
const AboutUsTab = () => {
    const navigate = useNavigate();
    const customToolbar = [
        { name: 'headings', title: 'Headings' },
        { name: 'bold', title: 'Bold' },
        { name: 'italic', title: 'Italic' },
        { name: 'lists', title: 'Lists' },
        { name: 'quote', title: 'Quote' },
        { name: 'link', title: 'Link' },
        { name: 'code', title: 'Code Block' },
        { name: 'image', title: 'Image' },
        { name: 'table', title: 'Table' },
        { name: 'inlineCode', title: 'Inline Code' },
    ];

    return (
        <div className="container mx-auto p-6 w-full">
            <div className="flex justify-between items-center border-b pb-3 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold">About Business</h1>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-lg shadow-md w-full">
                <div className="col-span-1">
                    <h2 className="text-xl font-semibold mb-4">Business Short Bio</h2>





                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Subscription Information</h2>
                        <Card sx={{ maxWidth: 345, cursor: "pointer", display: "flex", flexDirection: "column" }} onClick={() => navigate("/subscriptions")}>
                            <CardHeader
                                title="Basic Subscription"
                                subheader="September 14, 2016"
                            />

                            <CardContent>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    <strong>Days Left : </strong>Unlimited
                                </Typography>
                            </CardContent>
                        </Card>

                    </div>

                </div>

                {/* Social Network & Contact Information */}
                <div className="col-span-1">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                        <div className="w-full">
                            <div style={{ display: "flex", width: "60%", }}>
                                <Box sx={{ width: "30%" }}>
                                    <FormControl sx={{ width: "100%", height: "100%" }}>
                                        <InputLabel id="demo-simple-select-label">Country Code</InputLabel>
                                        <Select required
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={""}
                                            label="Country Code"
                                        //onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                                        >
                                            {Object.keys(countryList).map(cat => <MenuItem key={countryList[cat].dial_code} value={countryList[cat].dial_code}>
                                                <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <img width={"30px"} height={"30px"} src={countryList[cat].image} />
                                                    <span > &nbsp; &nbsp;{countryList[cat].dial_code + " - " + cat}</span>
                                                </div></MenuItem>)}
                                        </Select>
                                    </FormControl>
                                </Box>
                                <TextField
                                    required
                                    id="outlined-required"
                                    label={"Mobile Number"}
                                    value={""}
                                    //onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                    sx={{ marginX: "2%", width: "100%", height: "100%" }}
                                />

                            </div>
                            <TextField
                                id="outlined-required"
                                label={"Business Email"}
                                value={"business@gmail.com"}
                                //onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                sx={{ marginY: "2%", width: "100%", height: "100%" }}
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <TextField
                            disabled={true}
                            id="outlined-required"
                            label={"Business URL"}
                            value={"https://demo.ewns.in"}
                            //onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                            sx={{ width: "100%", height: "100%" }}
                        />

                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <button className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg mr-3">
                    Cancel
                </button>
                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg">
                    Update Profile
                </button>
            </div>
        </div >
    );
};

/* Images Tab Content */
const ImagesTab = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Images</h2>
            <p>Upload and manage your business images here.</p>
            {/* Add image upload functionality */}
        </div>
    );
};

/* Business Hours Tab Content */
const BusinessHoursTab = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
            <p>Set your business hours for customer visibility.</p>
            {/* Add business hours input */}
        </div>
    );
};

/* Address Tab Content */
const AddressTab = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Address</h2>
            <p>Manage your business address information.</p>
            {/* Add address input fields */}
        </div>
    );
};

/* Social Media Tab Content */
const SocialMediaTab = () => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Social Media</h2>
            <p>Add links to your social media profiles for better engagement.</p>
            {/* Add social media input fields */}
        </div>
    );
};

export default PersonalProfile;
