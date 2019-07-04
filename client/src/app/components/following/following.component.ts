import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css']
})
export class FollowingComponent implements OnInit {
  following = [];
  user: any;
  socket: any;

  constructor(
    private tokenService: TokenService,
    private usersService: UsersService
  ) {
    this.socket = io('https://chat-ng-app.herokuapp.com');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.getUser();
    this.socket.on('refresh page', () => {
      this.getUser();
    })
  }

  getUser() {
    this.usersService.getUserById(this.user._id)
      .subscribe(data => {
        this.following = data.result.following;
      }, err => {
        console.log(err);
      });
  }

  unfollowUser(user) {
    this.usersService.unfollowUser(user._id)
      .subscribe(data => {
        this.socket.emit('refresh', {});
      })
  }

}
