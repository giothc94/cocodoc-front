import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PrettySizeService } from 'angular-pretty-size';
import { SelectItem } from 'primeng/api';
import { FormGroup, FormControl, Validators, FormArray, FormBuilder } from '@angular/forms';
import { FilesService } from '../_services/files/files.service';
import { DirectoryService } from '../_services/directories/directory.service';
import { TreeNode } from 'primeng/api';

@Component({
  selector: 'app-ingreso-pdf',
  templateUrl: './ingreso-pdf.component.html',
  styleUrls: ['./ingreso-pdf.component.css'],
  providers: [MessageService]
})
export class IngresoPDFComponent implements OnInit {
  uploadedFiles: Array<any>;
  pdfCreate: FormGroup;
  files: Array<File>;
  selectedNode: string;
  nodoSelect: TreeNode
  BreadcrumFiles
  formData = new FormData()
  @ViewChild('filesClaer', { static: false }) filesClaer: ElementRef;

  constructor(private ds: DirectoryService, private messageService: MessageService, private fb: FormBuilder, private PDF: FilesService, private prettySize: PrettySizeService) {

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

  ngOnInit() {

    this.pdfCreate = new FormGroup({
      'title': new FormControl(null, Validators.required),
      'subject': new FormControl(null, Validators.required),
      'coment': new FormControl(null, Validators.required),
      'brodcastDate': new FormControl(null, Validators.required),
      'receptionDate': new FormControl(null, Validators.required),
      'keywords': new FormControl(null, Validators.required),
      'idFolder': new FormControl(null, Validators.required),
      'segment': new FormControl(null, Validators.required),
      'issuingEntity': new FormControl(null, Validators.required),
      'receivingEntity': new FormControl(null, Validators.required),
      'numberOfSheets': new FormControl(null, Validators.required),
      'responsibleObservation': new FormControl('Ninguna', []),
      'documentsFiles': new FormControl(null, Validators.required)
    });
    this.loadDirectory()
  }

  loadDirectory(){
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
    this.formData.delete('images')
    this.formData.delete('documentsFiles')
    this.uploadedFiles = []
    let { files } = event.target
    let names: Array<any> = []
    if (files) {
      for (let i = 0; i < files.length; i++) {
        // let reader = new FileReader()
        const element = files[i];
        this.formData.append('images', element, element.name)
        names.push(element.name)
        // this.filesOrder.push(element.name)
        // reader.readAsDataURL(element)
        // reader.onload = async () => {
        // let src = reader.result
        // }
        this.uploadedFiles.push({ name: element.name, size: this.prettySize.pretty(element.size), mimetype: element.type })
      }
      this.pdfCreate.controls['documentsFiles'].setValue(names)
      names = []
      this.pdfCreate.controls['documentsFiles'].value.forEach(element => {
        this.formData.append('documentsFiles',element)
      });
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
    // envio api en node js por post
    this.formData.set('title', this.pdfCreate.get('title').value)
    this.formData.set('subject', this.pdfCreate.get('subject').value)
    this.formData.set('coment', this.pdfCreate.get('coment').value)
    this.formData.set('brodcastDate', this.pdfCreate.get('brodcastDate').value)
    this.formData.set('receptionDate', this.pdfCreate.get('receptionDate').value)
    for (const key of this.pdfCreate.controls['keywords'].value) {
      this.formData.append('keywords',key)
    }
    this.formData.set('idFolder', this.pdfCreate.get('idFolder').value)
    this.formData.set('segment', this.pdfCreate.get('segment').value)
    this.formData.set('issuingEntity', this.pdfCreate.get('issuingEntity').value)
    this.formData.set('receivingEntity', this.pdfCreate.get('receivingEntity').value)
    this.formData.set('numberOfSheets', this.pdfCreate.get('numberOfSheets').value)
    this.formData.set('responsibleObservation', this.pdfCreate.get('responsibleObservation').value)
    this.PDF.generatePdf(this.formData)
      .subscribe(resp => {
        console.log('resp', resp)
        this.formData = new FormData()
      }, error => {
        console.log('error', error)
      })
    // this.pdfCreate.reset()
  }
  clearImgs() {
    this.files = []
  }
  cancelarPDF() {
    this.pdfCreate.reset()
    this.uploadedFiles = null
    this.filesClaer.nativeElement.value = ''
    this.formData = new FormData()
  }

}
