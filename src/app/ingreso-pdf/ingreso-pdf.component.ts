import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-ingreso-pdf',
  templateUrl: './ingreso-pdf.component.html',
  styleUrls: ['./ingreso-pdf.component.css'],
  providers: [MessageService]
})
export class IngresoPDFComponent implements OnInit {
  uploadedFiles: any[] = [];
  pdfCreate: FormGroup;
  files: Array<File>;
  URLs = [];
  cars: SelectItem[];
  selectedNode: string;
  constructor(private messageService: MessageService, private fb: FormBuilder) {
    this.pdfCreate = new FormGroup({
      'titulo': new FormControl(null, Validators.required),
      'autor': new FormControl(null, Validators.required),
      'asunto': new FormControl(null, Validators.required),
      'comentario': new FormControl(null, Validators.required),
      'keywords': new FormControl(null, Validators.required),
      'node': new FormControl(null, Validators.required)
    });
  }


  ngOnInit() {
    this.cars = [
      { label: 'Audi', value: 'Audi' },
      { label: 'BMW', value: 'BMW' },
      { label: 'Fiat', value: 'Fiat' },
      { label: 'Ford', value: 'Ford' },
      { label: 'Honda', value: 'Honda' },
      { label: 'Jaguar', value: 'Jaguar' },
      { label: 'Mercedes', value: 'Mercedes' },
      { label: 'Renault', value: 'Renault' },
      { label: 'VW', value: 'VW' },
      { label: 'Volvo', value: 'Volvo' },
    ];
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
