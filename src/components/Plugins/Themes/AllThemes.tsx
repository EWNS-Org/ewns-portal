'use client';

import { Card, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllThemesAction } from '../../../Redux/Actions/Themes/themes.actions';
import { ACTIVE_BUSINESS_ID } from '../../../utils/constants';

function AllThemes() {

  let dispatch = useDispatch();
  let allThemes = useSelector((state: any) => state.themes.allThemes);
  const [themes, setThemes] = useState<any>([]);

  useEffect(()=>{
    setThemes(allThemes);
  }, [allThemes]);

  useEffect(()=>{
    async function fetchAllThemes() {
      let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
      await dispatch(getAllThemesAction(businessId) as any);
    }
    fetchAllThemes();
  }, [dispatch])

  return (
    <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
      <div className=" p-4 md:p-6 bg-white shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
        <Stack  width={"100%"} style={{  }}>
            <div className="themes-grid">
            {themes && themes.length > 0 && themes.map((theme: any) => {
              return (
                <Card sx={{ cursor:"pointer", padding: "12px", display:"flex", flexDirection:"column", justifyContent:"space-between", alignItems: "center"}}>
                  <div style={{width: "100%"}}>
                    <img style={{width: "100%", height: "auto", objectFit: "cover"}} src={theme.previewUrls?.[0]} />
                  </div>
                  <div>
                    <Typography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' }, textAlign: 'center', mt: 1 }}>{theme.name}</Typography>
                  </div>
                </Card>
              )
            })}
            </div>
        </Stack>
      </div>
    </div>
  )
}

export default AllThemes