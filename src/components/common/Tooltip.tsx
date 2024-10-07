import React from 'react';
import { Tooltip, Typography } from '@mui/material';

const Tooltipp = ({ title, children }: any) => {
  return (
    <Tooltip
      title={
        <Typography
          variant="body2"
          sx={{ fontSize: '14px', textAlign:"center" }}
        >
          {title}
        </Typography>
      }
      arrow
    >
      {children}
    </Tooltip>
  );
};

export default Tooltipp;
