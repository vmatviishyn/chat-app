import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/services/token.service';
import { UsersService } from 'src/app/services/users.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.css']
})
export class SideComponent implements OnInit {
  socket: any;
  user: any;
  userData: any;

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
    });
  }

  getUser() {
    this.usersService.getUserById(this.user._id)
      .subscribe(data => {
        this.userData = data.result;
      });
  }

}
