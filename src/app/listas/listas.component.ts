import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { TreeNode } from 'primeng/api';
import { DirectoryService } from '../_services/directories/directory.service';
import { LoginService } from '../_services/login.service';
import { FilesService } from '../_services/files/files.service';

@Component({
    selector: 'app-listas',
    templateUrl: './listas.component.html',
    styleUrls: ['./listas.component.css']
})
export class ListasComponent implements OnInit {

    files: TreeNode[];
    nodoSelect:TreeNode
    BreadcrumFiles
    src
    URL = 'http://localhost:8000/api/files'

    constructor(private ds: DirectoryService, private sanitizer:DomSanitizer,private filesService:FilesService) { }

    generateDir(dir) {
        var files = []
        var p: TreeNode = {
            label: dir.name,//.toUpperCase(),
            data: dir.code
        }
        if (dir.children) {
            var childs = []

            dir.children.forEach(element => {
                let c = this.generateDir(element)[0]
                if (c) {
                    childs.push(c)
                }
            });
            p.children = childs
            p.expandedIcon = "pi pi-folder-open"//"fa fa-folder-open"
            p.collapsedIcon = "pi pi-folder"
            p.selectable = false
            files.push(p)
        } else {
            p.key = dir.path.split('/').pop()
            p.icon = "pi pi-file"
            files.push(p)
        }
        return files
    }

    ngOnInit() {
        this.ds.getDirectory()
            .subscribe(resp => {
                if (resp.ok) {
                    const { objectDir } = resp.data;
                    this.files = this.generateDir(objectDir)
                    this.files.forEach(node => {
                    });
                }
            });
    }

    nodoSelectF(event) {
        if (event.node) {
            this.nodoSelect = event.node;
            // this.BreadcrumFiles = this.nodoSelect.key === undefined ? `root/${this.nodoSelect.label}/` : `${this.nodoSelect.key}/`;
            console.log(event.node.data)
            this.filesService.getDocument(event.node.data).toPromise()
            .then(resp=>{
                let file = new Blob([resp],{type:'application/pdf'})
                this.src = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
                this.collapseAll();
            })
            .catch(error=>console.log(error))
        }
    }
    collapseAll() {
        this.files.forEach(node => {
          this.expandRecursive(node, false);
        });
    }
    private expandRecursive(node: TreeNode, isExpand: boolean) {
        node.expanded = isExpand;
        if (node.children) {
          node.children.forEach(childNode => {
            this.expandRecursive(childNode, isExpand);
          });
        }
      }

}
