import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomesService } from 'src/service/homes.service';
import { airbnbUrlValidator, integerValidator } from 'src/utils/validators';
import { Home } from 'src/models/home';
import { SortOption, defaultSortOptions, SortField, SortDirection, SortValue } from 'src/models/sort-option';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private searchForm: FormGroup;
  private sortOptions: SortOption[] = defaultSortOptions;
  private selectedSort: SortValue;
  // private homes: Home[] = [];
  private homes: Home[] = [
    {
      image: 'https://a0.muscache.com/im/pictures/50226263/1514a6b6_original.jpg?aki_policy=large',
      description: 'Skylit Loft in Old Montreal',
      amenity: 'Wifi·Air conditioning·Kitchen',
      room: '2 guests·1 bedroom·1 bed·1 bath',
      rating: 4.77,
      reviewCount: 353,
      price: 122,
      isNew: true,
      isSuperhost: true,
      homeType: 'Entire Home',
      detailPage: undefined
    },
    {
      image: 'https://a0.muscache.com/im/pictures/50226263/1514a6b6_original.jpg?aki_policy=large',
      description: 'Skylit Loft in Old Montreal',
      amenity: 'Wifi·Air conditioning·Kitchen',
      room: '2 guests·1 bedroom·1 bed·1 bath',
      rating: 4.77,
      reviewCount: 353,
      price: 122,
      isNew: true,
      isSuperhost: false,
      homeType: 'Entire Home',
      detailPage: undefined
    }
  ];
  private loading = false;

  constructor(
    private fb: FormBuilder,
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
    this.sortHomes();
  }

  private sortHomes() {
    this.homes.sort((home1, home2) => {
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

  trackHomeItem(home: Home) {
    return home.description;
  }

}
