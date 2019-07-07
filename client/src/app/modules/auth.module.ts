import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared.module';

import { LoginComponent } from '../components/login/login.component';
import { SignupComponent } from '../components/signup/signup.component';

import { AuthService } from '../services/auth.service';

@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
  ],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [
    LoginComponent,
    SignupComponent,
  ],
  providers: [
    AuthService,
  ]
})
export class AuthModule { }
