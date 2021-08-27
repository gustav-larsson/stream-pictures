import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function foundInArrayValidator(array: Array<any>): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      return array.includes(control.value) ? null : {foundInArray: {value: control.value}};
  };
}
