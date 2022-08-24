import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs/operators'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
  isDragOver = false
  file: File | null = null
  nextStep = false
  inSubmission = false
  percentage = 0
  showPercentage = false
  user: firebase.User | null = null
  
  title = new FormControl('', {
    validators: [
      Validators.required,
      Validators.minLength(3)
    ],
    nonNullable: true
  })

  uploadForm = new FormGroup({
    title: this.title
  })

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService
    ) 
    {
      auth.user.subscribe(user => this.user = user)
    }

  ngOnInit(): void {
  }

  showAlert = false
  alertMsg = 'Espera un momento, tu video se está cargando.'
  alertColor = 'blue'
  
  storeFile($event: Event){
    this.isDragOver = false
    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null

    if(!this.file || this.file.type !== 'video/mp4')
    {
      return
    }
    
    this.title.setValue(
      this.file.name.replace(/\.[^/.]+$/, '')
    )

    this.nextStep = true
  }

    uploadFile(){
    this.showAlert = true
    this.alertMsg = 'Espera un momento, tu video se está cargando.'
    this.alertColor = 'blue'
    this.inSubmission = true
    this.showPercentage = true

    const clipFileName = uuid()
    const clipPath = `clips/${clipFileName}.mp4`

    const task =  this.storage.upload(clipPath, this.file)
    const clipReference = this.storage.ref(clipPath)
    task.percentageChanges().subscribe(progress => {
      this.percentage = progress as number / 100
    })

    task.snapshotChanges().pipe(
      last(),
      switchMap(() => clipReference.getDownloadURL())
    ).subscribe({
      next: (url) => {
        const clip = { 
          uid: this.user?.uid as string,
          displayName: this.user?.displayName as string,
          title: this.title.value,
          fileName: `${clipFileName}.mp4`,
          url
        }

        this.clipService.createClip(clip)

        console.log(clip)
        this.alertMsg = 'El video se ha cargado exitosamente.'
        this.alertColor = 'green'
        this.showPercentage = false
      },
      error: (error) => {
        console.error(error)
        this.alertMsg = 'Ha ocurrido un error inesperado, por favor intenta más tarde.'
        this.alertColor = 'red'
        this.inSubmission = true
        this.showPercentage = false
      }
    })
  }

}
