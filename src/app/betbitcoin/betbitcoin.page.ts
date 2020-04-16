import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MenuController } from '@ionic/angular';
import { BtcService } from '../Services/btc-service.service';
import { interval } from 'rxjs';
import { formatDate } from '@angular/common';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-betbitcoin',
  templateUrl: './betbitcoin.page.html',
  styleUrls: ['./betbitcoin.page.scss'],
})
export class BetbitcoinPage implements OnInit {
  @ViewChild("chart", {static: false}) chart:ChartComponent;
  public chartOptions:Partial<ChartOptions>;

  time: number;
  btcData: any = [];
  count:number = 0;
  prevCandle:number;
  newCandle:number;
  newData: any;
  user: any;
  name:string;
  balance: number;

  constructor(public storage: Storage, private menu: MenuController, private service: BtcService) {
    this.chartOptions = {
      series: [{
        data: []
      }],
      chart: {
        type: "candlestick",
        height: 350
      },
      title: {
        text: "BTC/USD",
        align: "left"
      },
      xaxis: {
        type: "datetime"
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };
   }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  source = interval(1000);
  subscribe = this.source.subscribe(val => this.secondTracker());

  ngOnInit() {
    this.getData();
    this.storage.get("loggedIn")
      .then((data) => {
          this.user = data;
          this.name = this.user.name;
          this.balance = this.user.dollar;
        })
      .catch();
  }

  secondTracker()
  {
    this.time = new Date().getSeconds();
    console.log(this.time);
    if(this.time % 60 == 0)
    {
      this.getData();
    }

  }

  getData() {
    this.service.GetBtcData().subscribe(
      (data) => {
        this.btcData = data;
        //this.updateSeries();
      }); 
  }

  public generateDayWiseTimeSeries(baseval, count, yrange) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }
}
