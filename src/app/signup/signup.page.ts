import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
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

  constructor(public formBuilder: FormBuilder, private storage: Storage, private navCtrl: NavController) { }

  ngOnInit() {
    this.printDatabase();
    this.ionicForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
      dob: [this.defaultDate],
      password: ['', [Validators.required, Validators.minLength(8)]]
    })
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

submitForm() {
  this.isSubmitted = true;
  if (!this.ionicForm.valid) {
    console.log('Please provide all the required values!')
    return false;
  } else {
    this.saveForm();
  }
 }

 saveForm() {
  this.storage.get("user")
      .then((data) => {
        console.log(data);
          this.users = data;
          console.log(this.users);
          console.log(this.ionicForm.value);
          this.users.push(this.ionicForm.value);
          console.log(this.users);
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
          console.log(data);
        })
      .catch();
  }
}
