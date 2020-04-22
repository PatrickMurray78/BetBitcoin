import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ɵNgNoValidate } from "@angular/forms";
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  // Declare variables
  signupForm:FormGroup;
  defaultDate:string = "1987-06-30";
  isSubmitted:boolean = false;
  users:any = [];
  accountNum: number;

  constructor(public formBuilder: FormBuilder, private storage: Storage, private navCtrl: NavController) { }

  /*
    When the signup page loads, the signupForm is initialised with validators.
    The next account number is also generated.
  */
  ngOnInit():void {
    this.signupForm = this.formBuilder.group({
      accountNum: [''],
      dollar: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      dob: [this.defaultDate],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
    this.getAccountNum();
  }

  /* 
    This function is called once the date of birth has been changed.
    It creates the date that was chosen and sets the corresponding dob value
    in the signup form.
  */
  getDate(e):void {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    this.signupForm.get('dob').setValue(date, {
       onlyself: true
    })
  }

  /*
    Returns signupForm control errors.
  */
  get errorControl():any {
    return this.signupForm.controls;
  }

/*
    Called once Sign Up button is clicked, if the form is
    invalid a message will be displayed. If the form is valid
    we give the user 50000 dollars and assign an accountNum
    to the user. The saveForm() function is then called.
  */
  submitForm(value: any):boolean {
    this.isSubmitted = true;
    if (!this.signupForm.valid) {
      console.log('Please provide all the required values!')
      return false;
    } else {
      value.dollar = 50000;
      value.accountNum = this.accountNum;
      this.saveForm();
    }
  }

 /*
  This function saves the validated form to localStorage,
  creating a new user.
 */
 saveForm():void {
  this.storage.get("user") 
      .then((data) => {
        if(data != null) { // Add to end of users
          this.users = data;
          this.users.push(this.signupForm.value);
        } else { // First user
          this.users[0] = this.signupForm.value;
        }
          this.storage.set("user", this.users)
           .then()
           .catch();
        })
      .catch();
  }

  /*
    This function generates a new unique account number.
    It does so by getting accountNum in storage, if it doesnt
    exist then it creates the current accountNum as 1. If an
    accountNum exists, the function increments it and saves it in
    storage.
  */
  getAccountNum():void {
    this.storage.get("accountNum")
    .then((data) => {
      if(data == null) { // AccountNum doesnt exist
        this.storage.set("accountNum", 1)
        .then(() => {
          console.log("No numbers yet");
          this.accountNum = 1;
        })
        .catch();
      } else { // Increment accountNum and save it
        this.accountNum = data + 1;
        this.storage.set("accountNum", this.accountNum)
        .then(() => {
        })
        .catch();
      }
    })
    .catch();
  }
}
