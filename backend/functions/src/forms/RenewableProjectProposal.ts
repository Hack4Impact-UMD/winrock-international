import * as formAPI from "../formAPI.js";

interface RenewableProjectProposalData extends formAPI.FormData {
    afterEmissionFactor?: string;
    afterEnergyConsumption?: string;
    afterSourceOfEnergy?: string;
    beforeEmissionFactor?: string;
    beforeEnergyConsumption: string;
    beforeSourceOfEnergy: string;
    commentsAndSourceOfEmissionFactor?: string;
    impactEvidence?: string;
    impactReductionOnGHGEmission?: string;
    impactTiming?: string;
    levelTwoCategory: string;
    parentVendorName: string;
    projectImplementationYear?: string;
    projectSpecificActivities?: string;
    projectType?: string;
    spendCategory: string;
    vendorCode?: string;
    vendorSiteCity: string;
    vendorSiteCountry: string;
    vendorSiteSAPName?: string;
    volumeOfMaterial: string;
}

class RenewableProjectProposal implements formAPI.FormSubmission {
    static formType: formAPI.FormType = {
        formName: "renewableProjectProposal",
        formID: "project-proposal-form/GG9KZ21emgEDELo9kvTT/project-submission-form"
    };
    formData: RenewableProjectProposalData;

    constructor(formData: RenewableProjectProposalData) {
        this.formData = formData;
    }
}

export default RenewableProjectProposal;