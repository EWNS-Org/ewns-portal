import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategoriesAction } from "../../Redux/Actions/Categories/category.actions";
import { ACTIVE_BUSINESS_ID } from "../../utils/constants";

const RecursiveCategorySelect = ({ level = 0, getCatDetails, parentCategories, index = 0 }: any) => {
    const allCategories = useSelector((state: any) => state.categories.allCategories);
    const [categories, setCategories] = useState<any>([]);
    const dispatch = useDispatch();
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

    const [selectedCategory, setSelectedCategory] = useState('');
  
    const handleCategoryChange = (event: any) => {
      setSelectedCategory(event.target.value as string);
      getCatDetails(event.target.value)
    };
  
    useEffect(()=>{
        if(parentCategories && index < parentCategories.length){
          setSelectedCategory(parentCategories[index]._id + "_mk_" + parentCategories[index].name);
        }
      }, [parentCategories]);

    const selectedCategoryObj = categories && categories.find((cat: any) => cat._id+"_mk_"+cat.name === selectedCategory);
  
    return (
      <Box sx={{  minWidth: 200 }}>
        <FormControl fullWidth sx={{marginBottom: "8%"}}>
          <InputLabel id={`category-label-${level}`}>Category Level {level + 1}</InputLabel>
          <Select
            labelId={`category-label-${level}`}
            value={selectedCategory}
            onChange={handleCategoryChange}
            label={`Category Level ${level + 1}`}
          >
            <MenuItem value="">
              <em>Select a category</em>
            </MenuItem>
            {categories && categories.map((category: any) => (
              <MenuItem key={category._id} value={category._id + "_mk_" + category.name} >
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
  
        {/* Render the next level recursively if there are subcategories */}
        {selectedCategoryObj?.subcategories?.length > 0 && (
          <RecursiveCategorySelect options={selectedCategoryObj.subcategories} level={level + 1} getCatDetails={getCatDetails} />
        )}
      </Box>
    );
  };

  export default RecursiveCategorySelect;