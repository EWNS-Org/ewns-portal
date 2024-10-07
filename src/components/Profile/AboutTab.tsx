import { Button, Card, Stack, TextField, Typography } from "@mui/material";
import RichEditor from "../common/BundledRichEditor/RichEditor";
import { useCallback, useEffect, useRef, useState } from "react";
import Popup from "../common/Popup";
import { fetchLongDescriptions, fetchShortDescriptions } from "../../services/api/business.service";
import { ACTIVE_BUSINESS_ID } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { updateBusinessProfileAction } from "../../Redux/Actions/BusinessActions/business.actions";

const AboutUsTab = ({ profile, setProfile }: any) => {

    const editorRef = useRef(null);
    const generateRef =useRef(undefined);
    const [profileDetails, setProfileDetails] = useState(profile);
    const [hideSubmit, setHideSubmit] = useState(true);

    const dispatch = useDispatch();
    
    const [showAutoGeneratePopup, setShowAutoGeneratePopup] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        pageSize: 1
    });
    const [selectedDescription, setSelectedDescription] = useState({
        isShortSelected: false,
        isLongSelected: false
    });

    const [descriptions, setDescriptions] = useState<any>({
        short: "",
        long: ""
    })

    useEffect(()=>{
        if(JSON.stringify(profile) === JSON.stringify(profileDetails)){
            setHideSubmit(true);
        }else{
            setHideSubmit(false);
        }
    }, [profileDetails])

    async function fetchDescriptions(){
        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
        let shortDescription = await fetchShortDescriptions(businessId, pagination.pageSize, pagination.page);
        let longDescription = await fetchLongDescriptions(businessId, pagination.pageSize, pagination.page);
        return {short: shortDescription?.length > 0 ? shortDescription[0] : {}, long: longDescription?.length > 0 ? longDescription[0] : {}}
    }

    const popupContent = () =>{
        return (<div style={{display: "flex", flexDirection:"column", justifyContent:"space-between", height: "750px"}}>
            <div style={{display:"flex", justifyContent:"space-between", padding:"2%"}}>
                <Button onClick={()=>handlePagination("PREVIOUS")} variant="contained" disabled={pagination.page === 1}>Previous</Button>
                <Button onClick={()=>handlePagination("NEXT")} variant="contained">Next</Button>
            </div>
            <div>
                <Card sx={{ padding: "2% 2%", width: "100%", display: "flex", flexDirection:"column" }}>
                <Typography variant="h6">Short Description</Typography>
                    <div style={{ cursor: "pointer", padding: "2% 2%", width: "90%" }} >
                        <Typography color="gray">{descriptions.short}</Typography>
                    </div>
                    <Button onClick={()=>{setProfileDetails({...profileDetails,shortBio: descriptions.short}); setSelectedDescription({...selectedDescription, isShortSelected: true});}} variant="outlined">Select Short Description </Button>
                </Card>
            </div>
            <div>
                <Card sx={{ padding: "2% 2%", width: "100%", display: "flex", flexDirection:"column"}}>
                <Typography variant="h6">Long Description</Typography>
                <div style={{cursor:"pointer", padding: "2% 2%",}}>
                <RichEditor
                disabled={true}
                    onInit={(_evt: any, editor: any) => generateRef.current = editor}
                    initialValue={"<html>" + descriptions.long + "</html>"}
                    init={{
                        height: 450,
                        width: "100%",
                        menubar: false,
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    }}
                />
                </div>
                <Button onClick={()=>{setProfileDetails({ ...profileDetails, description: ("<html>"+ descriptions.long+"</html>")}); setSelectedDescription({...selectedDescription, isLongSelected: true});}} variant="outlined">Select Long Description </Button>

                </Card>
            </div>
        </div>);
    }

    useEffect(()=>{
        if(selectedDescription.isLongSelected && selectedDescription.isShortSelected){
            setShowAutoGeneratePopup(false);
            setPagination({
                page: 1,
                pageSize: 1
            });

        }
    }, [selectedDescription])

    useEffect(()=>{
       async function fetch(){
            let data : any= await fetchDescriptions();
            setDescriptions({...descriptions, long: data.long, short: data.short});
        }

        if(pagination.page)
        fetch();
    }, [pagination.page])

    const handleGenerateDescription = () => {
        setShowAutoGeneratePopup(true);
    };

    const handlePagination = (val: any) => {
        if(val === "NEXT"){
            setPagination({...pagination, page: pagination.page + 1});
        }
        if(val === "PREVIOUS"){
            setPagination({...pagination, page: pagination.page - 1});
        }
    }

    const handleUpdateProfile = async () => {
        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
        let isFormChanged = JSON.stringify(profileDetails) !== JSON.stringify(profile);
        if (isFormChanged) {
            dispatch(updateBusinessProfileAction(profileDetails, businessId) as any);
        }
    }

    return (
        <div className="container  w-full" style={{ fontFamily: "source Sans pro" }}>
            <div className=" bg-white p-4 h-[680px] shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                <Stack width={"100%"} style={{  }}>
                    <Card sx={{ padding: "2%", height:"560px" }}>
                        <div className="h-full w-full ">
                            <div className="mb-2" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                                <h2 className="text-xl font-semibold mb-4">Short Description</h2>
                                <Button variant="contained" onClick={()=>handleGenerateDescription()} sx={{backgroundColor: "rgba(89, 50, 234, 1)"}}>Generate With AI</Button>
                            </div>

                            <div className="">
                                <TextField
                                    required
                                    id="outlined-required"
                                    label="Short Description"
                                    multiline
                                    rows={4}
                                    sx={{ width: "100%" }}
                                    onChange={(e: any) => setProfileDetails({ ...profileDetails, shortBio: e.target.value })}
                                    value={profileDetails.shortBio}
                                />
                            </div>
                            <div className="w-full">
                                <h2 className="text-xl font-semibold mb-1">Description</h2>

                                <div className='editordiv w-full'>
                                    <RichEditor
                                        onInit={(_evt: any, editor: any) => editorRef.current = editor}
                                        initialValue={profileDetails.description}
                                        init={{
                                            height: 340,
                                            width: "100%",
                                            menubar: false,
                                            plugins: [
                                                'advlist', 'anchor', 'autolink', 'link', 'lists',
                                                'searchreplace', 'table', 'wordcount', 'code', 'directionality', 'media', 'preview', 'image', 'emoticons'
                                            ],
                                            toolbar: 'undo redo | blocks | ' +
                                                'bold italic underline forecolor | alignleft aligncenter ' +
                                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                                'code directionality media table preview image emoticons',
                                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

                                        }}

                                        onChange={() => {setProfileDetails({ ...profileDetails, description: (editorRef.current as any).getContent()}); setHideSubmit(true); }}
                                    />
                                </div>

                            </div>
                        </div>
                    </Card>
                </Stack>

                <div style={{display:"flex", justifyContent:"space-between", marginTop: "2%"}}>
                    <Button variant='outlined' >
                        Reset
                    </Button>
                    <Button variant='contained' onClick={handleUpdateProfile} disabled={hideSubmit}>
                        Update Profile
                    </Button>
                </div>
            </div>
            {showAutoGeneratePopup && <Popup 
                children={popupContent()}
                onClose={()=>setShowAutoGeneratePopup(false)}
                header={"Generate Descriptions"}
                inputs={[{label: "Next", onClick: () => handlePagination("NEXT"), variant: "contained"}]}
            />}
        </div>
    );
};

export default AboutUsTab;