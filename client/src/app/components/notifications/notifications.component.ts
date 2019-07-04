import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';
import * as moment from 'moment';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  socket: any;
  user: any;
  notifications = [];

  constructor(
    private tokenService: TokenService,
    private usersService: UsersService
  ) {
    this.socket = io('http://localhost:3000');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    this.getUser();
    this.socket.on('refresh page', () => {
      this.getUser();
    })
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  getUser() {
    this.usersService.getUserById(this.user._id)
      .subscribe(data => {
        this.notifications = data.result.notifications.reverse();
      });
  }

  markNotification(notification) {
    this.usersService.markNotification(notification._id)
      .subscribe(data => {
        this.socket.emit('refresh', {});
      })
  }

  deleteNotification(notification) {
    this.usersService.markNotification(notification._id, true)
    .subscribe(data => {
      this.socket.emit('refresh', {});
    })
  }

}
