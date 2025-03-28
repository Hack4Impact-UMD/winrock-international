import { useState } from "react";
import * as firestore from "firebase/firestore";
import { db } from "../../src/firebaseConfig.js";

import LogoHeader from "../components/LogoHeader.js";
import SectionHeader from "../components/SectionHeader.js";
import TitleHeader from "../components/TitleHeader.js";

function RenewableProposalForm() {
    const renewableProjectProposalFormID = "project-proposal-form/GG9KZ21emgEDELo9kvTT/project-submission-form";
    const renewableProjectProposalForm = firestore.collection(db, renewableProjectProposalFormID);

    const [parentVendorName, setParentVendorName] = useState("");
    const [vendorCode, setVendorCode] = useState("");
    const [vendorSiteSAPName, setVendorSiteSAPName] = useState("");
    const [spendCategory, setSpendCategory] = useState("");
    const [level2Category, setLevel2Category] = useState("");
    const [vendorSiteCountry, setVendorSiteCountry] = useState("");
    const [vendorSiteCity, setVendorSiteCity] = useState("");
    const [projectType, setProjectType] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [projectImplementationYear, setProjectImplementationYear] = useState("");
    const [impactEvidence, setImpactEvidence] = useState("");

    const [impactEvidenceDropdownLabel, setImpactEvidenceDropdownLabel] = useState("");
    const [displayImpactEvidenceTextbox, setDisplayImpactEvidenceTextbox] = useState(false);

    /**
     * Save a new renewableProjectProposal document with the user-inputted
     * fields into the renewableProjectProposalForm collection.
    */
    async function handleSubmit() {
        try {
            const documentObj = {
                parentVendorName: parentVendorName,
                vendorCode: vendorCode,
                vendorSiteSAPName: vendorSiteSAPName,
                spendCategory: spendCategory,
                level2Category: level2Category,
                vendorSiteCountry: vendorSiteCountry,
                vendorSiteCity: vendorSiteCity,
                projectType: projectType,
                projectDescription: projectDescription,
                projectImplementationYear: projectImplementationYear,
                impactEvidence: impactEvidence
            }
            const documentRef = await firestore.addDoc(renewableProjectProposalForm, documentObj); // addDoc() auto-generates an ID for the doc
            console.log(`renewableProjectProposal submitted successfully with ID ${documentRef.id}`)
        } catch (error) {
            console.error("Error submitting renewableProjectProposal", error);
        }
    }

    return (
        <div className="form renewable-proposal-form">
            <LogoHeader />
            <TitleHeader
                title="Renewable Energy Project Proposal Form"
                description="This is an intake form for renewable energy/energy reduction projects to support Nestlé's
                             goal of achieving Net Zero GHG emissions by 2050."
            />
            <br /> {/* ProgressBar will go here */}

            <SectionHeader label="Generic Information" />

            <div className="question text-question required">
                <label htmlFor="parent-vendor-name">Parent Vendor Name</label>
                <input
                    type="text"
                    id="parent-vendor-name"
                    value={parentVendorName}
                    onChange={(e) => setParentVendorName(e.target.value)}
                />
            </div>

            <div className="question text-question">
                <label htmlFor="vendor-code">Vendor Code</label>
                <input
                    type="text"
                    id="vendor-code"
                    value={vendorCode}
                    onChange={(e) => setVendorCode(e.target.value)}
                />
            </div>

            <div className="question text-question">
                <label htmlFor="vendor-site-sap-name">Vendor Site SAP Name</label>
                <input
                    type="text"
                    id="vendor-site-sap-name"
                    value={vendorSiteSAPName}
                    onChange={(e) => setVendorSiteSAPName(e.target.value)}
                />
            </div>

            <div className="question dropdown-question required">
                <label htmlFor="spend-category">Spend Category</label>
                <select
                    id="spend-category"
                    value={spendCategory}
                    onChange={(e) => setSpendCategory(e.target.value)}
                >
                    <option value="" disabled>-- select --</option>
                    <option value="Ingredients">Ingredients</option>
                    <option value="Commodities">Commodities</option>
                    <option value="Packaging">Packaging</option>
                    <option value="Logistics">Logistics</option>
                </select>
            </div>

            <div className="question dropdown-question required">
                <label htmlFor="level-2-category">Level 2 Category</label>
                <select
                    id="level-2-category"
                    value={level2Category}
                    onChange={(e) => setLevel2Category(e.target.value)}
                >
                    <option value="" disabled>-- select --</option>
                    <option value="Amino Acids">Amino Acids</option>
                    <option value="Cereals & Grains">Cereals & Grains</option>
                    <option value="Flexibles">Flexibles</option>
                    <option value="Warehousing Services">Warehousing Services</option>
                </select>
            </div>

            <div className="question text-question required">
                <label htmlFor="vendor-site-country">Vendor Site Country</label>
                <input
                    type="text"
                    id="vendor-site-country"
                    value={vendorSiteCountry}
                    onChange={(e) => setVendorSiteCountry(e.target.value)}
                />
            </div>

            <div className="question text-question required">
                <label htmlFor="vendor-site-city">Vendor Site City</label>
                <input
                    type="text"
                    id="vendor-site-city"
                    value={vendorSiteCity}
                    onChange={(e) => setVendorSiteCity(e.target.value)}
                />
            </div>

            <div className="question text-question required">
                <label htmlFor="project-type">Project Type</label>
                <input
                    type="text"
                    id="project-type"
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                />
            </div>

            <div className="question text-question required">
                <label htmlFor="project-description">Provide a brief description of the project's specific activities.</label>
                <textarea
                    id="project-description"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                />
            </div>

            <div className="question text-question required">
                <label htmlFor="project-implementation-year">Project Implementation Year</label>
                <input
                    type="text"
                    id="project-implementation-year"
                    value={projectImplementationYear}
                    onChange={(e) => setProjectImplementationYear(e.target.value)}
                />
            </div>

            <div className="question dropdown-question required">
                <label htmlFor="impact-evidence-dropdown">How do you plan to evidence the project impact?</label>
                <select
                    id="impact-evidence-dropdown"
                    value={impactEvidenceDropdownLabel}
                    onChange={(e) => {
                        setImpactEvidenceDropdownLabel(e.target.value);
                        if (e.target.value === "other") {
                            setImpactEvidence("");
                            setDisplayImpactEvidenceTextbox(true);
                        } else {
                            setImpactEvidence(e.target.value);
                            setDisplayImpactEvidenceTextbox(false);
                        }
                    }}
                >
                    <option value="" disabled>-- select --</option>
                    <option value="Project implementation partner (2nd/3rd party)">Project implementation partner (2nd/3rd party)</option>
                    <option value="Electronic metering tool">Electronic metering tool</option>
                    <option value="other">Other (please describe)</option>
                </select>
                {displayImpactEvidenceTextbox &&
                    <textarea
                        id="impact-evidence-textbox"
                        value={impactEvidence}
                        onChange={(e) => setImpactEvidence(e.target.value)}
                    />}
            </div>

            <button
                className="submit"
                onClick={async () => await handleSubmit()}
            >
                Submit
            </button>
        </div>
    );
}

export default RenewableProposalForm;