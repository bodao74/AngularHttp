import {
  HttpClient,
  HttpEventType,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, Observable, Subject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  error = new Subject<string>();

  postObservable: Observable<any>;

  constructor(private http: HttpClient) {}

  createAndStorePosts(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    /*
    this.http.post<{ name: string }>(
      'https://ng-complete-guide-c2c8a-default-rtdb.firebaseio.com/posts.json', postData).subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });

    ALTERADO POIS O SUBSCRIBE DESSA FORMA ESTÁ DEPRECATED
    
    */
    this.http
      .post<{ name: string }>(
        'https://ng-complete-guide-c2c8a-default-rtdb.firebaseio.com/posts.json',
        postData,
        {
          observe: 'response',
        }
      )
      .subscribe({
        next: (responseData) => {
          console.log(responseData);
        },
        error: (error) => {
          this.error.next(error.message);
        },
      });
  }

  fetchPosts() {
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty');
    //to add more params to the URL
    //searchParams = searchParams.append('custom','key');
    return this.http
      .get<{ [key: string]: Post }>(
        'https://ng-complete-guide-c2c8a-default-rtdb.firebaseio.com/posts.json',
        {
          headers: new HttpHeaders({ 'Custom-Header': 'Marcelo Header' }),
          //params: new HttpParams().set('print', 'pretty'),
          params: searchParams,
        }
      )
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          //send to analytics server
          return throwError(() => new errorRes());
        })
      );
  }

  deletePosts() {
    return this.http
      .delete(
        'https://ng-complete-guide-c2c8a-default-rtdb.firebaseio.com/posts.json',
        {
          observe: 'events',
          //pode mudar o tipo de resposta, default eh 'json'
          responseType: 'text',
        }
      )
      .pipe(
        tap((event) => {
          console.log(event);
          if (event.type === HttpEventType.Sent) {
            //.... um IF para controlar as respostas e executar alguma ação sem alterar a resposta.
          }
          if (event.type === HttpEventType.Response) {
            console.log(event.body);
          }
        })
      );
  }
}
