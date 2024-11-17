import { Avatar, Box, Button, Card, CardActions, CardContent, CardMedia, DialogContent, FormControlLabel, Grid, IconButton, ListItemAvatar, Stack, styled, Switch, SwitchProps, TextField, Tooltip, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Popup from '../common/Popup';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import { useLoader } from '../../contexts/LoaderContext';import DeleteIcon from '@mui/icons-material/Delete';
import { generateProductSKU, getAvatar, removeHtmlTags } from '../../Helpers/common.helper';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { CloudUpload } from '@mui/icons-material';
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import { createBlogAction, deleteBlogAction, getAllBlogsAction, toggleBlogAction, updateBlogAction } from '../../Redux/Actions/Blogs&Services/blogs&services.actions';
import RecursiveCategorySelect from '../common/RecursiveCategory';
import RichEditor from '../common/BundledRichEditor/RichEditor';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { format } from 'date-fns';
import RichTextViewer from '../common/RichTextViewer';


function Blogs() {
    const [Blogs, setBlogs] = useState([]);
    const allBlogs = useSelector((state: any) => {
        return state.blogsAndServices.allBlogs;
    });

    const editorRef = useRef();
    const [isPopupOpen, setIsPopupOpen] = useState({
        editBlogPopup: false,
        createBlogPopup: false,
        popularBlogPopup: false
    })
    const dispatch = useDispatch();

    const { showLoader, hideLoader } = useLoader();

    const initialFormData = {
        _id: "",
        title: "",
        subTitle: "",
        description: "",
        category: {
            categoryId: "",
            categoryName: ""
        },
        files: [],
        sku: "",
        comments: [],
        bloggerName: ""
    };
    const [blogData, setBlogData] = useState<any>(null);

    const handleCreateOrUpdateBlog = async (type: any, id: any = null) => {
        try {
            showLoader();
            console.log(blogData);
            blogData.sku = generateProductSKU(blogData.title, blogData.category.categoryName);

            let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);

            if (!blogData.description || blogData.description === "") {
                toast.error("Please add feedback.");
                hideLoader();
                return;
            }

            if (!blogData.title || blogData.title === "") {
                toast.error("Please add title");
                hideLoader();
                return;
            }

            if (!blogData.subTitle || blogData.subTitle === "") {
                toast.error("Please add title");
                hideLoader();
                return;
            }

            if (type === "CREATE") {
                await dispatch(createBlogAction(businessId, blogData) as any);
            } else if (type === "UPDATE") {
                await dispatch(updateBlogAction(businessId, id, blogData) as any);
            }
            setIsPopupOpen({ createBlogPopup: false, editBlogPopup: false, popularBlogPopup: false });
            setBlogData(initialFormData);
            await dispatch(getAllBlogsAction(businessId) as any);
        }
        catch (error: any) {
            toast.error("Unable to create address");
        }
        finally {
            hideLoader();
        }
    }

    const handleInputChange = (field: any, value: any) => {
        setBlogData((prevValues:any) => ({...prevValues, [field]: value}));
    }

    const editLinkActions = [
        { label: 'Update Blog', onClick: () => handleCreateOrUpdateBlog("UPDATE", blogData._id), className: 'ml-2', variant: 'contained', display: 'block' },
    ];


    const editLink = (id: any) => {
        let link = allBlogs.filter((x: any) => x._id === id);
        if (link.length === 1) {
            setBlogData({ ...link[0] });
            setIsPopupOpen({ ...isPopupOpen, editBlogPopup: true });
        }
    };

    const deleteLink = async (id: any) => {
        showLoader();
        const businessId = localStorage.getItem("activeBusinessId");
        await dispatch(deleteBlogAction(businessId, id) as any);
        await dispatch(getAllBlogsAction(businessId) as any);
        hideLoader();
    }

    useEffect(() => {
        showLoader();

        async function getAllBlogs() {
            let businessId = localStorage.getItem("activeBusinessId");

            if (businessId)
                await dispatch(getAllBlogsAction(businessId) as any)
        }

        getAllBlogs();
        hideLoader();
    }, []);

    useEffect(() => {
        showLoader();
        console.log(allBlogs)
        setBlogs(allBlogs);
        hideLoader();

    }, [allBlogs, dispatch]);

    const handlePopupClose = (popupType: string) => {
        setIsPopupOpen({ ...isPopupOpen, [popupType]: false });
    }


    const toggleFAQ = async (id: any, isChecked: any) => {
        let bussId = localStorage.getItem("activeBusinessId");
        await dispatch(toggleBlogAction(bussId, id, isChecked) as any);
        await dispatch(getAllBlogsAction(bussId) as any);
    }



    const getPopularBlogs = () => {
        return (
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", width: "100%" }}>
                {[].map((blog: any) => {
                    return (
                        <Card sx={{ margin: 'auto', mb: 2, padding: "2%", width: "100%" }}>
                            <div style={{ cursor: "pointer", padding: "2%", }} onClick={() => { setBlogData({ ...blogData, title: blog.title, feedback: blog.feedback }); setIsPopupOpen({ ...isPopupOpen, popularBlogPopup: false, createBlogPopup: true }); }}>
                                <Typography variant='h5' sx={{fontWeight:"bold"}}>{blog.title}</Typography>
                                <Typography variant='h6' color='gray' >{blog.feedback}</Typography>
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
            setBlogData({...blogData, userLogo: imageUrl});
        else{
            if(file.type.startsWith("image")){
                setBlogData({...blogData, image: [{url: imageUrl, file: file}]});
            }else{
                setBlogData({...blogData, video: [{url: imageUrl, file: file}]});
            }
        }
      }

      console.log(blogData)
    };
  
    // Function to trigger the file input click
    const handleIconClick = (isLogo: boolean) => {
        if(isLogo) logoInputRef.current.click();
        else fileInputRef.current.click();
    };


    const handleCloseIconClick = () => {
        setBlogData({...blogData, userLogo: null});
    }

    const handleRemoveFile = (id: any) => {
        let upFiles = blogData.files.filter((x:any) => x.url !== id)
        setBlogData({...blogData, files: upFiles});
    }
    const [open, setOpen] = useState(false);

    const handleFileUpload = (event: any) => {
        const selectedFiles : any = Array.from(event.target.files);
        let allFiles = [];
        for(let file of selectedFiles){
            allFiles.push({
                type: file.type.startsWith("image") ? "image" : "video",
                file: file,
                url: URL.createObjectURL(file),
                _id: null
            });
        }
        setBlogData({...blogData, files: [...blogData.files, ...allFiles]});
    };

    const handleFilesSelect = () => {
        setOpen(false);
    } 


    const handleClose = () => {
        setOpen(false);
        setBlogData({...blogData, files: []});
    };

    const getProductFiles = () => {
        return (
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "start",  gap: "10px"}}>
                <div style={{ display:"flex", flexDirection: "column"}}>
                    <IconButton sx={{height: "180px", width: "250px",borderRadius: 0, }} onClick={()=> setOpen(true)}>
                        <AttachFileIcon />
                        <Typography variant='h6' color="gray" >Add Media</Typography>
                    </IconButton>
                </div>
                {blogData.files && blogData.files.length > 0 && blogData.files.map((file: any) => {
                    return (
                        <div className='relative' style={{  display:"flex", cursor:"pointer"}} key={file.url}>
                            {file && file.type === "video" &&
                            <>
                                <video className='transition-transform duration-300 ease-in-out transform hover:scale-110' controls={true} style={{height: "180px", width: "250px", maxWidth:0}}>
                                    <source type="video/mp4" src={file.url} />
                                    <source type="video/3pg" src={file.url} />
                                    <source type="video/mkv" src={file.url} />
                                    <source type="video/avi" src={file.url} />
                                </video> 
                            
                            <button
                                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-1"
                                onClick={() => handleRemoveFile(file?.url)}
                            >
                                &#10005;
                            </button></>
                            }
                        </div>  
                    )
                })}
                {blogData.files && blogData.files.length > 0 && blogData.files.map((file: any) => {
                    return (
                        <div className='relative' style={{ display:"flex", cursor:"pointer"}} key={file.url}>
                            {file && file.type === "image" && 
                            <><img className='transition-transform duration-300 ease-in-out transform hover:scale-110' src={file.url} style={{height: "180px", width: "250px", maxWidth:"250px"}} />
                            <button 
                                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-1"
                                onClick={() => handleRemoveFile(file?.url)}
                            >
                                &#10005;
                            </button></>
                            }
                        </div>  
                    )
                })}
            </div>
        );
    };

    const getBlogInputs = () => {
        return (
            <div>
                <Card className='no-scrollbar' sx={{ overflow:"auto", width:"100%", height: "200px", marginBottom: "2%", display:"flex", alignItems: "center", padding: "0% 1%"}}>
                    {getProductFiles()}
                </Card>
                <div style={{display:"flex", width: "100%", justifyContent:"space-between"}}>
                    <div style={{display:"flex", flexDirection:"column", width:"60%", justifyContent:"space-between"}}>
                        <TextField 
                            label="Blog Title"
                            multiline
                            rows="2"
                            fullWidth
                            sx={{marginBottom: "2%"}}
                            value={blogData.title}
                            onChange={(e: any)=>handleInputChange("title", e.target.value)}
                        />
                        <TextField 
                            label="Blog Sub Title"
                            fullWidth
                            multiline
                            rows="2"
                            sx={{marginBottom: "2%"}}
                            value={blogData.subTitle}
                            onChange={(e: any)=>handleInputChange("subTitle", e.target.value)}
                        />
                        <TextField 
                            label="User Name"
                            fullWidth
                            sx={{marginBottom: "2%"}}
                            value={blogData.bloggerName}
                            onChange={(e: any)=>handleInputChange("bloggerName", e.target.value)}
                        />
                    </div>
                    <Card sx={{height: "240px", width: "35%", padding:"1%", overflowY: "auto", display:"flex", flexDirection: "column", justifyContent:"top", alignItems:"center"}}>
                    <Typography variant='h6' color='gray' sx={{marginBottom:"5%"}}>Select Category</Typography>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <RecursiveCategorySelect getCatDetails={(id: any) => setBlogData({...blogData, category: {categoryId: id.split("_mk_")[0], categoryName: id.split("_mk_")[1]}})}/>
                    </div>
                </Card>

                </div>
                
                <div className='editordiv w-full mb-[2%]'>
                    <Typography>Blog Content</Typography>
                    <RichEditor
                        onInit={(_evt: any, editor: any) => editorRef.current = editor}
                        initialValue={blogData.description}
                        init={{
                            height: 340,
                            width: "100%",
                            menubar: false,
                            plugins: [
                                'advlist', 'anchor', 'autolink', 'link', 'lists',
                                'searchreplace', 'table', 'wordcount', 'code', 'directionality', 'files', 'preview', 'image', 'emoticons'
                            ],
                            toolbar: 'undo redo | blocks | ' +
                                'bold italic underline forecolor | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'code directionality files table preview image emoticons',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

                        }}
                        onChange={() => {setBlogData({ ...blogData, description: (editorRef.current as any).getContent()}); }}
                    />
                </div>
                <div style={{display:"flex", justifyContent: "space-between"}}>
                    <Button variant='outlined' className='' onClick={() => setIsPopupOpen({ ...isPopupOpen, popularBlogPopup: true })}>
                        Popular Blogs
                    </Button>
                    <Button variant='contained' className='ml-2' onClick={() => handleCreateOrUpdateBlog("CREATE")}>
                        Create Blog
                    </Button>
                </div>
            </div>
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
        <div className="w-full h-full" style={{ fontFamily: "source Sans pro" }}>
            <div className="  shadow w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
                <Stack spacing={4} width={"100%"} style={{ padding: "2%",  }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant='h5'>Blogs</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => { setBlogData(initialFormData); setIsPopupOpen({ ...isPopupOpen, createBlogPopup: true }); }}
                            sx={{  zIndex: 0, backgroundColor: "rgba(89, 50, 234, 1)" }}
                        >
                            Add New Blog
                        </Button>
                    </div>
                    <Grid container spacing={4} style={{overflow: "auto", height: "600px", padding: "1%"}}>
                        {Blogs && Blogs.length >  0 && Blogs.map((blog: any) => (
                            <Grid 
                                item xs={12} sm={6} md={4} key={blog._id} 
                                style={{transition: 'transform 0.3s ease', transform: 'scale(1)', cursor: "pointer"}} 
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                            <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: "space-between" }}>
                                <div
                                style={{
                                    overflow: 'hidden',
                                    position: 'relative',
                                    height: "45%"
                                }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="100%"
                                        image={blog.media && blog.media.length > 0 ? blog.media[0].url : 'https://placehold.co/600x400.png?text=No+Image'}
                                        alt={blog.title}
                                    />
                                </div>

                                <CardContent sx={{ flexGrow: 1 }} style={{display: "flex", flexDirection: "column", justifyContent: "space-between"}} >
                                    <Typography variant="h6" component="div"  gutterBottom>
                                        {blog.title}
                                    </Typography>
                                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                                        {blog.subTitle}
                                    </Typography>

                                    <Box display="flex" alignItems="center" mb={1} >
                                        <Typography variant="body2" color="text.secondary">
                                            {`Category: ${blog.category?.categoryName}`}
                                        </Typography>
                                        <Box sx={{ flexGrow: 1 }} />
                                        <Tooltip title={`Blogger: ${blog.bloggerName}`}>
                                        <ListItemAvatar>
                                            <Avatar style={{width: 36, height: 36, }} {...getAvatar(blog?.bloggerName)} />
                                        </ListItemAvatar>
                                        </Tooltip>
                                    </Box>

                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {removeHtmlTags(blog.description)}
                                    </Typography>
                                </CardContent>

                                <Box display="flex" alignItems="center" px={2} py={1} bgcolor="background.paper">
                                <Typography variant="caption" color="text.secondary">
                                    {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                                </Typography>
                                <Box sx={{ flexGrow: 1 }} />
                                <Tooltip title={`${blog.comments.length} Comments`}>
                                    <Typography variant="body2" color="text.secondary">
                                    {blog.comments.length} Comments
                                    </Typography>
                                </Tooltip>
                                </Box>
                            </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
            </div>
            <div style={{ height: "50%" }}>
                {
                    isPopupOpen.createBlogPopup && <Popup
                        header={"Create New Blog"}
                        onClose={() => handlePopupClose("createBlogPopup")}
                    >{getBlogInputs()}</Popup>
                }

                {
                    isPopupOpen.editBlogPopup && <Popup
                        header={"Update Blog"}
                        onClose={() => handlePopupClose("editBlogPopup")}
                    >{getBlogInputs()}</Popup>
                }

                {
                    isPopupOpen.popularBlogPopup && <Popup
                        header={"Popular Blogs"}
                        onClose={() => handlePopupClose("popularBlogPopup")}
                        children={getPopularBlogs()}
                    />
                }
            </div>
            <div>
                {open && <Popup header="Upload Files"
                    buttons={[{
                        label: "Cancel", onClick: ()=>handleClose(), variant:"outlined"
                    },{
                        label: "Add Files", onClick: ()=>handleFilesSelect(), variant:"contained"
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
                                {blogData?.files?.length > 0 ? (
                                    blogData.files.map(((file: any, index: any) => (
                                        <Box key={index} mt={2} display="flex" alignItems="center">
                                            {file.type === "image" ? (
                                                <img
                                                    src={file.url}
                                                    alt={file.name}
                                                    style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "10px" }}
                                                />
                                            ) : (
                                                file.type === "video" ? <video src={file.url}
                                                style={{ width: "100px", height: "100px", objectFit: "cover", marginRight: "10px" }}
                                                ></video> : <></>
                                            )}
                                        </Box>
                                    ))
                                )) : (
                                    <Typography variant="body2">No files selected</Typography>
                                )}
                            </Box>
                        </Box>
                    </DialogContent>
                </Popup>}
            </div>
        </div >
    )
}

export default Blogs