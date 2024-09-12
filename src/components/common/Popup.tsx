import React, { useState } from 'react';
import './Popup.css'; // Optional for styling
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { countryList } from '../../utils/country-flag';
import CloseIcon from '@mui/icons-material/Close';

const Popup = ({
    header,
    inputs = [],
    buttons = [],
    onClose
}: any) => {
    const [formValues, setFormValues] = useState<any>({
        'business-category': 'General',
        'business-country-code': countryList["IN"].dial_code
    });

    const handleInputChange = (name: any, value: any) => {
        setFormValues({
            ...formValues,
            [name]: value,
        });
    };

    return (
        <div className="popup-overlay">
            <div className="popup">
                <div className="popup-header">
                    <Typography variant='h5' marginY={"2%"} sx={{ color: "blue" }}>{header}</Typography>
                    <button className="close-btn" onClick={onClose}><CloseIcon sx={{ color: "red" }} /></button>
                </div>
                <div className="popup-content">
                    {inputs.map((input: any, index: any) => (
                        <div key={index} className="popup-input">
                            {(input.type === "text" || input.type === "number" || input.type === "email") && <TextField
                                required
                                label={input.label}
                                sx={{ marginBottom: "2%", width: input.width, height: "100%" }}
                                onChange={(e) => handleInputChange(input.name, e.target.value)}
                                value={formValues[input.name]}
                                disabled={input.disabled || false}
                            />}
                            {
                                input.type === "select" && <Box sx={{ minWidth: 120, marginY: "2%" }} key={index}>
                                    <FormControl sx={{ width: input.width }}>
                                        <InputLabel id={`${input.name}${input.label}`} >{input.label}</InputLabel>
                                        <Select
                                            required
                                            id={`${input.name}${input.label}`}
                                            labelId={`${input.name}${input.label}`}
                                            value={formValues[input.name]}
                                            label={input.label}
                                            onChange={(e) => handleInputChange(input.name, e.target.value)}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        zIndex: 100,
                                                    },
                                                },
                                            }}
                                        >
                                            {input?.options &&
                                                input.options.map((cat: any) => <MenuItem value={cat}>{cat}</MenuItem>)}
                                            {input?.menuItems && input.menuItems.map((item: any) => item)}
                                        </Select>
                                    </FormControl>
                                </Box>
                            }
                            {
                                input.type === "text-area" && <TextField
                                    required
                                    id="outlined-required"
                                    label="Business Description"
                                    multiline
                                    rows={4}
                                    sx={{ marginBottom: "2%", width: input.width }}
                                    onChange={(e) => handleInputChange(input.name, e.target.value)}
                                    value={formValues[input.name]}
                                />
                            }
                        </div>
                    ))}
                </div>
                <div className="popup-actions">
                    {buttons.map((button: any, index: any) => (
                        <Button onClick={() => button.onClick} className={button.className} variant='contained' sx={{ width: "100%", height: "15%" }}>{button.label}</Button>

                    ))}
                </div>
            </div>
        </div >
    );
};

export default Popup;
