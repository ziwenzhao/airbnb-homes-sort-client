import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { HomesService } from 'src/service/homes.service';
import { airbnbUrlValidator, integerValidator } from 'src/utils/validators';
import { Home } from 'src/models/home';
import { SortOption, defaultSortOptions, SortField, SortDirection, SortValue } from 'src/models/sort-option';
import { HomeFiltersComponent, FilterValue } from 'src/components/home-filters/home-filters.component';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private searchForm: FormGroup;
  private sortOptions: SortOption[] = defaultSortOptions;
  private selectedSort: SortValue;
  private filterValue: FilterValue = {
    price: {
      minPrice: null,
      maxPrice: null
    },
    minRating: null,
    minReviews: null
  };
  private homes: Home[] = [];
  // private filteredHomes: Home[] = [
  //   {
  //     image: 'https://a0.muscache.com/im/pictures/50226263/1514a6b6_original.jpg?aki_policy=large',
  //     description: 'Skylit Loft in Old Montreal',
  //     amenity: 'Wifi·Air conditioning·Kitchen',
  //     room: '2 guests·1 bedroom·1 bed·1 bath',
  //     rating: 4.77,
  //     reviewCount: 353,
  //     price: 122,
  //     isNew: true,
  //     isSuperhost: true,
  //     homeType: 'Entire Home',
  //     detailPage: undefined
  //   },
  //   {
  //     image: 'https://a0.muscache.com/im/pictures/50226263/1514a6b6_original.jpg?aki_policy=large',
  //     description: 'Skylit Loft in Old Montreal',
  //     amenity: 'Wifi·Air conditioning·Kitchen',
  //     room: '2 guests·1 bedroom·1 bed·1 bath',
  //     rating: 4.77,
  //     reviewCount: 353,
  //     price: 122,
  //     isNew: true,
  //     isSuperhost: false,
  //     homeType: 'Entire Home',
  //     detailPage: undefined
  //   }
  // ];
  private filteredHomes: Home[] = [];
  private loading = false;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private homeService: HomesService
  ) {
    this.initForm();
  }

  private initForm() {
    this.searchForm = this.fb.group({
      url: ['', airbnbUrlValidator],
      maxPageNumber: [null, integerValidator]
    });
  }

  private async searchHomes() {
    this.loading = true;
    try {
      this.homes = await this.homeService.scrapeAndGetHomes(this.searchForm.controls.url.value,
        this.searchForm.controls.maxPageNumber.value);
      console.log('Fetching homes success', this.homes);
    } catch (err) {
      console.error('Fetch homes fails', err);
    } finally {
      this.loading = false;
    }
    this.filterHomes();
    this.sortHomes();
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
