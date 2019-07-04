import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import _ from 'lodash';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';
import { Router } from '@angular/router';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  users = [];
  loggedInUser: any;
  userArray = [];
  socket: any;
  onlineusers = [];

  constructor(
    private userService: UsersService,
    private tokenService: TokenService,
    private router: Router
  ) {
    this.socket = io('https://chat-ng-app.herokuapp.com');
  }

  ngOnInit() {
    this.loggedInUser = this.tokenService.getPayload();
    this.getUsers();
    this.getUser();

    this.socket.on('refresh page', () => {
      this.getUsers();
      this.getUser();
    });
  }

  getUsers() {
    this.userService.getAllUsers()
      .subscribe(data => {
        _.remove(data.result, { username: this.loggedInUser.username });
        this.users = data.result;
      });
  }

  getUser() {
    this.userService.getUserById(this.loggedInUser._id)
      .subscribe(data => {
        this.userArray = data.result.following;
      });
  } 

  followUser(user) {
    this.userService.followUser(user._id)
      .subscribe(data => {
        this.socket.emit('refresh', {});  
      })
  }

  checkInArray(arr, id) {
    const result  = _.find(arr, ['userFollowed._id', id]);
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  online(event) {
    this.onlineusers = event;
  }

  checkIfOnline(name) {
    const result = _.indexOf(this.onlineusers, name);
    if (result > -1) {
      return true;
    } else {
      return false;
    }
  }

  viewUser(user) {
    this.router.navigate([user.username]);
    if (this.loggedInUser.username !== user.username) {
      this.userService.profileNotifications(user._id)
        .subscribe(data => {
          this.socket.emit('refresh', {});  
        }, err => {
          console.log(err);
        });
    }
  }

}
