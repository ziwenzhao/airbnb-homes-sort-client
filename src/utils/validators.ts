import { ValidatorFn, AbstractControl } from '@angular/forms';

export const airbnbUrlValidator: ValidatorFn = (control: AbstractControl) => {
    const regex = /www.airbnb.*?\/homes/;
    return regex.test(control.value) ? null : { invalidUrl: { value: control.value } };
};

export const integerValidator: ValidatorFn = (control: AbstractControl) => {
    return control.value === null || (Number.isInteger(control.value) && control.value > 0) ?
        null : { invalidInteger: { value: control.value } };
};
