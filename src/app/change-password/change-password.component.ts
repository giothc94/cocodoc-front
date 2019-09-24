import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { LoginService } from '../_services/login.service';
import { MessageService, Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
  providers:[MessageService]
})
export class ChangePasswordComponent implements OnInit {

  change: any = {};
  message: Message[] = [];
  isLogged: boolean;
  constructor(
    private router: Router,
    private loginService: LoginService,
    private messageService: MessageService
  ) {
  }

  ngOnInit() {
    var dataUserActive: any = this.loginService.getCookieDateUser();
    if (dataUserActive) {
      dataUserActive = JSON.parse(dataUserActive);
      this.router.navigate(['user']);
    }
  }

  changePassword() {
    if (this.change.password === this.change.repeatPassword) {
      this.loginService.changePassword(this.change.password)
      .subscribe(resp=>{
        location.href = '/user'
        console.log(resp)
      },error=>{
        console.log(error)
      })
    }else{
      this.message.push({severity:'error', detail:'No coinciden las claves ingresadas.'});
    }
    // this.loginService.registerUser(this.user.user, this.user.password)
    //   .then(() => location.href = '/login')
    //   .catch(error => {
    //     this.message = [];
    //     this.message.push({severity:'error', detail:error.error.error.message});
    //     this.user.user = ''
    //     this.user.password = ''
    //     setTimeout(() => {
    //       this.message = []
    //     }, 5000);
    //   })
  }
}
