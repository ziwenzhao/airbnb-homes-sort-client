import { Component, TemplateRef, ViewChild, ViewContainerRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { first } from 'rxjs/operators';

import { HomeFiltersComponent, FilterValue } from 'src/components/home-filters/home-filters.component';
import { HomesService } from 'src/service/homes.service';
import { airbnbUrlValidator, integerValidator } from 'src/utils/validators';
import { Home } from 'src/models/home';
import { SortOption, defaultSortOptions, SortField, SortDirection, SortValue } from 'src/models/sort-option';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  private searchForm: FormGroup;
  private sortOptions: SortOption[] = defaultSortOptions;
  private selectedSort: SortValue;
  private filterValue: FilterValue = new FilterValue();
  private homes: Home[] = [];
  private filteredHomes: Home[] = [];
  private overlayRef: OverlayRef;
  private spinnerPortal: TemplatePortal;
  private lastSearchRequestTimestamp: number = null;

  @ViewChild('spinnerRef', { static: true })
  private spinnerRef: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private homeService: HomesService,
    private overlay: Overlay,
    private vcRef: ViewContainerRef
  ) {
    this.initForm();
  }

  ngAfterViewInit() {
    this.overlayRef = this.overlay.create({
      hasBackdrop: false,
      positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically()
    });
    this.spinnerPortal = new TemplatePortal(this.spinnerRef, this.vcRef);
  }

  private initForm() {
    this.searchForm = this.fb.group({
      url: ['', airbnbUrlValidator],
      maxPageNumber: [null, integerValidator]
    });
  }

  private async searchHomes() {
    if (this.lastSearchRequestTimestamp === null) {
      this.showSpinner();
    }
    const timestamp = Date.now();
    this.lastSearchRequestTimestamp = timestamp;
    try {
      const homes = await this.homeService.scrapeAndGetHomes(this.searchForm.controls.url.value,
        this.searchForm.controls.maxPageNumber.value);
      console.log('Fetching homes success', this.homes);
      if (timestamp === this.lastSearchRequestTimestamp) {
        this.homes = homes;
        this.filterHomes();
        this.sortHomes();
      }
    } catch (err) {
      console.error('Fetch homes fails', err);
    } finally {
      if (timestamp === this.lastSearchRequestTimestamp) {
        this.hideSpinner();
        this.lastSearchRequestTimestamp = null;
      }
    }
  }

  private showSpinner() {
    this.overlayRef.attach(this.spinnerPortal);
  }

  private hideSpinner() {
    this.overlayRef.detach();
  }

  private sortHomes() {
    if (this.selectedSort) {
      this.filteredHomes.sort((home1, home2) => {
        switch (this.selectedSort.field) {
          case SortField.Price:
            return this.selectedSort.direction === SortDirection.Asc ? home1.price - home2.price : home2.price - home1.price;
          case SortField.Reviews:
            return this.selectedSort.direction === SortDirection.Asc ?
              home1.reviewCount - home2.reviewCount : home2.reviewCount - home1.reviewCount;
          case SortField.Rating:
            return this.selectedSort.direction === SortDirection.Asc ? home1.rating - home2.rating : home2.rating - home1.rating;
        }
      });
    }
  }

  private filterHomes() {
    this.filteredHomes = this.homes.filter(home => (this.filterValue.price.minPrice ? home.price >= this.filterValue.price.minPrice : true)
      && (this.filterValue.price.maxPrice ? home.price <= this.filterValue.price.maxPrice : true)
      && (this.filterValue.minRating ? home.rating >= this.filterValue.minRating : true)
      && (this.filterValue.minReviews ? home.reviewCount >= this.filterValue.minReviews : true));
  }

  private trackHomeItem(home: Home) {
    return home.description;
  }

  private openFilterDialog() {
    const dialogRef = this.dialog.open(HomeFiltersComponent, {
      data: this.filterValue
    });

    dialogRef.componentInstance.clearFilterEvent.subscribe(() => {
      this.filterValue.clear();
      this.filteredHomes = this.homes;
      this.sortHomes();
    });

    dialogRef.afterClosed().pipe(
      first()
    ).subscribe((val: FilterValue) => {
      if (val) {
        this.filterValue = val;
        this.filterHomes();
        this.sortHomes();
      }
    });
  }
}
