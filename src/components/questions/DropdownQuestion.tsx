import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface DropdownQuestionProps {
    questionName: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

function DropdownQuestion({
    questionName,
    options,
    value,
    onChange,
}: DropdownQuestionProps) {
    return (
        <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id={`${questionName}-label`}>{questionName}</InputLabel>
            <Select
                labelId={`${questionName}-label`}
                value={value}
                label={questionName}
                onChange={(e: SelectChangeEvent) => onChange(e.target.value)}
                name={questionName}
            >
                {options.map((option: string, index: number) => (
                    <MenuItem key={index} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}

export default DropdownQuestion; 