import { IUser } from './../../@core/models/User';
import { AuthService } from './../services/auth.service';
import { MyCustomValidators } from './../../helpers/Validators';
import { CONFIGAUTH, IconfigAuth } from './../config';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.styles.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  stylesForBackground = {
    backgroundImage: `url('${this.configAuth.imageForRegister}')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  } as CSSStyleDeclaration;
  constructor(
    private fb: FormBuilder,
    private _AUHtSERVICE: AuthService,
    @Inject(CONFIGAUTH) public configAuth: IconfigAuth
  ) {}
  buildForm(): void {
    this.registerForm = this.fb.group({
      name: this.fb.control(null, [Validators.required]),
      lastName: this.fb.control(null, [Validators.required]),
      email: this.fb.control(null, [Validators.email]),
      password: this.fb.control(null, [
        MyCustomValidators.verifyPassword(),
        Validators.min(9),
      ]),
      repeatPassword: this.fb.control(null, [
        Validators.required,
        MyCustomValidators.identStrings.call(
          this,
          ['password', 'repeatPassword'],
          'registerForm'
        ),
      ]),
      phone: this.fb.control(null, [Validators.required]),
    });
  }
  ngOnInit(): void {
    this.buildForm();
  }
  senForm(): void {
    if (this.registerForm.valid) {
      const value = this.registerForm.value as IUser;
      const newValue = _.omit(value, ['repeatPassword']);
      this._AUHtSERVICE.signUp(newValue).subscribe((data) => {
        console.log(data.data);
        console.log(data.errors);
      });
    } else {
      console.log('form is invalid');
    }
  }
}
