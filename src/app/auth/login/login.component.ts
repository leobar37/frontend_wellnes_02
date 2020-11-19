import { MyCustomValidators } from './../../helpers/Validators';
import { AuthService } from './../services/auth.service';
import { CONFIGAUTH, IconfigAuth } from './../config';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { FaIconLibrary} from '@fortawesome/angular-fontawesome'
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
interface ILoguin {
  email: string;
  password: string;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../auth.styles.scss'],
})
export class LoginComponent implements OnInit {
  formLogin: FormGroup;
  stylesForBackground = {
    backgroundImage: `url('${this.configAuth.imageForLogin}')`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
  } as CSSStyleDeclaration;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    @Inject(CONFIGAUTH) public configAuth: IconfigAuth,
    private _AUTHSERVICE: AuthService
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }
  buildForm(): void {
    this.formLogin = this.fb.group({
      email: this.fb.control(null, [Validators.email]),
      password: this.fb.control(null, [
        Validators.min(9),
        MyCustomValidators.verifyPassword(),
      ]),
    });
  }
  public submitForm(): void {
    if (this.formLogin.valid) {
      const valueForm = this.formLogin.value as ILoguin;
      this._AUTHSERVICE
        .sigIn(valueForm.email, valueForm.password)
        .pipe(take(1))
        .subscribe((data) => {
          this._AUTHSERVICE.saveToken(data.data['sigIn']);
          this.router.navigateByUrl('/dashboard');
        });
    }
  }
}
