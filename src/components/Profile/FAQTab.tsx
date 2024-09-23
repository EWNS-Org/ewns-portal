import React, { useEffect, useState } from 'react';
import { Box, Button, Card, CardActions, CardContent, Checkbox, Grid, Stack, TextField, Tooltip, Typography } from '@mui/material';
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
import { popularFAQs } from '../../utils/constants/faqs';


const initialLinks = [
    {
        question: "0lfjwaofp;jwgfjewgjresgkrkl;grl;ghkdr;lghkdr;lkghdr;lhkrd;lhk ;drk ;hkd ;kdr;;hlkrdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
        answer: "w;lfjwaofp;jwgfjewgjresgkrkl;grl;ghkdr;lghkdr;lkghdr;lhkrd;lhk ;drk ;hkd ;kdr;;hlkrddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddlfjwaofp;jwgfjewgjresgkrkl;grl;ghkdr;lghkdr;lkghdr;lhkrd;lhk ;drk ;hkd ;kdr;;hlkrdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd lfjwaofp;jwgfjewgjresgkrkl;grl;ghkdr;lghkdr;lkghdr;lhkrd;lhk ;drk ;hkd ;kdr;;hlkrdddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
        isActive: true
    }
];

const FAQTab = ({ profile, setProfile }: any) => {
    const [links, setLinks] = useState(initialLinks);
    const faqs = useSelector((state: any) => state.business.faqs);
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
            setIsPopupOpen({ createFAQPopup: false, editFAQPopup: false, popularFAQPopup: false });
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
        { label: 'Show Popular FAQs', onClick: () => setIsPopupOpen({ ...isPopupOpen, popularFAQPopup: true }), className: 'ml-2', variant: 'outlined', display: 'block' },
        { label: 'Create FAQ', onClick: () => handleCreateOrUpdateLink("CREATE"), className: 'ml-2', variant: 'contained', display: 'block' },
    ];

    const editLinkActions = [
        { label: 'Update Link', onClick: () => handleCreateOrUpdateLink("UPDATE", formValues._id), className: 'ml-2', variant: 'contained', display: 'block' },
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
        let link = links.filter((x: any) => x._id === id);
        if (link.length === 1) {
            setFormValues({ ...link[0] });
            setIsPopupOpen({ ...isPopupOpen, editFAQPopup: true });
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

        setLinks(faqs);
        hideLoader();

    }, [faqs])

    const handlePopupClose = (popupType: string) => {
        setIsPopupOpen({ ...isPopupOpen, [popupType]: false });
    }

    const getAddFAQContainer = () => {
        return (
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", width: "100%", padding: "2%" }}>
                <TextField
                    required
                    id="outlined-required"
                    label={"Question"}
                    multiline
                    rows={4}
                    sx={{ marginBottom: "4%", width: "100%" }}
                    onChange={(e) => handlePopupInputChange("question", e.target.value)}
                    value={formValues["question"]}
                />
                <TextField
                    required
                    id="outlined-required"
                    label={"Answer"}
                    multiline
                    rows={4}
                    sx={{ marginBottom: "2%", width: "100%" }}
                    onChange={(e: any) => handlePopupInputChange("answer", e.target.value)}
                    value={formValues["answer"]}
                />
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginTop: "2%" }}>
                    <Button variant='outlined' onClick={() => setIsPopupOpen({ ...isPopupOpen, popularFAQPopup: true })}>
                        Show Popular FAQS
                    </Button>
                    <Button variant='contained'>
                        Create FAQ
                    </Button>
                </div>
            </div >)
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
    return (
        <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
            <div className=" bg-white p-6 h-[800px] shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                <Stack spacing={4} width={"100%"} style={{ marginTop: "1%" }}>
                    <Card sx={{ margin: '1%', padding: "2%" }}>
                        <Box sx={{ height: "700px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant='h5'>All FAQs</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { setFormValues(initialFormData); setIsPopupOpen({ ...isPopupOpen, createFAQPopup: true }); }}
                                    sx={{ marginBottom: '20px', zIndex: 0 }}
                                >
                                    Add New FAQ
                                </Button>
                            </div>

                            <Grid container spacing={2} sx={{ padding: "1%" }}>
                                {links?.length > 0 ? links.map((link: any) => (
                                    <Grid item md={12} key={link._id} sx={{ width: "100%", height: "100%" }} >
                                        <Card sx={{ borderTop: "1px solid gray", width: "100%", height: "100%" }}>
                                            <CardContent sx={{ display: "flex", width: "100%", justifyContent: "space-between", }}>

                                                <Typography variant="h6" sx={{ marginLeft: "5%", }}>{link.title}</Typography>
                                                <CardActions sx={{ display: "flex", }}>
                                                    <EditIcon onClick={() => editLink(link._id)} sx={{ cursor: "pointer" }} />
                                                    <DeleteIcon onClick={() => deleteLink(link._id)} sx={{ cursor: "pointer" }} />
                                                </CardActions>

                                            </CardContent>

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
                        children={getAddFAQContainer()}
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


        </div>
    )
}
export default FAQTab;