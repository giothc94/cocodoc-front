import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/components/common/api';
import { UsersService } from '../_services/users/users.service';
import { FormGroup, FormControl, Validators, FormArray, AbstractControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent implements OnInit {
  users: SelectItem[] = []
  roles = []
  updateUserForm: FormGroup
  userSelected
  dataUserSelected
  dataUser
  btnEditUser = false
  btnCreateUser = false
  keyword;

  constructor(private us: UsersService, private fb: FormBuilder, private readonly messageService: MessageService) {

  }

  ngOnInit() {
    this.keyword = '';
    this.us.getRoles()
      .subscribe(({ body }) => {
        this.roles = []
        body.forEach(element => {
          this.roles.push(
            {
              label: element.type_rol,
              value: element.id_rol
            })
        });
      });
    this.getUsers()
    this.setForm()
  }
  searchDataUser() {
    if (this.keyword) {
      this.users = []
      this.us.searchDataUser({ keyword: this.keyword })
        .subscribe((resp:any) => {
          const {body} = resp
          if(body.length  < 1 ) this.users = [];
          body.forEach(element => {
            console.log(element)
            this.users.push({
            label: `${element.Cédula} - ${element.PrimerNombre} ${element.SegundoNombre} ${element.PrimerApellido} ${element.SegundoApellido}`,
              value: {
                id: element.Id,
                cedula: element.Cédula,
                idRol: element.IdRol,
                rol: element.TipoUsuario,
                nombre: `${element.PrimerNombre} ${element.SegundoNombre} ${element.PrimerApellido} ${element.SegundoApellido}`
              }
            })
          });
        },error=>{
        })
    }else{
      this.getUsers();
      this.showError('Busqueda vacía','El campo de busqueda esta vacío.');
    }
  }
  saveUser() {
    let { status, value } = this.updateUserForm
    if (status === 'VALID') {
      this.us.createUser(value)
        .subscribe(resp => {
          this.updateUserForm.reset()
          this.getUsers()
          this.btnCreateUser = false;
          this.showSuccessCreateUser()
        },
          error => {
            this.showError('No se creo el usuario', error.error.error.message)
          });
    } else if (status === 'INVALID') {
      console.log('No se puede realizar el registro')
    }
  }

  getUsers() {
    this.keyword = '';
    this.users = [];
    this.us.getUsers()
      .subscribe(({body}) => {
        body.forEach(element => {
          this.users.push({
            label: `${element.Cédula} - ${element.PrimerNombre} ${element.SegundoNombre} ${element.PrimerApellido} ${element.SegundoApellido}`,
            value: {
              id: element.Id,
              cedula: element.Cédula,
              idRol: element.IdRol,
              rol: element.TipoUsuario,
              nombre: `${element.PrimerNombre} ${element.SegundoNombre} ${element.PrimerApellido} ${element.SegundoApellido}`
            }
          })
        });
      })
  }

  click({ value }) {
    this.btnEditUser = false;
    this.btnCreateUser = false;
    this.dataUserSelected = value
    this.userSelected = value
  }
  setForm(user?) {
    const { Cedula, Id, IdRol, PrimerApellido, PrimerNombre, SegundoApellido, SegundoNombre, TipoUsuario } = user || '';
    this.updateUserForm = new FormGroup({
      'cedula': new FormControl(Cedula || '', [Validators.required, Validators.minLength(10), Validators.maxLength(13), Validators.pattern('^[0-9]+$')]),
      'pNombre': new FormControl(PrimerNombre || '', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
      'sNombre': new FormControl(SegundoNombre || '', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
      'pApellido': new FormControl(PrimerApellido || '', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
      'sApellido': new FormControl(SegundoApellido || '', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
      'idRol': new FormControl(IdRol || '', [Validators.required, Validators.pattern('^[0-9]+$')])
    })
  }
  editUser() {
    let _id = this.dataUserSelected.id
    this.us.getUser(_id)
      .subscribe(({body}) => {
        this.setForm(body)
        this.updateUserForm.addControl('id', new FormControl(body.Id, [Validators.required, Validators.pattern('^[0-9]+$')]))
        this.btnEditUser = true
      })
  }

  updateUser() {
    let { status, value } = this.updateUserForm;
    if (status === 'VALID') {
      this.us.updateUser(value)
        .subscribe(resp => {
          if (resp.status === 200) {
            this.updateUserForm.reset()
            this.getUsers()
            this.showSuccessEditUser()
            this.btnEditUser = false
            this.userSelected = ''
          }
        },
          error => {
            this.showError('No se creo el usuario', error.error.error.message)
          });
    } else if (status === 'INVALID') {
      console.log('No se puede realizar el registro')
    }
  }
  cancelForm() {
    this.setForm();
    this.btnEditUser = false
    this.btnCreateUser = false
    this.userSelected = ''
  }
  actionCreateUser() {
    this.btnCreateUser = true;
    this.setForm();
  }

  showConfirm() {
    this.messageService.clear();
    this.messageService.add({ key: 'deleteUser', sticky: true, severity: 'warn', summary: 'Eliminar el registro ?', detail: 'Confirme para eliminar permanentemente el registro del usuario' });
  }

  confirmDelete() {
    this.us.deleteUser(this.dataUserSelected.id)
      .subscribe(result => {
        if (result.status === 200) {
          this.userSelected = ''
          this.messageService.clear();
          this.showSuccessDeleteUser()
          this.getUsers()
          this.btnEditUser = false;
          this.btnCreateUser = false;
        }
      }, error => {
        this.userSelected = ''
        this.messageService.clear();
        this.showError('No se elimino el usuario', 'Consulta con el administrador del sistema.')
        this.getUsers()
      })
  }
  cancelDelete() {
    this.messageService.clear();
  }

  showSuccessDeleteUser() {
    this.messageService.add({ key: 'deleteSeccess', severity: 'success', summary: 'Usuario eliminado', detail: 'Has eliminado al usuario del sistema' });
  }
  showSuccessCreateUser() {
    this.messageService.add({ key: 'createSeccess', severity: 'success', summary: 'Usuario creado', detail: 'Has creado un usuario en el sistema' });
  }
  showSuccessEditUser() {
    this.messageService.add({ key: 'editSeccess', severity: 'success', summary: 'Usuario modificado', detail: 'Has modificado al usuario exitosamente' });
  }
  showError(summary, detail) {
    this.messageService.add({ key: 'errorEditUser', severity: 'error', summary: summary, detail: detail });
  }

}
