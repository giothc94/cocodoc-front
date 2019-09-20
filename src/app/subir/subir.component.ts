import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PrettySizeService } from 'angular-pretty-size';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { FilesService } from '../_services/files/files.service';
import { DirectoryService } from '../_services/directories/directory.service';
import { TreeNode } from 'primeng/api';
import { HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-subir',
  templateUrl: './subir.component.html',
  styleUrls: ['./subir.component.css'],
  providers: [MessageService]
})
export class SubirComponent implements OnInit {
  @ViewChild('filesClaer', { static: false }) filesClaer: ElementRef;
  uploadedFiles: Array<any>;
  pdfCreate: FormGroup;
  files: Array<File>;
  selectedNode: string;
  nodoSelect: TreeNode
  BreadcrumFiles
  formData = new FormData()
  private progress;

  constructor(private ds: DirectoryService, private messageService: MessageService, private fb: FormBuilder, private PDF: FilesService, private prettySize: PrettySizeService) {

  }

  ngOnInit() {

    this.pdfCreate = new FormGroup({
      'title': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      'subject': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      'comment': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]+$')]),
      'broadcastDate': new FormControl(null, [Validators.required]),
      'receptionDate': new FormControl(null, [Validators.required]),
      'keywords': new FormControl(null, [Validators.required]),
      'idFolder': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]+$')]),
      'segment': new FormControl(null, [Validators.required, Validators.pattern('^[0-9-]+$')]),
      'issuingEntity': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      'receivingEntity': new FormControl(null, [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
      'numberOfSheetsOriginalDocument': new FormControl(null, [Validators.required, Validators.pattern('^[0-9]+$')]),
      'responsibleObservation': new FormControl(null, [])
    });
    this.loadDirectory()
  }

  generateDir(dir) {
    var files = []
    var p: TreeNode = {
      label: dir.path.split('/').pop(),
      data: dir.code,
    }
    if (dir.type === "directory") {
      if (dir.children) {
        var childs = []
        dir.children.forEach(element => {
          let c = this.generateDir(element)[0]
          if (c) {
            childs.push(c)
          }
        });
      }
      p.key = dir.path,
        p.expandedIcon = "fa fa-folder-open"
      p.collapsedIcon = "fa fa-folder"
      p.children = childs
      files.push(p)
    }
    return files
  }

  loadDirectory() {
    this.ds.getDirectory()
      .subscribe(resp => {
        if (resp.ok) {
          const { objectDir } = resp.data;
          this.files = this.generateDir(objectDir)
        }
      });
  }

  nodoSelectF(event) {
    if (event.node) {
      this.nodoSelect = event.node;
      this.BreadcrumFiles = this.nodoSelect.key;
      this.pdfCreate.controls['idFolder'].setValue(this.nodoSelect.data)
      this.files.forEach((node) => {
        this.expandRecursive(node, false)
      })
    }
  }

  selecteds(event) {
    this.uploadedFiles = []
    let { files } = event.target
    if (files) {
      for (const element of files) {
        this.formData.append('images', element, element.name)
        this.uploadedFiles.push({ name: element.name, size: this.prettySize.pretty(element.size), mimetype: element.type })
      }
    }
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }
  guardarPDF() {
    if (this.pdfCreate.valid && this.formData.get('images')) {
      let keys = Object.keys(this.pdfCreate.value)
      for (const key of keys) {
        if (key === 'keywords') {
          for (const keyword of this.pdfCreate.controls['keywords'].value) {
            this.formData.append(key, keyword)
          }
        } else {
          this.formData.set(key, this.pdfCreate.get(key).value)
        }
      }
      this.formData.forEach((data, key) => console.log(key + ":" + data))
      this.PDF.generatePdf(this.formData)
        .subscribe(event => {
          this.progress = event.loaded ? Math.floor(event.loaded * 100 / event.total) : 100;
          if (event.type === HttpEventType.Response) {
            this.showSuccessCreateDocument()
            this.formData = new FormData()
            this.pdfCreate.reset()
            this.progress = null;
          }
        }, error => {
          this.uploadedFiles = null;
          this.filesClaer.nativeElement.value = '';
          this.showError('Documento existente', error.error.error.message)
        })
    }
  }
  clearImgs() {
    this.files = []
  }
  cancelarPDF() {
    this.pdfCreate.reset();
    this.BreadcrumFiles = '';
    this.uploadedFiles = null;
    this.filesClaer.nativeElement.value = '';
    this.formData = new FormData();
    this.progress = null;
  }

  showError(summary, detail) {
    this.messageService.add({ key: 'errorCreatePdf', severity: 'error', summary: summary, detail: detail });
  }
  showSuccessCreateDocument() {
    this.messageService.add({ key: 'createSuccess', severity: 'success', summary: 'Documento creado', detail: 'Has creado un documento en el sistema' });
  }

}