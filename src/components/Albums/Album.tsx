import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddImagesInAlbumsAction, AddVideosInAlbumAction, createAlbumsAction, createSubAlbumsAction, getAlbumDetailsAction, getAllAlbumsAction } from '../../Redux/Actions/Albums/albums.actions';
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import Popup from '../common/Popup';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import toast from 'react-hot-toast';
import WindowIcon from '@mui/icons-material/Window';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReorderIcon from '@mui/icons-material/Reorder';
import "./Album.css";
import { set } from 'date-fns';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import FolderIcon from '@mui/icons-material/Folder';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { CloudUpload, PhotoCamera } from '@mui/icons-material';
import { useLoader } from '../../contexts/LoaderContext';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ImageIcon from '@mui/icons-material/Image';

const allowedFileExtentions = ["mkv", "jpg", "mp4", "3gp", "avi", "png", "gif"];

function Albums() {

    const [albums, setAlbums] = useState<any>([]);
    const [currentAlbum, setCurrentAlbum] = useState<any>(null);
    const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
    const [isUploadFilesOpen, setIsUploadFilesOpen] = useState(false);
    const [createAlbumData, setCreateAlbumData] = useState<any>({
        name: "",
        description: ""
    });

    const allAlbums = useSelector((state: any) => {
        return state.albums.allAlbums;
    });

    const albumDetails = useSelector((state: any) => {
        return state.albums.albumDetails;
    })

    const dispatch = useDispatch();

    useEffect(()=>{
        async function fetchAlbums() {
            let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
            await dispatch(getAllAlbumsAction(businessId) as any);
        }

        fetchAlbums();
    }, []);

    const createAlbumInputs = [
        { label: 'Album Title', name: 'name', type: 'text', width: "100%" },
        { label: 'Album Description', name: 'description', type: 'text', width: "100%" },
    ];



    useEffect(()=>{
        if(allAlbums?.length > 0){
            setAlbums(allAlbums)
        }
    }, [allAlbums]);

    const createNewAlbum = async () => {
        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);

        if (!createAlbumData.name && createAlbumData.name === ""){
            toast.error("Album name cannot be empty");
            return;
        }

        if (!createAlbumData.description && createAlbumData.description === ""){
            toast.error("Album description cannot be empty");
            return;
        }

        if(currentAlbum){
            await dispatch(createAlbumsAction(businessId, {...createAlbumData, parentAlbum: currentAlbum._id}) as any);
        }else{
            await dispatch(createAlbumsAction(businessId, {...createAlbumData, parentAlbum: null}) as any);
        }

        await dispatch(getAllAlbumsAction(businessId) as any);
        await dispatch(getAllAlbumsAction(businessId) as any);
        setIsCreateAlbumOpen(false);
    }

    const createAlbumActions = [
        { label: 'Cancel', onClick: ()=> setIsCreateAlbumOpen(false), className: 'mr-2', variant: 'outlined', display: "block", width: "48%"},
        { label: 'Create Album', onClick: ()=>createNewAlbum(), className: 'mr-2', variant: 'contained', display: "block", width: "48%" },
    ];

    const [view, setView] = useState('grid'); 
    const [currentFile, setCurrentFile] = useState<any>({
        type: "",
        file: null
    }); 
    const [sortType, setSortType] = useState('name');
    const {showLoader, hideLoader} = useLoader();

    const sortFiles = (type: string) => {
        let albs = currentAlbum ? currentAlbum.subAlbums : albums;
      const sortedFiles = [...albs].sort((a: any, b: any) => {
        if (type === 'name') {
          return a.name.localeCompare(b.name);
        } else if (type === 'createdAt') {
          return ((new Date(a[type]) as any) - (new Date(b[type]) as any));
        }
        return 0;
      });

        if(currentAlbum)
            setCurrentAlbum({...currentAlbum, subAlbums: sortedFiles});
        else
            setAlbums(sortedFiles);

            console.log(sortedFiles)
    };
  
    // Handle the sort change
    const handleSortChange = (e: any) => {
      setSortType(e.target.value);
      sortFiles(e.target.value);
    };
  
    // Toggle between list and grid views
    const toggleView = () => {
      setView(view === 'list' ? 'grid' : 'list');
    };

    const getFolderData = (folder: any, type: any) => {
        return (
        <div key={folder._id} className="folder-item" onClick={type ? ()=>handleFileOpen(folder, type) : ()=>openFolder(folder._id)}>
            <div>
                {type === "video" ? <PlayCircleIcon/> : type === "image" ? <ImageIcon /> : <FolderIcon sx={{color: "black"}} />}
            </div>
            <div className="folder-details">
                <Typography  className='texxt' color="gray"> {type ? folder.title : folder.name}</Typography>
            </div>
        </div>
        )
    }

    const handleFileOpen = (file: any, type: any) => {
        setIsFileOpen(true);
        setCurrentFile({
            type, file
        });
    }

    useEffect(()=>{
        setCurrentAlbum(albumDetails);
    }, [albumDetails])


    const openFolder = async (id: any) => {
        showLoader();
        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
        await dispatch(getAlbumDetailsAction(businessId, id) as any);
        hideLoader();
    }

    const checkRecursion = (albs: any) => {
        for(let alb of albs){
            if(alb._id === currentAlbum.parentAlbum){
                setCurrentAlbum(alb);
                return;
            }
            checkRecursion(alb.subAlbums);
        }
        return;
    }

    const handleBack = (albumss: any) => {
        if(currentAlbum && currentAlbum?.parentAlbum !== null){
            checkRecursion(albumss);
        }else{
            setCurrentAlbum(null);
        }
    };
    const [open, setOpen] = useState(false);
    const [files, setFiles] = useState<any>([]);
    const [fileNames, setFileNames] = useState([]);
    const [isFileOpen, setIsFileOpen] = useState(false);

    const handleFileUpload = (event: any) => {
        const selectedFiles : any = Array.from(event.target.files);
        setFiles(selectedFiles);
        setFileNames(selectedFiles.map((file: any) => file.name));
        console.log(files, fileNames);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFiles([]);
        setFileNames([]);
    };

    const handleFileNameChange = (index: any, newFileName: any) => {
        const updatedFileNames: any = [...fileNames];
        updatedFileNames[index] = newFileName;
        setFileNames(updatedFileNames);
    };

    const UploadFiles = async () => {
        showLoader();
        try{
            const images = [];
        const videos = [];

        for(let i=0; i<files.length; i++){
            if(files[i].type.startsWith("image/")){
                images.push({
                    file: files[i],
                    title: fileNames[i]
                })
            }else if (files[i].type.startsWith("video/")){
                videos.push({
                    file: files[i],
                    title: fileNames[i]
                })
            }else{
                return;
            }
        }

        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);

        for(let image of images){
            await dispatch(AddImagesInAlbumsAction(businessId, currentAlbum._id, {file: image.file}, image.title) as any);
        }

        for(let video of videos){
            await dispatch(AddVideosInAlbumAction(businessId, currentAlbum._id, {file: video.file}, video.title) as any);
        }
        }
        catch(Err){
            console.log(Err);
        }

        hideLoader();
        handleClose();
    }

    const getNextFile = (val: any) => {
        let isFound = false;
        for(let file of currentAlbum.images){
            if(isFound) {
                setCurrentFile({file: file, type: "image"});
                return true;
            }
            if(currentFile.file._id === file._id){
                isFound = true;
            }
        }
        for(let file of currentAlbum.videos){
            if(isFound) setCurrentFile({file: file, type: "video"});
            if(currentFile.file._id === file._id){
                isFound = true;
            }
        }
    }

    const getPreviousFile = () => {
        let isFound = false;
        for(let i = currentAlbum.images.length - 1; i>=0; i--){
            if(isFound){
                setCurrentFile({file: currentAlbum.images[i], type: "image"});
                return;
            }
            if(currentFile.file._id === currentAlbum.images[i]._id){
                isFound = true;
            }
        }
        for(let i = currentAlbum.videos.length - 1; i>=0; i--){
            if(isFound){
                setCurrentFile({file: currentAlbum.videos[i], type: "video"});
                return;
            }
            if(currentFile.file._id === currentAlbum.videos[i]._id){
                isFound = true;
            }
        }
    }

    return (
    <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
        <div className=" bg-white p-6 h-[800px] shadow-md w-full" style={{ borderRadius: "15px" }}>
            <Stack spacing={4} width={"100%"} style={{ }}>
                <Card sx={{ padding: "2%", height: "760px" }}>
                  <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                    <Typography variant='h4'>Albums</Typography>
                    <div style={{ width: "30%", display:"flex", justifyContent:"space-between" }}>
                        <Button variant='outlined' onClick={()=>{handleClickOpen()}} sx={{display:"flex", width:"50%", justifyContent:"space-between" }}>
                            <Typography>Upload Files</Typography>
                            <CloudUploadIcon />
                        </Button>

                        <FormControl sx={{ width: "40%" }} >
                            <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                onChange={handleSortChange}
                                value={sortType}
                                label="Sort By"
                            >
                                <MenuItem value={'name'}>{"Name"}</MenuItem>
                                <MenuItem value={'createdAt'}>{"Added On"}</MenuItem>
                            </Select>
                        </FormControl>
                        <div onClick={toggleView}  style={{alignContent: "center", cursor:"pointer"}}>
                            {view === 'list' ?  <WindowIcon /> : <ReorderIcon />}
                        </div>
                    </div>
                  </div>
                  <div style={{marginTop: "2%"}}>
                    <div style={{display:"flex", alignItems: "center"}}>
                        <IconButton onClick={()=>handleBack(albums)} disabled={currentAlbum === null}>
                            <ArrowBackIcon />
                        </IconButton>
                    <Typography color="gray">{ (currentAlbum && "/Home" + currentAlbum?.path) || "/Home"}</Typography>
                    </div>
                    <div className={view === 'list' ? 'list-view' : 'grid-view'} style={{height: view === "list" ? "600px" : "600px", overflow:"auto"}}>
                        <div className="folder-item" style={{cursor: "pointer"}} onClick={()=>{setIsCreateAlbumOpen(true)}}>
                                <CreateNewFolderIcon sx={{color:"black"}} />
                            <div className="folder-details">
                                <Typography className='texxt' color="gray"> {"New Album"}</Typography>
                            </div>
                        </div>
                        { !currentAlbum && albums && albums?.length > 0 && albums.map((album: any) => (
                            getFolderData(album, null)
                        ))}
                        {  currentAlbum && currentAlbum?.subAlbums?.length > 0 && currentAlbum?.subAlbums?.map((album: any) => (
                            getFolderData(album, null)
                        ))}
                        {  currentAlbum && currentAlbum?.images?.length > 0 && currentAlbum?.images?.map((album: any) => (
                            getFolderData(album, "image")
                        ))}
                        {  currentAlbum && currentAlbum?.videos?.length > 0 && currentAlbum?.videos?.map((album: any) => (
                            getFolderData(album, "video")
                        ))}
                    </div>
                    </div>
                </Card>
            </Stack>
        </div>

        {isCreateAlbumOpen && <Popup
            formValues={createAlbumData}
            setFormValues={setCreateAlbumData}
            handleInputChange={(field: any, value: any)=>setCreateAlbumData({...createAlbumData, [field]: value})}
            onClose={()=>setIsCreateAlbumOpen(false)}
            inputs={createAlbumInputs}
            buttons={createAlbumActions}
            header="Create Album"
        />}

            {open && <Popup header="Upload Files"
            buttons={[{
                label: "Cancel", onClick: ()=>handleClose(), variant:"outlined"
            },{
                label: "Upload", onClick: ()=>UploadFiles(), variant:"contained"
            }]}
            >
            <DialogContent>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                    {/* File Input */}
                    <Button variant="contained" component="label" startIcon={<CloudUpload />}>
                        Select Files
                        <input type="file" accept=".mkv,.jpg,.mp4,.3gp,.avi,.png,.gif" max={2} hidden multiple onChange={handleFileUpload} />
                    </Button>

                    <Box mt={2} sx={{display:"flex", flexWrap: "wrap", justifyContent:"space-between"}}>
                        {files.length > 0 ? (
                            files.map(((file: any, index: any) => (
                                <Box key={index} mt={2} display="flex" alignItems="center">
                                    {file.type.startsWith("image/") ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "10px" }}
                                        />
                                    ) : (
                                        file.type.startsWith("video/") ? <video src={URL.createObjectURL(file)}
                                        style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "10px" }}
                                        ></video> : <></>
                                    )}
                                    <TextField
                                        label="File Name"
                                        value={fileNames[index]}
                                        onChange={(e) => handleFileNameChange(index, e.target.value)}
                                        variant="outlined"
                                        fullWidth
                                    />
                                </Box>
                            ))
                        )) : (
                            <Typography variant="body2">No files selected</Typography>
                        )}
                    </Box>
                </Box>
            </DialogContent>
    </Popup>
            }

            {isFileOpen && 
            <Popup
            onClose={()=>{setIsFileOpen(false); setCurrentFile(null)}}
            header={"File Preview"}
            >
                <Typography variant='h6' color='gray'>{currentFile.file.title}</Typography>
                {currentFile.type === "image" ? <img width="100%" height="400px" src={currentFile.file.originalUrl} /> : 
                <video width="100%" height="400"  controls={true}>
                    <source type="video/mp4" src={currentFile.file.url} />
                    <source type="video/3pg" src={currentFile.file.url} />
                    <source type="video/mkv" src={currentFile.file.url} />
                    <source type="video/avi" src={currentFile.file.url} />
                </video>}
                <div style={{display:"flex", justifyContent:"space-between", marginTop:"2%"}}>
                    <Button variant='outlined' onClick={getPreviousFile}>Previous</Button>
                    <Button variant="contained" onClick={getNextFile} >Next</Button>
                </div>
            </Popup>}
    </div>
    )
}

  

export default Albums