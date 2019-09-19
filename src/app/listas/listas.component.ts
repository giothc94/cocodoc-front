import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { TreeNode } from 'primeng/api';
import { DirectoryService } from '../_services/directories/directory.service';

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

    constructor(private ds: DirectoryService, private sanitizer:DomSanitizer) { }

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
            this.BreadcrumFiles = this.nodoSelect.key === undefined ? `root/${this.nodoSelect.label}/` : `${this.nodoSelect.key}/`;
            this.src = this.sanitizer.bypassSecurityTrustResourceUrl(this.URL)
            console.log(this.src)
            console.log(this.nodoSelect)
        }
    }

}
