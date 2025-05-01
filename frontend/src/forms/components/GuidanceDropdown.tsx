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
                    <h2>Renewable Energy Proposal Form Guidance</h2>
                    <h3>Background</h3>
                    <p>
                        In 2019, Nestlé has publicly committed to Net Zero GHG (Greenhouse Gases) emissions by 2050 on the full value chain scope with intermediary targets of -20% GHG emissions by 2025 and -50% by 2030 compared to the baseline year 2018. One of the efforts for the reduction of GHG, is for our supply base to shift to Renewable Energy/Electricity. We expect our suppliers to support Nestlé in delivering against this commitment.                     </p>
                    <h3>Objective</h3>
                    <p>
                        The objective of the submission form is to collect all opportunities linked to Renewable Energy & Energy consumptions reduction projects implemented by our suppliers or suggested to be implemented by our suppliers covering Nestlé's volume produced by you as our supplier
                    </p>
                    <h3>Overview of Process</h3>
                    <p>
                        1) Nestlé receives completed Project Submission Forms from suppliers, which can include initiatives prior to our 2018 baseline Emission year, initiatives that took place between 2018-2022, as well initiatives that are implemented/have been planned to implement from 2023 onwards
                    </p>
                    <p>
                        2) Follow up by Nestlé on any clarifications on the information provided
                    </p>
                    <p>
                        3) Project proposals are reviewed for any potential collaboration after which potential feedback is given
                    </p>
                    <h3>Energy Consumption and Benefit Forecast</h3>
                    <p>
                        We recognize that quantifying Energy Consumption linked to Nestlé volume only can be challenging, however we ask you to provide energy consumption and benefit forecasts to the best of your ability linked to Nestlé's produced volume out of your individual production sites. Initial estimates are critical for our evaluation of opportunities on Renewable Energy/Electricity. As such, we require that this section be completed for all submissions with as much detail as possible. We have included several examples in the Green rows on how the benefits of projects can be estimated depending on what information is available.

                    </p>
                    <p style={{ color: '#D30000', marginTop: '20px' }}>
                        Important note: even if there is no Renewable Energy/Electricity project yet for your production site, we kindly request you to include your kWh consumption of Energy per site linked to Nestlé produced volume in that site (-kindly convert both electricity as well as other streams of energy to the unit: kWh)
                    </p>

                    <p>
                        <br />Please provide the best estimate for GHG emission impact that will likely occur as a result of the Renewable Energy/Electricity implementation. Several options to calculate this are included - we recognize that some projects may use different or more detailed methods for estimating the GHG emission impact.
                        <br /> <br />
                        Please ensure any volume reduction impact is not considered as a carbon benefit - please only focus on carbon benefits coming from a change towards a renewable energy/electricity source
                        <br /><br />
                        Also note that you can include multiple energy sources per factory site, to account for a variety of energy sources and transitions within that site</p>
                    <p style={{ color: '#31AB48', fontWeight: '600' }}>
                        <br />
                        Example, on RECs (Renewable Electricity Certificates):

                    </p>
                    <p>
                        You have bought RECs (Renewable Electricity Certificates) to cover Jan-Sept 2023 energy consumption to produce the Nestlé volume - if you do not have full RECs coverage for 2023 in place, please highlight this in the 'Comments/Remarks' column. Please do not annualize RECs coverage CO2e impact, if this coverage is not in place yet for the full 12 months in 2023 - kindly only include the current cover length.
                        <br /> <br />
                        The 'Project implementation date columns' in the Project Submission Form-tab therefore highlights the latest coverage date of the RECs - in the above example  '2023' - '09', for September 2023 cover length.
                    </p>
                    <p style={{ color: '#31AB48', fontWeight: '600' }}>
                        <br />
                        Example, on other Renewable Energy/Electricity initiatives:

                    </p>
                    <p>
                        Solar Panels installed in June 2023, please always annualize this, impacting 12 months of the expected energy consumption coming out of these solar panels to produce Nestlé volumes.

                        <br /> <br />The 'Project implementation date columns' in the Project Submission Form-tab therefore highlights when the panels started to be operational/active/working - in the above example '2023' - '06', for June 2023 implementation date.
                    </p>
                </div>
            )}
        </div>
    );
};

export default GuidanceDropdown;