import { EventState } from './../../../../@core/models/eventmodels/enums.event';
import { IEvent } from './../../../../@core/models/eventmodels/event.model';
import { SafeUrl } from '@angular/platform-browser';
import { UtilsService } from './../../../../services/utils.service';

import { EventService } from './../../services/event.service';
import { mergeDatetTime } from './../../../../helpers/helpers';
import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { getBase64 } from 'src/app/helpers/helpers';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isPast, setHours, setMinutes } from 'date-fns';

import { Router, ActivatedRoute, Params } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';

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
    this.activateRoute.queryParams.subscribe((params) => {
      console.log(params);
    });
  }

  private listenRoutes(): void {
    this.activateRoute.queryParams.subscribe((params: Params) => {
      if ('edit' in params) {
        console.log('you want edit?');
      }
    });
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
    const statateEvent = Number(EventState[event.published]);
    if (Number(EventState[event.published]) !== Number(this.programEvent)) {
      this.programEvent = event.published;
      console.log('equals');
    }
    this.optionsPublished = this.optionsPublished.map((item) => {
      item.checked = item.checked =
        item.value === this.programEvent ? true : false;

      return item;
    });

    this.eventForm.patchValue({
      title: event.name + 'test',
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
      timeStart: this.fb.control(null, [Validators.required]),
      description: this.fb.control(null, [Validators.required]),
    });
  }

  //  control image
  actionServer = (info: any) => {
    const errors = [];
    getBase64(info.file, (image) => {
      const imagetest = new Image();
      imagetest.onload = () => {
        // validations image
        imagetest.width;
        if (imagetest.width <= 400) {
          errors.push('Esta image es muy pequña');
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

  // upload image on server
  private uploadImage(id: any) {
    this.eventService.uploadFile(this.fileForUpload, id).subscribe((res) => {
      //  build url image
      this.previewImage = this.utils.resolvePathImage(
        res.data.addCoverEvent.path
      );
    });
  }
  /** final load event nad prepare sesions */
  public saveEvent(): void {
    let event;
    try {
      event = this.validateEvent();
    } catch (error) {
      console.log('error');

      return;
    }
    if (!this.fileForUpload) {
      this.modal.error({
        nzTitle: 'Error',
        nzContent: 'El evento necesita una imagen',
      });
      return;
    }
    this.eventService.addEvent(event).subscribe((res) => {
      if (res.data.createEvent.resp) {
        this.setValuesOnFormEvent(res.data.createEvent.event);
        this.uploadImage(res.data.createEvent.event.id);
        // changue url
        this.router.navigate([], {
          queryParams: {
            edit: res.data.createEvent.event.id,
          },
        });
      }
    });
  }

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

    const startEvent = mergeDatetTime(
      eventFormValue.startEvent,
      eventFormValue.timeStart
    );
    const description = eventFormValue.description;
    // value config
    let programDate: Date = null;
    if (this.programEvent === EventState.PROGRAM) {
      // validate dates
      console.log(configValue);

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

      return;
    }
    return {
      name: title,
      startEvent: startEvent,
      description: description,
      publishedDate: programDate != null ? programDate : null,
      published: this.programEvent,
      includeComments: configValue.includeComment,
    } as IEvent;
  }
}
