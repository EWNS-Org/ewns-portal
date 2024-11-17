import { Box, Button, Card, Checkbox, DialogContent, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, TextField, Tooltip, Typography } from '@mui/material'
import HelpIcon from '@mui/icons-material/Help';
import React, { useEffect, useState }from 'react'
import AttachFileIcon from '@mui/icons-material/AttachFile';
import "./Products.css"
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { CloudUpload } from '@mui/icons-material';
import Popup from '../common/Popup';
import { useDispatch, useSelector } from 'react-redux';
import { getAllCategoriesAction } from '../../Redux/Actions/Categories/category.actions';
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import { generateProductSKU, getDimensionUnits, getWeightUnits, validateAddProduct } from '../../Helpers/common.helper';
import { addProductAction, getProductDetailsAction, getProductsBySearchAction } from '../../Redux/Actions/Products/product.actions';
import Tooltipp from '../common/Tooltip';
import RecursiveCategorySelect from '../common/RecursiveCategory';

const initProductData = {
    name: "",
    description: "",
    stock: 0,
    price: {
        mrp: 0,
        sellingPrice: 0
    },
    category:{
        categoryId: null,
        categoryName: ""
    },
    sku: "",
    gst: {
        gstRate: 0,
        hsnCode: "",
        gstInclusive: false
    },
    discount: {
        type: "percentage",
        percentage: 0,
        amount: 0
    },
    files: [],
    attributes:{
        dimensions:{
            length : 0,
            width: 0,
            height: 0,
            unit: "cm"
        },
        color: "",
        weight: {
            weight: 0,
            unit: "kg"
        },
        size: "",
        brand: "",
        material: "",
        warrantyInYears: 0
    },
    averageRating: 0,
}

function AddProduct() {
    const [productData, setProductData] = useState<any>(initProductData);
    const dispatch = useDispatch();
    const allCategories = useSelector((state: any) => state.categories.allCategories);

    const handleRemoveFile = (id: any) => {
        let upFiles = productData.files.filter((x:any) => x.url !== id)
        setProductData({...productData, files: upFiles});
    }

    const getProductFiles = () => {
        return (
            <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "start",  gap: "10px"}}>
                <div style={{ display:"flex", flexDirection: "column"}}>
                    <IconButton sx={{height: "180px", width: "250px",borderRadius: 0, }} onClick={()=>  setOpen(true)}>
                        <AttachFileIcon />
                        <Typography variant='h6' color="gray" >Add Media</Typography>
                    </IconButton>
                </div>
                {productData.files && productData.files.length > 0 && productData.files.map((file: any) => {
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
                {productData.files && productData.files.length > 0 && productData.files.map((file: any) => {
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
    const [categories, setCategories] = useState<any>([]);

    useEffect(()=>{
        async function fetchCategories(){
            let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
            await dispatch(getAllCategoriesAction(businessId) as any);
        }

        fetchCategories();
    }, [dispatch]);

    useEffect(()=>{
        setCategories(allCategories)
    }, [allCategories]);

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
        console.log(allFiles)
        setProductData({...productData, files: [...productData.files, ...allFiles]});
    };

    const handleFilesSelect = () => {
        setOpen(false);
    } 


    const handleClose = () => {
        setOpen(false);
        setProductData({...productData, files: []});
    };
    
    const [showAdditionalAttributePopup, setShowAdditionalAttributePopup] = useState(false);

    const handleAddProduct = async () => {
        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);

        if(validateAddProduct(productData)){
            let payload = productData;
            payload.files = productData?.files?.map((x:any) => x.file) || [];
            
            await dispatch(addProductAction(businessId, payload) as any);
            setProductData(initProductData);
        }
    }

    const handleCancel = () => {
        setProductData({...productData, attributes:initProductData.attributes, averageRating: 0})
        setShowAdditionalAttributePopup(false);
    }

    const handleProductNAmeAndSKU = (event: any) => {
        let sku = generateProductSKU(productData.name, productData.category.categoryName);
        setProductData({...productData, name: event.target.value, sku: sku});
    }

    const [showButton, setShowButton] = useState(false);
    const [prefillPopup, setPrefillPopup] = useState(false);
    const [searchData, setSearchData] = useState({
        searchText: "",
        searchProducts: []
    });

    const findSearchProducts = async (event: any) => {
        setSearchData({...searchData, searchText: event.target.value});
        
        if(searchData.searchText.length > 3){
            let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
            let prods = await dispatch(getProductsBySearchAction(businessId, searchData.searchText) as any);
            setSearchData({searchText: event.target.value, searchProducts: prods});
        }else{
            setSearchData({searchText: event.target.value, searchProducts: []});
        }
    }

    const prefillProductData = async (productId: any) => {
        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
        let product = await dispatch(getProductDetailsAction(businessId, productId) as any);
        delete product._id;
        delete product.sku;
        delete product.files;
        let sku = generateProductSKU(product.name, "");
        setProductData({...product, sku});
        setPrefillPopup(false);
        setSearchData({searchText: "", searchProducts: []});
    }

    useEffect(()=>{
        if(validateAddProduct(productData)){
            setShowButton(true);
        }else{
            setShowButton(false);
        }
    }, [productData])

  return (
    <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
      <div className=" bg-white p-6 h-[720px] shadow-md w-full" style={{ borderRadius: "15px" }}>
        <Stack spacing={2} width={"100%"} style={{ padding: "1%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
                    <Typography variant='h5'>Add Product</Typography>
                    <Button variant='outlined' onClick={()=>setPrefillPopup(true)}>Prefill Product Data</Button>
                </div>
              </div>
                <div style={{}}>

                    <Card className='no-scrollbar' sx={{ overflow:"auto", width:"100%", height: "200px", marginBottom: "2%", display:"flex", alignItems: "center", padding: "0% 1%"}}>
                        {getProductFiles()}
                    </Card>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom: "2%"}}>
                        <TextField
                            label="Product Name"
                            sx={{width: "20%"}}
                            value={productData.name}
                            onChange={(e)=>handleProductNAmeAndSKU(e)}
                        />
                        <div style={{width: "50%", display:"flex", justifyContent: "space-between"}}>
                            <TextField
                                label="Product MRP Price"
                                sx={{}}
                                type='number'
                                onChange={(e)=>setProductData({...productData, price: {...productData.price, mrp: parseInt(e.target.value)}})}
                                value={productData.price.mrp} 
                            />
                            <TextField
                                label="Product Selling Price"
                                sx={{}}
                                type='number'
                                value={productData.price.sellingPrice} 
                                onChange={(e)=>setProductData({...productData, price: {...productData.price, sellingPrice: parseInt(e.target.value)}})}
                            />
                            <TextField
                                label="Stock"
                                sx={{}}
                                type='number' 
                                value={productData.stock}
                                onChange={(e)=>setProductData({...productData, stock: parseInt(e.target.value)})}
                            />
                        </div>
                        <TextField
                            label="Product SKU"
                            disabled
                            sx={{width: "20%"}}
                            value={productData.sku}
                        />
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                        <TextField
                            label="Product Description"
                            multiline
                            rows={9}
                            sx={{width: "30%"}}
                            value={productData.description} 
                            onChange={(e)=>setProductData({...productData, description: e.target.value})}
                        />
                        <Card sx={{height: "240px", width: "280px", padding:"1%", overflowY: "auto", display:"flex", flexDirection: "column", justifyContent:"top", alignItems:"center"}}>
                            <Typography variant='h6' color='gray' sx={{marginBottom:"5%"}}>GST Details</Typography>
                            <div style={{display:"flex", justifyContent:"space-between", flexDirection:"column"}}>
                                <TextField 
                                    label="GST Rate %"
                                    sx={{marginBottom: "5%"}}
                                    value={productData.gst.gstRate}
                                    onChange={(e)=>setProductData({...productData, gst: {...productData.gst, gstRate: parseInt(e.target.value)}})}
                                />
                                <TextField 
                                    label="HSN Code"
                                    value={productData.gst.hsnCode}
                                    onChange={(e)=>setProductData({...productData, gst: {...productData.gst, hsnCode: e.target.value}})}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={productData.gst.gstInclusive}
                                            onChange={(e) =>
                                                setProductData({...productData, gst: {...productData.gst, gstInclusive: e.target.checked}})
                                            }
                                        />
                                    }
                                    label="Price is Inclusive of GST"
                                    sx={{}}
                            />
                            </div>
                        </Card>
                        <Card sx={{height: "240px", width: "260px", padding:"1%", overflowY: "auto", display:"flex", flexDirection: "column", justifyContent:"top", alignItems:"center"}}>
                            <Typography variant='h6' color='gray' sx={{marginBottom:"5%"}}>Discount Details</Typography>
                            <div style={{display:"flex", justifyContent:"space-between", flexDirection:"column"}}>
                                <FormControl sx={{marginBottom: "15%"}}>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="percentage"
                                        name="radio-buttons-group"
                                        value={productData?.discount?.type || "percentage"}
                                        onChange={(e)=>setProductData({...productData, discount: {...productData.discount, type: e.target.value}})}
                                    >
                                        <div style={{display: "flex", flexDirection:"row"}}>
                                            <FormControlLabel value="percentage" control={<Radio />} label="Percentage" />
                                            <FormControlLabel value="amount" control={<Radio />}     label="Amount" />
                                        </div>
                                    </RadioGroup>
                                </FormControl>
                                    
                                {productData.discount.type === "percentage" && <TextField label="Discount in %" value={productData.discount.percentage || 0} onChange={(e)=>setProductData({...productData, discount: {...productData.discount, percentage:parseInt(e.target.value)}})}/>}
                                {productData.discount.type === "amount" && <TextField label="Discount in Amount" value={productData.discount.amount || 0} onChange={(e)=>setProductData({...productData, discount: {...productData.discount, amount: parseInt(e.target.value)}})}/>}
                            </div>
                        </Card>
                        <Card sx={{height: "240px", width: "260px", padding:"1%", overflowY: "auto", display:"flex", flexDirection: "column", justifyContent:"top", alignItems:"center"}}>
                            <Typography variant='h6' color='gray' sx={{marginBottom:"5%"}}>Select Category</Typography>
                            <div style={{display:"flex", justifyContent:"space-between"}}>
                                <RecursiveCategorySelect  getCatDetails={(id: any) => setProductData({...productData, category: {categoryId: id.split("_mk_")[0], categoryName: id.split("_mk_")[1]}})}/>
                            </div>
                        </Card>
                    </div>
                    <div style={{display: "flex", justifyContent: "space-between", marginTop: "1%"}}>
                        <Button variant='outlined' onClick={()=>setShowAdditionalAttributePopup(true)}>Add Additional Attributes</Button>
                        <div style={{width:"18%", display:"flex", justifyContent:"space-between"}}>
                            <Button variant="outlined" color="primary" onClick={()=> {setProductData(initProductData)}}> Reset</Button>
                            <Button variant='contained' disabled={!showButton} onClick={() => handleAddProduct()}>Add Product</Button>
                        </div>
                    </div>
                    
                </div>
                {open && 
                <Popup header="Upload Files"
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
                                {productData.files.length > 0 ? (
                                    productData.files.map(((file: any, index: any) => (
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
                </Popup>
                }
            
                {showAdditionalAttributePopup && <Popup
                    header="Additional Attributes"
                    onClose={()=>setShowAdditionalAttributePopup(false)}
                    buttons={[{
                        label: "Done", onClick: () => setShowAdditionalAttributePopup(false), variant: "contained",
                    },{
                        label: "Cancel", onClick: () => handleCancel(), variant: "outlined"
                    }]}
                >
                    <div>
                        <Card sx={{height: "320px", width: "100%", display: "flex", padding: "1%" }}>
                            <div style={{padding:"1%", overflowY: "auto", display:"flex", flexDirection: "column", justifyContent:"top", alignItems:"center"}}>
                                <Typography variant='h6' color='gray' sx={{marginBottom:"3%"}}>Dimensions & Weight</Typography>
                                <div style={{display:"flex", justifyContent:"space-between", flexDirection:"column"}}>
                                    <TextField sx={{marginBottom: "3%"}} type="number" label="Product Width" value={productData.attributes.dimensions.width} onChange={(e)=> setProductData({...productData, attributes: {...productData.attributes, dimensions: {...productData.attributes.dimensions, width: e.target.value}}})}/>
                                    <TextField sx={{marginBottom: "3%"}} type="number" label="Product Length" value={productData.attributes.dimensions.length} onChange={(e)=> setProductData({...productData, attributes: {...productData.attributes, dimensions: {...productData.attributes.dimensions, length: e.target.value}}})}/>
                                    <TextField sx={{marginBottom: "3%"}} type="number" label="Product Height" value={productData.attributes.dimensions.height} onChange={(e)=> setProductData({...productData, attributes: {...productData.attributes, dimensions: {...productData.attributes.dimensions, height: e.target.value}}})}/>
                                    <TextField sx={{marginBottom: "3%"}} type="number" label="Product Weight" value={productData.attributes.weight.weight} onChange={(e)=> setProductData({...productData, attributes: {...productData.attributes, weight: {...productData.attributes.weight, weight: e.target.value}}})}/>
                                </div>
                            </div>
                            <div style={{padding:"1%", overflowY: "auto", display:"flex", flexDirection: "column", justifyContent:"top", alignItems:"center"}}>
                                <Typography variant='h6' color='gray' sx={{marginBottom:"3%"}}>Other Attributes</Typography>
                                <div style={{display:"flex", justifyContent:"space-between", flexDirection:"column"}}>
                                    <TextField sx={{marginBottom: "3%"}} label="Product Color" value={productData.attributes.color} onChange={(e)=> setProductData({...productData, attributes: {...productData.attributes, color: e.target.value}})}/>
                                    <TextField sx={{marginBottom: "3%"}} label="Product Size" value={productData.attributes.size } onChange={(e)=> setProductData({...productData, attributes: {...productData.attributes, size: e.target.value}})}/>
                                    <TextField sx={{marginBottom: "3%"}} label="Product Brand" value={productData.attributes.brand} onChange={(e)=> setProductData({...productData, attributes: {...productData.attributes, brand: e.target.value}})}/>
                                    <TextField sx={{marginBottom: "3%"}} label="Product Material" value={productData.attributes.material} onChange={(e)=> setProductData({...productData, attributes: {...productData.attributes, material: e.target.value}})}/>
                                </div>
                            </div>
                            <div style={{padding:"1%", overflowY: "auto", display:"flex", flexDirection: "column", justifyContent:"top", alignItems:"center"}}>
                                <Typography variant='h6' color='gray' sx={{marginBottom:"3%"}}>Units</Typography>
                                <div style={{display:"flex", justifyContent:"space-between", flexDirection:"column"}}>
                                <FormControl fullWidth sx={{marginBottom: "3%"}}>
                                        <InputLabel id={`dimension-unit`}>Dimension Unit</InputLabel>
                                        <Select
                                            labelId={`dimension-unit`}
                                            value={productData?.attributes?.dimensions?.unit || ""}
                                            onChange={(e)=>setProductData({...productData, attributes: {...productData.attributes, dimensions: {...productData.attributes.dimensions, unit: e.target.value} }})}
                                            label={`Dimension unit`}
                                        >
                                            {getDimensionUnits().map((unit: any) => (
                                            <MenuItem key={unit.symbol} value={unit.symbol}>
                                                {unit.label}
                                            </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth  sx={{marginBottom: "3%"}}>
                                        <InputLabel id={`weight-unit`}>Weights Unit</InputLabel>
                                        <Select
                                            labelId={`weight-unit`}
                                            value={productData?.attributes?.weight?.unit || ""}
                                            onChange={(e)=>setProductData({...productData, attributes: {...productData.attributes, weight: {...productData.attributes.weight, unit: e.target.value} }})}
                                            label={`Weight unit`}
                                        >
                                            {getWeightUnits().map((unit: any) => (
                                            <MenuItem key={unit.symbol} value={unit.symbol}>
                                                {unit.label}
                                            </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <TextField sx={{marginBottom: "3%"}} type="number" label="Warranty in Years" value={productData.attributes.warrantyInYears} onChange={(e)=>setProductData({...productData, attributes:{...productData.attributes, warrantyInYears: e.target.value}})}/>
                                    <TextField sx={{marginBottom: "3%"}} type="number" label="Avg Rating out of 5" value={productData.averageRating} onChange={(e)=>setProductData({...productData, averageRating: e.target.value})}/>
                                </div>
                            </div>
                        </Card>
                    </div>
                </Popup>}

        </Stack>
        {prefillPopup && 
        <Popup header={<>{"Prefill Product Data from existing product"}</>}>
            <div style={{width: "740px", height: "300px"}}>
                <TextField sx={{marginBottom: "2%"}} label="Product Search" fullWidth value={searchData.searchText} onChange={(e)=>findSearchProducts(e)} />
                    {searchData.searchText.length > 3 && searchData.searchProducts && searchData.searchProducts.length > 0 &&
                        searchData.searchProducts.map((pro: any) => {
                            return (
                            <Card sx={{width: "40%", padding:"1%", cursor: "pointer", overflow: "auto",marginBottom:"1%", display:"flex", justifyContent:"space-between"}} onClick={()=>prefillProductData(pro._id)}>
                                <div style={{  display:"flex", cursor:"pointer"}}>
                                    {<img className='' src={pro.files?.[0]?.url || "https://placehold.co/70.png?text=No+image"} style={{height: "70px", width: "80px"}} />}
                                </div>
                                <div style={{display:"flex", flexDirection:"column", justifyContent:"end"}}>
                                    <div style={{display:"flex", justifyContent:"space-between"}}>
                                        <Typography color="gray"> {"Name : "}</Typography>
                                        <Typography>{pro.name}</Typography>
                                    </div>

                                    <div style={{display:"flex", justifyContent:"space-between"}}>
                                        <Typography color="gray"> {"Selling Price : "}</Typography>
                                        <Typography>{pro.price.sellingPrice}</Typography>
                                    </div>
                                    <div style={{display:"flex", justifyContent:"space-between"}}>
                                        <Typography color="gray"> {"Category : "}</Typography>
                                        <Typography>{pro.category.categoryName}</Typography>
                                    </div>
                                </div>
                                <div>
                                </div>
                            </Card>);
                        })
                    }
                    {searchData.searchText.length > 3 && searchData.searchProducts.length === 0 && <Typography sx={{alignItems: "center"}}>No Products Found</Typography>}
            </div>
        </Popup>}
      </div>
    </div>
  )
}



export default AddProduct