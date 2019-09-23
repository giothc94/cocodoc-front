import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { LoginService } from '../_services/login.service';
import { MessageService, Message } from 'primeng/components/common/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[MessageService]
})
export class LoginComponent implements OnInit {

  user: any = {};
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

  login() {
    this.loginService.registerUser(this.user.user, this.user.password)
      .then(() => location.href = '/login')
      .catch(error => {
        this.message = [];
        this.message.push({severity:'error', detail:error.error.error.message});
        this.user.user = ''
        this.user.password = ''
        setTimeout(() => {
          this.message = []
        }, 5000);
      })
  }
}

