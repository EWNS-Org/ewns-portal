'use client';

import { Card, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllThemesAction } from '../../../Redux/Actions/Themes/themes.actions';
import { getBusinessDetailsAction } from '../../../Redux/Actions/BusinessActions/business.actions';
import { ACTIVE_BUSINESS_ID } from '../../../utils/constants';

interface AllThemesProps {
  onConfigureTheme: (themeName: string) => void;
}

function AllThemes({ onConfigureTheme }: AllThemesProps) {

  let dispatch = useDispatch();
  let allThemes = useSelector((state: any) => state.themes.allThemes);
  const businessDetails = useSelector((state: any) => state.business.businessDetails);
  const [themes, setThemes] = useState<any>([]);
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null);

  const currentTheme = businessDetails?.currentTheme || 'nimbus';

  useEffect(() => {
    setThemes(allThemes);
  }, [allThemes]);

  useEffect(() => {
    async function fetchData() {
      const businessId = localStorage.getItem(ACTIVE_BUSINESS_ID);
      await dispatch(getAllThemesAction(businessId) as any);
      if (!businessDetails) {
        await dispatch(getBusinessDetailsAction(businessId) as any);
      }
    }
    fetchData();
  }, [dispatch]);

  const isSelected = (theme: any) => {
    const name = (theme.themeId || theme.name || '').toLowerCase();
    return name === currentTheme.toLowerCase();
  };

  return (
    <div className="w-full " style={{ fontFamily: "source Sans pro" }}>
      <div className=" p-4 md:p-6 bg-white shadow-md w-full" style={{ borderBottomLeftRadius: "15px", borderBottomRightRadius: "15px" }}>
        <Stack width={"100%"}>
          <div className="themes-grid">
            {themes && themes.length > 0 && themes.map((theme: any) => {
              const selected = isSelected(theme);
              const themeKey = theme._id || theme.themeId || theme.name;
              return (
                <Card
                  key={themeKey}
                  onMouseEnter={() => setHoveredTheme(themeKey)}
                  onMouseLeave={() => setHoveredTheme(null)}
                  sx={{
                    cursor: "pointer",
                    padding: "12px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                    border: selected ? "2px solid rgba(89, 50, 234, 1)" : "2px solid transparent",
                    boxShadow: selected ? "0 0 0 3px rgba(89, 50, 234, 0.15)" : undefined,
                    transition: "border 0.2s, box-shadow 0.2s",
                  }}
                >
                  {selected && (
                    <CheckCircleIcon
                      sx={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        color: "rgba(89, 50, 234, 1)",
                        fontSize: 22,
                        zIndex: 2,
                      }}
                    />
                  )}

                  {selected && hoveredTheme === themeKey && (
                    <Tooltip title="Configure theme">
                      <IconButton
                        size="small"
                        onClick={() => onConfigureTheme(theme.themeId || theme.name || 'nimbus')}
                        sx={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          zIndex: 2,
                          background: "rgba(255,255,255,0.9)",
                          "&:hover": { background: "rgba(89, 50, 234, 0.1)" },
                        }}
                      >
                        <SettingsIcon sx={{ fontSize: 20, color: "rgba(89, 50, 234, 1)" }} />
                      </IconButton>
                    </Tooltip>
                  )}

                  <div style={{ width: "100%" }}>
                    <img style={{ width: "100%", height: "auto", objectFit: "cover" }} src={theme.previewUrls?.[0]} />
                  </div>
                  <div>
                    <Typography variant='h5' sx={{ fontSize: { xs: '1rem', md: '1.5rem' }, textAlign: 'center', mt: 1 }}>
                      {theme.name}
                    </Typography>
                    {selected && (
                      <Typography variant="caption" sx={{ color: "rgba(89, 50, 234, 1)", display: "block", textAlign: "center" }}>
                        Active
                      </Typography>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </Stack>
      </div>
    </div>
  )
}

export default AllThemes
