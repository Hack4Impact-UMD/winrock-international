// Represents data from a response to the project submission form
export class ProjectSubmission {
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

    constructor(init?: Partial<ProjectSubmission>) {
        Object.assign(this, init);
    }
}

// Convert a ProjectSubmission to and from the Firestore key-value format
export const projectSubmissionConverter = {
    toFirestore: (data: ProjectSubmission) => Object.assign({}, data),
    fromFirestore: (snapshot: any, options: any) => new ProjectSubmission(snapshot.data(options))
};