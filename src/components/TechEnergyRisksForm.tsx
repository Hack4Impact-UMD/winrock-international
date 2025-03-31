import { useState } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import FreeResponseQuestion from './questions/FreeResponseQuestion';

interface FormData {
    // Technical Risks
    technologyReadiness: string;
    systemReliability: string;
    maintenanceRequirements: string;
    technicalIntegration: string;

    // Energy Risks
    energyEfficiency: string;
    powerSupply: string;
    gridIntegration: string;
    energyStorage: string;

    // Environmental Impact
    carbonEmissions: string;
    resourceConsumption: string;
    wasteManagement: string;
    environmentalCompliance: string;

    // Economic Considerations
    costEffectiveness: string;
    marketCompetitiveness: string;
    investmentRequirements: string;
    operationalCosts: string;

    // Social Impact
    jobCreation: string;
    skillDevelopment: string;
    communityBenefits: string;
    socialAcceptance: string;
}

interface TechEnergyRisksFormProps {
    userEmail: string;
}

function TechEnergyRisksForm({ userEmail }: TechEnergyRisksFormProps) {
    const [formData, setFormData] = useState<FormData>({
        technologyReadiness: '',
        systemReliability: '',
        maintenanceRequirements: '',
        technicalIntegration: '',
        energyEfficiency: '',
        powerSupply: '',
        gridIntegration: '',
        energyStorage: '',
        carbonEmissions: '',
        resourceConsumption: '',
        wasteManagement: '',
        environmentalCompliance: '',
        costEffectiveness: '',
        marketCompetitiveness: '',
        investmentRequirements: '',
        operationalCosts: '',
        jobCreation: '',
        skillDevelopment: '',
        communityBenefits: '',
        socialAcceptance: '',
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
                Tech & Energy Risks & CoBenefits Form
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Technical Risks
                </Typography>
                <FreeResponseQuestion
                    questionName="Technology Readiness Level"
                    value={formData.technologyReadiness}
                    onChange={(value: string) => handleChange('technologyReadiness', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="System Reliability and Performance"
                    value={formData.systemReliability}
                    onChange={(value: string) => handleChange('systemReliability', value)}
                    multiline
                    rows={3}
                />
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Energy Risks
                </Typography>
                <FreeResponseQuestion
                    questionName="Energy Efficiency Measures"
                    value={formData.energyEfficiency}
                    onChange={(value: string) => handleChange('energyEfficiency', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Grid Integration Challenges"
                    value={formData.gridIntegration}
                    onChange={(value: string) => handleChange('gridIntegration', value)}
                    multiline
                    rows={3}
                />
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Environmental Impact
                </Typography>
                <FreeResponseQuestion
                    questionName="Carbon Emissions Reduction"
                    value={formData.carbonEmissions}
                    onChange={(value: string) => handleChange('carbonEmissions', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Resource Consumption and Waste Management"
                    value={formData.resourceConsumption}
                    onChange={(value: string) => handleChange('resourceConsumption', value)}
                    multiline
                    rows={3}
                />
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Economic and Social Impact
                </Typography>
                <FreeResponseQuestion
                    questionName="Cost Effectiveness and Market Competitiveness"
                    value={formData.costEffectiveness}
                    onChange={(value: string) => handleChange('costEffectiveness', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Job Creation and Skill Development"
                    value={formData.jobCreation}
                    onChange={(value: string) => handleChange('jobCreation', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Community Benefits and Social Acceptance"
                    value={formData.communityBenefits}
                    onChange={(value: string) => handleChange('communityBenefits', value)}
                    multiline
                    rows={3}
                />
            </Paper>
        </Box>
    );
}

export default TechEnergyRisksForm; 