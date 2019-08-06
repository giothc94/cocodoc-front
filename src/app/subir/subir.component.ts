import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-subir',
  templateUrl: './subir.component.html',
  styleUrls: ['./subir.component.css']
})
export class SubirComponent implements OnInit {
  uploadedFiles: any[] = [];
  pdfCreate: FormGroup;
  files: Array<File>;
  URLs = [];
  constructor(private fb: FormBuilder) {
    this.pdfCreate = new FormGroup({
      'titulo': new FormControl(null, Validators.required),
      'autor': new FormControl(null, Validators.required),
      'asunto': new FormControl(null, Validators.required),
      'comentario': new FormControl(null, Validators.required),
      'keywords': new FormControl(null, Validators.required),
      'myfile': new FormControl(null, [Validators.required])
    });
  }


  ngOnInit() {
  }
  guardarPDF() {
    // envio api en node js por post
    console.log(this.pdfCreate)
    // this.selectImg()
  }
  selectImg(event) {
    // console.log(event)
    for (const file of event.files) {
      this.URLs.push(file.objectURL)
    }
    if (this.URLs) {
      console.log(this.URLs)
    }
  }
  clearImgs() {
    this.files = []
  }
  cancelarPDF() {

  }

}
