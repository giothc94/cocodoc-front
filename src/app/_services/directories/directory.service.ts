import { Injectable } from '@angular/core';
import { API_COCODOC } from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {
  private headers:HttpHeaders;
  constructor(private http:HttpClient,private loginService:LoginService) { 
    this.headers = this.loginService.getHeaderAuthToken()
  }

  getDirectory():Observable<any>{
    return this.http.get(`${API_COCODOC.URL}directories/`,{headers:this.headers});
  }
  createFolder(newFolder):Observable<any>{
    return this.http.post(`${API_COCODOC.URL}directories/`,newFolder);
  }
  renameFolder(nameFolder):Observable<any>{
    return this.http.put(`${API_COCODOC.URL}directories/`,nameFolder);
  }
  deleteFolder(nameFolder):Observable<any>{
    return this.http.delete(`${API_COCODOC.URL}directories/`,{params:nameFolder});
  }
}
