import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public userToken:string;

  constructor() {
    this.userToken = localStorage.getItem('userToken')
   }

  /**
   * userIsLogged
   */
  public get userIsLogged():string {
    return this.userToken;
  }
  /**
   * setLogged
   */
  public set setLogged(userToken:string) {
    this.userToken = userToken;
  }
}
