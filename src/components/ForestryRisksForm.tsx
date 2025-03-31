import { useState } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import FreeResponseQuestion from './questions/FreeResponseQuestion';

interface FormData {
    // Forest Management
    forestType: string;
    managementPlan: string;
    harvestingMethods: string;
    reforestationPlan: string;

    // Biodiversity
    speciesDiversity: string;
    habitatProtection: string;
    endangeredSpecies: string;
    ecosystemServices: string;

    // Climate Impact
    carbonSequestration: string;
    deforestationPrevention: string;
    climateResilience: string;
    emissionsReduction: string;

    // Water Resources
    watershedProtection: string;
    waterQuality: string;
    floodPrevention: string;
    waterConservation: string;

    // Social Impact
    localCommunities: string;
    indigenousRights: string;
    employmentOpportunities: string;
    culturalPreservation: string;

    // Economic Benefits
    sustainableTimber: string;
    nonTimberProducts: string;
    ecotourism: string;
    marketAccess: string;
}

interface ForestryRisksFormProps {
    userEmail: string;
}

function ForestryRisksForm({ userEmail }: ForestryRisksFormProps) {
    const [formData, setFormData] = useState<FormData>({
        forestType: '',
        managementPlan: '',
        harvestingMethods: '',
        reforestationPlan: '',
        speciesDiversity: '',
        habitatProtection: '',
        endangeredSpecies: '',
        ecosystemServices: '',
        carbonSequestration: '',
        deforestationPrevention: '',
        climateResilience: '',
        emissionsReduction: '',
        watershedProtection: '',
        waterQuality: '',
        floodPrevention: '',
        waterConservation: '',
        localCommunities: '',
        indigenousRights: '',
        employmentOpportunities: '',
        culturalPreservation: '',
        sustainableTimber: '',
        nonTimberProducts: '',
        ecotourism: '',
        marketAccess: '',
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
                Forestry Risks and CoBenefits Disclosure Form
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Forest Management
                </Typography>
                <FreeResponseQuestion
                    questionName="Forest Type and Management Plan"
                    value={formData.forestType}
                    onChange={(value: string) => handleChange('forestType', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Harvesting Methods and Reforestation"
                    value={formData.harvestingMethods}
                    onChange={(value: string) => handleChange('harvestingMethods', value)}
                    multiline
                    rows={3}
                />
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Biodiversity and Climate Impact
                </Typography>
                <FreeResponseQuestion
                    questionName="Species Diversity and Habitat Protection"
                    value={formData.speciesDiversity}
                    onChange={(value: string) => handleChange('speciesDiversity', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Carbon Sequestration and Climate Resilience"
                    value={formData.carbonSequestration}
                    onChange={(value: string) => handleChange('carbonSequestration', value)}
                    multiline
                    rows={3}
                />
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Water Resources
                </Typography>
                <FreeResponseQuestion
                    questionName="Watershed Protection and Water Quality"
                    value={formData.watershedProtection}
                    onChange={(value: string) => handleChange('watershedProtection', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Flood Prevention and Water Conservation"
                    value={formData.floodPrevention}
                    onChange={(value: string) => handleChange('floodPrevention', value)}
                    multiline
                    rows={3}
                />
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Social and Economic Impact
                </Typography>
                <FreeResponseQuestion
                    questionName="Local Communities and Indigenous Rights"
                    value={formData.localCommunities}
                    onChange={(value: string) => handleChange('localCommunities', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Employment and Cultural Preservation"
                    value={formData.employmentOpportunities}
                    onChange={(value: string) => handleChange('employmentOpportunities', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Sustainable Timber and Market Access"
                    value={formData.sustainableTimber}
                    onChange={(value: string) => handleChange('sustainableTimber', value)}
                    multiline
                    rows={3}
                />
            </Paper>
        </Box>
    );
}

export default ForestryRisksForm; 