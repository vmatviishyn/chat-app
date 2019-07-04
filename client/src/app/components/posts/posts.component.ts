import { Component, OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts = [];
  socket: any;
  user: any;

  constructor(
    private postService: PostService, 
    private tokenService: TokenService,
    private router: Router
  ) { 
    this.socket = io('https://chat-ng-app.herokuapp.com');
  }

  ngOnInit() {
    this.getPosts();
    this.socket.on('refresh page', data => {
      this.getPosts();
    });
    this.user = this.tokenService.getPayload();
  }

  getPosts() {
    this.postService.getAllPosts()
      .subscribe(data => {
        this.posts = data.posts;
      }, err => {
        if (err.error.token === null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
        }
      });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  likePost(post) {
    this.postService.addLike(post)
      .subscribe(data => {
        this.socket.emit('refresh', {});
      }, err => console.log(err));
  }

  checkInLikesArray(arr, username) {
    return _.some(arr, { username: username });
  }

  openCommentBox(post) {
    this.router.navigate(['post', post._id]);
  }
}
