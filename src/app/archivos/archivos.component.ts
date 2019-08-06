import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, FormBuilder } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { GetService } from '../_services/directories/get.service';

interface File {
  "label": string,
  "data": string,
  "expandedIcon": string,
  "collapsedIcon": string,
  "children"?: Array<any>
}
interface FileChild {
  "label": string,
  "data": string,
  "expandedIcon": string,
  "collapsedIcon": string,
  "children": Array<any>
}

@Component({
  selector: 'app-archivos',
  templateUrl: './archivos.component.html',
  styleUrls: ['./archivos.component.css']
})


export class ArchivosComponent implements OnInit {

  files: TreeNode[];
  formFiles: FormGroup;
  nodoSelect: TreeNode;
  BreadcrumFiles: string;
  newFile: string;

  root: File = {
    "label": "Cocodoc",
    "data": "Documents Folder",
    "expandedIcon": "fa fa-folder-open",
    "collapsedIcon": "fa fa-folder",
    "children": [],
  }

  rootFile: File

  child: FileChild

  constructor(private sd: GetService) {
    // this.formFiles = new FormGroup({
    //   'nodo': new FormControl(null,Validators.required),
    // });
  }

  ngOnInit() {
    this.sd.getDirectories().subscribe(resp => {
      if (resp.code === 200) {
        this.files = []
        let { data } = resp
        
        let root = data[0]
        this.root.label = root.nombreCarpeta
        this.root.data = root.nombreCarpeta + 'folder'
        
        console.log(root.hijos)
        root.hijos.forEach(element => {
          console.log(element)
          this.rootFile = {
            "label": element.nombreCarpeta,
            "data": `${element.nombreCarpeta} Folder`,
            "expandedIcon": "fa fa-folder-open",
            "collapsedIcon": "fa fa-folder",
            "children": [],
          }
          this.root.children.push(this.rootFile)
        });
        this.files.push(this.root)
      }
    })
  }

  crearNodos() {
    console.log(this.formFiles);
  }

  nodoSelectF(event) {
    if (event.node) {
      this.nodoSelect = event.node;
      this.BreadcrumFiles = this.nodoSelect.label == 'Cocodoc' ? `${this.nodoSelect.label}/` : `Cocodoc/${this.nodoSelect.label}/`;
      console.log(this.nodoSelect)
    }
  }

  cancelCreateFolder() {
    this.nodoSelect = null;
    this.newFile = null;
  }
}
