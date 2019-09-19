import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private http:HttpClient) { }

  generatePdf(files):Observable<any>{
    return this.http.post(`http://localhost:8000/api/files/`,files)
  }
}
