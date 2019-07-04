import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASEURL = 'https://chat-ng-app.herokuapp.com/api/chatapp';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<any> {
    return this.http.get(`${BASEURL}/users`);
  };

  getUserById(id): Observable<any> {
    return this.http.get(`${BASEURL}/user/${id}`);
  };

  getUserByName(username): Observable<any> {
    return this.http.get(`${BASEURL}/username/${username}`);
  };

  followUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/follow-user`, { userFollowed });
  }

  unfollowUser(userFollowed): Observable<any> {
    return this.http.post(`${BASEURL}/unfollow-user`, { userFollowed });
  }

  markNotification(id, deleteValue?): Observable<any> {
    return this.http.post(`${BASEURL}/mark/${id}`, { id, deleteValue });
  }

  markAllNotificationAsRead(): Observable<any> {
    return this.http.post(`${BASEURL}/mark-all`, { all: true });
  }

  addImage(image): Observable<any> {
    return this.http.post(`${BASEURL}/upload-image`, {
      image
    });
  }

  setDefaultImage(imageId, imageVesrion): Observable<any> {
    return this.http.get(`${BASEURL}/set-default-image/${imageId}/${imageVesrion}`);
  };

  profileNotifications(id): Observable<any> {
    return this.http.post(`${BASEURL}/user/view-profile`, { id });
  }

  changePassword(body): Observable<any> {
    return this.http.post(`${BASEURL}/change-password`, body);
  }
}
