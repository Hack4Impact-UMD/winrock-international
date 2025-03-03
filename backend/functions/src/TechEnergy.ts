export class TechEnergy {
    
    riskCat!: string;
    riskSubCat!: string;
    disclosure!: string;
    description!: string;

    constructor(init?: Partial<TechEnergy>) {
        Object.assign(this, init);
    }
}