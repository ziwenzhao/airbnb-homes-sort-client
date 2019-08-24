import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomesService } from 'src/service/homes.service';
import { airbnbUrlValidator, integerValidator } from 'src/utils/validators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  private searchForm: FormGroup;
  private homes = [];
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
  }

  show() {
    console.log(this.searchForm);
  }
}
