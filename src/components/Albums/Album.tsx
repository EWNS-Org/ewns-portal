import { Button, Card, FormControl, IconButton, InputLabel, MenuItem, Select, Stack } from '@mui/material'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AddImagesInAlbumsAction, createAlbumsAction, getAllAlbumsAction } from '../../Redux/Actions/Albums/albums.actions';
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import Popup from '../common/Popup';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import toast from 'react-hot-toast';
import WindowIcon from '@mui/icons-material/Window';
import ReorderIcon from '@mui/icons-material/Reorder';
import "./Album.css";

let albums = [{
    name: "Album 1",

}]

function Albums() {

    const [albums, setAlbums] = useState<any>([]);
    const [isCreateAlbumOpen, setIsCreateAlbumOpen] = useState(false);
    const [createAlbumData, setCreateAlbumData] = useState<any>({
        title: "",
        description: ""
    });

    const allAlbums = useSelector((state: any) => {
        console.log(state);
        return state.albums.allAlbums;
    });

    const dispatch = useDispatch();

    useEffect(()=>{
        async function fetchAlbums() {
            let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
            await dispatch(getAllAlbumsAction(businessId) as any);
        }

        fetchAlbums();
    }, []);

    const createAlbumInputs = [
        { label: 'Album Title', name: 'title', type: 'text', width: "100%" },
        { label: 'Album Description', name: 'description', type: 'text', width: "100%" },
    ];



    useEffect(()=>{
        setAlbums(allAlbums);
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

        await dispatch(createAlbumsAction(businessId, createAlbumData) as any);

        await dispatch(getAllAlbumsAction(businessId) as any);
    }

    const createAlbumActions = [
        { label: 'Cancel', onClick: ()=> setIsCreateAlbumOpen(false), className: 'mr-2', variant: 'outlined', display: "block", width: "48%"},
        { label: 'Create Album', onClick: ()=>createNewAlbum(), className: 'mr-2', variant: 'contained', display: "block", width: "48%" },
    ];

    const [view, setView] = useState('list'); 
    const [sortType, setSortType] = useState('name');
  
    const sortFiles = (type: string) => {
      const sortedFiles = [...albums].sort((a: any, b: any) => {
        if (type === 'name') {
          return a.title.localeCompare(b.title);
        } else if (type === 'createdAt') {
          return ((new Date(a[type]) as any) - (new Date(b[type]) as any));
        }
        return 0;
      });
      setAlbums(sortedFiles);
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

    const getFolderData = (folder: any) => {
        return (
        <div key={folder._id} className="folder-item">
            <div className="folder-icon">{'📁'}</div>
            <div className="folder-details">
                <div>{folder.title}</div>
            </div>
        </div>
        )
    }

    const getFileData = (file: any) => {
        return (
        <div key={file._id} className="file-item">
            <div className="file-icon">{'📄'}</div>
            <div className="file-details">
                <div>{file.title}</div>
            </div>
        </div>
        )
    }
    return (
    <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
        <div className=" bg-white p-6 h-[800px] shadow-md w-full" style={{ borderRadius: "15px" }}>
            <Stack spacing={4} width={"100%"} style={{ }}>
                <Card sx={{ padding: "2%", height: "760px" }}>
                  <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                    <Button onClick={()=>{setIsCreateAlbumOpen(true)}} variant='contained' sx={{width:"20%", marginRight:"5%"}}>Add New Folder</Button>
                    <div style={{ width: "20%", display:"flex", justifyContent:"space-between" }}>
                    <FormControl sx={{ width: "100%" }} >
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
                    <IconButton onClick={toggleView}>
                            {view === 'list' ?  <WindowIcon /> : <ReorderIcon />}
                        </IconButton>
                    </div>
                  </div>
                  <div style={{marginTop: "2%"}}>
                    <div className={view === 'list' ? 'list-view' : 'grid-view'}>
                        { albums && albums.length > 0 && albums.map((album: any) => (
                            getFolderData(album)
                        ))}
                        { albums && albums.albums && albums.albums.length > 0 && albums.albums.map((album: any) => (
                            getFolderData(album)
                        ))}
                        { albums && albums.images && albums.images.length > 0 && albums.images.map((album: any) => (
                            getFileData(album)
                        ))}
                        { albums && albums.videos && albums.videos.length > 0 && albums.videos.map((album: any) => (
                            getFileData(album)
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
    </div>
    )
}

export default Albums