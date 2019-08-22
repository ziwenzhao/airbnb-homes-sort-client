import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule, MatCardModule, MatListModule, MatButtonModule } from '@angular/material';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomesService } from 'src/service/homes.service';
import { RestApiService } from 'src/service/rest-api.service';


const matModules = [MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, MatCardModule, MatListModule];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // AppRoutingModule,
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
