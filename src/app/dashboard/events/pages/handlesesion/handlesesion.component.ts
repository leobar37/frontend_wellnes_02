import { QueryRef } from 'apollo-angular';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SafeUrl } from '@angular/platform-browser';
import { getBase64 } from 'src/app/helpers/helpers';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { mergeDatetTime, isValidValue } from '@helpers/helpers';
import { UtilsService } from 'src/app/services/utils.service';
import { Isesion } from '@core/models/eventmodels/sesion.model';
import { of, Subscription } from 'rxjs';
import { SesionService } from '../../services/sesion.service';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { getTimestamp } from '@helpers/helpers';
import { Router } from '@angular/router';
// helpers
import { getVideoPreviw } from '@helpers/helpers';
import { CloudinaryService } from '@core/modules/cloudinary/services/file.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { isNull } from 'lodash';

interface IformSesion {
  duration: number;
  linkRoom: string;
  startDateSesion: Date;
  startTimeSesion: Date;
  nameSesion: string;
  description: string;
}
interface IformConfigSesion {
  includeVideo: boolean;
  includeComments: boolean;
}
@Component({
  selector: 'app-handlesesion',
  templateUrl: './handlesesion.component.html',
  styleUrls: ['../../events.component.scss'],
})
export class HandlesesionComponent implements OnInit, OnChanges, OnDestroy {
  public formSesion: FormGroup;
  private fileForUpload: File;
  public previewImage: string | SafeUrl;
  private idEvent: number;
  public currentSesion: Isesion;
  public editMode = false;
  // recolecta las sunscripciones para el ngOndestroy
  private subs: Subscription[] = [];
  private refQueryGetSesion: QueryRef<{ sesion: Isesion }> = null;
  public sesions: Isesion[] = [];
  public formConfigSesion: FormGroup;
  public videosrc: string;
  private videoForUpload: File;

  public messageSpinner = 'Loading..';
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private modal: NzModalService,
    private activateRoute: ActivatedRoute,
    private sesionService: SesionService,
    private utilsService: UtilsService,
    private router: Router,
    private serviceCloudinary: CloudinaryService,
    private ngxSpinner: NgxSpinnerService
  ) {}
  ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnInit(): void {
    this.buildForms();
    this.idEvent = this.activateRoute.snapshot.params['id'];

    /** listen routes */
    this.listentRoutes();
    /**  gets sesions */
    this.getSesions(this.idEvent);
  }

  private listentRoutes(): void {
    const subNavigation = this.activateRoute.queryParams
      .pipe(
        switchMap((params) => {
          this.refQueryGetSesion = this.sesionService.getSesion();
          if ('edit' in params) {
            //  enabled edit mode
            /// fetch sesion
            const idSesion = Number(params.edit);
            // /** traer la sesion por primera vez */
            this.fetchSesion(idSesion);
          } else {
            this.resetValues();
          }
          return of(params);
        })
      )
      .subscribe();
    // add sub for cleanning
    this.subs.push(subNavigation);
  }

  /*=============================================
 =            validations            =
 =============================================*/
  /*  */
  private validateFormSesion(): Isesion {
    if (!this.previewImage) {
      throw new Error('La Sesion necesita una imagen');
    }
    if (!this.formSesion.valid) {
      throw new Error('Formulario invalido , revise los campos');
    }
    const valueForm = this.formSesion.value as IformSesion;
    const valueConfigSesion = this.formConfigSesion.value as IformConfigSesion;

    // validate values  of the form
    valueConfigSesion.includeComments = isNull(
      valueConfigSesion.includeComments
    )
      ? false
      : valueConfigSesion.includeComments;
    valueConfigSesion.includeVideo = isNull(valueConfigSesion.includeVideo)
      ? false
      : valueConfigSesion.includeVideo;

    let sesion = {
      nameSesion: valueForm.nameSesion,
      linkRoom: valueForm.linkRoom,
      duration: valueForm.duration,
      description: valueForm.description,
      startSesion: mergeDatetTime(
        valueForm.startDateSesion,
        valueForm.startTimeSesion
      ),
      includeComments: valueConfigSesion.includeComments,
    } as Isesion;

    return sesion;
  }
  /** ad sesion */

  /*=============================================
   =            operations sesion            =
   =============================================*/
  public actionsSesion(): void {
    let sesion: Isesion | null;
    try {
      sesion = this.validateFormSesion();
    } catch (error) {
      this.modal.error({
        nzTitle: 'Error',
        nzContent: error.message,
      });
      return;
    }

    const ctrlEvent = async () => {
      /**
       *  Si se envia un null en el video el backend debe editarlo
       * o si se envia una url diferente
       */
      /// validations for video
      if (!this.videoForUpload && !this.videosrc && this.getIncludeVideo) {
        this.modal.error({
          nzTitle: 'Error',
          nzContent:
            'No se ha incluido un video, debe desabilitar esta opción he incluir un link o solo agregue un video',
        });
        return;
      }
      this.ngxSpinner.show();
      if (this.videoForUpload && this.getIncludeVideo) {
        this.messageSpinner = 'Cargando video';
        this.ngxSpinner.show();
        const resp = await this.uploadVIdeo();
        this.videosrc = resp.secure_url;
        if (sesion !== null) {
          sesion.cloudinarySource = JSON.stringify(resp);
        }
      }
      if (!this.editMode) {
        this.addSesion(sesion);
      } else {
        console.log('it is get include video', this.getIncludeVideo);

        if (!this.getIncludeVideo) {
          sesion.video = 'delete';
        } else {
          sesion.linkRoom = null;
        }
        this.editSesion(this.currentSesion.id, sesion);
      }
    };
    ctrlEvent();
  }

  public deleteSesion() {
    this.sesionService.deleteSesion(this.currentSesion.id).then((result) => {});
  }
  private getSesions(idEvent: number): void {
    const sub = this.sesionService.getSesions(idEvent).subscribe((re) => {
      if (re.data && re.data.sesions.resp) {
        this.sesions = re.data.sesions.sesions;
      }
    });
    this.subs.push(sub);
  }

  private addSesion(sesion: Isesion) {
    this.messageSpinner = 'Guardando sesión';
    this.ngxSpinner.show();
    // loading
    const subAdd = this.sesionService
      .addSesion(this.idEvent, sesion)
      .subscribe((res) => {
        const response = res.data.addSesion;
        if (response && response.sesion) {
          this.currentSesion = response.sesion;
          this.uploadImage(response.sesion.id);
          this.setValuesInForm(this.currentSesion);
          // fill sesions
          this.sesions = response.sesions;
          this.editMode = true;
          // close loading
          this.ngxSpinner.hide();
          // build url params
          this.navigateSesionEdit(response.sesion.id);
        }
      });
    this.subs.push(subAdd);
  }
  private uploadImage(id: number) {
    // loading
    if (this.fileForUpload) {
      this.messageSpinner = 'Cargando imagen';
      this.ngxSpinner.show();
      const subUpload = this.sesionService
        .uploadCover(this.fileForUpload, id)
        .subscribe((resp) => {
          this.ngxSpinner.hide();
          if (resp.data.addCoverSesion.resp) {
            this.previewImage = this.utilsService.resolvePathImage(
              resp.data.addCoverSesion.path
            );
          }
        });
      this.subs.push(subUpload);
    }
  }

  private editSesion(id: number, sesion: Isesion) {
    this.messageSpinner = 'Editando sesión';
    this.ngxSpinner.show();
    const editSesionSub = this.sesionService
      .editSesion(id, sesion)
      .subscribe((resp) => {
        const data = resp.data.updateSesion;
        if (resp.data && data.resp) {
          this.sesions = data.sesions;
          this.setValuesInForm(data.sesion);
          this.msg.success('actualizado');
          // verify image
          // close loading
          this.ngxSpinner.hide();

          this.uploadImage(id);
        }
      });

    this.subs.push(editSesionSub);
  }

  private async fetchSesion(id: number) {
    if (this.refQueryGetSesion) {
      this.refQueryGetSesion.refetch({ idSesion: id }).then((resp) => {
        this.currentSesion = resp.data.sesion;
        this.setValuesInForm(this.currentSesion);
        this.editMode = true;
      });
    }
  }

  /*=============================================
=            GETS            =
=============================================*/

  public get getIncludeVideo() {
    return this.formConfigSesion.get('includeVideo').value;
  }

  /*=============================================
  =            form operations            =
  =============================================*/
  private setValuesInForm(sesion: Isesion) {
    this.formSesion.patchValue({
      duration: sesion.duration,
      linkRoom: sesion.linkRoom,
      startDateSesion: getTimestamp(sesion.startSesion),
      startTimeSesion: getTimestamp(sesion.startSesion),
      nameSesion: sesion.nameSesion,
      description: sesion.description,
    });
    this.formConfigSesion.patchValue({
      includeVideo: sesion.video?.length ? true : false,
      includeComments: sesion.includeComments,
    });
    // preview image
    if (!isValidValue(this.previewImage)) {
      if (isValidValue(sesion.sesionCover))
        this.previewImage = this.utilsService.resolvePathImage(
          sesion.sesionCover
        );
    }
    // preview video
    if (sesion.video?.length) {
      this.videosrc = sesion.video;
    }
  }
  private buildForms(): void {
    this.formSesion = this.fb.group({
      duration: this.fb.control(null),
      linkRoom: this.fb.control(null),
      startDateSesion: this.fb.control(null, [Validators.required]),
      startTimeSesion: this.fb.control(null, [Validators.required]),
      nameSesion: this.fb.control('', [Validators.required]),
      description: this.fb.control('', [Validators.required]),
    });
    this.formConfigSesion = this.fb.group({
      includeVideo: this.fb.control(false),
      includeComments: this.fb.control(false),
    });
  }

  /*=============================================
  =            events Dom            =
  =============================================*/

  public actionClickSesion(id: number) {
    this.previewImage = null;
    this.resetValues();
    this.navigateSesionEdit(id);
    if (!this.currentSesion) {
      this.fetchSesion(id);
    }
  }
  public newSesion(): void {
    console.log('new Sesion');
    this.router.navigate([], {
      queryParams: {
        edit: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  // video function
  selectVideo(video: File) {
    this.videoForUpload = video;
    getVideoPreviw(video, (videoString: string) => {
      this.videosrc = videoString;
    });
  }

  /*=============================================
=            cloudinary functions            =
=============================================*/
  private async uploadVIdeo() {
    const auth = await this.serviceCloudinary.getSignature();
    return this.serviceCloudinary.uploadFileCloudinary(
      this.videoForUpload,
      auth
    );
  }
  /*=============================================
  =            helpers            =
  =============================================*/
  private navigateSesionEdit(id: number): void {
    this.router.navigate([], {
      queryParams: {
        edit: id,
      },
    });
  }

  private resetValues() {
    // reset forms
    this.formConfigSesion.reset();
    this.formSesion.reset();
    this.previewImage = null;
    this.videosrc = null;
    this.fileForUpload = null;
    this.videoForUpload = null;
    this.editMode = false;
    this.currentSesion = null;
  }
  // verify validvalueimage

  get isValidValueImage() {
    return isValidValue(this.previewImage);
  }

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
