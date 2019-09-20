import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  getDocument(id:Number):Observable<any>{
    return this.http.get(`http://localhost:8000/api/files/search/${id}`,{headers:this.header,responseType:"arraybuffer"})
  }
}
