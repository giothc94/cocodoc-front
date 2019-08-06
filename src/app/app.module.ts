import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// primeng
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { PanelMenuModule } from 'primeng/panelmenu';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { PanelModule } from 'primeng/panel';
import { TooltipModule } from 'primeng/tooltip';
import { TabMenuModule } from 'primeng/tabmenu';
import { FieldsetModule } from 'primeng/fieldset';
import { TreeModule } from 'primeng/tree';
import {DropdownModule} from 'primeng/dropdown';
import {ChipsModule} from 'primeng/chips';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {CheckboxModule} from 'primeng/checkbox';

// fin primeng
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IngresoPDFComponent } from './ingreso-pdf/ingreso-pdf.component';
import { LoginComponent } from './login/login.component';
import { SubirComponent } from './subir/subir.component';
import { ListasComponent } from './listas/listas.component';
import { UserComponent } from './user/user.component';
import { ArchivosComponent } from './archivos/archivos.component';
import { GestionUsuariosComponent } from './gestion-usuarios/gestion-usuarios.component';

@NgModule({
  declarations: [
    AppComponent,
    IngresoPDFComponent,
    LoginComponent,
    SubirComponent,
    ListasComponent,
    UserComponent,
    ArchivosComponent,
    GestionUsuariosComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    InputTextModule,
    CardModule,
    ButtonModule,
    PanelMenuModule,
    FileUploadModule,
    ToastModule,
    PanelModule,
    TooltipModule,
    TabMenuModule,
    FieldsetModule,
    TreeModule,
    DropdownModule,
    ChipsModule,
    InputTextareaModule,
    CheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
