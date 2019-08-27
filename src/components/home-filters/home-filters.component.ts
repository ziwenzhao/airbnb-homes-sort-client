import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { integerValidator } from 'src/utils/validators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-home-filters',
  templateUrl: './home-filters.component.html',
  styleUrls: ['./home-filters.component.scss']
})
export class HomeFiltersComponent implements OnInit {

  private homeFilterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<HomeFiltersComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) private filterValue?: FilterValue
  ) {
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.homeFilterForm = this.fb.group({
      price: this.fb.group({
        minPrice: this.filterValue.price.minPrice,
        maxPrice: this.filterValue.price.maxPrice,
      }),
      minRating: this.filterValue.minRating,
      minReviews: [this.filterValue.minReviews, integerValidator]
    });
  }

  onSubmit() {
    const formValue = this.homeFilterForm.value;
    const filterValue: FilterValue = {
      price: {
        minPrice: formValue.price.minPrice,
        maxPrice: formValue.price.maxPrice
      },
      minRating: formValue.minRating,
      minReviews: formValue.minReviews
    };
    this.dialogRef.close(filterValue);
  }
}

export class FilterValue {
  price?: {
    minPrice?: number;
    maxPrice?: number
  };
  minRating?: number;
  minReviews?: number;
}
