import React, { useEffect, useState } from 'react';
import Popup from '../common/Popup';
import { useDispatch, useSelector } from 'react-redux';
import { useLoader } from '../../contexts/LoaderContext';
import { validateFields } from '../../Helpers/common.helper';
import { createBusinessFAQAction, createBusinessLinkAction, deleteBusinessFAQAction, deleteBusinessLinkAction, getAllBusinessFAQAction, getAllBusinessLinksAction, toggleBusinessFAQAction, updateBusinessAddressAction, updateBusinessFAQAction, updateBusinessLinkAction } from '../../Redux/Actions/BusinessActions/business.actions';
import toast from 'react-hot-toast';
import { fetchPincodeDetails } from '../../services/api/postalcode.service';
import EditIcon from '@mui/icons-material/Edit';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormControl, InputLabel, Select, TextField, Theme, Tooltip, styled } from "@mui/material";
import { Box, Button, Card, CardActions, CardContent, Checkbox, FormControlLabel, Grid, MenuItem, Stack, Switch, SwitchProps, Typography } from '@mui/material'
import { popularFAQs } from '../../utils/constants/faqs';



const initialFaqs = [
    {
        question: "0lfjwaofp;jwgfjewgjresgkrkl;grl;ghkdr;lghkdr;lkghdr;lhkrd;lhk ;drk ;hkd ;kdr;;hlkrdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
        answer: "w;lfjwaofp;jwgfjewgjresgkrkl;grl;ghkdr;lghkdr;lkghdr;lhkrd;lhk ;drk ;hkd ;kdr;;hlkrddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddlfjwaofp;jwgfjewgjresgkrkl;grl;ghkdr;lghkdr;lkghdr;lhkrd;lhk ;drk ;hkd ;kdr;;hlkrdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd lfjwaofp;jwgfjewgjresgkrkl;grl;ghkdr;lghkdr;lkghdr;lhkrd;lhk ;drk ;hkd ;kdr;;hlkrdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
        isActive: true
    }
];

const FAQTab = ({ profile, setProfile }: any) => {
    const [allFaqs, setAllFaqs] = useState(initialFaqs);
    const faqs = useSelector((state: any) => {
        return state.business.businessFAQs
    });
    const [isPopupOpen, setIsPopupOpen] = useState({
        editFAQPopup: false,
        createFAQPopup: false,
        popularFAQPopup: false
    })
    const dispatch = useDispatch();

    const { showLoader, hideLoader } = useLoader();

    const initLinkInputs = [
        { label: 'Question', name: 'question', type: 'text-area', rows: 6, width: "100%" },
        { label: 'Answer', name: 'answer', type: 'text-area', rows: 6, width: "100%" },
    ];

    const [createFAQInputs, setLinkInputs] = useState(initLinkInputs);

    const initialFormData = {
        _id: "",
        question: "",
        answer: ""
    };



    const handleCreateOrUpdateLink = async (type: any, id: any = null) => {
        try {
            showLoader();

            let formData: any = {};
            setFormValues((prevValues: any) => {
                formData = prevValues;
                return { ...prevValues };
            });
            let businessId = localStorage.getItem("activeBusinessId");

            if (!formData.question || formData.question === "") {
                toast.error("Please add question.");
                hideLoader();
                return;
            }

            if (!formData.answer || formData.answer === "") {
                toast.error("Please add answer");
                hideLoader();
                return;
            }

            if (type === "CREATE") {
                await dispatch(createBusinessFAQAction(formData, businessId) as any);
            } else if (type === "UPDATE") {
                await dispatch(updateBusinessFAQAction(formData, businessId, id) as any);
            }
            setIsPopupOpen({ createFAQPopup: false, editFAQPopup: false, popularFAQPopup: false });
            setFormValues(initialFormData);
            await dispatch(getAllBusinessFAQAction(businessId) as any);
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
        { label: 'Show Popular FAQs', onClick: () => setIsPopupOpen({ ...isPopupOpen, popularFAQPopup: true }), className: 'ml-2', variant: 'outlined', display: 'block' },
        { label: 'Create FAQ', onClick: () => handleCreateOrUpdateLink("CREATE"), className: 'ml-2', variant: 'contained', display: 'block' },
    ];

    const editLinkActions = [
        { label: 'Update FAQ', onClick: () => handleCreateOrUpdateLink("UPDATE", formValues._id), className: 'ml-2', variant: 'contained', display: 'block' },
    ];

    const [createFAQActions, setCreateLinkActions] = useState(newLinkActions);

    const [formValues, setFormValues] = useState<any>(initialFormData);

    const handlePopupInputChange = async (name: any, value: any) => {
        setFormValues({
            ...formValues,
            [name]: value,
        });
    }

    const editLink = (id: any) => {
        let link = allFaqs.filter((x: any) => x._id === id);
        if (link.length === 1) {
            setFormValues({ ...link[0] });
            setIsPopupOpen({ ...isPopupOpen, editFAQPopup: true });
        }
    };

    const deleteLink = async (id: any) => {
        showLoader();
        const businessId = localStorage.getItem("activeBusinessId");
        await dispatch(deleteBusinessFAQAction(businessId, id) as any);
        await dispatch(getAllBusinessFAQAction(businessId) as any);
        hideLoader();
    }

    useEffect(() => {
        showLoader();

        async function getFAQS() {
            let businessId = localStorage.getItem("activeBusinessId");

            if (businessId)
                await dispatch(getAllBusinessFAQAction(businessId) as any)
        }

        getFAQS();
        hideLoader();
    }, [dispatch]);

    useEffect(() => {
        showLoader();

        setAllFaqs(faqs);
        hideLoader();

    }, [faqs, dispatch])

    const handlePopupClose = (popupType: string) => {
        setIsPopupOpen({ ...isPopupOpen, [popupType]: false });
    }


    const toggleFAQ = async (id: any, isChecked: any) => {
        let bussId = localStorage.getItem("activeBusinessId");
        await dispatch(toggleBusinessFAQAction(bussId, id, isChecked) as any);
        await dispatch(getAllBusinessFAQAction(bussId) as any);
    }



    const getPopularFAQs = () => {
        return (
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", width: "100%" }}>
                {popularFAQs.map((faq: any) => {
                    return (
                        <Card sx={{ margin: 'auto', mb: 2, padding: "2%", width: "100%" }}>
                            <div style={{ cursor: "pointer", padding: "2%", }} onClick={() => { setFormValues({ ...formValues, question: faq.question, answer: faq.answer }); setIsPopupOpen({ ...isPopupOpen, popularFAQPopup: false, createFAQPopup: true }); }}>
                                <Typography variant='h6'>{faq.question}</Typography>
                                <Typography color='gray' sx={{ fontSize: "15px" }}>{faq.answer}</Typography>
                            </div>
                        </Card>
                    )
                })
                }
            </div >)
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
            <div className=" bg-white p-6 h-[680px] shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                <Stack spacing={4} width={"100%"} style={{  }}>
                    <Card sx={{ padding: "2%", height: "630px" }}>
                        <Box sx={{  }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant='h5'>All FAQs</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setFormValues(initialFormData); setIsPopupOpen({ ...isPopupOpen, createFAQPopup: true }); }}
                                    sx={{  zIndex: 0, backgroundColor: "rgba(89, 50, 234, 1)" }}
                                >
                                    Add New FAQ
                                </Button>
                            </div>

                            <Grid container sx={{ padding: "2%", overflow: "auto", height: "500px", justifyContent: "center", display: "flex" }}>
                                {allFaqs?.length > 0 ? allFaqs.map((faq: any, index: number) => (
                                    <Grid item key={index} sx={{ width: "100%", height:"200px" }} >
                                        <Card sx={{ padding: "1% 2%", width: "100%", display: "flex", }}>
                                            <div style={{ cursor: "pointer", padding: "2% 0%", width: "90%" }} >
                                                <Typography variant='h6'>{faq.question}</Typography>
                                                <Typography color='gray' sx={{ fontSize: "15px", marginTop: "2%" }}>{faq.answer}</Typography>
                                            </div>
                                            <CardActions sx={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", marginBottom: "30%" }}>
                                                    <EditIcon onClick={() => editLink(faq._id)} sx={{ cursor: "pointer", color: "rgba(89, 50, 234, 1)" }} />
                                                    <DeleteIcon onClick={() => deleteLink(faq._id)} sx={{ cursor: "pointer", color: "rgba(89, 50, 234, 1)" }} />
                                                </div>

                                                <FormControlLabel
                                                    sx={{ height: "20%" }}
                                                    control={<IOSSwitch sx={{}} checked={faq.isActive} />}
                                                    label={``}
                                                    onChange={(e: any) =>
                                                        toggleFAQ(faq._id, e.target.checked)
                                                    }
                                                />
                                            </CardActions>
                                        </Card>
                                    </Grid>)) :
                                    <Typography > No Question and Answers found</Typography>}
                            </Grid>
                        </Box>
                    </Card>
                </Stack>
            </div>
            <div style={{ height: "50%" }}>
                {
                    isPopupOpen.createFAQPopup && <Popup
                        header={"Create New FAQ"}
                        onClose={() => handlePopupClose("createFAQPopup")}
                        formValues={formValues}
                        setFormValues={setFormValues}
                        inputs={createFAQInputs}
                        buttons={createFAQActions}
                        handleInputChange={handlePopupInputChange}
                    />
                }

                {
                    isPopupOpen.editFAQPopup && <Popup
                        header={"Update FAQ"}
                        onClose={() => handlePopupClose("editFAQPopup")}
                        formValues={formValues}
                        inputs={createFAQInputs}
                        buttons={editLinkActions}
                        setFormValues={setFormValues}
                        handleInputChange={handlePopupInputChange}
                    />
                }

                {
                    isPopupOpen.popularFAQPopup && <Popup
                        header={"Popular FAQs"}
                        onClose={() => handlePopupClose("popularFAQPopup")}
                        children={getPopularFAQs()}
                    />
                }
            </div>


        </div >
    )
}
export default FAQTab;