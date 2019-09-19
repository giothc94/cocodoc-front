import { Component, OnInit } from '@angular/core';
import { LoginService } from '../_services/login.service';
import { Router } from '@angular/router';
import { UsersService } from '../_services/users/users.service';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  private _userDate: any = {}
  public user: any = {};

  constructor(
    private loginService: LoginService
  ) {
    this._userDate = JSON.parse(this.loginService.getCookieDateUser());
  }

  ngOnInit() {
    this.user = this._userDate.user
  }

}
