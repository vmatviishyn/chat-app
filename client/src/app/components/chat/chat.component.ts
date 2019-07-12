import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  online_users = [];

  constructor() { }

  online(event) {
    this.online_users = event;
  }

}
