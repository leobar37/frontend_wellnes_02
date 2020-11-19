import { AuthService } from './services/auth.service';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';

// providers
import { CONFIGAUTH, IconfigAuth, IdatConfigAuth } from './config';

const zorro = [
  NzFormModule,
  NzLayoutModule,
  GridModule,
  NzInputModule,
  NzButtonModule,
];

import { ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@angular/flex-layout';
import { SocialproviderComponent } from './components/socialprovider/socialprovider.component';

@NgModule({
  declarations: [RegisterComponent, LoginComponent, SocialproviderComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    AuthRoutingModule,
    zorro,
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: CONFIGAUTH, useValue: IdatConfigAuth }, AuthService],
})
export class AuthModule {
  constructor(libray: FaIconLibrary) {
    libray.addIcons(faFacebook, faGoogle);
  }
}
