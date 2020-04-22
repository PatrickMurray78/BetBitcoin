import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MenuController } from '@ionic/angular';
import { BtcService } from '../Services/btc-service.service';
import { interval } from 'rxjs';
import { formatDate } from '@angular/common';
import { NavController } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';

/**
 * Import components and interfaces from the ng-apexcharts module.
 */
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";

/**
 * Exports ChartOptions using values from the ng-apexcharts module
 */
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
  // Create a view query, using chart as the selector
  @ViewChild("chart", {static: false}) chart:ChartComponent;
  public chartOptions:Partial<ChartOptions>;

  time: number;
  btcData: any = [];
  count:number = 0;
  newData: any;
  user: any;
  accountNum: number;
  name:string;
  balance: number;
  seconds: number;
  amount: number;
  myBet: any;
  choice: number;
  currentBet: number;
  gotData: boolean = false;
  disableBet: boolean = false;
  numCandles: number = 10;

  constructor(public storage: Storage, private menu: MenuController, private service: BtcService, private navCtrl: NavController, private vibration: Vibration) {
    // Initialise ChartOptions
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
  
  /**
   * Called once <ion-menu-button> has been clicked.
   * This enables the side menu and displays it.
   */
  openCustom():void {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }

  // Create a subscription to the secondTracker() function, that is called
  // every 1000ms.
  source = interval(1000);
  subscribe = this.source.subscribe(val => this.secondTracker());

  /**
   * When the user logs in, this function fetches the current
   * chart data, while also fetching the user whho is logged in.
   */
  ngOnInit():void {
    document.getElementById("bet").style.opacity = "0";
    this.getData();
    this.storage.get("loggedIn")
      .then((data) => {
          this.user = data;
          this.name = this.user.name;
          this.balance = this.user.dollar;
          this.accountNum = this.user.accountNum;
        })
      .catch();
  }

  /**
   * This function is called every second. It creates a countdown
   * timer until the minute is up, displaying the next candle.
   * It also fetches the chart data when a minute passes.
   */
  secondTracker():void {
    this.time = new Date().getSeconds();
    this.seconds = 60 - this.time; // Countdown timer
    // Every 59 seconds, set gotData to false
    if(this.time % 59 == 0) {
      this.gotData = false;
    }
    // Every 60 seconds, when gotData is false. Fetch chart data.
    if(this.time % 60 == 0 && this.gotData == false) {
      this.getData();
      this.gotData = true;
    }
  }

  /**
   * getData calls the btc service which returns the current chart
   * data. If this is the first time getData is called, we will fetch 
   * all the candles except the current one. If it is not the first time
   * being called. We fetch all the candles including the current one.
   */
  getData():void {
    this.service.GetBtcData().subscribe(
      (data) => {
        this.btcData = data;
        if(this.count == 0) { // First time
          this.updateSeries(1);
          this.count++;
        }
        else { // n time
          this.updateSeries(0); 
        }
      }); 
  }

  /**
   * This function updates the chart depending on the mode passed
   * as a parameter. Only 11 candles are displayed to the user at 
   * a time.
   * 
   * @param mode - Can either be 0 or 1
   */
  public updateSeries(mode: number):void {
    let count:number = 0;
    let series:any = [
      { data: [] },
    ];
    // Iterate through the btcData and create an array
    for(let i = this.numCandles; i >= 0; i--) {
      if(mode == 0) {
        this.newData = this.btcData[i];
      }
      else {
        this.newData = this.btcData[i + 1];
      }
      
      series[0].data[count] = {
        x: new Date(this.newData[0]),
        y: [this.newData[1], this.newData[2], this.newData[3], this.newData[4]]
      }
      count++;
    }
    // Update chart by updating the series
    this.chartOptions.series = series;
    // If the user has made a bet, check it
    if(this.choice != null) {
      this.checkBet();
    } 
    console.log(this.chartOptions.series);
  }

  /**
   * This function was given to me by the ng-apexcharts module.
   * It updates the series and returns it once called.
   * 
   * @param baseval 
   * @param count 
   * @param yrange 
   */
  public generateDayWiseTimeSeries(baseval, count, yrange):any {
    var i:number = 0;
    var series:any = [];
    while (i < count) {
      var y:number =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([baseval, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  /**
   * Called once user clicks either of the two buttons.
   * We reduce the users balance by the bet amount and
   * multiply the bet amount by 2 to create the return
   * amount if won.
   * 
   * @param choice - Green(0) or Red(1)
   */
  bet(choice:number):void {
    this.vibration.vibrate(1000);
    this.choice = choice;
    this.balance -= this.amount;
    this.currentBet = this.amount * 2;
    document.getElementById("bet").style.opacity = "1";
    this.disableBet = true;
  }

  /**
   * If the user has made a bet and the countdown is over,
   * this function checks their bet.If they were correct
   * their balance is updated and if they lose, they lose the
   * bet amount.
   */
  checkBet():void {
    //this.vibration.vibrate([2000, 1000, 2000]);
    if(this.newData[1] < this.newData[4]) { // Green Candle
      if(this.choice == 0) { // Winner
        this.amount *= 2;
        this.balance += this.amount;
      } else { // Loser
        console.log("You lost");
      }
    }
    else { // Red Candle
      if(this.choice == 1) { // Winner
        this.amount *= 2;
        this.balance += this.amount;
      } else { // Loser
        console.log("You lost");
      }
    }
    this.choice = null;
    document.getElementById("bet").style.opacity = "0";
    this.user.dollar = this.balance;
    this.storage.set("loggedIn", this.user)
      .then()
      .catch();
    this.disableBet = false;
  }

  /**
   * Once user clicks sign out in the side menu. The current user
   * in local storage is updated once the account number has
   * been found. "loggedIn" in local storage is set to null, as no
   * users are logged in now and we navigate back to the home page.
   */
  signOut():void {
        this.storage.get("user")
        .then((data) => {
          let users: any = data;
          for(let i = 0; i < users.length; i++) {
            if(users[i].accountNum == this.accountNum) {
              users[i] = this.user;
              this.storage.set("user", users)
              .then(() => {
                this.storage.set("loggedIn", null)
                .then()
                .catch();
              })
              .catch();
            }
          }
        })
      .catch();
      this.navCtrl.navigateBack('/home');
  }
}
