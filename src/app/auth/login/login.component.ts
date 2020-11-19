import { CONFIGAUTH, IconfigAuth } from './../config';
import { Component, Inject, OnInit } from '@angular/core';
import { StyleDefinition } from '@angular/flex-layout';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { FaIconLibrary} from '@fortawesome/angular-fontawesome'
import { Router } from '@angular/router';
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
    @Inject(CONFIGAUTH) public configAuth: IconfigAuth
  ) {
    this.formLogin = this.fb.group({});
  }

  ngOnInit(): void {}

  public submitForm(): void {
    this.router.navigateByUrl('/dashboard');
  }
}
