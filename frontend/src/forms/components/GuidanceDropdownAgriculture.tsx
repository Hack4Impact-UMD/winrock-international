import React, { useState } from 'react';
import styles from '../css-modules/GuidanceDropdown.module.css';
import downArrow from '../../assets/arrow-left.png'; // Assuming you've saved your icon as a React component or SVG

const GuidanceDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(prevState => !prevState);
    };

    return (
        <div className={styles.guidanceContainer}>
            <button className={styles.guidanceButton} onClick={toggleDropdown}>
                {isOpen ? "Guidance" : "Guidance"}
                <img src={downArrow} alt="Down Arrow" className={`${styles.icon} ${isOpen ? styles.open : ''}`} />
            </button>
            {isOpen && (
                <div className={styles.guidanceContent}>
                    <h2>Agriculture Proposal Form Guidance</h2>
                    <h3>Form Contents</h3>
                    <p>
                        <strong>Agriculture Project Proposal Form:</strong> This project proposal form asks for comprehensive details including the specific ingredient, project activity, geographic location, project partners, timeline, connection to Nestle’s value chain, GHG estimates calculation, costs, and benefit sharing. To assist you, the form includes examples and guidance for each question.
                    </p>
                    <p>
                        <strong>Documentation Checklist:</strong> The checklist details the information required for project validation and third-party audits, which will be gathered throughout the project validation process.
                    </p>


                    <h3>Background</h3>
                    <p>
                        In 2019, Nestlé has publicly committed to Net Zero GHG (Greenhouse Gases) emissions by 2050 on the full value chain scope with intermediary targets of -20% GHG emissions by 2025 and -50% by 2030 compared to the baseline year 2018. One of the efforts for the reduction of GHG, is for our supply base to shift to Renewable Energy/Electricity. We expect our suppliers to support Nestlé in delivering against this commitment.                     </p>
                    <h3>Objective</h3>
                    <p>
                        The objective of the submission form is to collect all opportunities linked to Renewable Energy & Energy consumptions reduction projects implemented by our suppliers or suggested to be implemented by our suppliers covering Nestlé's volume produced by you as our supplier
                    </p>
                    <h3>Overview of Process</h3>
                    <p>
                        1) Suppliers/Project developers send Nestlé a completed Agriculture Project Proposal Form.  Note - To capture the impacts of an intervention within a specific reporting year, the intervention must take place and its benefits must be measured within that same reporting year.                       </p>
                    <p>
                        2) Nestlé staff or a designated third-party technical advisor of Nestlé will follow up to clarify any of the information provided or missing in this form.                       </p>
                    <p>
                        3) Project proposals are reviewed for (1) technical accuracy and compliance with the GHG Protocol and other carbon accounting best practices as well as (2) any potential collaboration opportunities with Nestlé and the Project Proposal Form submitter, after which the Winrock team may request supplementary documentation or clarifications via email, or schedule a meeting.                       </p>
                    <p>
                        4) Winrock will conduct a detailed GHG emissions assessment on your project(s). Winrock team will have follow-up meetings or email exchanges with you to review the information provided, resolve any data discrepancies, and address questions.
                    </p>
                    <p>
                        5) Winrock will share the completed GHG assessment of the project with both the supplier and the Nestle procurement manager, including a flag rating and any corrective actions needed. As a final step, the supplier will also receive a risk disclosure document to complete and return.
                    </p>
                    <h3>GHG Benefits Estimates</h3>
                    <p>The following considerations may impact the total GHG benefits to Nestlé:</p>
                    <p>1. For projects with co-products: When purchasing only one processed ingredient, Nestlé is responsible for only a portion of the total ingredient which corresponds to the equivalent of hectares used to produce the volume of purchased processed ingredient (e.g., Corn Gluten Meal).</p>
                    <p>2. For removals projects: A 20% buffer must be considered on reported carbon removals to manage the reversal risk.</p>
                    <p>3. For removals projects involving crop rotation: In situations where several crops are produced in a rotation and Nestlé is purchasing only some of these crops, proportional allocation would have to be considered up to the hectarage corresponding to the purchased volumes.</p>
                    <p>For any of the above considerations, Winrock will provide technical guidance on a project-to-project basis.</p>
                    <p>Additionally, please provide the best estimate for GHG emission impact that will likely occur as a result of the regenerative agriculture project implementation. Different options to calculate this are included - we recognize that projects may use different approaches for estimating the GHG emission impact.</p>
                    <p>Please ensure any volume reduction impact is not considered as a carbon benefit — only focus on carbon benefits coming from a change in practice through better agricultural practices.</p>


                </div>
            )}
        </div>
    );
};

export default GuidanceDropdown;