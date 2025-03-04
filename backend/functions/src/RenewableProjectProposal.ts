// Represents data from a response to the renewable energy
// project proposal form
class RenewableProjectProposal {
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

/**
 * Convert a renewableProjectProposal between JSON string
 * format and Firestore key-value format
 */
export const renewableProjectProposalConverter = {
    toFirestore: (data: string) => {
        return {};
    },

    fromFirestore: (snapshot: any, options: any) => {

    }
};

export default RenewableProjectProposal;