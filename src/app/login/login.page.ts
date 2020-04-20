import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // Declare variables
  loginForm: FormGroup;
  isSubmitted:boolean = false;
  passwordIncorrect:boolean = false;
  emailIncorrect:boolean = false;
  users:any = [];

  constructor(public formBuilder: FormBuilder, public storage: Storage, private navCtrl: NavController) { }

  /*
    When the login page is loaded, the loginForm is initialised
    using validators for both email and password
  */
  ngOnInit():void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  /*
    Returns loginForm control errors
  */
  get errorControl():any {
    return this.loginForm.controls;
  }

  /*
    Called once Sign In button is clicked, if the form is
    invalid a message will be displayed. If the form is valid
    the login() function is called
  */
  submitForm(value: any):boolean {
    this.isSubmitted = true;
    if (!this.loginForm.valid) { // Invalid Form
      console.log('Please provide all the required values!')
      return false;
    } else { // Valid Form
      this.login();
    }
  }

  /*
    The login() function finds a user in the database with a
    matching email, once found the password is then validated.
    If password is valid, log in user and navigate to the betbitcoin page.
  */
  login():void {
    let loginDetails = this.loginForm.value;
    this.storage.get("user")
      .then((data) => {
          this.users = data;
          for(let i = 0; i < this.users.length; i++) {
            if(this.users[i].email == loginDetails.email) { // Email found
              if(this.users[i].password == loginDetails.password) { // Password Valid
                this.users[i].loggedIn = 1;
                this.storage.set("loggedIn", this.users[i]) // Log in user
                 .then()
                 .catch();
                  this.navCtrl.navigateForward('/betbitcoin');
              } else { // Incorrect Password
                this.passwordIncorrect = true;
              }
            } else { // Incorrect email
              this.emailIncorrect = true;
            }
          }
        })
      .catch();
      
  }
}
