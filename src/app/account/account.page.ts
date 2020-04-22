import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {

  accountNum: number;
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

  /**
   * When account page is called, we get the current logged
   * in user and populate our variables to display the current
   * account information to the user.
   */
  ngOnInit() {
   this.storage.get("loggedIn")
      .then((data) => {
        console.log(data);
          this.user = data;
          this.accountNum = data.accountNum;
          this.name = data.name;
          this.email = data.email;
          this.password = data.password;
          this.dob = data.dob;
          this.balance = data.dollar;
        })
      .catch();
  }

  /**
   * This function is called once the date of birth has been changed.
   * It creates the date that was chosen and sets the value of the dob
   * variable
   * 
   * @param e 
   */
  getDate(e) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    this.dob = date;
    console.log(this.dob);
  }

  /**
   * When user clickes the edit button, this function is called.
   * When called, it allows the user to edit the account details, while
   * disabling the edit button and enabling the save changes button.
   */
  edit() {
    this.isReadOnly = false;
    this.editDisabled = true;
    this.saveDisabled = false;
  }

  /**
   * Called when user clicks the save changes button.
   * This function the user variables are set and the details
   * of the current logged in user in local storage is updated.
   * The account number of this user is then searched in local 
   * storage and once found, their details are also changed to 
   * that of the current logged in user.
   */
  saveChanges() {
    this.user.name = this.name;
    this.user.email = this.email;
    this.user.password = this.password;
    this.user.dob = this.dob;
    this.user.dollar = this.balance;
    this.storage.set("loggedIn", this.user)
      .then(() => {
        this.storage.get("user")
        .then((data) => {
          let users: any = data;
          for(let i = 0; i < users.length; i++) {
            if(users[i].accountNum == this.accountNum) {
              users[i] = this.user;
              this.storage.set("user", users)
              .then()
              .catch();
            }
          }
        })
        .catch();
        })
      .catch();
      // Make details read only, enable edit button and disable
      // save changes button.
      this.isReadOnly = true;
      this.editDisabled = false;
      this.saveDisabled = true;
  }

  /**
   * This function is called when the reset account button is clicked.
   * It sets the balance of the user to 50000, the default balance and calls
   * the saveChanges() function.
   */
  resetAccount() {
    this.balance = 50000;
    this.saveChanges();
  }

}
