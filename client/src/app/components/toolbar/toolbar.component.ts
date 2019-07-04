import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import * as M from 'materialize-css';
import * as moment from 'moment';
import io from 'socket.io-client';
import _ from 'lodash';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, AfterViewInit {
  @Output() onlineUsers = new EventEmitter();
  user: any;
  notifications = [];
  socket: any;
  count = [];
  chatList = [];
  msgNumber = 0;
  imageId: any;
  imageVersion: any;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private usersService: UsersService,
    private messageService: MessageService
  ) {
    this.socket = io('https://chat-ng-app.herokuapp.com');
  }

  ngOnInit() {
    this.user = this.tokenService.getPayload();
    
    const dropdown = document.querySelectorAll('.dropdown-trigger');
    M.Dropdown.init(dropdown, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    const dropdownTwo = document.querySelectorAll('.dropdown-trigger1');
    M.Dropdown.init(dropdownTwo, {
      alignment: 'right',
      hover: true,
      coverTrigger: false
    });

    this.socket.emit('online', { 
      room: 'global', 
      user: this.user.username 
    });

    this.getUser();
    this.socket.on('refresh page', () => {
      this.getUser();
    });
  }

  ngAfterViewInit() {
    this.socket.on('users online', data => {
      this.onlineUsers.emit(data);
    });
  }

  getUser() {
    this.usersService.getUserById(this.user._id)
      .subscribe(data => {
        this.imageId = data.result.picId;
        this.imageVersion = data.result.picVersion;
        this.notifications = data.result.notifications.reverse();
        const value = _.filter(this.notifications, ['read', false]);
        this.count = value;
        this.chatList = data.result.chatList;
        this.checkIfRead(this.chatList);
      }, error => {
        if (error.error.token === null) {
          this.tokenService.deleteToken();
          this.router.navigate(['']);
        }
      });
  }

  checkIfRead(arr) {
    const checkArr = [];
    for (let i = 0; i < arr.length; i++) {
      const receiver = arr[i].msgId.message[arr[i].msgId.message.length - 1];
      if (this.router.url !== `/chat/${receiver.sendename}`) {
        if (receiver.isRead === false && receiver.receivername === this.user.username) {
          checkArr.push(1);
          this.msgNumber = _.sum(checkArr);
        }
      }
    }
  }

  markAll() {
    this.usersService.markAllNotificationAsRead()
      .subscribe(data => {
        console.log(data);
        this.socket.emit('refresh', {});
      });
  }

  logout() {
    this.tokenService.deleteToken();
    this.router.navigate(['/']);
  }

  goToHome() {
    this.router.navigate(['streams']);
  }

  goToChatPage(name) {
    this.router.navigate(['chat', name]);
    this.messageService.markMessages(this.user.username, name)
      .subscribe(data => {
        console.log(data);
        this.socket.emit('refersh', {});
      });
  }

  timeFromNow(time) {
    return moment(time).fromNow();
  }

  messageDate(data) {
    return moment(data).calendar(null, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: 'DD/MM/YYYY',
      sameElse: 'DD/MM/YYYY',
    });
  }

  markAllMessages() {
    this.messageService.markAllMessages()
      .subscribe(data => {
        this.socket.emit('refersh', {});
        this.msgNumber = 0;
      });
  }
}
