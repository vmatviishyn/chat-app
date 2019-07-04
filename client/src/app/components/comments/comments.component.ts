import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validator, Validators } from '@angular/forms';
import { PostService } from 'src/app/services/post.service';
import { ActivatedRoute } from '@angular/router';
import io from 'socket.io-client';
import * as moment from 'moment';


@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit, AfterViewInit {
  toolbarElement: any;
  commentForm: FormGroup;
  postId: any;
  comments = [];
  socket: any;
  post: string;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute
  ) { 
    this.socket = io('https://chat-ng-app.herokuapp.com');
  }

  ngOnInit() {
    this.toolbarElement = document.querySelector('.nav-content');
    this.initForm();
    this.postId = this.route.snapshot.paramMap.get('id');
    this.getPost();
    this.socket.on('refresh page', data => {
      this.getPost();
    });
  }

  ngAfterViewInit() {
    this.toolbarElement.style.display = 'none';
  }

  initForm() {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required]
    });
  }

  onSubmit() {
    this.postService.addComment(this.postId, this.commentForm.value.comment)
      .subscribe(data => {
        this.socket.emit('refresh', {});
        this.commentForm.reset();
      });
  }

  getPost() {
    this.postService.getPost(this.postId)
      .subscribe(data => {
        this.post = data.post.post;
        this.comments = data.post.comments.reverse();
      });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }
}
