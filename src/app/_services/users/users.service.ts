import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_COCODOC } from '../../../environments/environment.prod';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private URL = `${API_COCODOC.URL}users/`;
  private _headerAuthToken:HttpHeaders;

  constructor(
    private http: HttpClient,
    private loginService: LoginService
  ) {
    this._headerAuthToken = this.loginService.getHeaderAuthToken();
  }

  getRoles(): Observable<any> {
    return this.http.get(`${API_COCODOC.URL}roles/`);
  }

  createUser(user): Observable<any> {
    return this.http.post(`${API_COCODOC.URL}users/`, user)
  }
  getUsers(): Observable<any> {
    return this.http.get(`${API_COCODOC.URL}users/`);
  }
  getUser(id): Observable<any> {
    return this.http.get(`${API_COCODOC.URL}users/${id}`,{headers:this._headerAuthToken});
  }
  deleteUser(id): Observable<any> {
    return this.http.delete(`${API_COCODOC.URL}users/${id}`)
  }
  updateUser(user): Observable<any> {
    return this.http.put(`${API_COCODOC.URL}users/`, user)
  }

}
