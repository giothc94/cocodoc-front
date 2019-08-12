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
  newUser: FormGroup
  userSelected
  dataUserSelected
  dataUser
  btnEditUser = false

  constructor(private us: UsersService, private fb: FormBuilder, private readonly messageService: MessageService) {
    this.us.getRoles()
      .subscribe(({ data }) => {
        data.forEach(element => {
          this.roles.push(
            {
              label: element.type,
              value: element.id_rol
            })
        });
      });
    this.getUsers()
    this.setForm()
  }

  ngOnInit() {
  }
  saveUser() {
    let { status, value } = this.newUser
    if (status === 'VALID') {
      this.us.createUser(value)
        .subscribe((resp) => {
          console.log(resp)
          this.newUser.reset()
          this.getUsers()
          this.showSuccessCreateUser()
        });
    } else if (status === 'INVALID') {
      console.log('No se puede realizar el registro')
    }
  }

  getUsers() {
    this.users = []
    this.us.getUsers()
      .subscribe(({ data }) => {
        data.forEach(element => {
          this.users.push({
            label: `${element.PRIMER_NOMBRE} ${element.SEGUNDO_NOMBRE} ${element.PRIMER_APELLIDO} ${element.SEGUNDO_APELLIDO}`,
            value: {
              id: element.ID,
              cedula: element.CEDULA,
              idRol: element.ID_ROL,
              rol:element.TIPO_USUARIO,
              nombre: `${element.PRIMER_NOMBRE} ${element.SEGUNDO_NOMBRE} ${element.PRIMER_APELLIDO} ${element.SEGUNDO_APELLIDO}`
            }
          })
        });
      })
  }

  click({ value }) {
    this.dataUserSelected = value
    this.userSelected = value || ''
  }
  setForm(user?) {
    const { CEDULA, ID, ID_ROL, PRIMER_APELLIDO, PRIMER_NOMBRE, SEGUNDO_APELLIDO, SEGUNDO_NOMBRE, TIPO_USUARIO } = user || ''
    this.newUser = new FormGroup({
      'cedula': new FormControl(CEDULA, [Validators.required, Validators.minLength(10), Validators.maxLength(13), Validators.pattern('^[0-9]+$')]),
      'pNombre': new FormControl(PRIMER_NOMBRE, [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
      'sNombre': new FormControl(SEGUNDO_NOMBRE, [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
      'pApellido': new FormControl(PRIMER_APELLIDO, [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
      'sApellido': new FormControl(SEGUNDO_APELLIDO, [Validators.required, Validators.pattern('^[a-zA-Z]+$')]),
      'idRol': new FormControl(ID_ROL, [Validators.required, Validators.pattern('^[0-9]+$')]),
    })
  }
  editUser() {
    this.btnEditUser = true
    this.dataUser = this.dataUserSelected
    this.dataUserSelected = {}
    this.us.getUser(this.dataUser.id)
      .subscribe(({ data }) => {
        this.setForm(data)
        this.btnEditUser = true
        this.userSelected = ''
      })
  }
  updateUser() {
    let { status, value } = this.newUser
    value.id = this.dataUser.id
    if (status === 'VALID') {
      this.us.updateUser(value)
        .subscribe((resp) => {
          if (resp.ok) {
            this.newUser.reset()
            this.getUsers()
            this.showSuccessEditUser()
            this.btnEditUser = false
            this.userSelected = ''
          } else {
            const {message, response} = resp
            this.showError(message,response)
          }
        });
    } else if (status === 'INVALID') {
      console.log('No se puede realizar el registro')
    }
  }
  cancelForm() {
    this.setForm();
    this.btnEditUser = false
    this.userSelected = ''
  }

  addSingle() {
    this.messageService.add({ severity: 'success', summary: 'Service Message', detail: 'Via MessageService' });
  }
  showConfirm() {
    this.messageService.clear();
    this.messageService.add({ key: 'deleteUser', sticky: true, severity: 'warn', summary: 'Eliminar el registro ?', detail: 'Confirme para eliminar permanentemente el registro del usuario' });
  }

  async confirmDelete() {
    this.us.deleteUser(this.dataUserSelected.id)
      .subscribe((result) => {
        if (result.ok) {
          this.userSelected = ''
          this.messageService.clear();
          this.showSuccessDeleteUser()
          this.getUsers()
        }
        // console.log(result)
        // message: "Usuario borrado"
        // ok: true
        // status: 200
        // statusText: "Ok"
      })
  }
  cancelDelete() {
    this.userSelected = ''
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
  showError(summary,detail) {
    this.messageService.add({ key: 'errorEditUser', severity: 'error', summary: summary, detail: detail });
  }

}
