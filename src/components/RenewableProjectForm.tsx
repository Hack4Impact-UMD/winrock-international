import { useState } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import FreeResponseQuestion from './questions/FreeResponseQuestion';

interface FormData {
    // Project Overview
    projectName: string;
    projectLocation: string;
    projectType: string;
    projectCapacity: string;
    projectTimeline: string;

    // Technical Specifications
    technologyType: string;
    equipmentSpecs: string;
    gridConnection: string;
    storageSolution: string;

    // Resource Assessment
    resourceAvailability: string;
    siteConditions: string;
    environmentalConstraints: string;
    landUse: string;

    // Financial Analysis
    capitalCosts: string;
    operationalCosts: string;
    revenueStreams: string;
    financingPlan: string;

    // Environmental Impact
    carbonReduction: string;
    biodiversityImpact: string;
    waterUsage: string;
    wasteManagement: string;

    // Social Impact
    localEmployment: string;
    communityEngagement: string;
    skillDevelopment: string;
    socialBenefits: string;
}

function RenewableProjectForm() {
    const [formData, setFormData] = useState<FormData>({
        projectName: '',
        projectLocation: '',
        projectType: '',
        projectCapacity: '',
        projectTimeline: '',
        technologyType: '',
        equipmentSpecs: '',
        gridConnection: '',
        storageSolution: '',
        resourceAvailability: '',
        siteConditions: '',
        environmentalConstraints: '',
        landUse: '',
        capitalCosts: '',
        operationalCosts: '',
        revenueStreams: '',
        financingPlan: '',
        carbonReduction: '',
        biodiversityImpact: '',
        waterUsage: '',
        wasteManagement: '',
        localEmployment: '',
        communityEngagement: '',
        skillDevelopment: '',
        socialBenefits: '',
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
                Project Proposal Form - Renewable Energy
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Project Overview
                </Typography>
                <FreeResponseQuestion
                    questionName="Project Name and Location"
                    value={formData.projectName}
                    onChange={(value: string) => handleChange('projectName', value)}
                />
                <FreeResponseQuestion
                    questionName="Project Type and Capacity"
                    value={formData.projectType}
                    onChange={(value: string) => handleChange('projectType', value)}
                />
                <FreeResponseQuestion
                    questionName="Project Timeline"
                    value={formData.projectTimeline}
                    onChange={(value: string) => handleChange('projectTimeline', value)}
                />
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Technical Specifications
                </Typography>
                <FreeResponseQuestion
                    questionName="Technology Type and Equipment Specifications"
                    value={formData.technologyType}
                    onChange={(value: string) => handleChange('technologyType', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Grid Connection and Storage Solutions"
                    value={formData.gridConnection}
                    onChange={(value: string) => handleChange('gridConnection', value)}
                    multiline
                    rows={3}
                />
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Resource Assessment
                </Typography>
                <FreeResponseQuestion
                    questionName="Resource Availability and Site Conditions"
                    value={formData.resourceAvailability}
                    onChange={(value: string) => handleChange('resourceAvailability', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Environmental Constraints and Land Use"
                    value={formData.environmentalConstraints}
                    onChange={(value: string) => handleChange('environmentalConstraints', value)}
                    multiline
                    rows={3}
                />
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Financial and Social Impact
                </Typography>
                <FreeResponseQuestion
                    questionName="Capital and Operational Costs"
                    value={formData.capitalCosts}
                    onChange={(value: string) => handleChange('capitalCosts', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Revenue Streams and Financing Plan"
                    value={formData.revenueStreams}
                    onChange={(value: string) => handleChange('revenueStreams', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Environmental and Social Benefits"
                    value={formData.carbonReduction}
                    onChange={(value: string) => handleChange('carbonReduction', value)}
                    multiline
                    rows={3}
                />
            </Paper>
        </Box>
    );
}

export default RenewableProjectForm; 