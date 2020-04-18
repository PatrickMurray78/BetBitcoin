import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  user: any;
  name: string;
  email: any;
  password: any;
  dob: any;
  balance: number;
  isReadOnly: boolean = true;


  constructor(public storage: Storage) { }

  ngOnInit() {
   this.storage.get("loggedIn")
      .then((data) => {
          this.user = data;
          this.name = data.name;
          this.email = data.email;
          this.password = data.password;
          this.dob = data.dob;
          this.balance = data.dollar;
        })
      .catch();
  }

  edit() {
   this.isReadOnly = false;
  }

}
