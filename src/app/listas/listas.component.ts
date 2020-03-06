import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { TreeNode, MessageService, ConfirmationService } from "primeng/api";
import { DirectoryService } from "../_services/directories/directory.service";
import { LoginService } from "../_services/login.service";
import { FilesService } from "../_services/files/files.service";
import { PrettySizeService } from "angular-pretty-size";

@Component({
  selector: "app-listas",
  templateUrl: "./listas.component.html",
  styleUrls: ["./listas.component.css"],
  providers: [ConfirmationService]
})
export class ListasComponent implements OnInit {
  files: TreeNode[];
  nodoSelect: TreeNode;
  cardContentPdf = [
    "broadcastDate",
    "comment",
    "createdBy",
    "idDoc",
    "issuingEntity",
    "location",
    "nameDocument",
    "numberOfSheetsOriginalDocument",
    "receivingEntity",
    "receptionDate",
    "responsibleObservation",
    "segment",
    "subject",
    "title"
  ];
  src;
  cardPdf: any = {};
  resultSearch: any = [];
  keyword;

  constructor(
    private ds: DirectoryService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
    private confirmationService: ConfirmationService,
    private filesService: FilesService,
    private prettySize: PrettySizeService
  ) {}

  generateDir(dir, expanded) {
    var files = [];
    var p: TreeNode = {
      data: {
        Name: dir.name,
        Code: dir.code,
        Type: dir.type,
        Path: dir.path,
        Size: this.prettySize.pretty(dir.size)
      }
    };
    if (dir.children) {
      p.expanded = expanded;
      var childs = [];

      dir.children.forEach(element => {
        let c = this.generateDir(element, expanded)[0];
        if (c) {
          childs.push(c);
        }
      });
      p.children = childs.sort((a, b) => {
        var NameOne = a.data.Name;
        var NameTwo = b.data.Name;
        if (NameOne < NameTwo) return -1;
        if (NameOne > NameTwo) return 1;
        return 0;
      });
      // p.expandedIcon = "pi pi-folder-open"//"fa fa-folder-open"
      // p.collapsedIcon = "pi pi-folder"
      // p.selectable = false
      files.push(p);
    } else {
      files.push(p);
    }
    console.log("FILES::", files);
    return files;
  }

  ngOnInit() {
    this.resultSearch = [];
    this.keyword = "";
    this.src = "";
    this.ds.getDirectory().subscribe(resp => {
      if (resp.status === 200) {
        const { dir } = resp.body;
        this.files = this.generateDir(dir, true);
      }
    });
  }

  clearDataDocument() {
    this.src = "";
  }

  nodoSelectF(event) {
    if (event) {
      this.filesService
        .searchDocument({ query: "idDoc", queryParam: event })
        .toPromise()
        .then(data => {
          console.log("EV-D", data);
          for (const key in data.body[0]) {
            if (data.body[0][key] === "broadcastDate")
              data.body[0][key] = new Date(data.body[0][key]);
            if (data.body[0][key] === "receptionDate")
              data.body[0][key] = new Date(data.body[0][key]);
            if (this.cardContentPdf.includes(key))
              this.cardPdf[key] = data.body[0][key];
          }
          return this.filesService.getDocument(event).toPromise();
        })
        .then(resp => {
          let file = new Blob([resp], { type: "application/pdf" });
          this.src = this.sanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(file)
          );
        })
        .catch(error => this.showError("Error", "No se obtuvo el documento."));
    }
  }
  downloadFile(cod, fileName) {
    this.filesService
      .downloadDocument(cod)
      .toPromise()
      .then(resp => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(resp);
        link.download = fileName;
        link.click();
        // new Blob(resp, { type: "application/pdf" })
      })
      .catch(err => console.error(err));
  }
  searchPdf() {
    this.src = "";
    this.resultSearch = [];
    this.filesService
      .searchDocument({ query: "keywords", queryParam: this.keyword })
      .toPromise()
      .then(data => {
        for (const element of data.body) {
          this.resultSearch.push({
            nameFile: element.nameDocument,
            content: element.keywords,
            idDoc: element.idDoc
          });
        }
      })
      .catch(error => {
        if (error.status !== 400) this.showError("Error", "No se obtuvieron los documentos.");
      });
  }
  deleteFile(idDoc) {
    this.filesService
      .deleteDocument(idDoc)
      .toPromise()
      .then(() =>
        this.showSuccess(
          "Documento eliminado",
          "El documento fue eliminado exitosamente"
        )
      )
      .then(() => this.ngOnInit())
      .catch(error => {
        console.log(error);
        this.showError("Error", "Error al intentar eliminar el documento.");
      });
  }
  showSuccess(summary, detail) {
    this.messageService.add({
      key: "success",
      severity: "success",
      summary: summary,
      detail: detail
    });
  }
  showError(summary, detail) {
    this.messageService.add({
      key: "error",
      severity: "error",
      summary: summary,
      detail: detail
    });
  }
  confirmDelete(idDoc) {
    console.log(idDoc);
    this.confirmationService.confirm({
      key: "confirmDelete",
      message: `Desea eliminar el documento?`,
      accept: () => this.deleteFile(idDoc)
    });
  }
}
