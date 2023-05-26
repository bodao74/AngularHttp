import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { Post } from './post.model';
import { PostService } from './posts.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];

  isFetching: boolean = false;

  error = null;

  errorSubscription: Subscription;

  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
    this.errorSubscription = this.postService.error.subscribe(
      (errorMessage) => {
        this.error = errorMessage;
      }
    );
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postService.createAndStorePosts(postData.title, postData.content);
    this.fetchPosts();
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
    this.postService.deletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  private fetchPosts() {
    this.isFetching = true;
    /*this.postService.fetchPosts().subscribe((posts) => {
      this.isFetching = false;
      this.loadedPosts = posts;
    }, error => {
      this.error = "(" + error.status + ")" + " " + error.statusText;
      console.log(error);
    });
    
    ALTERADO POIS O SUBSCRIBE DESSA FORMA ESTÁ DEPRECATED
    
    */
    this.postService.fetchPosts().subscribe({
      next: (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      error: (error) => {
        this.error = '(' + error.status + ')' + ' ' + error.statusText;
        console.log(error);
      },
    });
  }

  onHandlingError() {
    this.isFetching = false;
    this.error = null;
    console.log(this.error);
  }

  ngOnDestroy(): void {
    this.errorSubscription.unsubscribe();
  }
}
