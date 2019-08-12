import { Injectable } from '@angular/core';
import { API_COCODOC } from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http:HttpClient) { }

  getRoles():Observable<any>{
    return this.http.get(`${API_COCODOC.URL}roles/`);
  }

  createUser(user):Observable<any>{
    return this.http.post(`${API_COCODOC.URL}users/`,user)
  }
  getUsers():Observable<any>{
    return this.http.get(`${API_COCODOC.URL}users/`);
  }
  getUser(id):Observable<any>{
    return this.http.get(`${API_COCODOC.URL}users/${id}`);
  }
  deleteUser(id):Observable<any>{
    return this.http.delete(`${API_COCODOC.URL}users/${id}`)
  }
  updateUser(user):Observable<any>{
    return this.http.put(`${API_COCODOC.URL}users/`,user)
  }

}
