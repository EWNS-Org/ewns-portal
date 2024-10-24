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
      <div className=" p-4 h-[680px] bg-white shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
        <Stack  width={"100%"} style={{  }}>
          <Card sx={{  padding: "2% 1%", height: "650px", display:"flex", flexWrap: "wrap", justifyContent:"start", gap:"2%" }}> 
            {themes && themes.length > 0 && themes.map((theme: any) => {
              return (
                <Card sx={{width:"18%", height: "50%", cursor:"pointer", padding: "2%", display:"flex", flexDirection:"column", justifyContent:"space-between", alignItems: "center"}}>
                  <div>
                    <img width="95%" height="40%" src={theme.previewUrls?.[0]} />
                  </div>
                  <div>
                    <Typography variant='h4'>{theme.name}</Typography>
                  </div>
                </Card>
              )
            })}
          </Card>
        </Stack>
      </div>
    </div>
  )
}

export default AllThemes