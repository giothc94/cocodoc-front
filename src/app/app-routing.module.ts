import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { IngresoPDFComponent } from './ingreso-pdf/ingreso-pdf.component';
import { LoginComponent } from './login/login.component';
import { SubirComponent } from './subir/subir.component';
import { ListasComponent } from './listas/listas.component';
import { UserComponent } from './user/user.component';
import {ArchivosComponent} from './archivos/archivos.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {GestionUsuariosComponent} from './gestion-usuarios/gestion-usuarios.component';
import { AuthGuardService } from './_services/AuthGuard/auth-guard.service';


const routes: Routes = [
  {path:'',component:LoginComponent},
  {path:'login', component:LoginComponent},
  {path:'user', component:UserComponent,canActivate:[AuthGuardService]},
  {path:'enter', component:IngresoPDFComponent,canActivate:[AuthGuardService]},
  {path:'upload', component:SubirComponent,canActivate:[AuthGuardService]},
  {path:'list', component:ListasComponent,canActivate:[AuthGuardService]},
  {path:'files', component:ArchivosComponent,canActivate:[AuthGuardService]},
  {path:'users', component:GestionUsuariosComponent,canActivate:[AuthGuardService]},
  {path:'change', component:ChangePasswordComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
