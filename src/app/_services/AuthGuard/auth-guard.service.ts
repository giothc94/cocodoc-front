import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from '../login.service';
import {AppComponent} from '../../app.component'

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private loginService:LoginService, private router:Router) { }

  async canActivate(){
    try {
      await this.loginService.verifyToken();
      return true
    } catch (error) {
      // this.router.navigate(['login'])
      // .then(()=>location.reload())
      location.href = '/login';
      return false
    }
  }
}
