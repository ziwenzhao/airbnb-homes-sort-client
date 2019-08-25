import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule,
  MatListModule, MatButtonModule, MatProgressSpinnerModule, MatIconModule
} from '@angular/material';


import { AppComponent } from './app.component';
import { HomesService } from 'src/service/homes.service';
import { RestApiService } from 'src/service/rest-api.service';
import { ElevationDirective } from 'src/directives/elevation.directive';


const matModules = [MatFormFieldModule, MatInputModule, MatButtonModule,
  MatSelectModule, MatCardModule, MatListModule, MatIconModule, MatProgressSpinnerModule];

@NgModule({
  declarations: [
    AppComponent,
    ElevationDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ...matModules
  ],
  providers: [
    HomesService,
    RestApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
