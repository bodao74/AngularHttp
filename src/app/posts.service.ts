import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from 'rxjs/operators';

import { Post } from "./post.model";

@Injectable({ providedIn: 'root' })
export class PostService {

  error = new Subject<string>();

  postObservable: Observable<any>;

  constructor(private http: HttpClient) {

  }

  createAndStorePosts(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    this.http.post<{ name: string }>(
      'https://ng-complete-guide-c2c8a-default-rtdb.firebaseio.com/posts.json', postData).subscribe(responseData => {
        console.log(responseData);
      }, error => {
        this.error.next(error.message);
      });
  }

  fetchPosts() {
    return this.http.get<{ [key: string]: Post }>('https://ng-complete-guide-c2c8a-default-rtdb.firebaseio.com/posts.json')
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        })
      );
  }

  deletePosts() {
    return this.http.delete('https://ng-complete-guide-c2c8a-default-rtdb.firebaseio.com/posts.json');
  }
}
