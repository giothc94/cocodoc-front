import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class FilesService {
  private header:HttpHeaders;
  constructor(private http:HttpClient,private loginService:LoginService) { 
    this.header = this.loginService.getHeaderAuthToken();
  }

  generatePdf(files):Observable<any>{
    return this.http.post(`http://localhost:8000/api/files/`,files,{headers:this.header,observe:'events',reportProgress:true})
  }
  uploadPdf(files):Observable<any>{
    return this.http.post(`http://localhost:8000/api/files/upload`,files,{headers:this.header,observe:'events',reportProgress:true})
  }
  getDocument(id:Number):Observable<any>{
    return this.http.get(`http://localhost:8000/api/files/search/${id}`,{headers:this.header,responseType:"arraybuffer"})
  }
  downloadDocument(id:Number):Observable<any>{
    return this.http.get(`http://localhost:8000/api/files/search/${id}/download`,{headers:this.header,responseType:"blob"})
  }
  searchDocument({query,queryParam}):Observable<any>{
    return this.http.get(`http://localhost:8000/api/files/search?query=${query}&queryParam=${queryParam}`,{headers:this.header})
  }
  deleteDocument(idDoc):Observable<any>{
    return this.http.delete(`http://localhost:8000/api/files/${idDoc}`,{headers:this.header})
  }
}
