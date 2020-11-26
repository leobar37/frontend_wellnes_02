import { PROFILECONFIG, DEFAULTCONFIGPROFILE } from './config';

import { JwtService } from './../../services/jwt.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProfileService } from './services/profile.service';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
/*=============================================
=            pipes            =
=============================================*/

import { ImageresolvePipe } from '../../@core/pipes/imageresolve.pipe';

const zorro = [
  NzButtonModule,
  NzCardModule,
  NzInputModule,
  NzUploadModule,
  NzIconModule,
  NzDatePickerModule,
];
@NgModule({
  declarations: [ProfileComponent, ImageresolvePipe],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ProfileRoutingModule,
    zorro,
    FormsModule,
  ],
  providers: [
    ProfileService,
    JwtService,
    { provide: PROFILECONFIG, useValue: DEFAULTCONFIGPROFILE },
  ],
})
export class ProfileModule {}
