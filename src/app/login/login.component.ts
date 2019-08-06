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
  isLogged: boolean = false;

  constructor(
    private router: Router,
    private loginService:LoginService
  ) { 
    if (this.loginService.userIsLogged) {
      this.router.navigate(['ingreso']);      
    }
  }

  ngOnInit() {
  }

  login() {
    console.log(this.user);
    this.user = {};
    localStorage.setItem('userToken','A')
    this.loginService.setLogged = localStorage.getItem('userToken');
    this.router.navigate(['ingreso']);
  }

}
