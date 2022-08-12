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
  alertMsg = 'Validando información de usuario.'
  alertColor = 'blue'

  constructor(private auth: AngularFireAuth) { }

  ngOnInit(): void {
  }

  async login(){
    this.showAlert = true
    this.alertMsg = 'Validando información de usuario.'
    this.alertColor = 'blue'
    this.inSubmission = true

    try{
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email, this.credentials.password
      )
    }
    catch(e){
      console.log(e)
      this.alertMsg = 'Ha ocurrido un error inesperado, por favor intenta más tarde.'
      this.alertColor = 'red'
      this.inSubmission = false
      return
    }

    this.alertMsg = 'Usuario autenticado correctamente.'
    this.alertColor = 'green'
  }

}
