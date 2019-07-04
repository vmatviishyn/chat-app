import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { UsersService } from 'src/app/services/users.service';
import { TokenService } from 'src/app/services/token.service';
import io from 'socket.io-client';

const URL = 'https://chat-ng-app.herokuapp.com/api/chatapp/upload-image';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  uploader: FileUploader = new FileUploader({
    url: URL,
    disableMultipart: true
  });
  selectedFile: any;
  user: any;
  images = [];

  socket: any;

  constructor(
    private userService: UsersService,
    private tokernService: TokenService
  ) { 
    this.socket = io('https://chat-ng-app.herokuapp.com');
  }

  ngOnInit() {
    this.user = this.tokernService.getPayload();
    this.getUser();
    this.socket.on('refresh page', () => {
      this.getUser();
    });
  }

  getUser() {
    this.userService.getUserById(this.user._id)
      .subscribe(data => {
        this.images = data.result.images;
      }, err => {
        console.log(err);
      });
  }

  onFileSelected(event) {
    const file: File = event[0];

    this.readAsBase64(file)
      .then(result => {
        this.selectedFile = result;
      })
      .catch(err => {
        console.log(err);
      });
  }

  upload() {
    if (this.selectedFile) {
      this.userService.addImage(this.selectedFile)
        .subscribe(data => {
          this.socket.emit('refresh', {});
          const filePath = <HTMLInputElement>document.getElementById('filePath');
          filePath.value = '';
        }, err => {
          console.log(err);
        });
    }
  }

  setProfileImage(image) {
    this.userService.setDefaultImage(image.imgId, image.imgVersion)
      .subscribe(data => {
        this.socket.emit('refresh', {});
      }, err => {
        console.log(err);
      });
  }

  readAsBase64(file): Promise<any> {
    const reader = new FileReader();
    const fileValue = new Promise((resolve, reject) => {
      reader.addEventListener('load', () => {
        resolve(reader.result);
      });

      reader.addEventListener('error', (event) => {
        reject(event);
      });

      reader.readAsDataURL(file);
    });
    
    return fileValue;
  }

}
