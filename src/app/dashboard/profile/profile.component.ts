import { ProfileService } from './services/profile.service';
import { IUser, examplesUser } from './../../@core/models/User';
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { getBase64 } from 'src/app/helpers/helpers';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit, OnChanges {
  user: IUser = examplesUser.shift();

  auxProfileImage: string;
  edit = false;
  config = {
    leftSide: '40%',
  };
  constructor(private profileService: ProfileService) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    console.log(this.user);
  }
  ngOnInit(): void {}
  public handleChange(info: { file: NzUploadFile }): void {
    getBase64(info.file!.originFileObj!, (img: string) => {
      // this.loading = false;
      this.auxProfileImage = img;
      // this.avatarUrl = img;
      this.profileService
        .uploadFile(info.file.originFileObj)
        .subscribe((data) => {
          console.log(data);
        });
    });
  }
  public editProfile(): void {
    this.edit = !this.edit;
    if (!this.edit) {
      console.log('save changues');
    }
  }
}
