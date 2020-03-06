import { Component, OnInit } from "@angular/core";
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  AbstractControl,
  FormBuilder
} from "@angular/forms";
import { TreeNode, MessageService } from "primeng/api";
import { DirectoryService } from "../_services/directories/directory.service";
import { ConfirmationService } from "primeng/api";

interface File {
  label: string;
  data: string;
  expandedIcon: string;
  collapsedIcon: string;
  children?: Array<any>;
  parent: string;
}

@Component({
  selector: "app-archivos",
  templateUrl: "./archivos.component.html",
  styleUrls: ["./archivos.component.css"],
  providers: [ConfirmationService]
})
export class ArchivosComponent implements OnInit {
  files: TreeNode[];
  formFiles: FormGroup;
  nodoSelect: TreeNode;
  BreadcrumFiles: string;
  newFile: string;
  rootFile: File;
  collapse: boolean = false;
  create: boolean = false;
  flagNewFolder: boolean = false;
  operation: string;
  operationMessage: string;

  constructor(
    private ds: DirectoryService,
    private readonly messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  generateDir(dir) {
    var files = [];
    var p: TreeNode = {
      label: dir.name.toUpperCase(),
      data: dir.code,
      parent: dir.path,
      key: dir.path,
      expandedIcon: "fa fa-folder-open",
      collapsedIcon: "fa fa-folder"
    };
    if (dir.type === "directory" && dir.children.length > 0) {
      var childs = [];

      dir.children.forEach(element => {
        let c = this.generateDir(element)[0];
        if (c) {
          childs.push(c);
        }
      });
      p.children = childs.sort((a, b) => {
        var labelOne = a.label;
        var labelTwo = b.label;
        if (labelOne < labelTwo) return -1;
        if (labelOne > labelTwo) return 1;
        return 0;
      });
      files.push(p);
    } else if (dir.type === "directory") {
      files.push(p);
    }
    return files;
  }

  ngOnInit() {
    this.ds.getDirectory().subscribe(resp => {
      if (resp.status === 200) {
        const { dir } = resp.body;
        this.files = this.generateDir(dir);
        console.log("Files:: ", this.files);
        this.files.forEach(node => {
          this.expandRecursive(node, true);
        });
        this.collapse = true;
      }
    });
  }
  nodoSelectF(event) {
    if (event.node) {
      this.nodoSelect = event.node;
      console.log(this.nodoSelect);
      this.BreadcrumFiles =
        this.nodoSelect.key === undefined
          ? `root/${this.nodoSelect.label}/`
          : `${this.nodoSelect.key}/`;
    }
  }

  expandAll() {
    this.files.forEach(node => {
      this.expandRecursive(node, true);
    });
    this.collapse = true;
  }

  collapseAll() {
    this.files.forEach(node => {
      this.expandRecursive(node, false);
    });
    this.collapse = false;
    this.nodoSelect = null;
    this.newFile = null;
    this.flagNewFolder = false;
  }

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach(childNode => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  createFolder() {
    if (this.newFile) {
      this.ds
        .createFolder({
          destinationFolderCode: this.nodoSelect.data,
          nameFolder: this.newFile
        })
        .subscribe(
          resp => {
            this.ngOnInit();
            this.showSuccessCreateFolder();
            this.newFile = "";
          },
          ({ error }) => {
            let { message } = error.error;
            if (message.includes("fails to match"))
              message = "No puede crear la carpeta con ese nombre.";
            this.showError("No se creo la carpeta", message);
          }
        );
    } else {
      this.showError("Sin nombre.", "Ingrese un nombre para la carpeta.");
    }
  }
  renameFolder() {
    if (this.newFile) {
      this.ds
        .renameFolder({
          newNameFolder: this.newFile,
          idFolder: this.nodoSelect.data
        })
        .subscribe(
          resp => {
            this.cancelCreateFolder();
            this.showSuccessRenameFolder();
            this.ngOnInit();
          },
          ({
            error: {
              error: { message }
            }
          }) => {
            if (message.includes("fails to match"))
              message = "No puede crear la carpeta con ese nombre.";
            this.showError("No se modifico la carpeta", message);
          }
        );
    } else {
      this.showError(
        "No se modifico la carpeta",
        "No a ingresado ningun nombre."
      );
    }
  }

  cancelCreateFolder() {
    this.nodoSelect = null;
    this.newFile = null;
    this.flagNewFolder = false;
  }

  activateNewFolder() {
    this.flagNewFolder = true;
    this.operation = "Nombre de la nueva carpeta";
    this.operationMessage = "<strong> Sera creado en: </strong>";
  }
  activateRenameFolder() {
    this.flagNewFolder = true;
    this.operation = "Nuevo nombre de la carpeta";
    this.operationMessage = null;
  }

  showSuccessCreateFolder() {
    this.messageService.add({
      key: "createSeccess",
      severity: "success",
      summary: "Carpeta creada",
      detail: "Has creado una carpeta en el sistema"
    });
  }
  showSuccessRenameFolder() {
    this.messageService.add({
      key: "renameSeccess",
      severity: "success",
      summary: "Carpeta renombrada",
      detail: "Has renombrado una carpeta en el sistema"
    });
  }
  showSuccessDeleteFolder() {
    this.messageService.add({
      key: "deleteSeccess",
      severity: "success",
      summary: "Carpeta borrada",
      detail: "Has eliminado una carpeta del sistema"
    });
  }
  showError(summary, detail) {
    this.messageService.add({
      key: "errorEditUser",
      severity: "error",
      summary: summary,
      detail: detail
    });
  }

  confirm() {
    this.confirmationService.confirm({
      key: "confirmDelete",
      message: `Desea eliminar la carpeta ${this.nodoSelect.label}?`,
      accept: () => {
        this.ds.deleteFolder({ idFolder: this.nodoSelect.data }).subscribe(
          resp => {
            this.ngOnInit();
            this.showSuccessDeleteFolder();
          },
          ({
            error: {
              error: { message }
            }
          }) => {
            this.showError("No se elimino la carpeta", message);
          }
        );
      }
    });
  }
}
