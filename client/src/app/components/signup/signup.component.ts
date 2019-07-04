import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
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
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.showSpinner = true;
    this.authService.signupUser(this.signupForm.value)
      .subscribe(
        data => {
          this.tokenService.setToken(data.token);
          this.signupForm.reset();
          setTimeout(() => {
            this.router.navigate(['streams']);
          }, 2000);
        },
        error => {
          this.showSpinner = false;
          if (error.error.msg) {
            this.errorMessage = error.error.msg[0].message;
          }
          if (error.error.message) {
            this.errorMessage = error.error.message;
          }
        }
      );
  }

}
