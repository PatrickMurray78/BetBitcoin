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
  loginForm: FormGroup;
  isSubmitted = false;
  passwordIncorrect = false;
  emailIncorrect = false;
  users = [];

  constructor(public formBuilder: FormBuilder, public storage: Storage, private navCtrl: NavController) { }

  ngOnInit() {
    this.printDatabase();
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  get errorControl() {
    return this.loginForm.controls;
    }

  submitForm(value: any) {
    this.isSubmitted = true;
    if (!this.loginForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      this.login();
    }
   }

   printDatabase() {
    this.storage.get("user")
      .then((data) => {
          console.log(data);
        })
      .catch();
   }

   login() {
    let loginDetails = this.loginForm.value;
    this.storage.get("user")
      .then((data) => {
          this.users = data;
          for(let i = 0; i < this.users.length; i++)
          {
            if(this.users[i].email == loginDetails.email)
            {
              console.log("Email Found");
              if(this.users[i].password == loginDetails.password)
              {
                console.log("Logging in user");
                this.users[i].loggedIn = 1;
                this.storage.set("loggedIn", this.users[i])
                 .then(
                    ()=> {
                      this.printDatabase();
                    })
                  .catch();
                  this.navCtrl.navigateForward('/betbitcoin');
              
              }
              else {
                this.passwordIncorrect = true;
                console.log("Invalid Password");
              }
            }
            else {
              this.emailIncorrect = true;
            }
          }
        })
      .catch();
      
   }
}
