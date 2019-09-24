import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LoginService } from './_services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Cocodoc | Admin';
  menu: MenuItem[];
  isLogged: boolean=false;


  constructor(
    private router: Router,
    private loginService: LoginService
  ) {
  }
  ngOnInit(): void {
    var dataUserActive:any = this.loginService.getCookieDateUser();
    if(dataUserActive){
      dataUserActive =  JSON.parse(dataUserActive);
      this.isLogged = dataUserActive.isLogged
    }else{
      this.isLogged = false;
    }
    this.menu = [
      {
        label: 'Usuario',
        icon: 'pi pi-user',
        routerLink: '/user',
        command: () => this.disableLink()
      },
      {
        label: 'Documentos',
        icon: 'pi pi-file',
        routerLink: '/enter',
        command: () => this.disableLink(),
        items:[
          {
            label: 'Crear documento',
            icon: 'pi pi-plus',
            routerLink: '/enter',
            command: () => this.disableLink()
          },
          {
            label: 'Subir documento',
            icon: 'pi pi-save',
            routerLink: '/upload',
            command: () => this.disableLink()
          },
          {
            label: 'Listas',
            icon: 'pi pi-list',
            routerLink: '/list',
            command: () => this.disableLink()
          },
        ]
      },
      {
        label: 'Sistema de archivos',
        icon: 'pi pi-folder',
        routerLink: '/files',
        command: () => this.disableLink()
      },
      {
        label: 'Administrar usuarios',
        icon: 'pi pi-users',
        routerLink: '/users',
        command: () => this.disableLink()
      }
    ]
  }

  disableLink() {
    this.menu.forEach(x => x.expanded = false)
  }
  signOut(){
    this.loginService.signOut();
    location.href = '/login'
  }
}
