import { Router } from '@angular/router';
import { SocialUser } from 'angularx-social-login';
import { Subscription, Subject } from 'rxjs';
import { IUser } from './../../@core/models/User';
import { AuthService } from './../services/auth.service';
import { MyCustomValidators } from './../../helpers/Validators';
import { CONFIGAUTH, IconfigAuth } from './../config';
import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import _ from 'lodash';
import { NzModalService } from 'ng-zorro-antd/modal';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../auth.styles.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  user: IUser;
  stylesForBackground = {
    backgroundImage: `url('${this.configAuth.imageForRegister}')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  } as CSSStyleDeclaration;
  subscriptionProvider: Subscription;
  private eventSignUp = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private _AUHtSERVICE: AuthService,
    @Inject(CONFIGAUTH) public configAuth: IconfigAuth,
    private modalZorro: NzModalService,
    private router: Router
  ) {}
  ngOnDestroy(): void {
    this.subscriptionProvider.unsubscribe();
  }

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
    this.subscriptionProvider = this.eventSignUp.subscribe((provider) => {
      this._AUHtSERVICE.signUp(this.user, provider).subscribe((data) => {
        if (data.resp) {
          this._AUHtSERVICE.saveToken(data.token);
          this.router.navigateByUrl('/dashboard');
        } else {
          this.modalZorro.error({
            nzTitle: 'ERROR',
            nzContent: data.errors.shift().message,
            nzOkText: 'De acuerdo',
          });
        }
      });
    });
  }

  eventOfProvider($event: SocialUser) {
    if (!$event.email) {
      this.modalZorro.error({
        nzTitle: 'Error',
        nzContent:
          'No puede registrarse con este proveedor por que no contiene un email',
        nzFooter: 'NOTA: puede registrarse con google',
        nzOkText: 'De acuerdo',
      });
      return;
    }
    this.user = {
      email: $event.email,
      name: $event.firstName,
      lastName: $event.lastName,
    };
    this.eventSignUp.next($event.provider.toLowerCase());
  }
  senForm(): void {
    if (this.registerForm.valid) {
      const value = this.registerForm.value as IUser;
      this.user = _.omit(value, ['repeatPassword']);
      this.eventSignUp.next('email');
    } else {
      console.log('form is invalid');
    }
  }
}
