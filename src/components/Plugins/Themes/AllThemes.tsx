import { Button, Card, IconButton, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllThemesAction, selectThemeAction } from '../../../Redux/Actions/Themes/themes.actions';
import { ACTIVE_BUSINESS_ID, AUTH_TOKEN } from '../../../utils/constants';
import { getBusinessDetailsAction } from '../../../Redux/Actions/BusinessActions/business.actions';
import Popup from '../../common/Popup';
import { useNavigate } from 'react-router-dom';
import PreviewIcon from '@mui/icons-material/Preview';
import { useLoader } from '../../../contexts/LoaderContext';

function AllThemes() {

  let dispatch = useDispatch();
  let allThemes = useSelector((state: any) => state.themes.allThemes);
  let businessDetails = useSelector((state: any) => state.business.businessDetails);
  const [themes, setThemes] = useState<any>([]);
  const [viewThemeDetails, setViewThemeDetails] = useState<any>({
    openPopup: false,
    themeDetails: null
  });
const {showLoader, hideLoader} = useLoader();
  useEffect(()=>{
    setThemes(allThemes);
  }, [allThemes]);

  useEffect(()=>{
    async function fetchAllThemes() {
      showLoader();
      let businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
      await dispatch(getAllThemesAction(businessId) as any);
      await dispatch(getBusinessDetailsAction(businessId) as any);
      hideLoader();
    }
    fetchAllThemes();
  }, [dispatch])


  const openThemeDetails = async (them: any) => {
    setViewThemeDetails({openPopup: true, themeDetails: them});
  }

  const setTheme = async () => {
    showLoader();
    let businessId= localStorage.getItem(ACTIVE_BUSINESS_ID);
    await dispatch(selectThemeAction(businessId, viewThemeDetails.themeDetails.themeId) as any);
    await dispatch(getBusinessDetailsAction(businessId) as any);
    setViewThemeDetails({openThemeDetails: false, themeDetails: null})
    hideLoader();
  }

  const setThemeConfig = async () => {
    let token = localStorage.getItem(AUTH_TOKEN);
    window.open(`https://${businessDetails.businessUsername}-edit.ewns.in?token=${token}`);
  }

  return (
    <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
      <div className=" p-4 h-[680px] bg-white shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
        <Stack  width={"100%"} style={{  }}>
        <Card
          sx={{
            padding: "2% 1%",
            height: "650px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            gap: "2%",
          }}
        >
          {themes &&
            themes.length > 0 &&
            themes.map((theme: any) => (
              <Card
                key={theme.themeId}
                sx={{
                  width: "18%",
                  height: "50%",
                  cursor: "pointer",
                  padding: "2%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: businessDetails?.currentTheme === theme?.themeId
                    ? "2px solid rgba(89, 50, 234, 1)"
                    : "1px solid #e0e0e0", // Add a subtle border for unselected themes
                  transition: "transform 0.2s ease, border 0.2s ease",
                  "&:hover": {
                    border: "2px solid rgba(89, 50, 234, 1)", // Border color on hover
                    transform: "scale(1.05)", // Slight zoom effect on hover
                    cursor: "pointer",
                  },
                }}
                onClick={()=>openThemeDetails(theme)}
              >
                  <img
                    style={{
                      width: "95%",
                      borderRadius: "8px", // Adds subtle rounding to the image
                    }}
                    src={theme.previewUrls?.[0]}
                    alt={`${theme.name} preview`}
                  />
                  
                <div style={{  }}>
                  <Typography variant="h6" fontWeight="bold">
                    {theme.name}
                  </Typography>
                </div>
              </Card>
          ))}
      </Card>
        </Stack>
        {viewThemeDetails.openPopup && <Popup header={viewThemeDetails.themeDetails.name + " Theme Details"} onClose={()=>setViewThemeDetails({openThemeDetails: false, themeDetails: null})}>
          <div>
            <div style={{display:"flex", justifyContent:"space-between", marginBottom: "2%"}}>
              <Button variant='outlined' onClick={()=>window.open(`https://sample${viewThemeDetails.themeDetails.themeId}.ewns.in`, "_blank")} >View Demo</Button>
              {businessDetails.currentTheme === viewThemeDetails.themeDetails?.themeId ? 
                <Button variant='outlined' onClick={()=>setThemeConfig()} >Set Up Theme Configuration</Button>
                    :
                <Button variant='contained' onClick={()=>setTheme()} >Set Theme</Button>}
            </div>  
            <div style={{marginBottom: "2%"}}>
              <Typography variant='h5' color="gray">Preview</Typography>
              <Card className='no-scrollbar' sx={{ overflow:"auto", width:"100%", height: "200px", marginBottom: "2%", display:"flex", alignItems: "center", padding: "0% 1%"}}>
                <div style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "start",  gap: "10px"}}>
                
                  {viewThemeDetails.themeDetails && viewThemeDetails.themeDetails.previewUrls.length > 0 && viewThemeDetails.themeDetails.previewUrls.map((file: any) => {
                    return (
                        <div className='relative' style={{ display:"flex", cursor:"pointer"}} key={file}>
                            { 
                            <><img className='transition-transform duration-300 ease-in-out transform hover:scale-110' src={file} style={{height: "180px", width: "250px", maxWidth:"250px"}} /></>
                            }
                        </div>  
                    )
                  })}
                </div>
              </Card>
            </div>
            <Typography variant='h5' color="gray">Description</Typography>
            <Typography variant='h6' color="black">{viewThemeDetails.themeDetails.description}</Typography>
          </div></Popup>}
      </div>
    </div>
  )
}

export default AllThemes