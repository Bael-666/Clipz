import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials = {
    email: '',
    password: ''
  }

  constructor() { }

  ngOnInit(): void {
  }

  showAlert = false
  alertMsg = 'Login correct!!'
  alertColor = 'blue'


  login(){
    this.showAlert = true
    this.alertMsg = 'Login correct!!'
    this.alertColor = 'blue'
  }

}
