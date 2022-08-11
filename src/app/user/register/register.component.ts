import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  constructor(
    private auth: AuthService
    ){}

  inSubmission = false;

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3)
  ])
  email = new FormControl('', [
    Validators.required,
    Validators.email
  ])
  age = new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(18),
    Validators.max(120)
  ])
  password = new FormControl('', [
    Validators.required,
    Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm)
  ])
  confirmPassword = new FormControl('', [
    Validators.required
  ])
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.minLength(13),
    Validators.maxLength(13)
  ])

  registerForm = new FormGroup({
    name : this.name,
    email : this.email,
    age : this.age,
    password : this.password,
    confirmPassword : this.confirmPassword,
    phoneNumber : this.phoneNumber
  })

  showAlert = false
  alertMsg = 'Espera un momento, tu cuenta está siendo creada.'
  alertColor = 'blue'

  async register(){
    this.showAlert = true
    this.alertMsg = 'Espera un momento, tu cuenta está siendo creada.'
    this.alertColor = 'blue'
    this.inSubmission = true

    try {
      await this.auth.createUser(this.registerForm.value as IUser)
    }
    catch(e){
      console.log(e)
      this.alertMsg = 'Ha ocurrido un error inesperado, por favor intenta más tarde.'
      this.alertColor = 'red'
      this.inSubmission = false
      return
    }
    
    this.alertMsg = 'Tu cuenta ha sido creada correctamente.'
    this.alertColor = 'green'
  }
}
