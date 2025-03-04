// Represents data from a response to the renewable energy
// project proposal form
class RenewableProjectProposal {
    // TODO: Make sure these fields are all correct
    afterEmissionFactor!: string;
    afterEnergyConsumption!: number;
    afterSourceOfEnergy!: string;
    beforeEmissionFactor!: string;
    beforeEnergyConsumption!: number;
    beforeSourceOfEnergy!: string;
    commentsAndSourceOfEmissionFactor!: string;
    impactEvidence!: string;
    impactReductionOnGHGEmission!: number;
    impactTiming!: string;
    levelTwoCategory!: string;
    parentVendorName!: string;
    projectImplementationYear!: number;
    projectSpecificActivities!: string;
    projectType!: string;
    spendCategory!: string;
    vendorCode!: number;
    vendorSiteCity!: string;
    vendorSiteCountry!: string;
    vendorSiteSAPName!: string;
    volumeOfMaterial!: number;

    constructor(init?: Partial<RenewableProjectProposal>) {
        Object.assign(this, init);
    }
}

export const renewableProjectProposalConverter = {
    toFirestore: (data: string) => {

    },

    fromFirestore: (snapshot: any, options: any) => {

    }
};

export default RenewableProjectProposal;