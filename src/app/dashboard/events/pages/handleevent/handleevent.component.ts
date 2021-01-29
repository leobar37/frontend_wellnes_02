import { EventState } from '@core/models/eventmodels/enums.event';
import { IEvent } from '@core/models/eventmodels/event.model';
import { SafeUrl } from '@angular/platform-browser';
import { UtilsService } from '@services/utils.service';
import { EventService } from './../../services/event.service';
import { mergeDatetTime } from '@helpers/helpers';
import { Component, OnInit } from '@angular/core';
import { of, Subscription } from 'rxjs';
import { getBase64 } from 'src/app/helpers/helpers';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isPast } from 'date-fns';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import _, { partial } from 'lodash';
import { error } from 'protractor';

@Component({
  selector: 'app-handleevent',
  templateUrl: './handleevent.component.html',
  styleUrls: ['../../events.component.scss'],
})
export class HandleeventComponent implements OnInit {
  public previewImage: string | SafeUrl;
  public eventForm: FormGroup;
  public configForm: FormGroup;
  private fileForUpload: File;
  private currentEvent: IEvent;
  public editMode = false;
  private subs: Subscription[] = [];
  public optionsPublished: {
    label: string;
    value: EventState;
    checked?: boolean;
  }[] = [
    {
      label: 'borrador',
      value: EventState.DRAFT,
    },
    {
      label: 'publicar',
      value: EventState.PUBLIC,
    },
    {
      label: 'programar',
      value: EventState.PROGRAM,
    },
  ];
  public programEvent: EventState;

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private eventService: EventService,
    private modal: NzModalService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private utils: UtilsService
  ) {}
  ngOnInit(): void {
    this.buildForm();
    this.listenRoutes();
    this.activateRoute.queryParams.subscribe((params) => {});
  }

  private listenRoutes(): void {
    const subRoute = this.activateRoute.queryParams.subscribe(
      (params: Params) => {
        if ('edit' in params) {
          const idParam: number = params['edit'];
          this.editMode = true;
          if (!this.currentEvent) {
            this.getEvent(idParam);
          }
        }
      }
    );
    this.subs.push(subRoute);
  }

  public navigateSesions(): void {
    this.router.navigate([
      '/dashboard',
      'events',
      'sesion',
      this.currentEvent.id,
    ]);
  }

  /** validations */
  private validateEvent(): IEvent {
    const configValue = this.configForm.value;

    if (this.eventForm.invalid) {
      this.modal.error({
        nzTitle: 'Error',
        nzContent: 'Formulario invalido',
      });
      throw new Error();
    }
    // value event
    const eventFormValue = this.eventForm.value;
    const title = eventFormValue.title;
    const startEvent = eventFormValue.startEvent;
    const description = eventFormValue.description;
    // value config
    let programDate: Date = null;
    if (this.programEvent === EventState.PROGRAM) {
      if (configValue.programDate == null || configValue.programTime == null) {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: 'Por favor proporcione todos los campos',
        });
        throw new Error();
      }
      programDate = mergeDatetTime(
        configValue.programDate,
        configValue.programTime
      );
      if (startEvent.getTime() <= programDate.getTime()) {
        // la fecha de programacion no puede ser mayor a la fecha de inicio
        this.modal.error({
          nzTitle: 'ERROR',
          nzContent:
            'la fecha de programacion no puede ser mayor a la fecha de inicio',
        });

        throw new Error();
      }
    }
    // validate event
    if (isPast(startEvent)) {
      // el evento no puede ser pasado
      this.modal.error({
        nzTitle: 'ERROR',
        nzContent: 'No puede programar un evento en fecha pasada',
      });
      throw new Error();
    }

    return {
      ...this.currentEvent,
      name: title,
      startEvent: startEvent,
      description: description,
      publishedDate: programDate != null ? programDate : null,
      published: this.programEvent,
      includeComments: configValue.includeComment,
    } as IEvent;
  }

  /*=============================================
 =            CRUD            =
 =============================================*/

  /** final load event nad prepare sesions */
  public actionEvent(): void {
    let event;
    try {
      event = this.validateEvent();
    } catch (error) {
      return;
    }
    if (!this.previewImage) {
      this.modal.error({
        nzTitle: 'Error',
        nzContent: 'El evento necesita una imagen',
      });
      return;
    }

    if (!this.editMode) {
      this.saveEvent(event);
    } else {
      this.editEvent(this.currentEvent.id, event);
    }
  }
  private editEvent(id: number, event: IEvent) {
    const subEditEvent = this.eventService
      .editEvent(id, event)
      .subscribe((res) => {
        if (res.data.editEvent.resp) {
          this.currentEvent = res.data.editEvent.event;
          this.uploadImage(this.currentEvent.id);
          this.msg.success('El evento ha sido actualizado');
        }
      });

    this.subs.push(subEditEvent);
  }
  private saveEvent(event: IEvent): void {
    const subSaveEvent = this.eventService.addEvent(event).subscribe((res) => {
      if (res.data.createEvent.resp) {
        const evenResp = res.data.createEvent.event;
        this.setValuesOnFormEvent(evenResp);
        this.uploadImage(evenResp.id);
        // changue url
        this.msg.success('Evento creado satisfactioriamente');
        this.currentEvent = evenResp;
        this.editMode = true;
        this.router.navigate([], {
          queryParams: {
            edit: res.data.createEvent.event.id,
          },
        });
      }
    });
    this.subs.push(subSaveEvent);
  }

  private getEvent(id: number) {
    const subGetEvent = this.eventService.getEvent(id).subscribe((resp) => {
      if (resp.data.event != null) {
        console.log(resp.data.event);
        this.setValuesOnFormEvent(resp.data.event);
        this.currentEvent = resp.data.event;
      } else {
        this.modal.error({
          nzTitle: 'Error',
          nzContent: 'Este evento no ha sido encontrado',
        });
        this.router.navigateByUrl('/dashboard');
      }
    });
    this.subs.push(subGetEvent);
  }

  /**
   * upload file
   */

  /*=============================================
  =            helpers            =
  =============================================*/

  // checkbox
  public publishedChangue(
    arr: {
      label: string;
      value: EventState;
      checked?: boolean;
    }[]
  ): void {
    const val = arr.find(
      ({ checked, value }) =>
        checked && checked === true && this.programEvent !== value
    );
    if (!val) return;
    this.optionsPublished = this.optionsPublished.map((ite) => {
      ite.checked = ite.value === val.value ? true : false;
      return ite;
    });
    this.programEvent = val.value;
  }

  //  patch value in form
  private setValuesOnFormEvent(event: IEvent) {
    const statateEvent =
      typeof event.published == 'number'
        ? event.published
        : EventState[event.published];

    this.programEvent = Number(statateEvent);

    this.optionsPublished = this.optionsPublished.map((item) => {
      item.checked = item.checked =
        item.value === this.programEvent ? true : false;

      return item;
    });

    this.eventForm.patchValue({
      title: event.name,
      startEvent: new Date(event.startEvent),
      timeStart: new Date(event.startEvent),
      description: event.description,
    });

    this.configForm.patchValue({
      includeComment: event.includeComments,
      programDate:
        statateEvent == EventState.PROGRAM
          ? new Date(event.publishedDate)
          : null,
      programTime:
        statateEvent == EventState.PROGRAM
          ? new Date(event.publishedDate)
          : null,
    });

    if (!this.previewImage) {
      console.log(event.eventCover);

      this.previewImage = this.utils.resolvePathImage(
        event.eventCover as string
      );
    }
  }

  //  build form
  private buildForm(): void {
    this.configForm = this.fb.group({
      includeComment: this.fb.control(false),
      programDate: this.fb.control(null),
      programTime: this.fb.control(null),
    });
    this.eventForm = this.fb.group({
      title: this.fb.control('', [Validators.required]),
      startEvent: this.fb.control(null, [Validators.required]),
      // timeStart: this.fb.control(null, [Validators.required]),
      description: this.fb.control(null, [Validators.required]),
    });
  }

  //  control image
  actionServer = (info: any) => {
    const errors = [];
    // el formato de validacion debe serapararse en un archivo de configuracion
    const isJpgOrPng =
      info.file.type === 'image/jpeg' || info.file.type === 'image/png';
    if (!isJpgOrPng) {
      errors.push('Este tipo de archivo no esta permitido');
    }
    getBase64(info.file, (image) => {
      const imagetest = new Image();
      imagetest.onload = () => {
        // validations image
        imagetest.width;
        if (imagetest.height > 1200) {
          errors.push(
            `Tamaño no permitido ${imagetest.height} * ${imagetest.width} -> 1200 * 1200`
          );
        }
        if (imagetest.width <= 400) {
          errors.push('Esta image es muy pequeña');
        }

        if (info.size / 1024 / 1024 > 5) {
          errors.push('Excedio las 5mb por archivo');
        }
        if (errors.length == 0) {
          this.fileForUpload = info.file;
          this.previewImage = image;
        } else {
          this.msg.error(errors.pop());
        }
      };
      imagetest.src = URL.createObjectURL(info.file);
    });
    // launch errors
    if (errors.length > 0) {
      this.msg.error(errors.pop());
    }
    return of(null);
  };
  // upload image on server
  private uploadImage(id: any) {
    if (this.fileForUpload) {
      const subUpload = this.eventService
        .uploadFile(this.fileForUpload, id)
        .subscribe((res) => {
          //  build url image
          this.previewImage = this.utils.resolvePathImage(
            res.data.addCoverEvent.path
          );
        });

      this.subs.push(subUpload);
      return;
    }
  }
}
