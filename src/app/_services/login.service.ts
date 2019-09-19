import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as Crypto from 'crypto-js';
import { API_COCODOC } from '../../environments/environment.prod'
@Injectable({
  providedIn: "root"
})
export class LoginService {
  private URL = `${API_COCODOC.URL}auth/`
  private _isLogged: boolean;
  private _userLogged: Object;

  constructor(
    private cookieService: CookieService,
    private http: HttpClient
  ) { }

  public verifyToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = this.decryptTokenCookie();
      const data = JSON.parse(this.getCookieDateUser())
      if (token && data.isLogged) {
        this.http.get(`${this.URL}check`, { headers: this.setHeader('Bearer', token) }).toPromise()
          .then(resolve)
          .catch(error => {
            this.cookieService.delete('UDCocodoc')
            this.cookieService.delete('UTCocodoc')
            reject(error);
          })
      }else{
        this.cookieService.delete('UDCocodoc')
        this.cookieService.delete('UTCocodoc')
        reject({error:'No autenticado'});
      }
    })
  }

  public registerUser(user: string, password: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.URL}log-in`, {}, { headers: this.setHeader('Basic', null, user, password) }).toPromise()
        .then((resp: any) => {
          this.encryptTokenCookie(resp.token);
          this.setCookieDateUser(resp.user, true);
          resolve(resp.user)
        })
        .catch(reject)
    })
  }

  private setHeader(type: String, token?: String, user?: String, password?: String): HttpHeaders {
    let authorizationData;
    let headers: HttpHeaders;
    if (type === 'Basic') {
      authorizationData = 'Basic ' + btoa(user + ':' + password);
      headers = new HttpHeaders({ 'Authorization': authorizationData });
    } else if (type === 'Bearer') {
      authorizationData = 'Bearer ' + token;
      headers = new HttpHeaders({ 'Authorization': authorizationData });
    }
    return headers;
  }

  private setCookieDateUser(user, isLogged) {
    let date: Date = new Date(new Date().getTime() + 2 * 1000 * 60 * 60);
    const cookieData = { user: user, isLogged: isLogged };
    const cookie =  Crypto.AES.encrypt(JSON.stringify(cookieData), API_COCODOC.PUBLIC_API_KEY).toString()
    this.cookieService.set('UDCocodoc',cookie ,date);
  }
  public getCookieDateUser(): string {
    return Crypto.AES.decrypt(this.cookieService.get('UDCocodoc'), API_COCODOC.PUBLIC_API_KEY).toString(Crypto.enc.Utf8) || null
  }

  private encryptTokenCookie(userToken){
    let date: Date = new Date(new Date().getTime() + 2 * 1000 * 60 * 60);
    const userTokenEncrypt = Crypto.AES.encrypt(userToken,API_COCODOC.PUBLIC_API_KEY).toString();
    this.cookieService.set('UTCocodoc', userTokenEncrypt, date);
  }

  private decryptTokenCookie(){
    return Crypto.AES.decrypt(this.cookieService.get('UTCocodoc'),API_COCODOC.PUBLIC_API_KEY).toString(Crypto.enc.Utf8) || null;
  }

  public signOut():void{
    this.cookieService.deleteAll();
  }
}
