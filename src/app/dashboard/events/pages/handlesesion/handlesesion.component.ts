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
import { switchMap } from 'rxjs/operators';
import { getTimestamp } from '@helpers/helpers';
import { Router } from '@angular/router';
import { tr } from 'date-fns/locale';
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
export class HandlesesionComponent implements OnInit, OnChanges, OnDestroy {
  public formSesion: FormGroup;
  private fileForUpload: File;
  public previewImage: string | SafeUrl;
  private idEvent: number;
  public currentSesion: Isesion;
  public editMode = false;
  private subs: Subscription[] = [];
  private refQueryGetSesion: QueryRef<{ sesion: Isesion }> = null;
  public sesions: Isesion[] = [];
  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private modal: NzModalService,
    private activateRoute: ActivatedRoute,
    private sesionService: SesionService,
    private utilsService: UtilsService,
    private router: Router
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
            // this.refQueryGetSesion.result().then((resp) => {
            //   this.currentSesion = resp.data.sesion;
            //   this.setValuesInForm(this.currentSesion);
            //   this.editMode = true;
            // });

            return of(params);
          }
        })
      )
      .subscribe();

    // add sub for cleanning
    this.subs.push(subNavigation);
  }
  /** fetch sesion */

  // ve4rify params in url
  private verifyUrlInSesion() {
    const params = this.activateRoute.snapshot.queryParams;
    if ('edit' in params) {
      //  enabled edit mode
      // call sesions
      const idSesion = Number(params.edit);
      this.fetchSesion(idSesion);
    } else {
      this.buildForms();
      this.previewImage = null;
      this.editMode = false;
    }
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

  /*=============================================
   =            operations sesion            =
   =============================================*/

  public deleteSesion() {
    this.sesionService.deleteSesion(this.currentSesion.id).then((result) => {
      console.log('delete');

      console.log(result);
    });
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
          // build url params
          this.navigateSesionEdit(response.sesion.id);
        }
      });
    this.subs.push(subAdd);
  }
  private uploadImage(id: number) {
    if (this.fileForUpload) {
      const subUpload = this.sesionService
        .uploadCover(this.fileForUpload, id)
        .subscribe((resp) => {
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
    const editSesionSub = this.sesionService
      .editSesion(id, sesion)
      .subscribe((resp) => {
        const data = resp.data.updateSesion;
        if (resp.data && data.resp) {
          this.sesions = data.sesions;
          this.setValuesInForm(data.sesion);
          this.msg.success('actualizado');
          // verify image
          this.uploadImage(id);
        }
      });

    this.subs.push(editSesionSub);
  }

  public actionsSesion(): void {
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
    if (this.editMode) {
      this.editSesion(this.currentSesion.id, sesion);
    } else {
      this.addSesion(sesion);
    }
    // create sesion
  }
  private async fetchSesion(id: number) {
    console.log('fetch sesion', this.currentSesion);

    if (this.refQueryGetSesion) {
      this.refQueryGetSesion.refetch({ idSesion: id }).then((resp) => {
        this.currentSesion = resp.data.sesion;
        this.setValuesInForm(this.currentSesion);
        console.log('fetch sesion two', this.currentSesion);
        this.editMode = true;
      });
    }
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
    if (!isValidValue(this.previewImage)) {
      if (isValidValue(sesion.sesionCover))
        this.previewImage = this.utilsService.resolvePathImage(
          sesion.sesionCover
        );
    }
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
  =            events Dom            =
  =============================================*/

  public actionClickSesion(id: number) {
    this.previewImage = null;
    this.navigateSesionEdit(id);
    this.verifyUrlInSesion();
  }
  public newSesion(): void {
    this.router.navigate([], {
      queryParams: {
        edit: null,
      },
      queryParamsHandling: 'merge',
    });
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
