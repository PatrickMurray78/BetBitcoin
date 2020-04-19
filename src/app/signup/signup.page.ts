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
  ionicForm: FormGroup;
  defaultDate = "1987-06-30";
  isSubmitted = false;
  users = [];
  accountNum: any;

  constructor(public formBuilder: FormBuilder, private storage: Storage, private navCtrl: NavController) { }

  ngOnInit() {
    this.printDatabase();
    this.ionicForm = this.formBuilder.group({
      accountNum: [''],
      dollar: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      dob: [this.defaultDate],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
    this.getAccountNum();
  }

  getDate(e) {
    let date = new Date(e.target.value).toISOString().substring(0, 10);
    this.ionicForm.get('dob').setValue(date, {
       onlyself: true
    })
  }

  get errorControl() {
  return this.ionicForm.controls;
  }

submitForm(value: any) {
  this.isSubmitted = true;
  if (!this.ionicForm.valid) {
    console.log('Please provide all the required values!')
    return false;
  } else {
    value.dollar = 50000;
    value.accountNum = this.accountNum;
    this.saveForm();
  }
 }

 saveForm() {
  this.storage.get("user")
      .then((data) => {
        if(data != null) {
          this.users = data;
          this.users.push(this.ionicForm.value);
        }
        else {
          this.users[0] = this.ionicForm.value;
        }
          this.storage.set("user", this.users)
            .then(
              ()=> {
                this.printDatabase();
              })
              .catch();
        })
      .catch();
 }

  printDatabase()
  {
    this.storage.get("user")
      .then((data) => {
          if(data == null)
          {
            console.log("Database Empty!")
          }
          else {
            console.log(data);
          }
        })
      .catch();
  }

  getAccountNum() {
    this.storage.get("accountNum")
    .then((data) => {
      if(data == null)
      {
        this.storage.set("accountNum", 1)
        .then(() => {
          console.log("No numbers yet");
          this.accountNum = 1;
        })
        .catch();
      }
      else {
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
