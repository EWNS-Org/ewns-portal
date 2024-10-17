import { Box, Button, Card, IconButton, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCategoryAction, addSubCategoryAction, deleteCategoryAction, deleteSubCategoryAction, getAllCategoriesAction, getCategoryDetailsAction, getSubCategoryDetailsAction, updateCategoryAction, updateSubCategoryDetailsAction } from '../../Redux/Actions/Categories/category.actions';
import { ACTIVE_BUSINESS_ID } from '../../utils/constants';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem2 } from '@mui/x-tree-view/TreeItem2';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Popup from '../common/Popup';
import toast from 'react-hot-toast';
import { getSubCategoryById } from '../../Helpers/common.helper';
import { Description } from '@mui/icons-material';



const collectNodeIds = (node: any) => {
    const ids = [node._id];
    if (node.subCategories && node.subCategories.length > 0) {
      node.subCategories.forEach((subCategory: any) => {
        ids.push(...collectNodeIds(subCategory));
      });
    }
    return ids;
};

function AllCategories() {

    const { categoryDetails, allCategories} = useSelector((state:any) => {
        return state.categories
    });

    const [isPopupOpen, setIsPopupOpen] = useState({
      update: false,
      create: false,
      createSub: false,
      updateSub: false,
      view: false,
      viewSub: false
    });

    const [formValues, setFormValues] = useState<any>({
      name: "",
      description: "",
      imageUrl: "",
      categoryId: "",
      subCategoryId: "",
      parentCategoryId: ""
    });

    const [categories, setCategories] = useState<any>(null);
    const [previewData, setPreviewData] = useState<any>(null);

    const [expanded, setExpanded] = useState([]);

 


    const dispatch = useDispatch();
    

    useEffect(()=>{
        async function fetchCategories() {
            let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
            await dispatch(getAllCategoriesAction(businessId) as any);
        }
        fetchCategories();
    }, [dispatch]);

    useEffect(()=>{
        setCategories(allCategories);
    }, [allCategories]);

      const handleEdit = async (id: any, parentId: any, categoryId: any) => {

        if(id === parentId && id === categoryId){
          let cat : any= await getSubCategoryById(id,  categories, parentId);
          setIsPopupOpen({...isPopupOpen, update: true});
          setFormValues({name: cat.name, description: cat.description, imageUrl: cat.imageUrl, categoryId : id, parentCategoryId: id, subCategoryId: id});
        }else{
          let cat : any= await getSubCategoryById(id,  categories, categoryId);
          setIsPopupOpen({...isPopupOpen, updateSub: true});  
          setFormValues({name: cat.name, description: cat.description, imageUrl: cat.imageUrl, categoryId : categoryId, parentCategoryId: parentId, subCategoryId: id});
        }
      };
      
      const handleView = async (id: any, parentId: any, categoryId: any) => {
        if(id === parentId && id === categoryId){
          let data = await getSubCategoryById(id, categories, parentId);
          setFormValues({...data, categoryId : categoryId, parentCategoryId: parentId, subCategoryId: id});
          setIsPopupOpen({...isPopupOpen, view: true});
        }else{
          setIsPopupOpen({...isPopupOpen, viewSub: true});
          let data = await getSubCategoryById(id, categories, categoryId);
          setFormValues({...data, categoryId : categoryId, parentCategoryId: parentId, subCategoryId: id});
        }
      };
      
      const handleDelete = async (id: any, parentId: any, categoryId: any) => {
        let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
        if(id === parentId && id === categoryId){
          await dispatch(deleteCategoryAction(businessId, id) as any);
        }else{
          await dispatch(deleteSubCategoryAction(businessId, categoryId, id) as any);
        }
        await dispatch(getAllCategoriesAction(businessId) as any);
      };

      const handleAdd = (id: any, parentId: any, categoryId: any) => {
        if(id === parentId && id === categoryId){
          setFormValues({...formValues, categoryId : categoryId, parentCategoryId: parentId, subCategoryId: id});
          setIsPopupOpen({...isPopupOpen, createSub: true});
        }else{
          setFormValues({...formValues, categoryId : parentId, parentCategoryId: id, subCategoryId: categoryId});
          setIsPopupOpen({...isPopupOpen, createSub: true});
        }
      };

      const handleImageChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewData(reader.result);
            };
            reader.readAsDataURL(file);
        }
      }

      const handleDeleteImage = () => {
        setPreviewData("");
      }

      const handleCategoryCreate = async () => {
        if(formValues.name && formValues.name !== ""){
          toast.error("Category name is required");
        }else if (formValues.description && formValues.description !== ""){
          toast.error("Category description is required");
        }
        let businessID = localStorage.getItem(ACTIVE_BUSINESS_ID);
        if(isPopupOpen.create){
          await dispatch(addCategoryAction(businessID, {...formValues, imageUrl: previewData}) as any);
        }else if (isPopupOpen.createSub){
          await dispatch(addSubCategoryAction(businessID, formValues.categoryId, formValues.parentCategoryId, {name: formValues.name, description: formValues.description, imageUrl: previewData}) as any);
        } else if (isPopupOpen.update){
          await dispatch(updateCategoryAction(businessID, formValues.categoryId, {name: formValues.name, description: formValues.description, imageUrl: previewData}) as any);
        }else if (isPopupOpen.updateSub){
          await dispatch(updateSubCategoryDetailsAction(businessID, formValues.categoryId, formValues.subCategoryId, {name: formValues.name, description: formValues.description, imageUrl: previewData}) as any);
        }
        await dispatch(getAllCategoriesAction(businessID) as any);
      }

      const getCreateCategoryChildren = (type: any) => {
        return(
          <div style={{display:"flex", justifyContent:'space-between', width:"100%", height:"600px", flexWrap:"wrap"}}>
            <TextField sx={{width:"48%"}} value={formValues.name} onChange={(e)=>setFormValues({...formValues, name: e.target.value})}  label='Name' fullWidth></TextField>
            <TextField  sx={{width:"48%"}} value={formValues.description} onChange={(e)=>setFormValues({...formValues, description: e.target.value})} label='Description' fullWidth></TextField>
            <div style={{ width: "800px", height: "450px" }}>
                <Typography variant='h6'>Category Image</Typography>
                <div className="containerr" style={{  width:"100%", height:"100%"}}>
                    <img src={formValues.imageUrl && formValues.imageUrl !== "" ? formValues.imageUrl : (previewData || "https://placehold.co/1200.png?text=No+Image")} alt="Avatar" className="image" style={{ width: "100%" }} />
                    <div className="middle">
                        <div style={{ flexDirection: "row", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <IconButton component="label" sx={{ color: "rgba(89, 50, 234, 1)" }}>
                                <EditIcon fontSize="large" sx={{ color: "rgba(89, 50, 234, 1)" }} />
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => handleImageChange(e)}
                                />
                            </IconButton>
                            <IconButton
                                sx={{ color: "rgba(89, 50, 234, 1)" }}
                                onClick={() => handleDeleteImage()}
                                disabled={!previewData}
                            >
                                <DeleteIcon fontSize="large" />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </div>
            <Button onClick={()=>handleCategoryCreate()} variant='contained' sx={{marginTop:"2%", width:"100%"}}>{type}</Button>

          </div>
          
        )
      }

    const renderTree = (node: any, parentId: any, categoryId: any) => (
        <TreeItem2 key={node._id} itemId={node._id} label={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <div style={{display:"flex", alignItems:"center"}}>
                    <img src={node.imageUrl} width="24px" height="24px" alt="cat-image"/>
                    <Typography variant="body1">{node.name}</Typography>
                    <IconButton onClick={() => handleAdd(node._id, parentId, categoryId)} size='small'>
                        <AddCircleIcon />
                    </IconButton>
                </div>
              <Box>
                <IconButton onClick={() => handleEdit(node._id, parentId, categoryId)} size="small">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => handleView(node._id, parentId, categoryId)} size="small">
                  <VisibilityIcon fontSize="small" />
                </IconButton>
                <IconButton onClick={() => handleDelete(node._id, parentId, categoryId)} size="small">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          } className='w-full'>
            <div style={{display:"flex", alignItems:"center", flexDirection:"column"}}>
                {Array.isArray(node.subCategories) && node.subCategories.length > 0
                ? node.subCategories.map((subCategory: any) => renderTree(subCategory, parentId, node._id))
                : null}
            </div>
        </TreeItem2>
      );

      const handleClosePopup = (field: any) => {
        setIsPopupOpen({...isPopupOpen, [field]: false});
        setFormValues({name: "", description: "", imageUrl: ""});
        setPreviewData(null);
      }

      useEffect(() => {
        if(categories){
          const allNodeIds: any = collectNodeIds(categories);
          setExpanded(allNodeIds);
        }
      }, [allCategories]);

  return (
    <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
        <div className=" bg-white p-6 h-[680px] shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
            <Stack spacing={4} width={"100%"} style={{ }}>
                <Card sx={{ padding: "2%", height: "630px" }}>
                  <div style={{display:"flex", justifyContent:"end"}}>
                    <Button onClick={()=>setIsPopupOpen({...isPopupOpen, create: true})} variant='contained' >Add New Category</Button>
                  </div>
                <SimpleTreeView  defaultExpandedItems={expanded}  sx={{fontSize:"30px", width:"100%", height:"30%", display:"flex", flexDirection:"column"}} aria-label="icon expansion" expansionTrigger="iconContainer">
                    {categories && categories.length > 0 && categories.map((cat:any) => {
                        return renderTree(cat, cat._id, cat._id)
                    })}
                </SimpleTreeView>
                </Card>
            </Stack>
        </div>
        {isPopupOpen.create && 
        <Popup header="Create Category"
        onClose={()=>handleClosePopup('create')}
        >
          {getCreateCategoryChildren("Create Category")}
        </Popup>}
        {isPopupOpen.update && 
        <Popup header="Update Category"
        onClose={()=>handleClosePopup('update')}
        >
          {getCreateCategoryChildren("Update Category")}
        </Popup>}
        {isPopupOpen.createSub && 
        <Popup header="Create Sub Category"
        onClose={()=>handleClosePopup('createSub')}
        >
          {getCreateCategoryChildren("Create Sub Category")}
        </Popup>}
        {isPopupOpen.updateSub && 
        <Popup header="Update Sub Category"
        onClose={()=>handleClosePopup('updateSub')}
        >
          {getCreateCategoryChildren("Update Sub Category")}
        </Popup>}
        {isPopupOpen.view && 
        <Popup header="View Category"
        onClose={()=>handleClosePopup('view')}
        >
          {getCreateCategoryChildren("View")}
        </Popup>}
        {isPopupOpen.viewSub && 
        <Popup 
          header="View Sub Category"
          onClose={()=>handleClosePopup('viewSub')}
        >
          {getCreateCategoryChildren("View")}
        </Popup>}
    </div>
  )
}

export default AllCategories