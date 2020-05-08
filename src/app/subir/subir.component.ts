import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { MessageService } from "primeng/api";
import { PrettySizeService } from "angular-pretty-size";
import { SelectItem } from "primeng/api";
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder
} from "@angular/forms";
import { FilesService } from "../_services/files/files.service";
import { DirectoryService } from "../_services/directories/directory.service";
import { TreeNode } from "primeng/api";
import { HttpEventType } from "@angular/common/http";

@Component({
  selector: "app-subir",
  templateUrl: "./subir.component.html",
  styleUrls: ["./subir.component.css"],
  providers: [MessageService]
})
export class SubirComponent implements OnInit {
  @ViewChild("filesClaer", { static: false }) filesClaer: ElementRef;
  title = "Subir documento";
  uploadedFiles: Array<any>;
  pdfCreate: FormGroup;
  files: Array<File>;
  selectedNode: string;
  nodoSelect: TreeNode;
  BreadcrumFiles;
  formData = new FormData();
  progress;
  invalidImages = [];

  constructor(
    private ds: DirectoryService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private PDF: FilesService,
    private prettySize: PrettySizeService
  ) {}

  ngOnInit() {
    this.pdfCreate = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z ]+$")
      ]),
      subject: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z ]+$")
      ]),
      comment: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9 ]+$")
      ]),
      broadcastDate: new FormControl(null, [Validators.required]),
      receptionDate: new FormControl(null, [Validators.required]),
      keywords: new FormControl(null, [Validators.required]),
      idFolder: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[0-9]+$")
      ]),
      segment: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[0-9-]+$")
      ]),
      issuingEntity: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z ]+$")
      ]),
      receivingEntity: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[a-zA-Z ]+$")
      ]),
      numberOfSheetsOriginalDocument: new FormControl(null, [
        Validators.required,
        Validators.pattern("^[0-9]+$")
      ]),
      responsibleObservation: new FormControl(null, [])
    });
    this.loadDirectory();
  }

  generateDir(dir) {
    var files = [];
    var p: TreeNode = {
      label: dir.path.split("/").pop(),
      data: dir.code
    };
    if (dir.type === "directory") {
      if (dir.children) {
        var childs = [];
        dir.children.forEach(element => {
          let c = this.generateDir(element)[0];
          if (c) {
            childs.push(c);
          }
        });
      }
      (p.key = dir.path), (p.expandedIcon = "fa fa-folder-open");
      p.collapsedIcon = "fa fa-folder";
      p.children = childs.sort((a, b) => {
        var labelOne = a.label;
        var labelTwo = b.label;
        if (labelOne < labelTwo) return -1;
        if (labelOne > labelTwo) return 1;
        return 0;
      });
      files.push(p);
    }
    return files;
  }

  loadDirectory() {
    this.ds.getDirectory().subscribe(resp => {
      if (resp.status === 200) {
        const { dir } = resp.body;
        this.files = this.generateDir(dir);
      }
    });
  }

  nodoSelectF(event) {
    if (event.node) {
      this.nodoSelect = event.node;
      this.BreadcrumFiles = this.nodoSelect.key;
      this.pdfCreate.controls["idFolder"].setValue(this.nodoSelect.data);
      this.files.forEach(node => {
        this.expandRecursive(node, false);
      });
    }
  }

  selecteds(event) {
    this.invalidImages = [];
    this.uploadedFiles = [];
    this.formData = new FormData();
    let { files } = event.target;
    if (files) {
      for (const element of files) {
        if (element.type === "application/pdf") {
          this.formData.append("pdf", element, element.name);
          this.uploadedFiles.push({
            name: element.name,
            size: this.prettySize.pretty(element.size),
            mimetype: element.type
          });
        } else {
          this.invalidImages.push(element.name);
        }
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
    if (this.pdfCreate.valid && this.formData.get("pdf")) {
      let keys = Object.keys(this.pdfCreate.value);
      for (const key of keys) {
        if (key === "keywords") {
          for (const keyword of this.pdfCreate.controls["keywords"].value) {
            this.formData.append(key, keyword);
          }
        } else {
          this.formData.set(key, this.pdfCreate.get(key).value);
        }
      }
      this.PDF.uploadPdf(this.formData).subscribe(
        event => {
          if (event.type === 1 && event.loaded) {
            this.progress = Math.floor((event.loaded * 100) / event.total);
          }
          if (event.type === HttpEventType.Response) {
            this.showSuccessCreateDocument();
            this.cancelarPDF();
          }
        },
        error => {
          this.showError(
            "Problema con el documento",
            error.error.error.message
          );
        }
      );
    }
  }
  clearImgs() {
    this.files = [];
  }
  cancelarPDF() {
    this.pdfCreate.reset();
    this.BreadcrumFiles = "";
    this.uploadedFiles = null;
    this.filesClaer.nativeElement.value = "";
    this.formData = new FormData();
    this.progress = null;
  }

  showError(summary, detail) {
    this.messageService.add({
      key: "errorCreatePdf",
      severity: "error",
      summary: summary,
      detail: detail
    });
  }
  showSuccessCreateDocument() {
    this.messageService.add({
      key: "createSuccess",
      severity: "success",
      summary: "Documento creado",
      detail: "Has creado un documento en el sistema"
    });
  }
}
