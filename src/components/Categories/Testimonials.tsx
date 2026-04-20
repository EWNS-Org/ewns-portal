'use client';

import { Avatar, Box, Button, Card, CardActions, FormControlLabel, Grid, IconButton, Stack, styled, Switch, SwitchProps, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Popup from '../common/Popup';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import { useLoader } from '../../contexts/LoaderContext';import DeleteIcon from '@mui/icons-material/Delete';
import "./Categories.css";
import { addTestimonialAction, deleteTestimonialAction, getAllTestimonialsAction, toggleTestimonialAction, updateTestimonialAction } from '../../Redux/Actions/Testimonials/testimonial.actions';
import { getAvatar } from '../../Helpers/common.helper';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { CloudUpload } from '@mui/icons-material';
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import { populatTestimonials } from '../../utils/constants/testimonials';

function Testimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const allTestimonials = useSelector((state: any) => {
        return state.testimonials.allTestimonials;
    });
    const [isPopupOpen, setIsPopupOpen] = useState({
        editTestimonialPopup: false,
        createTestimonialPopup: false,
        popularTestimonialPopup: false
    })
    const dispatch = useDispatch();

    const { showLoader, hideLoader } = useLoader();

    const initialFormData = {
        _id: "",
        title: "",
        feedback: "",
        rating: 1,
        image: null,
        video: null,
        userName: "",
        userLogo: ""
    };
    const [testimonialData, setTestimonialData] = useState<any>(null);

    const handleCreateOrUpdateTestimonial = async (type: any, id: any = null) => {
        try {
            showLoader();
            console.log(testimonialData);

            let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);

            if (!testimonialData.feedback || testimonialData.feedback === "") {
                toast.error("Please add feedback.");
                hideLoader();
                return;
            }

            if (!testimonialData.title || testimonialData.title === "") {
                toast.error("Please add rating");
                hideLoader();
                return;
            }

            if (type === "CREATE") {
                await dispatch(addTestimonialAction(businessId, testimonialData) as any);
            } else if (type === "UPDATE") {
                await dispatch(updateTestimonialAction(businessId, id, testimonialData) as any);
            }
            setIsPopupOpen({ createTestimonialPopup: false, editTestimonialPopup: false, popularTestimonialPopup: false });
            setTestimonialData(initialFormData);
            await dispatch(getAllTestimonialsAction(businessId) as any);
        }
        catch (error: any) {
            toast.error("Unable to create address");
        }
        finally {
            hideLoader();
        }
    }

    const handleInputChange = (field: any, value: any) => {
        console.log(testimonialData)
        setTestimonialData((prevValues:any) => ({...prevValues, [field]: value}));
    }

    const editLinkActions = [
        { label: 'Update Testimonial', onClick: () => handleCreateOrUpdateTestimonial("UPDATE", testimonialData._id), className: 'ml-2', variant: 'contained', display: 'block' },
    ];


    const editLink = (id: any) => {
        let link = allTestimonials.filter((x: any) => x._id === id);
        if (link.length === 1) {
            setTestimonialData({ ...link[0] });
            setIsPopupOpen({ ...isPopupOpen, editTestimonialPopup: true });
        }
    };

    const deleteLink = async (id: any) => {
        showLoader();
        const businessId = localStorage.getItem("activeBusinessId");
        await dispatch(deleteTestimonialAction(businessId, id) as any);
        await dispatch(getAllTestimonialsAction(businessId) as any);
        hideLoader();
    }

    useEffect(() => {
        showLoader();

        async function getAllTestimonials() {
            let businessId = localStorage.getItem("activeBusinessId");

            if (businessId)
                await dispatch(getAllTestimonialsAction(businessId) as any)
        }

        getAllTestimonials();
        hideLoader();
    }, []);

    useEffect(() => {
        showLoader();
        console.log(allTestimonials)
        setTestimonials(allTestimonials);
        hideLoader();

    }, [allTestimonials, dispatch]);

    const handlePopupClose = (popupType: string) => {
        setIsPopupOpen({ ...isPopupOpen, [popupType]: false });
    }


    const toggleFAQ = async (id: any, isChecked: any) => {
        let bussId = localStorage.getItem("activeBusinessId");
        await dispatch(toggleTestimonialAction(bussId, id, isChecked) as any);
        await dispatch(getAllTestimonialsAction(bussId) as any);
    }



    const getPopularTestimonials = () => {
        return (
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", width: "100%" }}>
                {populatTestimonials.map((testimonial: any) => {
                    return (
                        <Card sx={{ margin: 'auto', mb: 2, padding: "2%", width: "100%" }}>
                            <div style={{ cursor: "pointer", padding: "2%", }} onClick={() => { setTestimonialData({ ...testimonialData, title: testimonial.title, feedback: testimonial.feedback }); setIsPopupOpen({ ...isPopupOpen, popularTestimonialPopup: false, createTestimonialPopup: true }); }}>
                                <Typography variant='h5' sx={{fontWeight:"bold"}}>{testimonial.title}</Typography>
                                <Typography variant='h6' color='gray' >{testimonial.feedback}</Typography>
                            </div>
                        </Card>
                    )
                })
                } 
            </div >)
    }

    const [hovered, setHovered] = useState(false);
    const [selectedImage, setSelectedImage] = useState<any>(null); // State to store selected image

    const logoInputRef: any = useRef(null);
    const fileInputRef: any = useRef(null);

    // Function to handle file selection
    const handleFileChange = (event: any, isLogo: boolean) => {
      const file = event.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        if(isLogo)
            setTestimonialData({...testimonialData, userLogo: imageUrl});
        else{
            if(file.type.startsWith("image")){
                setTestimonialData({...testimonialData, image: [{url: imageUrl, file: file}]});
            }else{
                setTestimonialData({...testimonialData, video: [{url: imageUrl, file: file}]});
            }
        }
      }

      console.log(testimonialData)
    };
  
    // Function to trigger the file input click
    const handleIconClick = (isLogo: boolean) => {
        if(isLogo) logoInputRef.current.click();
        else fileInputRef.current.click();
    };


    const handleCloseIconClick = () => {
        setTestimonialData({...testimonialData, userLogo: null});
    }

    const getTestimonialInputs = () => {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: { xs: 0, md: 1 } }}>
                {/* Avatar + Name */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <div
                        style={{ position: 'relative', display: 'inline-block', flexShrink: 0 }}
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <Avatar sx={{ width: 48, height: 48 }} src={testimonialData?.userLogo || null} {...(!testimonialData?.userLogo && getAvatar(testimonialData?.userName ? testimonialData?.userName : "Prem Prakash"))}/>
                        {hovered && (
                            <Tooltip title={testimonialData.userLogo ? "Remove" : "Edit"}>
                                {!testimonialData.userLogo ?
                                    <EditIcon onClick={()=>handleIconClick(true)} style={{ position: 'absolute', top: -4, right: -4, fontSize: 18, cursor: 'pointer', backgroundColor: 'white', borderRadius: '50%', padding: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                                    : <CloseIcon onClick={handleCloseIconClick} style={{ position: 'absolute', top: -4, right: -4, fontSize: 18, cursor: 'pointer', backgroundColor: 'white', borderRadius: '50%', padding: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
                                }
                            </Tooltip>
                        )}
                        <input type="file" accept=".jpg,.png,.gif" ref={logoInputRef} style={{ display: 'none' }} onChange={(e)=>handleFileChange(e, true)} />
                    </div>
                    <TextField size="small" fullWidth label="Full Name" value={testimonialData.userName} onChange={(e: any)=>handleInputChange("userName", e.target.value)} />
                </Box>

                {/* Title */}
                <TextField size="small" label="Title" fullWidth value={testimonialData.title} onChange={(e: any)=>handleInputChange("title", e.target.value)} />

                {/* Feedback */}
                <TextField size="small" multiline rows={3} label="Feedback" fullWidth value={testimonialData.feedback} onChange={(e: any)=>handleInputChange("feedback", e.target.value)} />

                {/* Media */}
                <Box>
                    <Typography variant='subtitle2' sx={{ fontWeight: 600, color: '#475569', mb: 1, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Media</Typography>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        {/* Image preview */}
                        {testimonialData.image && testimonialData.image.length > 0 && (
                            <Box sx={{ position: 'relative', width: 120, height: 120, borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                                <img src={testimonialData.image[0].url} alt="Testimonial" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <IconButton size="small" onClick={() => setTestimonialData({...testimonialData, image: []})}
                                    sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', width: 24, height: 24, '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Box>
                        )}
                        {/* Video preview */}
                        {testimonialData.video && testimonialData.video.length > 0 && (
                            <Box sx={{ position: 'relative', width: 120, height: 120, borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', flexShrink: 0 }}>
                                <video src={testimonialData.video[0].url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <IconButton size="small" onClick={() => setTestimonialData({...testimonialData, video: []})}
                                    sx={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', width: 24, height: 24, '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}>
                                    <DeleteIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Box>
                        )}
                        {/* Upload box */}
                        <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 120, height: 120, border: '2px dashed #cbd5e1', borderRadius: '10px', cursor: 'pointer', color: '#94a3b8', transition: 'border-color 0.2s' }}>
                            <EditIcon sx={{ fontSize: 28, mb: 0.5 }} />
                            <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Add Media</span>
                            <input type="file" accept=".jpg,.png,.gif,.mp4,.mkv,.3gp,.avi" ref={fileInputRef} style={{ display: 'none' }} onChange={(e) => handleFileChange(e, false)} />
                        </label>
                    </Box>
                </Box>

                {/* Rating */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant='subtitle2' sx={{ color: '#475569', fontWeight: 600 }}>Rating</Typography>
                    <Box sx={{ display: 'flex' }}>
                        {Array.from({ length: 5 }, (_, index) => {
                            const starValue = index + 1;
                            return (
                                <IconButton key={index} size="small" onClick={() => setTestimonialData({...testimonialData, rating: starValue})} style={{ color: '#FFD700' }}>
                                    {starValue <= testimonialData.rating ? <StarIcon /> : <StarBorderIcon />}
                                </IconButton>
                            );
                        })}
                    </Box>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1.5, flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'flex-end' }}>
                    <Button variant='outlined' onClick={() => setIsPopupOpen({ ...isPopupOpen, popularTestimonialPopup: true })} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', borderColor: '#e2e8f0', color: '#64748b', '&:hover': { borderColor: '#cbd5e1', backgroundColor: '#f8fafc' } }}>
                        Popular Testimonials
                    </Button>
                    <Button variant='contained' onClick={() => handleCreateOrUpdateTestimonial("CREATE")} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '8px', backgroundColor: '#5932EA', '&:hover': { backgroundColor: '#4a28d4' } }}>
                        Create Testimonial
                    </Button>
                </Box>
            </Box>
        )
    }

    const IOSSwitch = styled((props: SwitchProps) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({ theme }) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: 'rgba(89, 50, 234, 1)',
                    opacity: 1,
                    border: 0,
                    ...theme.applyStyles('dark', {
                        backgroundColor: '#2ECA45',
                    }),
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color: theme.palette.grey[100],
                ...theme.applyStyles('dark', {
                    color: theme.palette.grey[600],
                }),
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.7,
                ...theme.applyStyles('dark', {
                    opacity: 0.3,
                }),
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#E9E9EA',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
            ...theme.applyStyles('dark', {
                backgroundColor: '#39393D',
            }),
        },
    }));

    return (
        <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
            <div className=" bg-white p-4 md:p-6 shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                <Stack spacing={4} width={"100%"} style={{  }}>
                    <Card sx={{ padding: "2%" }}>
                        <Box sx={{  }}>
                            <div className="page-header-responsive">
                                <Typography variant='h5' sx={{ fontSize: { xs: '1.2rem', md: '1.5rem' } }}>Testimonials</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setTestimonialData(initialFormData); setIsPopupOpen({ ...isPopupOpen, createTestimonialPopup: true }); }}
                                    sx={{  zIndex: 0, backgroundColor: "rgba(89, 50, 234, 1)" }}
                                >
                                    Add New Testimonial
                                </Button>
                            </div>

                            <Grid container sx={{ padding: "2%", overflow: "auto", maxHeight: "500px", justifyContent: "center", display: "flex" }}>
                                {testimonials?.length > 0 ? testimonials.map((testimonial: any, index: number) => (
                                    <Grid item key={index} sx={{ width: "100%" }} >
                                        <Card sx={{ padding: "1% 2%", width: "100%", display: "flex", flexDirection: { xs: "column", md: "row" } }}>
                                            <div style={{display:"flex", flexDirection: "inherit", width: "100%"}}>
                                                <div style={{ marginRight: "2%", display: "flex", alignItems:"center", justifyContent: "center"}}>
                                                    <Avatar sx={{ width: { xs: 64, md: 128 }, height: { xs: 64, md: 128 }, fontSize: { xs: 32, md: 64 } }}  src={testimonial?.userLogo || null} {...(!testimonial?.userLogo && getAvatar(testimonial?.userName ? testimonial?.userName : "Prem Prakash"))}/>
                                                </div>
                                                <div>
                                                    <div style={{display:"flex", alignItems: "center", justifyContent:"space-between", flexWrap: "wrap", gap: "8px"}}>
                                                        <Typography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>{testimonial.userName}</Typography>
                                                        <div style={{display :"flex", justifyContent: "space-between", marginBottom: "2%"}}>
                                                            <Typography variant='h5' color="gray">Rating:</Typography>
                                                            <div style={{display: "flex", justifyContent:"space-between", alignItems: "center", width: "50%"}}>
                                                                {Array.from({ length: 5 }, (_, index) => {
                                                                    const starValue = index + 1;
                                                                    return (
                                                                    <div
                                                                        key={index}
                                                                        style={{ color: '#FFD700' }}
                                                                    >
                                                                        {starValue <= testimonial.rating ? (
                                                                        <StarIcon fontSize="large" />
                                                                        ) : (
                                                                        <StarBorderIcon fontSize="large" />
                                                                        )}
                                                                    </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Typography variant='h6' sx={{fontWeight:"bold"}} >{testimonial.title}</Typography>
                                                    <Typography variant='h6' color="gray" >{testimonial.feedback}</Typography>
                                                </div>
                                            </div>
                                            <CardActions sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", marginBottom: "30%" }}>
                                                    <EditIcon onClick={() => editLink(testimonial._id)} sx={{ cursor: "pointer", color: "rgba(89, 50, 234, 1)" }} />
                                                    <DeleteIcon onClick={() => deleteLink(testimonial._id)} sx={{ cursor: "pointer", color: "rgba(89, 50, 234, 1)" }} />
                                                </div>

                                                <FormControlLabel
                                                    sx={{ height: "20%" }}
                                                    control={<IOSSwitch sx={{}} checked={testimonial.isActive} />}
                                                    label={``}
                                                    onChange={(e: any) =>
                                                        toggleFAQ(testimonial._id, e.target.checked)
                                                    }
                                                />
                                            </CardActions>
                                        </Card>
                                    </Grid>)) :
                                    <Typography > No Testimonials found</Typography>}
                            </Grid>
                        </Box>
                    </Card>
                </Stack>
            </div>
            <div style={{ height: "50%" }}>
                {
                    isPopupOpen.createTestimonialPopup && <Popup
                        header={"Create New Testimonial"}
                        onClose={() => handlePopupClose("createTestimonialPopup")}
                    >{getTestimonialInputs()}</Popup>
                }

                {
                    isPopupOpen.editTestimonialPopup && <Popup
                        header={"Update Testimonial"}
                        onClose={() => handlePopupClose("editTestimonialPopup")}
                    >{getTestimonialInputs()}</Popup>
                }

                {
                    isPopupOpen.popularTestimonialPopup && <Popup
                        header={"Popular Testimonials"}
                        onClose={() => handlePopupClose("popularTestimonialPopup")}
                        children={getPopularTestimonials()}
                    />
                }
            </div>
        </div >
    )
}

export default Testimonials