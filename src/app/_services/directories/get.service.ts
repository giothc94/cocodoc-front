import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GetService {

  FOLDER:string = `directories`
  URL:string = `http://localhost:3000/api/${this.FOLDER}/`;

  constructor(private http:HttpClient) { }

  getDirectories():Observable<any>{
    return this.http.get(this.URL)
  }
}
