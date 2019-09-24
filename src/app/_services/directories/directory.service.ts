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
  createFolder({nameFolder,destinationFolderCode}):Observable<any>{
    return this.http.post(`${API_COCODOC.URL}directories/`,{nameFolder,destinationFolderCode},{headers:this.headers});
  }
  renameFolder({newNameFolder,idFolder}):Observable<any>{
    return this.http.put(`${API_COCODOC.URL}directories/`,{newNameFolder,idFolder},{headers:this.headers});
  }
  deleteFolder({idFolder}):Observable<any>{
    return this.http.delete(`${API_COCODOC.URL}directories/${idFolder}`,{headers:this.headers});
  }
}
