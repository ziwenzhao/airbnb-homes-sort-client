import { Component, OnInit, Inject, Optional, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { integerValidator } from 'src/utils/validators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-home-filters',
  templateUrl: './home-filters.component.html',
  styleUrls: ['./home-filters.component.scss']
})
export class HomeFiltersComponent implements OnInit {

  public clearFilterEvent = new EventEmitter();
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

  private initForm() {
    this.homeFilterForm = this.fb.group({
      price: this.fb.group({
        minPrice: this.filterValue.price.minPrice,
        maxPrice: this.filterValue.price.maxPrice,
      }),
      minRating: this.filterValue.minRating,
      minReviews: [this.filterValue.minReviews, integerValidator]
    });
  }

  private onSubmit() {
    const { price, minRating, minReviews } = this.homeFilterForm.value as FilterValue;
    this.dialogRef.close(new FilterValue(price, minRating, minReviews));
  }

  private anyFilter() {
    return this.homeFilterForm.value.price.minPrice !== null || this.homeFilterForm.value.price.maxPrice !== null
      || this.homeFilterForm.value.minReviews !== null || this.homeFilterForm.value.minRating !== null;
  }

  private clearFilter() {
    this.homeFilterForm.reset();
    this.clearFilterEvent.emit();
  }
}

export class FilterValue {
  price: FilterPrice;
  minRating: number;
  minReviews: number;

  constructor(price: FilterPrice = new FilterPrice(), minRating: number = null, minRevies: number = null) {
    this.price = price;
    this.minRating = minRating;
    this.minReviews = minRevies;
  }

  clear() {
    this.price.minPrice = null;
    this.price.maxPrice = null;
    this.minRating = null;
    this.minReviews = null;
  }
}

export class FilterPrice {
  minPrice: number = null;
  maxPrice: number = null;
}
