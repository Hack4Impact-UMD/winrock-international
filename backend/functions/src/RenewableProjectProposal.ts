// Represents data from a response to the renewable energy
// project proposal form
class RenewableProjectProposal {
    afterEmissionFactor?: string;
    afterEnergyConsumption?: string;
    afterSourceOfEnergy?: string;
    beforeEmissionFactor?: string;
    beforeEnergyConsumption!: string;
    beforeSourceOfEnergy!: string;
    commentsAndSourceOfEmissionFactor?: string;
    impactEvidence?: string;
    impactReductionOnGHGEmission?: string;
    impactTiming?: string;
    levelTwoCategory!: string;
    parentVendorName!: string;
    projectImplementationYear?: string;
    projectSpecificActivities?: string;
    projectType?: string;
    spendCategory!: string;
    vendorCode?: string;
    vendorSiteCity!: string;
    vendorSiteCountry!: string;
    vendorSiteSAPName?: string;
    volumeOfMaterial!: string;

    constructor(init?: Partial<RenewableProjectProposal>) {
        Object.assign(this, init);
    }
}

export default RenewableProjectProposal;