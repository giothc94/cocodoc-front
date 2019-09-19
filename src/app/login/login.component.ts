import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { LoginService } from '../_services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any = {};
  message:String;
  isLogged:boolean;
  constructor(
    private router: Router,
    private loginService: LoginService,
  ) {
  }
  
  ngOnInit() {
    var dataUserActive:any = this.loginService.getCookieDateUser();
    if(dataUserActive){
      dataUserActive =  JSON.parse(dataUserActive);
      this.router.navigate(['user']);
    }
  }

  login() {
    this.loginService.registerUser(this.user.user, this.user.password)
    .then(()=>location.href = '/login')
    .catch(error=>console.log(error))
    }

}
