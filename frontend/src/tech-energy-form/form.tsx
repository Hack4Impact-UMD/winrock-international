import React, { useState } from 'react';

// Import components
import LogoHeader from './LogoHeader';
import TitleHeader from './TitleHeader';
import ProgressBar from './ProgressBar';
import SectionHeader from './SectionHeader';
import AddDropdown from './AddDropdown';
import TextQuestion from './TextQuestion';
import NavigationButtons from './NavigationButtons';

const TechEnergyForm: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 6; // Based on the number of images provided

  const styles = {
    techEnergyForm: {
      maxWidth: '800px',
      margin: '0 auto',
      backgroundColor: '#f5f5f5',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
      color: '#333',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    greenBar: {
      height: '4px',
      backgroundColor: '#4CAF50',
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const saveChanges = () => {
    console.log('Saving changes...');
    // Implement save functionality
  };

  const saveAndExit = () => {
    console.log('Saving and exiting...');
    // Implement save and exit functionality
  };

  // Common dropdown options
  const yesNoOptions = ['Yes', 'No', 'Not Applicable'];
  
  // Render different pages based on the current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            <TitleHeader 
              title="Risk and Co-Benefit Form" 
              description="Some open about what this form is about and just to provide some further information about what's happening?"
            />
            <ProgressBar steps={4} currentStep={1} />
            <SectionHeader title="Sustainable Use and Management of Natural Resources" />
            <AddDropdown 
              id="environmental-risk-assessment"
              question="Has the project completed an Environmental Risk Assessment?"
              options={yesNoOptions}
            />
            <AddDropdown 
              id="water-management-plan"
              question="Is there a water use and protection management plan in place to reduce local water body degradation risk and ensure compliance with local regulations?"
              options={yesNoOptions}
            />
            <AddDropdown 
              id="forestry-management"
              question="Is there a forestry resource management plan in place (with regards to fire management, protection against deforestation, illegal logging and land conversion)?"
              options={yesNoOptions}
            />
            <AddDropdown 
              id="raw-material-production"
              question="Does the project ensure that any raw material production (such as timber) adheres to the relevant legislation of the country of production, as well as forest-related regulations?"
              options={yesNoOptions}
            />
          </>
        );
      
      case 2:
        return (
          <>
            <TitleHeader 
              title="Risk and Co-Benefit Form" 
              description="Some open about what this form is about and just to provide some further information about what's happening?"
            />
            <ProgressBar steps={4} currentStep={2} />
            <SectionHeader title="Human and Labor Rights" />
            <AddDropdown 
              id="responsible-sourcing"
              question="Does this project align with Nestlé's 'Responsible Sourcing Core Requirements' framework for the protection of Human Rights?"
              options={yesNoOptions}
            />
            <AddDropdown 
              id="labor-declarations"
              question="Are there formal declarations, accountability frameworks and/or third party inspections that ensure that no forced or child labor is involved in the proposed intervention?"
              options={yesNoOptions}
            />
            <AddDropdown 
              id="farmer-health-safety"
              question="Are there assurances for farmer health and safety in place?"
              options={yesNoOptions}
            />
            <SectionHeader title="Community Impacts" />
            <AddDropdown 
              id="community-engagement"
              question="Is there effort to maintain ongoing engagements and participation of the community with regards to this project, including mechanisms to consider grievances?"
              options={yesNoOptions}
            />
            <AddDropdown 
              id="negative-community-impacts"
              question="Has this project been designed to minimize other potentially negative community impacts?"
              options={yesNoOptions}
            />
            <SectionHeader title="Safeguards" />
            <AddDropdown 
              id="design-safeguards"
              question="Have effective safeguards been incorporated in the to design phase?"
              options={yesNoOptions}
            />
          </>
        );
        
      case 3:
        return (
          <>
            <ProgressBar steps={4} currentStep={3} />
            <SectionHeader title="Risk Assessment" />
            <AddDropdown 
              id="risk-assessment-standard"
              question="Has the project completed a risk assessment following an approved standard?"
              options={yesNoOptions}
              followUpPlaceholder="What high-level risks were identified based on the geography or project activities?"
            />
            <SectionHeader title="Climate Change Adaptation" />
            <AddDropdown 
              id="business-continuity"
              question="Has the project been designed to minimize or avoid possible losses or impacts on business continuity for all stakeholders involved?"
              options={yesNoOptions}
            />
            <SectionHeader title="Sustainable Use and Management of Natural Resources" />
            <AddDropdown 
              id="environmental-risk"
              question="Has the project completed an Environmental Risk Assessment?"
              options={yesNoOptions}
            />
            <AddDropdown 
              id="water-management"
              question="Is there a water use and protection management plan in place to reduce local water body degradation risk and ensure compliance with local regulations?"
              options={yesNoOptions}
            />
            <AddDropdown 
              id="forestry-management"
              question="Is there a forestry resource management plan in place (with regards to fire management, protection against deforestation, illegal logging and land conversion)?"
              options={yesNoOptions}
            />
            <AddDropdown 
              id="raw-material"
              question="Does the project ensure that any raw material production (such as timber) adheres to the relevant legislation of the country of production, as well as forest-related regulations?"
              options={yesNoOptions}
            />
          </>
        );
        
      case 4:
        return (
          <>
            <ProgressBar steps={4} currentStep={3} />
            <SectionHeader title="Pollution & Waste Control" />
            <AddDropdown 
              id="pollution-risk-assessment"
              question="Has the project completed a risk assessment following an approved standard?"
              options={yesNoOptions}
              followUpPlaceholder="What high-level risks were identified based on the geography or project activities?"
            />
            <AddDropdown 
              id="pollution-reduction"
              question="Has the project been designed to avoid pollution release into the environment, such as pesticide use reduction and management?"
              options={yesNoOptions}
            />
            <SectionHeader title="Transition to a Circular Economy" />
            <AddDropdown 
              id="circular-economy"
              question="Has the project been designed to not negatively impact the transition to a circular economy? Is there utilization of by-products or recycled materials before, during or after the intervention?"
              options={yesNoOptions}
            />
            <SectionHeader title="Protection and Restoration of Biodiversity and Ecosystems" />
            <AddDropdown 
              id="biodiversity-impact"
              question="Has the project been designed to not negatively impact biodiversity and habitats?"
              options={yesNoOptions}
            />
            <AddDropdown 
              id="land-features"
              question="Has this project been designed to avoid any displacement or disturbance of natural land features?"
              options={yesNoOptions}
            />
          </>
        );
        
      case 5:
        return (
          <>
            <TitleHeader 
              title="Risk and Co-Benefit Form" 
              description="Some open about what this form is about and just to provide some further information about what's happening?"
            />
            <ProgressBar steps={4} currentStep={3} />
            <SectionHeader title="Human and Labor Rights" />
            <AddDropdown 
              id="human-rights"
              question="Does this project align with Nestlé's 'Responsible Sourcing Core Requirements' framework for the protection of Human Rights?"
              options={yesNoOptions}
              followUpPlaceholder="What high-level risks were identified based on the geography or project activities?"
            />
            <AddDropdown 
              id="labor-frameworks"
              question="Are there formal declarations, accountability frameworks and/or third party inspections that ensure that no forced or child labor is involved in the proposed intervention?"
              options={yesNoOptions}
            />
            <AddDropdown 
              id="health-safety"
              question="Are there assurances for farmer health and safety in place?"
              options={yesNoOptions}
            />
            <SectionHeader title="Community Impacts" />
            <AddDropdown 
              id="community-engagement"
              question="Is there effort to maintain ongoing engagements and participation of the community with regards to this project, including mechanisms to consider grievances?"
              options={yesNoOptions}
            />
            <AddDropdown 
              id="negative-impacts"
              question="Has this project been designed to minimize other potentially negative community impacts?"
              options={yesNoOptions}
            />
            <SectionHeader title="Safeguards" />
            <AddDropdown 
              id="effective-safeguards"
              question="Have effective safeguards been incorporated in the design phase?"
              options={yesNoOptions}
            />
          </>
        );
        
      case 6:
        return (
          <>
            <TitleHeader 
              title="Risk and Co-Benefit Form" 
              description="Some open about what this form is about and just to provide some further information about what's happening?"
            />
            <ProgressBar steps={4} currentStep={4} />
            <SectionHeader title="Project Water Co-Benefits" />
            <TextQuestion
              id="water-benefits"
              description="Enter information in this section that sheds light onto the project's potential co-benefits related to water quality or quantity. Is it expected that the project will have will improve... (If Yes, please describe how and how much/to)"
              questionItems={[
                "Water quality?",
                "Surface or ground water?",
                "Water availability in the local community?"
              ]}
            />
            <SectionHeader title="Project Biodiversity and Environmental Co-Benefits" />
            <TextQuestion
              id="biodiversity-benefits"
              description="Enter information in this section that sheds light onto the project's potential co-benefits related to nature. Is it expected that the project will have will improve..."
              questionItems={[
                "Habitat for plants and animals?",
                "Threatened species?",
                "Resilience of new ecosystems?",
                "Soil quality?",
                "Soil erosion?"
              ]}
            />
            <SectionHeader title="Project Community/Farmer Co-Benefits" />
            <TextQuestion
              id="community-benefits"
              description="Is it expected that the project will have will improve..."
              questionItems={[
                "Farmer enterprises?",
                "Farmer livelihoods or income generated?",
                "Farmer resilience to climate change?",
                "Local livelihoods or increased income generated?",
                "Community resilience to climate change?", 
                "Community relationships?",
              ]}
            />
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <div style={styles.techEnergyForm}>
      <div style={styles.greenBar}></div>
      <LogoHeader />
      
      <form>
        {renderCurrentPage()}
        
        <NavigationButtons
          onBack={goToPreviousPage}
          onSave={saveChanges}
          onSaveAndExit={saveAndExit}
          onNext={goToNextPage}
          showBack={currentPage > 1}
        />
      </form>
    </div>
  );
};

export default TechEnergyForm;