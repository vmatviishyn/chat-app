import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string;
  showSpinner = false;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private tokenService: TokenService
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.showSpinner = true;
    this.authService.loginUser(this.loginForm.value)
      .subscribe(
        data => {
          this.tokenService.setToken(data.token);
          this.loginForm.reset();
          setTimeout(() => {
            this.router.navigate(['streams']);
          }, 2000);
        },
        error => {
          this.showSpinner = false;
          if (error.error.message) {
            this.errorMessage = error.error.message;
          }
        }
      )
  }
}
