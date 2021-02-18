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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/*=============================================
=            pipes            =
=============================================*/

import { ImageresolvePipe } from '@core/pipes/imageresolve.pipe';
import { ReferrealsComponent } from './pages/referreals/referreals.component';
import { ProfileComponent as ProfilePageComponent } from './pages/profile/profile.component';
import { NzTableModule } from 'ng-zorro-antd/table';
const zorro = [
  NzButtonModule,
  NzCardModule,
  NzInputModule,
  NzUploadModule,
  NzIconModule,
  NzDatePickerModule,
  NzTableModule,
];
const material = [MatFormFieldModule, MatInputModule];
@NgModule({
  declarations: [
    ProfileComponent,
    ImageresolvePipe,
    ReferrealsComponent,
    ProfilePageComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ProfileRoutingModule,
    ...zorro,
    FormsModule,
    ...material,
  ],
  providers: [
    ProfileService,
    JwtService,
    { provide: PROFILECONFIG, useValue: DEFAULTCONFIGPROFILE },
  ],
})
export class ProfileModule {}
