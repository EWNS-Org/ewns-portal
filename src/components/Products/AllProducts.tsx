import { Box, Button, Card, Checkbox, DialogContent, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { addProductMediaAction, getAllProductsAction, getProductDetailsAction, removeProductMediaAction, updateProductAction } from '../../Redux/Actions/Products/product.actions';
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import Popup from '../common/Popup';
import CollectionsIcon from '@mui/icons-material/Collections';
import AddProduct from './AddProduct';
import { getAllCategoriesAction, getParentCategoriesAction } from '../../Redux/Actions/Categories/category.actions';
import { set } from 'date-fns';
import { getDimensionUnits, getWeightUnits } from '../../Helpers/common.helper';
import toast from 'react-hot-toast';
import { CloudUpload, Description } from '@mui/icons-material';
import { useLoader } from '../../contexts/LoaderContext';
import HelpIcon from '@mui/icons-material/Help';
import { toggleArchiveOrActiveProduct } from '../../services/api/products.service';


interface Column {
  id: 'sNo' | 'name' | 'description' | 'category' | 'price' | 'stock' | 'gst' | 'discount' | 'media';
  label: string;
  minWidth?: number;
  isIcon: boolean;
  isTooltip: boolean;
}

const columns: readonly Column[] = [
  { id: 'sNo', label: 'S.No.', minWidth: 80, isIcon: false, isTooltip: false },
  { id: 'name', label: 'Name', minWidth: 150, isIcon: false, isTooltip: false },
  { id: 'description', label: 'Description', minWidth: 150, isIcon: false, isTooltip: true },
  {
    id: 'category',
    label: 'Category',
    minWidth: 150,
    isIcon: false,
    isTooltip: true
  },
  {
    id: 'price',
    label: 'Price',
    minWidth: 150,
    isIcon: false,
    isTooltip: false
  },
  {
    id: 'stock',
    label: 'Stock',
    minWidth: 150,
    isIcon: false,
    isTooltip: false
  },
  {
    id: 'gst',
    label: 'GST Details',
    minWidth: 150,
    isIcon: false,
    isTooltip: true
  },{
    id: 'media',
    label: 'Media',
    minWidth: 150,
    isIcon: true,
    isTooltip: false
  },{
    id: 'discount',
    label: 'Discount',
    minWidth: 150,
    isIcon: false,
    isTooltip: true
  }
];


function AllProducts({handleTabChange}: any) {
  const [rows, setRows] = useState([{}]);
  const allProducts = useSelector((state: any) => state.products.allProducts);
  const productDetails = useSelector((state: any) => {
    return state.products.productDetails
  });
  const allCategories = useSelector((state:any) => state.categories.allCategories);
  const dispatch = useDispatch();
  const {showLoader, hideLoader} = useLoader();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [parentCategories, setParentCategories] = useState<any>(null);
  const [updateProductData,setUpdateProductData] = useState<any>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  useEffect(()=>{
    async function fetchProducts(){
      showLoader();
      let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
      await dispatch(getAllProductsAction(businessId, page, rowsPerPage) as any);
      hideLoader();
    }
    fetchProducts();
  }, [dispatch])

  useEffect(()=>{
    setRows(allProducts?.products);

  }, [allProducts]);

  const [updatedFiles, setUpdatedFiles] = useState<any>([]);
  const [open, setOpen] = useState(false);

  const handleAddMedia = async () => {
    showLoader();
    let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    await dispatch(addProductMediaAction(businessId, updateProductData._id, updatedFiles) as any);
    await dispatch(getProductDetailsAction(businessId, updateProductData._id) as any);
    setUpdateProductData(productDetails);
    setOpen(false);
    setShowPopup({...showPopup, editPopup: false});
    await dispatch(getAllProductsAction(businessId, page, rowsPerPage) as any);
    hideLoader();
  }

  const handleRemoveMedia = async (id: any, isAll: boolean) => {
    showLoader();
    let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    await dispatch(removeProductMediaAction(businessId, updateProductData._id, isAll ? "all" : id) as any);
    await handleProductEdit(updateProductData._id);
    setShowPopup({...showPopup, editPopup: false});
    await dispatch(getAllProductsAction(businessId, page, rowsPerPage) as any);
    hideLoader();
  }

  const [showPopup, setShowPopup] = useState({
    viewPopup: false,
    editPopup: false
  })
 

  const handleProductView = async (id: any) => {
    showLoader();
    let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    await dispatch(getProductDetailsAction(businessId, id) as any);
    setShowPopup({...showPopup, viewPopup: true});
    hideLoader();
  }

  const handleProductEdit = async (id: any) => {
    showLoader();
    let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    let data = await dispatch(getProductDetailsAction(businessId, id) as any);
    setUpdateProductData({...data});
    setShowPopup({...showPopup, editPopup: true});
    await dispatch(getAllProductsAction(businessId, page, rowsPerPage) as any);
    hideLoader();
  }

  const [categories, setCategories] = useState<any>([]);

  useEffect(()=>{
      async function fetchCategories(){
        showLoader();
        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
        await dispatch(getAllCategoriesAction(businessId) as any);
        hideLoader();
      }

      fetchCategories();
  }, [dispatch]);

  useEffect(()=>{
      setCategories(allCategories)
  }, [allCategories]);

  useEffect(()=>{
  async function fetchPArentCAts(){
    showLoader();
    let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    let parentCategories = await dispatch(getParentCategoriesAction(businessId, productDetails?.category?.categoryId) as any);
    setParentCategories(parentCategories);
    hideLoader();
  }

  if(!parentCategories)
    fetchPArentCAts();
}, [productDetails]);

  const RecursiveCategorySelect = ({ options, level = 0, getCatDetails, parentCategories, index = 0 }: any) => {
    const [selectedCategory, setSelectedCategory] = useState('');
  
    const handleCategoryChange = (event: any) => {
      console.log(event.target.value, options);
      setSelectedCategory(event.target.value as string);
      getCatDetails(event.target.value);
    };
    
    useEffect(()=>{
      if(parentCategories && index < parentCategories.length){
        setSelectedCategory(parentCategories[index]._id + "_mk_" + parentCategories[index].name);
      }
    }, [parentCategories]);
  
    const selectedCategoryObj = options && options.find((cat: any) => cat._id+"_mk_"+cat.name === selectedCategory);
  
    return (
      <Box sx={{  width:"100%", marginTop: "1%" }}>
        <FormControl fullWidth sx={{marginBottom: "8%"}}>
          {selectedCategory && <>
            <InputLabel id={`category-label-${level}`}>Category Level {level + 1}</InputLabel>
          <Select
            labelId={`category-label-${level}`}
            value={selectedCategory}
            onChange={handleCategoryChange}
            label={`Category Level ${level + 1}`}
            disabled
          >
            <MenuItem value="">
              <em>Select a category</em>
            </MenuItem>
            {options && options.map((category: any) => (
              <MenuItem key={category._id} value={category._id + "_mk_" + category.name} >
                {category.name}
              </MenuItem>
            ))}
          </Select></>}
        </FormControl>
  
        {selectedCategoryObj?.subcategories?.length > 0 && (
          <RecursiveCategorySelect level={level + 1} getCatDetails={getCatDetails} parentCategories={parentCategories} index={index + 1} />
        )}
      </Box>
    );
  };

  const updateProduct = async () => {
    showLoader();
    if(JSON.stringify(updateProductData) === JSON.stringify(productDetails)){
      toast.error("Nothing to update !!");
    }else{
      let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
      let updates = {...updateProductData};
      let pid = JSON.parse(JSON.stringify(updates._id));

      delete updates._id;
      delete updates.businessId;
      delete updates.userId;
      delete updates.files;
      delete updates.sku;
      await dispatch(updateProductAction(businessId, pid, {
        ...updates
      }) as any);
      await dispatch(getProductDetailsAction(businessId, pid) as any);
      await dispatch(getAllProductsAction(businessId, page, rowsPerPage) as any);
      setUpdateProductData(productDetails);
      setShowPopup({...showPopup, editPopup: false});
    }
    hideLoader();
  }
  const handleClose = () => {
    setOpen(false);
    setUpdatedFiles([]);
  };

  const handleFileUpload = (event: any) => {
    showLoader();
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
    setUpdatedFiles(allFiles);
    hideLoader();
  };

  const handleProductDelete = async (id: any) => {
    showLoader();
    let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
    let res : any= await toggleArchiveOrActiveProduct(businessId, id, "isArchive", true);
    if(!res?.isSuccess){
      toast.error(res?.message);  
    }
    await dispatch(getAllProductsAction(businessId, page, rowsPerPage) as any);
    hideLoader();
  }

  return (
    <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
      <div className=" bg-white p-6 h-[720px] shadow-md w-full" style={{ borderRadius: "15px" }}>
        <Stack spacing={4} width={"100%"} style={{ padding: "1%" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
               <Typography variant='h5'>All Products</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={()=> handleTabChange("Add Product")}
                  sx={{  backgroundColor: "rgba(89, 50, 234, 1)" }}
                >
                  Add New Product
                </Button>
              </div>

              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              {rows && rows.length === 0 ? <div style={{display:"flex", justifyContent: "center"}}>
                          No Products
                        </div> : <TableContainer sx={{ maxHeight: 500 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        {columns.map((column: any) => (
                          <TableCell
                            key={column.id}
                            align={"center"}
                            style={{ minWidth: column.minWidth, fontWeight:"bold", fontSize: "15px" }}
                          >
                            {column.label}
                          </TableCell>
                        ))}
                        <TableCell align={"center"} style={{ minWidth: 150, fontWeight:"bold", fontSize: "15px" }}>
                          Actions
                        </TableCell>
                      </TableRow>

                    </TableHead>
                    <TableBody>
                      {rows && rows?.length > 0 && rows?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row: any, index: any) => {
                          return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                  <TableCell align={"center"}>
                                    {index + 1}
                                  </TableCell>
                                  {row?.name && row.name.length > 18 ? 
                                      <Tooltip placement="top" title={row.name} arrow>
                                        <TableCell sx={{cursor: "pointer"}} align={"center"}>
                                          { row.name.slice(0,18) + "..."}
                                        </TableCell>    
                                      </Tooltip> : 
                                      <TableCell align={"center"}>
                                      { row.name}
                                    </TableCell>
                                  }
                                  {row?.description && row.description.length > 18 ? 
                                      <Tooltip placement="top" title={row.description} arrow>
                                        <TableCell sx={{cursor: "pointer"}} align={"center"}>
                                          { row.description.slice(0,18) + "..."}
                                        </TableCell>    
                                      </Tooltip> : 
                                      <TableCell align={"center"}>
                                      { row.description}
                                    </TableCell>
                                  }
                                  <TableCell align={"center"}>
                                    {row?.category?.categoryName || "-"}
                                  </TableCell>
                                  <TableCell align={"center"}>
                                    {row?.price?.sellingPrice || "-"}
                                  </TableCell>
                                  <TableCell align={"center"}>
                                    {row.stock || "-"}
                                  </TableCell>
                                  <TableCell align={"center"}>
                                    {row?.gst?.gstRate + `% (${row?.gst?.gstInclusive ? "Incl" : "excl"})`}
                                  </TableCell>
                                  <TableCell align={"center"} sx={{cursor: "pointer"}} onClick={()=>handleProductView(row._id)}>
                                        {<img src={row?.files?.[0]?.url || "https://placehold.co/70.png?text=No+Image"} width="40px" height="40px"/>}
                                  </TableCell>
                                  <TableCell align={"center"}>
                                    {row?.discount?.type === "percentage" ? row?.discount?.percentage + "%" : row?.discount?.amount}
                                  </TableCell>
                                  <TableCell align={"center"} sx={{display: "flex"}}>
                                    <IconButton onClick={()=>handleProductEdit(row._id)}>
                                      <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={()=>handleProductView(row._id)}>
                                      <VisibilityIcon />
                                    </IconButton>
                                    <IconButton>
                                      <DeleteIcon onClick={()=>handleProductDelete(row._id)}/>
                                    </IconButton>
                                  </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </TableContainer>}

                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={rows?.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
              
              {showPopup.viewPopup && <Popup header={"Product Details"} onClose={()=>setShowPopup({...showPopup, viewPopup: false})}>
                <div>
                  <Typography variant="h5" color="gray">Product Media</Typography>
                  <Card className='no-scrollbar' sx={{ overflow:"auto", width:"100%", height: "200px", marginBottom: "2%", display:"flex", alignItems: "center", padding: "0% 1%"}}>
                    <div style={{display: "flex", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: productDetails?.files && productDetails?.files.length === 0 ? "center" : "start",  gap: "10px"}}>
                        {productDetails.files.map((file: any) => {
                          return (
                              <div className='relative' style={{  display:"flex", cursor:"pointer"}} key={file.url}>
                                {file.type === "video" ? 
                                <video className='transition-transform duration-300 ease-in-out transform hover:scale-110' controls={true} style={{height: "180px", width: "250px", maxWidth:0}}>
                                  <source type="video/mp4" src={file.url} />
                                  <source type="video/3pg" src={file.url} />
                                  <source type="video/mkv" src={file.url} />
                                  <source type="video/avi" src={file.url} />
                                </video> : <img className='transition-transform duration-300 ease-in-out transform hover:scale-110' src={file.url} style={{height: "180px", width: "250px", maxWidth:"250px"}} />}
                              </div>
                          )
                        })}
                        {productDetails?.files.length === 0 && <Typography variant='h4' color="gray">No Product Media</Typography>}
                    </div>
                  </Card>
                </div>
                <Card sx={{height: "100%", width: "100%", padding:"1%", overflowY: "auto", display:"flex", justifyContent:"space-between", marginBottom: "2%"}}>
                  <div style={{display: "flex", flexDirection: "column", width:"40%", padding: "1%", height: "100%"}}>
                    <div style={{display:"flex", justifyContent:"space-between", }}>
                      <Typography variant='h6' color="gray">Name:</Typography>                          
                      <Typography variant='h6' >{productDetails.name}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">Stock:</Typography>                          
                      <Typography variant='h6' >{productDetails.stock + ` (${productDetails.availability})`}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">GST:</Typography>                          
                      <Typography variant='h6' >{productDetails.gst.gstRate + `% (${productDetails.gst.gstInclusive ? "Incl" : "Excl"})`}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">Category:</Typography>                          
                      <Typography variant='h6' >{productDetails.category.categoryName || "-"}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">Discount:</Typography>                          
                      <Typography variant='h6' >{productDetails.discount.type === "percentage" ? `${productDetails.discount.percentage}%` : `${productDetails.discount.amount}`}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">Selling Price:</Typography>                          
                      <Typography variant='h6' >{productDetails.price.sellingPrice}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">MRP:</Typography>                          
                      <Typography variant='h6' >{productDetails.price.mrp}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">Avg Rating:</Typography>                          
                      <Typography variant='h6' >{productDetails.averageRating || "-"}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">Brand:</Typography>                          
                      <Typography variant='h6' >{productDetails?.attributes?.brand || "-"}</Typography>                          
                    </div>
                  </div>
                  <div style={{display: "flex", flexDirection: "column", width:"40%", height: "100%", padding: "1%"}}>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">SKU:</Typography>                          
                      <Typography variant='h6' >{productDetails.sku || "-"}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">Length:</Typography>                          
                      <Typography variant='h6' >{productDetails?.attributes?.dimensions?.length ? (productDetails?.attributes?.dimensions?.length +" "+ productDetails?.attributes?.dimensions?.unit) : "-"}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">Width:</Typography>                          
                      <Typography variant='h6' >{productDetails?.attributes?.dimensions?.width ? (productDetails?.attributes?.dimensions?.width + " "+productDetails?.attributes?.dimensions?.unit) : "-"}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">Height:</Typography>                          
                      <Typography variant='h6' >{productDetails?.attributes?.dimensions?.height ? (productDetails?.attributes?.dimensions?.height + " "+productDetails?.attributes?.dimensions?.unit) : "-"}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">Color:</Typography>                          
                      <Typography variant='h6' >{productDetails?.attributes?.color ? (productDetails?.attributes?.color) : "-"}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">Size:</Typography>                          
                      <Typography variant='h6' >{productDetails?.attributes?.size  || "-"}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">Material:</Typography>                          
                      <Typography variant='h6' >{productDetails?.attributes?.material || "-"}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">Weight:</Typography>                          
                      <Typography variant='h6' >{productDetails?.attributes?.weight?.weight ? (productDetails.attributes.weight.weight + " " +productDetails.attributes.weight.unit) : "-"}</Typography>                          
                    </div>
                    <div style={{display:"flex", justifyContent:"space-between"}}>
                      <Typography variant='h6' color="gray">Warranty:</Typography>                          
                      <Typography variant='h6' >{productDetails?.attributes?.warrantyInYears ? productDetails?.attributes?.warrantyInYears + " Years" : "-"}</Typography>                          
                    </div>
                  </div>
                </Card>
                <Card sx={{height: "100%", width: "100%", padding:"1%", overflowY: "auto", display:"flex", flexDirection:"column"}}>
                  <Typography sx={{marginBottom: "2%"}} variant='h6' color="gray">Description:</Typography>
                  <Typography>{productDetails.description}</Typography>
                </Card>
                  
              </Popup>}

              {showPopup.editPopup && updateProductData && <Popup header="Edit Product" onClose={()=>setShowPopup({...showPopup, editPopup: false})}>
                 {<div>
                    <Card className='no-scrollbar' sx={{ overflow:"auto", width:"100%", height: "200px", marginBottom: "2%", display:"flex", alignItems: "center", padding: "0% 1%"}}>
                      <div style={{display: "flex", width: "100%", flexDirection: "row", alignItems: "center", justifyContent: productDetails?.files && productDetails?.files.length === 0 ? "center" : "start",  gap: "10px"}}>
                        <div style={{ display:"flex", flexDirection: "column"}}>
                          <IconButton sx={{height: "180px", width: "250px",borderRadius: 0, }} onClick={()=> setOpen(true)}>
                              <AttachFileIcon />
                              <Typography variant='h6' color="gray" >Add Media</Typography>
                          </IconButton>
                        </div>

                        {updateProductData.files.map((file: any) => {
                          return (
                            <div className='relative' style={{  display:"flex", cursor:"pointer"}} key={file.url}>
                              {file.type === "video" ? 
                              <video className='transition-transform duration-300 ease-in-out transform hover:scale-110' controls={true} style={{height: "180px", width: "250px", maxWidth:0}}>
                                <source type="video/mp4" src={file.url} />
                                <source type="video/3pg" src={file.url} />
                                <source type="video/mkv" src={file.url} />
                                <source type="video/avi" src={file.url} />
                              </video> : <img className='transition-transform duration-300 ease-in-out transform hover:scale-110' src={file.url} style={{height: "180px", width: "250px", maxWidth:"250px"}} />}
                              <button
                                className="absolute top-2 right-2 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full p-1"
                                onClick={() => handleRemoveMedia(file?._id, false)}>
                                &#10005;
                              </button>
                            </div>
                          )
                        })}
                        {updateProductData?.files.length === 0 && <Typography variant='h4' color="gray">No Product Media</Typography>}
                        {updateProductData?.files?.length > 0 && <div style={{ display:"flex", flexDirection: "column"}}>
                            <IconButton sx={{height: "180px", width: "250px",borderRadius: 0, }} onClick={()=> handleRemoveMedia(null, true)}>
                                <AttachFileIcon />
                                <Typography variant='h6' color="gray" >Delete All</Typography>
                            </IconButton>
                          </div>
                        }
                      </div>
                    </Card>
                    <div style={{display:"flex", width:"100%", justifyContent:"space-between", flexDirection:"column", marginBottom:"1%"}}>
                      <Card sx={{height: "250px", marginBottom:"1%", width: "100%", display: "flex", padding: "2%", justifyContent:"space-between" }}>
                        <div style={{display:"flex", justifyContent:"space-between", width:"33%", flexDirection:"column"}}>
                          <TextField 
                            label="Product Name"
                            sx={{marginBottom: "5%"}}
                            value={updateProductData?.name}
                            onChange={(e)=>setUpdateProductData({...updateProductData, gst: {...updateProductData.gst, gstRate: parseInt(e.target.value)}})}
                          />
                          <TextField 
                            label="GST Rate %"
                            sx={{marginBottom: "5%"}}
                            value={updateProductData?.gst?.gstRate}
                            onChange={(e)=>setUpdateProductData({...updateProductData, gst: {...updateProductData.gst, gstRate: parseInt(e.target.value)}})}
                          />
                          <TextField 
                            label="HSN Code"
                            value={updateProductData?.gst?.hsnCode}
                            onChange={(e)=>setUpdateProductData({...updateProductData, gst: {...updateProductData.gst, hsnCode: e.target.value}})}
                          />
                          <FormControlLabel
                            control={
                                <Checkbox
                                  checked={updateProductData?.gst?.gstInclusive}
                                  onChange={(e) =>
                                      setUpdateProductData({...updateProductData, gst: {...updateProductData.gst, gstInclusive: e.target.checked}})
                                  }
                                />
                            }
                            label="Price is Inclusive of GST"
                            sx={{}}
                          />
                        </div>
                        <div style={{display:"flex", justifyContent:"space-between",width:"30%", flexDirection:"column"}}>
                            <TextField 
                              label="MRP"
                              sx={{marginBottom: "5%"}}
                              value={updateProductData?.price?.mrp}
                              onChange={(e)=>setUpdateProductData({...updateProductData, gst: {...updateProductData.gst, gstRate: parseInt(e.target.value)}})}
                            />
                            <TextField 
                              label="Selling Price"
                              sx={{marginBottom: "2%"}}
                              value={updateProductData?.price?.sellingPrice}
                              onChange={(e)=>setUpdateProductData({...updateProductData, gst: {...updateProductData.gst, gstRate: parseInt(e.target.value)}})}
                            />
                            <FormControl sx={{marginBottom: "2%"}}>
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue="percentage"
                                    name="radio-buttons-group"
                                    value={updateProductData?.discount?.type || "percentage"}
                                    onChange={(e)=>setUpdateProductData({...updateProductData, discount: {...updateProductData.discount, type: e.target.value}})}
                                >
                                  <div style={{display: "flex", flexDirection:"row"}}>
                                      <FormControlLabel value="percentage" control={<Radio />} label="Percentage" />
                                      <FormControlLabel value="amount" control={<Radio />}     label="Amount" />
                                  </div>
                                </RadioGroup>
                            </FormControl>
                                
                            {updateProductData?.discount?.type === "percentage" && <TextField label="Discount in %" value={updateProductData?.discount?.percentage || 0} 
                            onChange={(e)=>setUpdateProductData({...updateProductData, discount: {...updateProductData.discount, percentage:parseInt(e.target.value)}})}
                            />}
                            {updateProductData?.discount?.type === "amount" && <TextField label="Discount in Amount" value={updateProductData?.discount?.amount || 0} 
                            onChange={(e)=>setUpdateProductData({...updateProductData, discount: {...updateProductData.discount, amount: parseInt(e.target.value)}})}
                            />}   
                        </div>
                        <div style={{display:"flex", flexDirection: "column",width:"30%"}}>
                          <Typography variant='h6' color='gray' sx={{marginBottom:"5%"}}>Category Details <Tooltip title="Category cannot be changed" arrow><HelpIcon/></Tooltip></Typography>
                          <div style={{display:"flex", justifyContent:"space-between", overflowY: "auto", padding:"1%"}} >
                              <RecursiveCategorySelect options={categories} 
                                getCatDetails={(id: any) => {setParentCategories(null); 
                                  setUpdateProductData({...updateProductData, category: {categoryId: id.split("_mk_")[0], categoryName: id.split("_mk_")[1]}})}}
                                parentCategories={parentCategories}
                                index={0}
                              />
                          </div>
                        </div>
                      </Card>
                      <Card sx={{height: "100%", width: "100%", display:"flex", flexDirection: "column", justifyContent:"top", padding:"2%"}}>
                        <Typography variant='h6' color='gray' >Description:</Typography>
                        <TextField
                          multiline
                          rows={4}
                          value={updateProductData.description}
                          onChange={(e)=>setUpdateProductData({...updateProductData, description: e.target.value})}
                        />
                      </Card>
                    </div>
                    <Card sx={{height: "350px", width: "100%", display: "flex", padding: "1%", flexDirection:"column", marginBottom: "1%" }}>
                        <Typography variant='h6' color='gray' >Additional Attributes</Typography>
                        <div style={{display:'flex'}}>
                          <div style={{padding:"1%", overflowY: "auto", display:"flex", flexDirection: "column", justifyContent:"top", alignItems:"center"}}>
                              <Typography variant='h6' color='gray' sx={{marginBottom:"3%"}}>Dimensions & Weight</Typography>
                              <div style={{display:"flex", justifyContent:"space-between", flexDirection:"column"}}>
                                  <TextField sx={{marginBottom: "3%"}} type="number" label="Product Width" value={updateProductData.attributes.dimensions.width} onChange={(e)=> setUpdateProductData({...updateProductData, attributes: {...updateProductData.attributes, dimensions: {...updateProductData.attributes.dimensions, width: e.target.value}}})}/>
                                  <TextField sx={{marginBottom: "3%"}} type="number" label="Product Length" value={updateProductData.attributes.dimensions.length} onChange={(e)=> setUpdateProductData({...updateProductData, attributes: {...updateProductData.attributes, dimensions: {...updateProductData.attributes.dimensions, length: e.target.value}}})}/>
                                  <TextField sx={{marginBottom: "3%"}} type="number" label="Product Height" value={updateProductData.attributes.dimensions.height} onChange={(e)=> setUpdateProductData({...updateProductData, attributes: {...updateProductData.attributes, dimensions: {...updateProductData.attributes.dimensions, height: e.target.value}}})}/>
                                  <TextField sx={{marginBottom: "3%"}} type="number" label="Product Weight" value={updateProductData.attributes.weight.weight} onChange={(e)=> setUpdateProductData({...updateProductData, attributes: {...updateProductData.attributes, weight: {...updateProductData.attributes.weight, weight: e.target.value}}})}/>
                              </div>
                          </div>
                          <div style={{padding:"1%", overflowY: "auto", display:"flex", flexDirection: "column", justifyContent:"top", alignItems:"center"}}>
                              <Typography variant='h6' color='gray' sx={{marginBottom:"3%"}}>Other Attributes</Typography>
                              <div style={{display:"flex", justifyContent:"space-between", flexDirection:"column"}}>
                                  <TextField sx={{marginBottom: "3%"}} label="Product Color" value={updateProductData.attributes.color} onChange={(e)=> setUpdateProductData({...updateProductData, attributes: {...updateProductData.attributes, color: e.target.value}})}/>
                                  <TextField sx={{marginBottom: "3%"}} label="Product Size" value={updateProductData.attributes.size } onChange={(e)=> setUpdateProductData({...updateProductData, attributes: {...updateProductData.attributes, size: e.target.value}})}/>
                                  <TextField sx={{marginBottom: "3%"}} label="Product Brand" value={updateProductData.attributes.brand} onChange={(e)=> setUpdateProductData({...updateProductData, attributes: {...updateProductData.attributes, brand: e.target.value}})}/>
                                  <TextField sx={{marginBottom: "3%"}} label="Product Material" value={updateProductData.attributes.material} onChange={(e)=> setUpdateProductData({...updateProductData, attributes: {...updateProductData.attributes, material: e.target.value}})}/>
                              </div>
                          </div>
                          <div style={{padding:"1%", overflowY: "auto", display:"flex", flexDirection: "column", justifyContent:"top", alignItems:"center"}}>
                              <Typography variant='h6' color='gray' sx={{marginBottom:"3%"}}>Units</Typography>
                              <div style={{display:"flex", justifyContent:"space-between", flexDirection:"column"}}>
                              <FormControl fullWidth sx={{marginBottom: "3%"}}>
                                      <InputLabel id={`dimension-unit`}>Dimension Unit</InputLabel>
                                      <Select
                                          labelId={`dimension-unit`}
                                          value={updateProductData?.attributes?.dimensions?.unit || ""}
                                          onChange={(e)=>setUpdateProductData({...updateProductData, attributes: {...updateProductData.attributes, dimensions: {...updateProductData.attributes.dimensions, unit: e.target.value} }})}
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
                                          value={updateProductData?.attributes?.weight?.unit || ""}
                                          onChange={(e)=>setUpdateProductData({...updateProductData, attributes: {...updateProductData.attributes, weight: {...updateProductData.attributes.weight, unit: e.target.value} }})}
                                          label={`Weight unit`}
                                      >
                                          {getWeightUnits().map((unit: any) => (
                                          <MenuItem key={unit.symbol} value={unit.symbol}>
                                              {unit.label}
                                          </MenuItem>
                                          ))}
                                      </Select>
                                  </FormControl>
                                  <TextField sx={{marginBottom: "3%"}} type="number" label="Warranty in Years" value={updateProductData.attributes.warrantyInYears} onChange={(e)=>setUpdateProductData({...updateProductData, attributes:{...updateProductData.attributes, warrantyInYears: e.target.value}})}/>
                                  <TextField sx={{marginBottom: "3%"}} type="number" label="Avg Rating out of 5" value={updateProductData.averageRating} onChange={(e)=>setUpdateProductData({...updateProductData, averageRating: e.target.value})}/>
                              </div>
                          </div>
                        </div>
                    </Card>
                    <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                       <Button variant='outlined' onClick={()=>{setUpdateProductData(null); setShowPopup({...showPopup, editPopup: false});}}>Cancel</Button>
                       <div style={{width: "30%", display:"flex", justifyContent: "space-between"}}>
                       <Button variant='outlined' onClick={()=>setUpdateProductData(productDetails)}>Reset</Button>
                       <Button variant='contained' onClick={()=>updateProduct()}>Update</Button>
                       </div>
                    </div>
                  </div>}
              </Popup>}

              {open && 
                <Popup header="Upload Files"
                    buttons={[{
                        label: "Cancel", onClick: ()=>handleClose(), variant:"outlined"
                    },{
                        label: "Add Files", onClick: ()=>handleAddMedia(), variant:"contained"
                    }]}
                    onClose={handleClose}
                >
                    <DialogContent>
                        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                            {/* File Input */}
                            <Button variant="contained" component="label" startIcon={<CloudUpload />}>
                                Select Files
                                <input type="file" accept=".mkv,.jpg,.mp4,.3gp,.avi,.png,.gif" max={2} hidden multiple onChange={handleFileUpload} />
                            </Button>

                            <Box mt={2} sx={{display:"flex", flexWrap: "wrap", justifyContent:"space-between"}}>
                                {updatedFiles && updatedFiles?.files?.length > 0 ? (
                                    updatedFiles.map(((file: any, index: any) => (
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
          </Stack>
      </div>
    </div>
  )
}


export default AllProducts