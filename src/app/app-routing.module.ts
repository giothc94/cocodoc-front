import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { IngresoPDFComponent } from './ingreso-pdf/ingreso-pdf.component';
import { LoginComponent } from './login/login.component';
import { SubirComponent } from './subir/subir.component';
import { ListasComponent } from './listas/listas.component';
import { UserComponent } from './user/user.component';
import {ArchivosComponent} from './archivos/archivos.component';
import {GestionUsuariosComponent} from './gestion-usuarios/gestion-usuarios.component';


const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'login', component:LoginComponent},
  {path:'user', component:UserComponent},
  {path:'enter', component:IngresoPDFComponent},
  {path:'upload', component:SubirComponent},
  {path:'list', component:ListasComponent},
  {path:'files', component:ArchivosComponent},
  {path:'users', component:GestionUsuariosComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
