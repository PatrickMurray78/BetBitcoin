import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MenuController } from '@ionic/angular';
import { BtcService } from '../Services/btc-service.service';
import { interval } from 'rxjs';
import { formatDate } from '@angular/common';
import { NavController } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';

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
  seconds: number;
  amount: number;
  myBet: any;
  choice: number;
  currentBet: number;

  constructor(public storage: Storage, private menu: MenuController, private service: BtcService, private navCtrl: NavController, private vibration: Vibration) {
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
    document.getElementById("currentBetsContainer").style.opacity = "0";
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
    this.seconds = 60 - this.time;
    if(this.time % 61 == 0)
    {
      this.getData();
    }

  }

  getData() {
    this.service.GetBtcData().subscribe(
      (data) => {
        this.btcData = data;
        this.updateSeries();
      }); 
  }

  public updateSeries() {
    let count = 0;
    var series = [
      { data: [] },
    ];
    for(let i = 10; i >= 0; i--)
    {
      this.newData = this.btcData[i+1];
      series[0].data[count] = {
        x: new Date(this.newData[0]),
        y: [this.newData[1], this.newData[2], this.newData[3], this.newData[4]]
      }
      count++;
    }
    this.chartOptions.series = series;
    console.log(this.chartOptions.series[0]);
    this.checkBet();
    
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

  bet(choice:number)
  {
    this.vibration.vibrate(1000);
    this.choice = choice;
    this.balance -= this.amount;
    this.currentBet = this.amount * 2;
    document.getElementById("currentBetsContainer").style.opacity = "1";
  }

  checkBet()
  {
    //this.vibration.vibrate([2000, 1000, 2000]);
    if(this.newData[1] < this.newData[4])
    {
      if(this.choice == 0)
      {
        this.amount *= 2;
        this.balance += this.amount;
      }
      else {
        console.log("You lost");
      }
    }
    else {
      if(this.choice == 1)
      {
        this.amount *= 2;
        this.balance += this.amount;
      }
      else {
        console.log("You lost");
      }
    }
    document.getElementById("currentBetsContainer").style.opacity = "0";
    this.user.dollar = this.balance;
    this.storage.set("loggedIn", this.user)
      .then((data) => {
        })
      .catch();
    
  }

  signOut() {
    this.user.loggedIn = 0;
    this.storage.set("loggedIn", this.user)
      .then((data) => {
        })
      .catch();
      this.navCtrl.navigateBack('/home');
  }
}
