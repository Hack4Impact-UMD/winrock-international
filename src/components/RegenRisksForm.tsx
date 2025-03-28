import { useState } from 'react';
import { Box, Typography, Paper, Divider } from '@mui/material';
import MultipleChoiceQuestion from './questions/MultipleChoiceQuestion';
import DropdownQuestion from './questions/DropdownQuestion';
import FreeResponseQuestion from './questions/FreeResponseQuestion';

interface FormData {
    // Risk Category
    riskAssessment: string;
    climateChangeAdaptation: string;
    sustainableUseWater: string;
    pollutionWasteControl: string;
    circularEconomy: string;
    biodiversityEcosystems: string;
    humanLaborRights: string;
    communityFarmerImpacts: string;
    safeguards: string;

    // Risk Sub-Category
    riskAssessmentCompleted: string;
    businessContinuity: string;
    waterManagementPlan: string;
    pollutionRelease: string;
    wasteStreams: string;
    agrochemicals: string;
    circularEconomyImpact: string;
    biodiversityImpact: string;
    humanRights: string;
    forcedChildLabor: string;
    farmerHealthSafety: string;
    farmerLivelihoods: string;
    smallHolders: string;
    capacityBuilding: string;
    communityEngagement: string;
    communityImpacts: string;
    safeguardsIncorporated: string;

    // Project Co-Benefits
    waterScarcity: string;
    waterQuality: string;
    waterAvailability: string;
    waterCoBenefits: string;
    speciesRichness: string;
    threatenedSpecies: string;
    threatenedEcosystems: string;
    airQuality: string;
    soilErosion: string;
    biodiversityCoBenefits: string;
    farmerLivelihoodsCoBenefits: string;
    farmerResilience: string;
    farmerAdaptation: string;
    localLivelihoods: string;
    communityResilience: string;
    communityAdaptation: string;
    communityCoBenefits: string;
}

function RegenRisksForm() {
    const [formData, setFormData] = useState<FormData>({
        // Initialize all form fields with empty strings
        riskAssessment: '',
        climateChangeAdaptation: '',
        sustainableUseWater: '',
        pollutionWasteControl: '',
        circularEconomy: '',
        biodiversityEcosystems: '',
        humanLaborRights: '',
        communityFarmerImpacts: '',
        safeguards: '',
        riskAssessmentCompleted: '',
        businessContinuity: '',
        waterManagementPlan: '',
        pollutionRelease: '',
        wasteStreams: '',
        agrochemicals: '',
        circularEconomyImpact: '',
        biodiversityImpact: '',
        humanRights: '',
        forcedChildLabor: '',
        farmerHealthSafety: '',
        farmerLivelihoods: '',
        smallHolders: '',
        capacityBuilding: '',
        communityEngagement: '',
        communityImpacts: '',
        safeguardsIncorporated: '',
        waterScarcity: '',
        waterQuality: '',
        waterAvailability: '',
        waterCoBenefits: '',
        speciesRichness: '',
        threatenedSpecies: '',
        threatenedEcosystems: '',
        airQuality: '',
        soilErosion: '',
        biodiversityCoBenefits: '',
        farmerLivelihoodsCoBenefits: '',
        farmerResilience: '',
        farmerAdaptation: '',
        localLivelihoods: '',
        communityResilience: '',
        communityAdaptation: '',
        communityCoBenefits: '',
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
                Regen Risks & Co Benefits Form
            </Typography>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Risk Category
                </Typography>
                <FreeResponseQuestion
                    questionName="Risk Assessment"
                    value={formData.riskAssessment}
                    onChange={(value: string) => handleChange('riskAssessment', value)}
                    multiline
                    rows={3}
                />
                <FreeResponseQuestion
                    questionName="Climate Change Adaptation"
                    value={formData.climateChangeAdaptation}
                    onChange={(value: string) => handleChange('climateChangeAdaptation', value)}
                    multiline
                    rows={3}
                />
                {/* Add other Risk Category questions similarly */}
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Risk Sub-Category
                </Typography>
                <FreeResponseQuestion
                    questionName="Has the project completed a risk assessment following an approved standard? If so, how was the risk assessment conducted? What high-level risks were identified based on the geography or project activities?"
                    value={formData.riskAssessmentCompleted}
                    onChange={(value: string) => handleChange('riskAssessmentCompleted', value)}
                    multiline
                    rows={3}
                />
                {/* Add other Risk Sub-Category questions similarly */}
            </Paper>

            <Paper sx={{ p: 3 }}>
                <Typography variant="h5" gutterBottom>
                    Project Co-Benefits
                </Typography>

                <Typography variant="h6" gutterBottom>
                    Project Water Co-Benefits
                </Typography>
                <FreeResponseQuestion
                    questionName="Is it expected that the project activities will improve resilience to potential water scarcity?"
                    value={formData.waterScarcity}
                    onChange={(value: string) => handleChange('waterScarcity', value)}
                    multiline
                    rows={3}
                />
                {/* Add other Water Co-Benefits questions similarly */}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                    Project Biodiversity and Environmental Co-Benefits
                </Typography>
                <FreeResponseQuestion
                    questionName="Is it expected that the project activities will improve overall species richness and diversity?"
                    value={formData.speciesRichness}
                    onChange={(value: string) => handleChange('speciesRichness', value)}
                    multiline
                    rows={3}
                />
                {/* Add other Biodiversity Co-Benefits questions similarly */}

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                    Project Community/Farmer Co-Benefits
                </Typography>
                <FreeResponseQuestion
                    questionName="Is it expected that the project activities will improve farmer livelihoods or income generated?"
                    value={formData.farmerLivelihoodsCoBenefits}
                    onChange={(value: string) => handleChange('farmerLivelihoodsCoBenefits', value)}
                    multiline
                    rows={3}
                />
                {/* Add other Community/Farmer Co-Benefits questions similarly */}
            </Paper>
        </Box>
    );
}

export default RegenRisksForm; 