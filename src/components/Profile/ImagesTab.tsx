import { Button, IconButton } from "@mui/material";
import { Checkbox, FormControlLabel } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Profile.css";
import Popup from "../common/Popup";
import { useEffect, useState } from "react";

const ImagesTab = ({ previewData, setPreviewData }: any) => {

    const handleImageChange = (event: any, field: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewData({ ...previewData, [field]: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };
    const handleDeleteImage = (field: any) => {
        setPreviewData({ ...previewData, [field]: "" });
    };
    const [childrenPopup, setChildrenPopup] = useState([]);



    const getPreviewContent = (label: string, url: any) => {
        return (
            <div>
                <div>
                    <h2>{label}</h2>
                </div>
                <div>
                    <img src={url} alt={label} height="400px" width="400px" />
                </div>
            </div>
        )
    }

    const handlePreview = (type: string) => {
        let data: any = [];
        switch (type) {
            case "Logo Image":
                data.push(getPreviewContent("Logo Image", previewData.logoImage));
                break;
            case "Featured Image":
                data.push(getPreviewContent("Featured Image", previewData?.featuredImage));
                break;
            case "Banner Image":
                data.push(getPreviewContent("Banner Image", previewData.bannerImage));
                break;
            default:
        }

        setChildrenPopup(data);
        setIsPreviewPopupOpen(true);

    }



    const [isPreviewPopupOpen, setIsPreviewPopupOpen] = useState(false);

    const popupActions = [{ label: 'Close', onClick: () => setIsPreviewPopupOpen(false), className: 'mr-2', variant: 'outlined', display: "none" }]

    return (
        <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
            <div className=" bg-white p-6 h-[800px] shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={previewData.isBannerFeaturedImage}
                            onChange={(e) =>
                                setPreviewData({ ...previewData, isBannerFeaturedImage: e.target.checked })
                            }
                        />
                    }
                    label="Use Banner as Featured Image"
                    sx={{}}
                />
                <div style={{ display: "flex", justifyContent: "space-between" }}>

                    <div style={{ width: "100%", height: "60%" }}>
                        <h2 className="text-xl font-semibold mb-4">Logo</h2>

                        <div className="containerr" style={{ width: "400px", height: "300px", justifyContent: "center" }}>
                            <img src={previewData?.logoImage || "https://placehold.co/600x400.png?text=No+Logo"} alt="Avatar" className="image" style={{ width: "100%" }} />
                            <div className="middle">
                                <div style={{ flexDirection: "row", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <IconButton component="label" sx={{ color: "blue" }}>
                                        <EditIcon fontSize="large" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => handleImageChange(e, "logoImage")}
                                        />
                                    </IconButton>
                                    <IconButton
                                        sx={{ color: "blue" }}
                                        onClick={() => handlePreview("Logo Image")}
                                        disabled={!previewData.logoImage}
                                    >
                                        <VisibilityIcon fontSize="large" />
                                    </IconButton>

                                    <IconButton
                                        sx={{ color: "blue" }}
                                        onClick={() => handleDeleteImage("logoImage")}
                                        disabled={!previewData.logoImage}
                                    >
                                        <DeleteIcon fontSize="large" />
                                    </IconButton>
                                </div>


                            </div>
                        </div>
                    </div>

                    {/* Banner Image Section */}
                    <div style={{ width: "100%", height: "60%" }}>
                        <h2 className="text-xl font-semibold mb-4">Featured Image</h2>

                        <div className="containerr" style={{ width: "400px", height: "300px" }}>
                            <img src={previewData.featuredImage || "https://placehold.co/600x400.png?text=No+Banner"} alt="Avatar" className="image" style={{ width: "100%" }} />
                            <div className="middle">
                                <div style={{ flexDirection: "row", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <IconButton component="label" sx={{ color: "blue" }}>
                                        <EditIcon fontSize="large" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => handleImageChange(e, "featuredImage")}
                                        />
                                    </IconButton>
                                    <IconButton
                                        sx={{ color: "blue" }}
                                        onClick={() => handlePreview("Featured Image")}
                                        disabled={!previewData.featuredImage}
                                    >
                                        <VisibilityIcon fontSize="large" />
                                    </IconButton>

                                    <IconButton
                                        sx={{ color: "blue" }}
                                        onClick={() => handleDeleteImage("featuredImage")}
                                        disabled={!previewData.featuredImage}
                                    >
                                        <DeleteIcon fontSize="large" />
                                    </IconButton>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>


                {/* Featured Image Checkbox */}


                {/* Conditionally Render Featured Image Section */}
                {!previewData.isBannerFeaturedImage && (
                    <div style={{ width: "100%" }}>
                        <h2 className="text-xl font-semibold mb-4">Banner Image</h2>

                        <div className="containerr" style={{ width: "400px", height: "300px" }}>
                            <img src={previewData.bannerImage || "https://placehold.co/600x200.png?text=No+Banner+Image"} alt="Avatar" className="image" style={{ width: "100%" }} />
                            <div className="middle">
                                <div style={{ flexDirection: "row", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <IconButton component="label" sx={{ color: "blue" }}>
                                        <EditIcon fontSize="large" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            hidden
                                            onChange={(e) => handleImageChange(e, "bannerImage")}
                                        />
                                    </IconButton>
                                    <IconButton
                                        sx={{ color: "blue" }}
                                        onClick={() => handlePreview("Banner Image")}
                                        disabled={!previewData.bannerImage}
                                    >
                                        <VisibilityIcon fontSize="large" />
                                    </IconButton>

                                    <IconButton
                                        sx={{ color: "blue" }}
                                        onClick={() => handleDeleteImage("bannerImage")}
                                        disabled={!previewData.bannerImage}
                                    >
                                        <DeleteIcon fontSize="large" />
                                    </IconButton>
                                </div>


                            </div>
                        </div>
                    </div>
                )}


            </div>
            {isPreviewPopupOpen && <Popup
                header={`${"Logo"} Preview`}
                inputs={[]}
                buttons={popupActions}
                onClose={() => setIsPreviewPopupOpen(false)}
                formValues={null}
                setFormValues={null}
                handleInputChange={() => { }}
                children={childrenPopup}
            />}

        </div >)
};

export default ImagesTab;