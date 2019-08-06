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
  isLogged:boolean;


  constructor(
    private router:Router,
    private loginService:LoginService
  ){
    if (this.loginService.userIsLogged) {
      this.isLogged = true;
      this.router.navigate(['user']);
    }else{
      this.router.navigate(['login']);
    }
  }

  ngOnInit(): void {
    this.menu = [
      {
        label: 'Usuario',
        icon: 'pi pi-user',
        routerLink: '/user',
        command: () => this.disableLink()
      },
      {
        label: 'Crear PDF',
        icon: 'pi pi-file',
        routerLink: '/enter',
        command: () => this.disableLink()
      },
      {
        label: 'Subir PDF',
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
      {
        label: 'Gestionar sistema de archivos',
        icon: 'pi pi-folder',
        routerLink: '/files',
        command: () => this.disableLink()
      },
      {
        label: 'Gestionar usuarios',
        icon: 'pi pi-users',
        routerLink: '/users',
        command: () => this.disableLink()
      }
    ]
  }

  disableLink() {
    this.menu.forEach(x => x.expanded = false)
  }
}
