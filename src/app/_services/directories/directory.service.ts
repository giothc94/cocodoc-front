import { Injectable } from '@angular/core';
import { API_COCODOC } from '../../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectoryService {

  constructor(private http:HttpClient) { }

  getDirectory():Observable<any>{
    return this.http.get(`${API_COCODOC.URL}directories/`);
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
