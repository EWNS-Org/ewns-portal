'use client';

import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const CategoryDropdown = ({ options }: any) => {
  const [selectedCategory, setSelectedCategory] = useState<any>('');


  const getSubCategories = () => {
    return options.filter((x:any) => x._id === selectedCategory)[0].subcategories;
  }
  return (
<>
    <select value={selectedCategory} onChange={(e:any)=>setSelectedCategory(e.target.value)}>
        {options && options?.length > 0 && options.map((x: any)=>(
            <option key={x._id} value={x._id}>{x.name}</option>
        ))}
    </select>

    {selectedCategory && getSubCategories()?.length > 0 && <CategoryDropdown options={getSubCategories()} />}

    </>
  );
};

export default CategoryDropdown;
