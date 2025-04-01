import React, { useState } from 'react';
import * as firestore from "firebase/firestore";
import { db } from "../../firebaseConfig.js";

// Import components
import LogoHeader from '../../components/headers/LogoHeader.js';
import TitleHeader from '../../components/headers/TitleHeader.js';
import ProgressBar from '../../components/ProgressBar.js';
import NavigationButtons from '../../components/NavigationButtons.js';
import SectionHeader from '../../components/headers/SectionHeader.js';
import DropdownQuestion from '../../components/questions/DropdownQuestion.js';
import TextQuestion from '../../components/questions/TextQuestion.js';

interface TechEnergyRisksFormData {

}

const TechEnergyRisksForm: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

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
  };

  const saveAndExit = () => {
    console.log('Saving and exiting...');
  };

  // Common DropdownQuestion options
  const yesNoOptions = ['Yes', 'No', 'Not Applicable'];

  // Render different pages based on the current page
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 1:
        return (
          <>
            <div className="tech-energy-form-category">
              <SectionHeader title="Risk Assessment" />
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="risk-assessment"
                  question="Has the project completed a risk assessment following an approved standard?"
                  options={yesNoOptions}
                  followUpPlaceholder="If so, how was the risk assessment conducted? What high-level risks were identified based on the geography or project activities? Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
            </div>
            
            <div className="tech-energy-form-category">
              <SectionHeader title="Climate Change Adaptation" />
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  question="Has the project been designed to minimize or avoid possible losses or impacts on business continuity for all stakeholders involved?"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
            </div>
            
            <div className="tech-energy-form-category">
              <SectionHeader title="Technology Risks" />
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="technology-risk"
                  question="Has the project been designed or the technology type selected to minimize technology risk (operational, failure avoidance, system lifetime, technology maturity)?"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="scalable-technology"
                  question="Has the project been designed with a solution or technology that can be scalable and replicable?"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
            </div>
            
            <div className="tech-energy-form-category">
              <SectionHeader title="Sustainable Use and Protection of Water Resources" />
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="water-management"
                  question="Is there a water use and protection management plan in place to reduce local water body degradation risk and ensure compliance with local regulations?"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
            </div>
            
            <div className="tech-energy-form-category">
              <SectionHeader title="Pollution & Waste Control" />
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="pollution-prevention"
                  question="Has the project been designed to avoid pollution release into the environment, such as wastewater and air pollution?"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="waste-monitoring"
                  question="Is there active monitoring or regulatory inspections regarding waste streams generated by the project operations or systems?"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
            </div>
          </>
        );
      
      case 2:
        return (
          <>
            <div className="tech-energy-form-category">
              <SectionHeader title="Transition to a Circular Economy" />
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="circular-economy"
                  question="Has the project been designed to not negatively impact the transition to a circular economy? Is there utilization of by-products or recycled elements before, during or after the intervention?"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
            </div>
            
            <div className="tech-energy-form-category">
              <SectionHeader title="Protection and Restoration of Biodiversity and Ecosystems" />
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="biodiversity-impact"
                  question="Has the project been designed to not negatively impact biodiversity and habitats?"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="land-features"
                  question="Has the project been designed to avoid any displacement or disturbance of natural land features?"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
            </div>
            
            <div className="tech-energy-form-category">
              <SectionHeader title="Human and Labor Rights" />
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="responsible-sourcing"
                  question="Does this project align with Nestlé's 'Responsible Sourcing Core Requirements' framework for the protection of Human Rights? (Link to Document)"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="labor-frameworks"
                  question="Are there formal declarations, accountability frameworks and/or third party inspections that ensure that no forced or child labor is involved in the proposed interventions?"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="farmer-health"
                  question="Are there assurances for farmer health and safety in place?"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
            </div>
            
            <div className="tech-energy-form-category">
              <SectionHeader title="Community Impacts" />
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="community-engagement"
                  question="Is there effort to maintain ongoing engagements and participation of the community with regards to this project, including mechanisms to consider grievances?"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="negative-impacts"
                  question="Has this project been designed to minimize other potentially negative community impacts?"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
            </div>
            
            <div className="tech-energy-form-category">
              <SectionHeader title="Safeguards" />
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="effective-safeguards"
                  question="Have effective safeguards been incorporated in the to design phase?"
                  options={yesNoOptions}
                  followUpPlaceholder="Please provide details including if a mitigation plan is in place. If not applicable, please justify."
                />
              </div>
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <div className="tech-energy-form-category">
              <SectionHeader title="Project Water Co-Benefits" />
              <div className="tech-energy-form-subcategory">
                <div className="tech-energy-form-description">
                  Enter information in this section that sheds light onto the project's potential co-benefits related to water quality or quantity.
                </div>

                <DropdownQuestion 
                  id="water-benefits-DropdownQuestion"
                  question="Is it expected that the project activities will improve?"
                  options={yesNoOptions}
                />
                
                <TextQuestion
                  id="water-benefits"
                  description="If Yes, please describe how and how impactful:"
                  questionItems={[
                    "resilience to potential water scarcity?",
                    "water quality?",
                    "Surface or ground water?",
                    "water availability in the local community?"
                  ]}
                />
              </div>
            </div>
            
            <div className="tech-energy-form-category">
              <SectionHeader title="Project Biodiversity and Environmental Co-Benefits" />
              <div className="tech-energy-form-subcategory">
                <div className="tech-energy-form-description">
                  Enter information in this section that sheds light onto the project's potential co-benefits related to nature.
                </div>

                <DropdownQuestion 
                  id="biodiversity-benefits-DropdownQuestion"
                  question="Is it expected that the project activities will improve?"
                  options={yesNoOptions}
                />
                
                <TextQuestion
                  id="biodiversity-benefits"
                  description="If Yes, please describe how and how impactful:"
                  questionItems={[
                    "overall species richness and diversity?",
                    "threatened species?",
                    "threatened or rare ecosystems?",
                    "air quality?",
                    "soil erosion?"
                  ]}
                />
              </div>
            </div>
            
            <div className="tech-energy-form-category">
              <SectionHeader title="Project Community/Farmer Co-Benefits" />
              <div className="tech-energy-form-subcategory">
                <DropdownQuestion 
                  id="community-benefits-DropdownQuestion"
                  question="Is it expected that the project activities will improve?"
                  options={yesNoOptions}
                />
                
                <TextQuestion
                  id="community-benefits"
                  description="If Yes, please describe how and how impactful:"
                  questionItems={[
                    "farmer livelihoods or income generated?",
                    "farmer adaptation to climate change?",
                    "local livelihoods or increased income generated?",
                    "community resilience to climate change?",
                    "community adaptation to climate change?"
                  ]}
                />
              </div>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  // Get the appropriate title description based on the current page
  const getTitleDescription = () => {
    if (currentPage === 3) {
      return "Welcome to the Co-Benefit form. Please continue to enter information.";
    }
    return "Some explanation about what this form is about and just to provide some further information about what's happening?";
  };

  return (
    <div className="tech-energy-form">
      {/* Logo header */}
      <LogoHeader />
      
      {/* Title header */}
      <TitleHeader 
        title="Risks and Co-Benefit Disclosure Form" 
        description={getTitleDescription()}
      />
      
      {/* Progress bar */}
      <ProgressBar steps={totalPages} currentStep={currentPage} />
      
      <form className="tech-energy-form-content">
        {renderCurrentPage()}
        
        {/* Navigation buttons */}
        <NavigationButtons
          onBack={goToPreviousPage}
          onSave={saveChanges}
          onSaveAndExit={saveAndExit}
          onNext={goToNextPage}
          showBack={currentPage > 1}
          showSubmit={currentPage === totalPages}
        />
      </form>
    </div>
  );
};

export default TechEnergyRisksForm;