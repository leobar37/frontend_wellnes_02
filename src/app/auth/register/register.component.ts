import { CONFIGAUTH, IconfigAuth } from './../config';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
    @Inject(CONFIGAUTH) public configAuth: IconfigAuth
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({});
  }
}
