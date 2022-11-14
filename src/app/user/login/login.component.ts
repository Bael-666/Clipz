import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';

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

  inSubmission = false;
  showAlert = false
  alertMsg = 'Validating user info.'
  alertColor = 'blue'

  constructor(private auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  async login(){
    this.showAlert = true
    this.alertMsg = 'Validating user info.'
    this.alertColor = 'blue'
    this.inSubmission = true

    try{
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email, this.credentials.password
      )
    }
    catch(e){
      console.log(e)
      this.alertMsg = 'An error has ocurred, please try again later.'
      this.alertColor = 'red'
      this.inSubmission = false
      return
    }

    this.alertMsg = 'User authenticated successfully.'
    this.alertColor = 'green'
  }

}
