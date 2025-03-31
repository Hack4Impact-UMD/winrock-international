import React from 'react';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';

interface MultipleChoiceQuestionProps {
    questionName: string;
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

function MultipleChoiceQuestion({
    questionName,
    options,
    value,
    onChange,
}: MultipleChoiceQuestionProps) {
    return (
        <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">{questionName}</FormLabel>
            <RadioGroup
                value={value}
                onChange={(e: { target: { value: string } }) => onChange(e.target.value)}
                name={questionName}
            >
                {options.map((option: string, index: number) => (
                    <FormControlLabel
                        key={index}
                        value={option}
                        control={<Radio />}
                        label={option}
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
}

export default MultipleChoiceQuestion; 