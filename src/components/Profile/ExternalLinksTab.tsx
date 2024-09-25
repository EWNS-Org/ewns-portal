import React, { useEffect, useState } from 'react';
import './ExternalLinkTab.css'; // Optional: Create a separate CSS file for styling
import { Box, Button, Card, CardActions, CardContent, Checkbox, Grid, Stack, Tooltip, Typography } from '@mui/material';
import Popup from '../common/Popup';
import { useDispatch, useSelector } from 'react-redux';
import { useLoader } from '../../contexts/LoaderContext';
import { validateFields } from '../../Helpers/common.helper';
import { createBusinessLinkAction, deleteBusinessLinkAction, getAllBusinessLinksAction, updateBusinessAddressAction, updateBusinessLinkAction } from '../../Redux/Actions/BusinessActions/business.actions';
import toast from 'react-hot-toast';
import { fetchPincodeDetails } from '../../services/api/postalcode.service';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';

// Predefined social media links
const popularSocialSites = [
    { logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg', title: 'Facebook' },
    { logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/X_logo.jpg/600px-X_logo.jpg', title: 'X' },
    { logo: 'https://upload.wikimedia.org/wikipedia/commons/0/01/LinkedIn_Logo.svg', title: 'LinkedIn' },
    { logo: 'https://www.gstatic.com/youtube/img/branding/youtubelogo/svg/youtubelogo.svg', title: 'YouTube' },
    { logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png', title: 'Pinterest' },
    { logo: 'https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg', title: 'TikTok' },
    { logo: 'https://upload.wikimedia.org/wikipedia/en/c/c4/Snapchat_logo.svg', title: 'Snapchat' },
    { logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg', title: 'WhatsApp' },
    { logo: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Tumblr-logo.png', title: 'Tumblr' },
    { logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png', title: 'Instagram' }
];

const initialLinks = [
    {
        logo: "",
        title: "",
        url: ""
    }
];

const ExternalLinksTab = ({ profile, setProfile }: any) => {
    const [links, setLinks] = useState(initialLinks);
    const businessLinks = useSelector((state: any) => {
        return state.business.businessLinks
    });
    const [isPopupOpen, setIsPopupOpen] = useState({
        editAddressPopup: false,
        createAddressPopup: false
    })
    const dispatch = useDispatch();

    const { showLoader, hideLoader } = useLoader();

    const initLinkInputs = [
        { label: 'Title', name: 'title', type: 'text', width: "100%" },
        { label: 'Logo Url', name: 'logo', type: 'text', width: "100%" },
        { label: 'Link', name: 'url', type: 'text', width: "100%" },
    ];

    const [createLinkInputs, setLinkInputs] = useState(initLinkInputs);

    const initialFormData = {
        _id: "",
        url: "",
        logo: "",
        title: ""
    };



    const handleCreateOrUpdateLink = async (type: any, id: any = null) => {
        try {
            showLoader();

            let formData: any = {};
            setFormValues((prevValues: any) => {
                formData = prevValues;
                return { ...prevValues };
            });
            console.log(formData)
            let businessId = localStorage.getItem("activeBusinessId");

            if (!formData.logo || formData.logo === "") {
                toast.error("Please add logo url");
                hideLoader();
                return;
            }

            if (!formData.title || formData.title === "") {
                toast.error("Please add title");
                hideLoader();
                return;
            }

            if (!formData.url || formData.url === "") {
                toast.error("Please add URL link");
                hideLoader();
                return;
            }
            if (type === "CREATE") {
                await dispatch(createBusinessLinkAction(formData, businessId) as any);
            } else if (type === "UPDATE") {
                await dispatch(updateBusinessLinkAction(formData, businessId, id) as any);
            }
            setIsPopupOpen({ createAddressPopup: false, editAddressPopup: false });
            setFormValues(initialFormData);
            await dispatch(getAllBusinessLinksAction(businessId) as any);
        }
        catch (error: any) {
            toast.error("Unable to create address");
        }
        finally {
            hideLoader();
        }
    }

    const handleResetForNewBusiness = () => {
        setFormValues(initialFormData)
    }

    const newLinkActions = [
        { label: 'Create Link', onClick: () => handleCreateOrUpdateLink("CREATE"), className: 'ml-2', variant: 'contained', display: 'block' },
    ];

    const editLinkActions = [
        { label: 'Update Link', onClick: () => handleCreateOrUpdateLink("UPDATE", formValues._id), className: 'ml-2', variant: 'contained', display: 'block' },
    ];

    const [createLinkActions, setCreateLinkActions] = useState(newLinkActions);

    const [formValues, setFormValues] = useState<any>(initialFormData);

    const handlePopupInputChange = async (name: any, value: any) => {
        setFormValues({
            ...formValues,
            [name]: value,
        });
    }

    const editLink = (id: any) => {
        let link = links.filter((x: any) => x._id === id);
        if (link.length === 1) {
            setFormValues({ ...link[0] });
            setIsPopupOpen({ ...isPopupOpen, editAddressPopup: true });
        }
    };

    const deleteLink = async (id: any) => {
        showLoader();
        const businessId = localStorage.getItem("activeBusinessId");
        await dispatch(deleteBusinessLinkAction(businessId, id) as any);
        await dispatch(getAllBusinessLinksAction(businessId) as any);
        hideLoader();
    }

    useEffect(() => {
        showLoader();
        let businessId = localStorage.getItem("activeBusinessId");

        if (businessId)
            dispatch(getAllBusinessLinksAction(businessId) as any)

        hideLoader();
    }, [dispatch]);

    useEffect(() => {
        showLoader();

        setLinks(businessLinks);
        hideLoader();

    }, [businessLinks])

    const handlePopupClose = (popupType: string) => {
        setIsPopupOpen({ ...isPopupOpen, [popupType]: false });
    }

    const getPopularLinks = () => {
        return (<div style={{ marginTop: "2%" }}>
            <Typography variant='h6'>Popular Links</Typography>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                {popularSocialSites.map((site: any) => {
                    return <Button sx={{ cursor: "pointer", padding: "2%" }} onClick={() => setFormValues({ ...formValues, title: site.title, logo: site.logo })}> <img src={site.logo} width="40px" height="40px" /></Button>
                })}
            </div>
        </div>)
    }



    return (
        <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
            <div className=" bg-white p-6 h-[800px] shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                <Stack spacing={4} width={"100%"} style={{ marginTop: "1%" }}>
                    <Card sx={{ margin: '1%', padding: "2%" }}>
                        <Box sx={{ height: "700px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant='h5'>All links</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setFormValues(initialFormData); setIsPopupOpen({ ...isPopupOpen, createAddressPopup: true }); }}
                                    sx={{ marginBottom: '20px', zIndex: 0, backgroundColor: "rgba(89, 50, 234, 1)" }}
                                >
                                    Add New Link
                                </Button>
                            </div>

                            <Grid container spacing={2} sx={{ overflowY: "auto", padding: "1%" }}>
                                {links?.length > 0 ? links.map((link: any) => (
                                    <Grid item md={3} key={link._id} sx={{ width: "300px", height: "100px" }} >
                                        <Card sx={{ borderTop: "1px solid gray", width: "100%", height: "100%" }}>
                                            <CardContent sx={{ display: "flex", width: "100%", justifyContent: "space-between", }}>
                                                <Tooltip
                                                    title={`Go to : ${link.url}`}
                                                    placement="top"
                                                    arrow
                                                >
                                                    <div onClick={() => window.open(link.url, "_blank")} style={{ display: "flex", alignItems: "center", width: "60%", justifyContent: "start", cursor: "pointer" }}>
                                                        <img src={link.logo} width="45" height="45" />
                                                        <Typography variant="h6" sx={{ marginLeft: "5%", }}>{link.title}</Typography>
                                                    </div>
                                                </Tooltip>
                                                <CardActions sx={{ display: "flex", }}>
                                                    <EditIcon onClick={() => editLink(link._id)} sx={{ cursor: "pointer", color: "rgba(89, 50, 234, 1)" }} />
                                                    <DeleteIcon onClick={() => deleteLink(link._id)} sx={{ cursor: "pointer", color: "rgba(89, 50, 234, 1)" }} />
                                                </CardActions>

                                            </CardContent>

                                        </Card>
                                    </Grid>)) :
                                    <Typography > No links found</Typography>}
                            </Grid>
                        </Box>
                    </Card>
                </Stack>
            </div>

            {
                isPopupOpen.createAddressPopup && <Popup
                    header={"Create New Link"}
                    onClose={() => handlePopupClose("createAddressPopup")}
                    inputs={createLinkInputs}
                    buttons={createLinkActions}
                    formValues={formValues}
                    setFormValues={setFormValues}
                    handleInputChange={handlePopupInputChange}
                    children={getPopularLinks()}
                />
            }

            {
                isPopupOpen.editAddressPopup && <Popup
                    header={"Update Link"}
                    onClose={() => handlePopupClose("editAddressPopup")}
                    formValues={formValues}
                    inputs={createLinkInputs}
                    buttons={editLinkActions}
                    setFormValues={setFormValues}
                    handleInputChange={handlePopupInputChange}
                />
            }
        </div >
    );
};

export default ExternalLinksTab;
