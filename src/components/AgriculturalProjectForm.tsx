import { useState } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import FreeResponseQuestion from './questions/FreeResponseQuestion';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import DropdownQuestion from './questions/DropdownQuestion';

interface FormData {
    // Project Overview
    projectName: string;
    projectLocation: string;
    projectDuration: string;
    projectScale: string;
    projectType: string;

    // Agricultural Details
    cropType: string;
    farmingMethod: string;
    irrigationSystem: string;
    soilType: string;
    landSize: string;

    // Sustainability Metrics
    waterEfficiency: string;
    soilHealth: string;
    biodiversityImpact: string;
    carbonFootprint: string;

    // Economic Impact
    expectedYield: string;
    marketAccess: string;
    employmentOpportunities: string;
    localEconomicBenefits: string;

    // Community Engagement
    farmerTraining: string;
    communityParticipation: string;
    knowledgeTransfer: string;
    socialImpact: string;
}

function AgriculturalProjectForm() {
    const [formData, setFormData] = useState<FormData>({
        projectName: '',
        projectLocation: '',
        projectDuration: '',
        projectScale: '',
        projectType: '',
        cropType: '',
        farmingMethod: '',
        irrigationSystem: '',
        soilType: '',
        landSize: '',
        waterEfficiency: '',
        soilHealth: '',
        biodiversityImpact: '',
        carbonFootprint: '',
        expectedYield: '',
        marketAccess: '',
        employmentOpportunities: '',
        localEconomicBenefits: '',
        farmerTraining: '',
        communityParticipation: '',
        knowledgeTransfer: '',
        socialImpact: '',
    });

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData((prev: FormData) => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Agricultural Project Proposal Form
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Project Overview
                </Typography>
                <FreeResponseQuestion
                    questionName="Project Name"
                    value={formData.projectName}
                    onChange={(value: string) => handleChange('projectName', value)}
                />
                <FreeResponseQuestion
                    questionName="Project Location"
                    value={formData.projectLocation}
                    onChange={(value: string) => handleChange('projectLocation', value)}
                />
                <FreeResponseQuestion
                    questionName="Project Duration"
                    value={formData.projectDuration}
                    onChange={(value: string) => handleChange('projectDuration', value)}
                />
                <FreeResponseQuestion
                    questionName="Project Scale"
                    value={formData.projectScale}
                    onChange={(value: string) => handleChange('projectScale', value)}
                />
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Agricultural Details
                </Typography>
                <FreeResponseQuestion
                    questionName="Crop Type"
                    value={formData.cropType}
                    onChange={(value: string) => handleChange('cropType', value)}
                />
                <FreeResponseQuestion
                    questionName="Farming Method"
                    value={formData.farmingMethod}
                    onChange={(value: string) => handleChange('farmingMethod', value)}
                />
                <FreeResponseQuestion
                    questionName="Irrigation System"
                    value={formData.irrigationSystem}
                    onChange={(value: string) => handleChange('irrigationSystem', value)}
                />
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Sustainability Metrics
                </Typography>
                <FreeResponseQuestion
                    questionName="Water Efficiency Measures"
                    value={formData.waterEfficiency}
                    onChange={(value: string) => handleChange('waterEfficiency', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Soil Health Management"
                    value={formData.soilHealth}
                    onChange={(value: string) => handleChange('soilHealth', value)}
                    multiline
                    rows={3}
                />
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Economic and Social Impact
                </Typography>
                <FreeResponseQuestion
                    questionName="Expected Yield and Market Access"
                    value={formData.expectedYield}
                    onChange={(value: string) => handleChange('expectedYield', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Employment Opportunities"
                    value={formData.employmentOpportunities}
                    onChange={(value: string) => handleChange('employmentOpportunities', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Community Engagement and Training"
                    value={formData.farmerTraining}
                    onChange={(value: string) => handleChange('farmerTraining', value)}
                    multiline
                    rows={3}
                />
            </Paper>
        </Box>
    );
}

export default AgriculturalProjectForm; 