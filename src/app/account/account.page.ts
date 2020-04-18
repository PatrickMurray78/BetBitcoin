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
  editDisabled: boolean = false;
  saveDisabled: boolean = true;

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
   this.editDisabled = true;
   this.saveDisabled = false;
  }

  saveChanges() {
    this.user.name = this.name;
    this.user.email = this.email;
    this.user.password = this.password;
    this.user.dob = this.dob;
    this.storage.set("loggedIn", this.user)
      .then(() => {
        })
      .catch();
      this.isReadOnly = true;
      this.editDisabled = false;
      this.saveDisabled = true;
  }

}
