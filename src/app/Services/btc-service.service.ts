import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BtcService {

  constructor(private http:HttpClient) { }
  
  /*
    This function fetches the data for the bitcoin/dollar chart from an api
  */
  GetBtcData():Observable<any> {
    return this.http.get('https://api.gemini.com/v2/candles/btcusd/1m');
   }
}