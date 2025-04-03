class FormField {
    value: string;
    isRequired: boolean;

    constructor(value: string, isRequired: boolean) {
        this.value = value;
        this.isRequired = isRequired;
    }
}

export default FormField;