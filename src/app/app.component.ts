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

  private onSubmit() {
    this.searchHomes();
  }

  private searchHomes() {
    // this.
  }

  show() {
    console.log(this.searchForm);
  }
}
