import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_COCODOC } from '../../../environments/environment.prod';
import * as Crypto from 'crypto-js';
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
    return this.http.get(`${API_COCODOC.URL}roles/`, {headers:this._headerAuthToken});
  }

  createUser(user): Observable<any> {
    return this.http.post(`${API_COCODOC.URL}users/`, user, {headers:this._headerAuthToken})
  }
  getUsers(): Observable<any> {
    return this.http.get(`${API_COCODOC.URL}users/`, {headers:this._headerAuthToken});
  }
  getUser(id): Observable<any> {
    return this.http.get(`${API_COCODOC.URL}users/${id}`,{headers:this._headerAuthToken});
  }
  deleteUser(id): Observable<any> {
    return this.http.delete(`${API_COCODOC.URL}users/${id}`, {headers:this._headerAuthToken})
  }
  updateUser(user): Observable<any> {
    return this.http.put(`${API_COCODOC.URL}users/`, user, {headers:this._headerAuthToken})
  }
  searchDataUser({keyword}){
    return this.http.post(`${API_COCODOC.URL}users/search`,{keyword:keyword},{headers:this._headerAuthToken })
  }
}
