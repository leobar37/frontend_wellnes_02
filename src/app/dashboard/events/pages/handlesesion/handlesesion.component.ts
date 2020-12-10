import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SafeUrl } from '@angular/platform-browser';
import { getBase64 } from 'src/app/helpers/helpers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { mergeDatetTime } from '@helpers/helpers';
import { UtilsService } from 'src/app/services/utils.service';
import { Isesion } from '@core/models/eventmodels/sesion.model';
import { of } from 'rxjs';
import { SesionService } from '../../services/sesion.service';
import { ActivatedRoute } from '@angular/router';

interface IformSesion {
  duration: number;
  linkRoom: string;
  startDateSesion: Date;
  startTimeSesion: Date;
  nameSesion: string;
  description: string;
}

@Component({
  selector: 'app-handlesesion',
  templateUrl: './handlesesion.component.html',
  styleUrls: ['../../events.component.scss'],
})
export class HandlesesionComponent implements OnInit {
  public formSesion: FormGroup;
  private fileForUpload: File;
  public previewImage: string | SafeUrl;
  private idEvent: number;
  sesions = Array(8)
    .fill(1)
    .map((_, i) => {
      return {
        name: `sesion ${i}`,
        time: new Date(),
      };
    });
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private modal: NzModalService,
    private activateRoute: ActivatedRoute,
    private sesionService: SesionService,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    this.buildForms();
    this.idEvent = this.activateRoute.snapshot.params['id'];
  }

  /*=============================================
 =            validations            =
 =============================================*/
  /*  */
  private validateFormSesion(): Isesion {
    if (!this.formSesion.valid) {
      throw new Error('Formulario invalido , revise los campos');
    }
    const valueForm = this.formSesion.value as IformSesion;
    let sesion = {
      nameSesion: valueForm.nameSesion,
      linkRoom: valueForm.linkRoom,
      duration: valueForm.duration,
      description: valueForm.description,
      startSesion: mergeDatetTime(
        valueForm.startDateSesion,
        valueForm.startTimeSesion
      ),
    } as Isesion;

    return sesion;
  }
  /** ad sesion */

  private addSesion(sesion: Isesion) {
    this.sesionService.addSesion(this.idEvent, sesion).subscribe((res) => {
      const response = res.data.addSesion;
      if (response && response.resp) {
        this.uploadImage(response.sesion.id);
      }
    });
  }
  private uploadImage(id: number) {
    if (this.fileForUpload)
      this.sesionService
        .uploadCover(this.fileForUpload, id)
        .subscribe((resp) => {
          if (resp.data.addCoverSesion.resp) {
            console.log('upload image :)');

            this.previewImage = this.utilsService.resolvePathImage(
              resp.data.addCoverSesion.path
            );
          }
        });
  }

  public actionsSesion(): void {
    console.log('actions');

    let sesion;
    try {
      sesion = this.validateFormSesion();
    } catch (error) {
      this.modal.error({
        nzTitle: 'Error',
        nzContent: error.message,
      });

      return;
    }
    console.log('here');
    this.addSesion(sesion);
    // create sesion
  }

  private buildForms(): void {
    this.formSesion = this.fb.group({
      duration: this.fb.control(null),
      linkRoom: this.fb.control(null, [Validators.required]),
      startDateSesion: this.fb.control(null, [Validators.required]),
      startTimeSesion: this.fb.control(null),
      nameSesion: this.fb.control('', [Validators.required]),
      description: this.fb.control('', [Validators.required]),
    });
  }

  /*=============================================
  =            helpers            =
  =============================================*/

  actionServer = (info: any) => {
    const errors = [];
    getBase64(info.file, (image) => {
      const imagetest = new Image();
      imagetest.onload = () => {
        imagetest.width;
        if (imagetest.width <= 400) {
          errors.push('Esta image es muy pequña');
        }
        const isJpgOrPng =
          info.file.type === 'image/jpeg' || info.file.type === 'image/png';

        if (!isJpgOrPng) {
          errors.push('Este tipo de archivo no esta permitido');
        }
        if (info.size / 1024 / 1024 > 5) {
          errors.push('Excedio las 5mb por archivo');
        }
        if (errors.length > 0) {
          this.msg.error(errors.pop());
        } else {
          this.fileForUpload = info.file;
          this.previewImage = image;
        }
      };
      imagetest.src = URL.createObjectURL(info.file);
    });
    return of(null);
  };
}
