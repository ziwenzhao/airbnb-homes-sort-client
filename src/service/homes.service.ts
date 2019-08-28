import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { Home } from 'src/models/home';

const BASE_URL = 'http://airbnbscrapeserver.x6pv2j6aqy.us-east-1.elasticbeanstalk.com';
// const BASE_URL = 'http://127.0.0.1:5000';

@Injectable({
  providedIn: 'root'
})
export class HomesService {

  constructor(
    private rest: RestApiService
  ) { }

  async scrapeAndGetHomes(url: string, maxPageNumber?: number): Promise<Home[]> {
    const { job_id } = await this.scrapeHomes(url, maxPageNumber);
    const homesJson = await this.getHomesWithJobId(job_id);
    await this.deleteHomesJsonFile(job_id);
    return !!homesJson ? homesJson.map(json => Home.getHomeFromJson(json)) : [];
  }

  scrapeHomes(url: string, maxPageNumber?: number) {
    return this.rest.request('POST', BASE_URL + '/scrape_homes', {
      body: {
        url,
        max_page_number: maxPageNumber
      },
    });
  }

  getHomesWithJobId(jobId: string) {
    return this.rest.request('GET', BASE_URL + '/get_homes', {
      params: {
        job_id: jobId
      },
    });
  }

  deleteHomesJsonFile(jobId: string) {
    return this.rest.request('DELETE', BASE_URL + '/delete_file', {
      responseType: 'text',
      params: {
        job_id: jobId
      }
    });
  }
}
