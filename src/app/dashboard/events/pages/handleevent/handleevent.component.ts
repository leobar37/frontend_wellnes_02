import { IEvent } from 'src/app/@core/models/eventmodels/event.model';
import { EventState } from 'src/app/@core/models/eventmodels/enums.event';
import { EventService } from './../../services/event.service';
import { mergeDatetTime } from './../../../../helpers/helpers';
import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { getBase64 } from 'src/app/helpers/helpers';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { isPast, setHours, setMinutes } from 'date-fns';

import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-handleevent',
  templateUrl: './handleevent.component.html',
  styleUrls: ['../../events.component.scss'],
})
export class HandleeventComponent implements OnInit {
  public previewImage: string;
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
    private modal: NzModalService
  ) {}
  ngOnInit(): void {
    this.buildForm();
  }
  /**
   * upload file
   */
  publishedChangue(
    arr: {
      label: string;
      value: EventState;
      checked?: boolean;
    }[]
  ) {
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
  /** final load event nad prepare sesions */
  public saveEvent(): void {
    const event = this.validateEvent();
    if (!this.fileForUpload) {
      this.modal.error({
        nzTitle: 'Error',
        nzContent: 'El evento necesita una image',
      });
      return;
    }
    this.eventService.addEvent(event).subscribe((res) => {
      if (res.data.createEvent.resp) {
        this.uploadImage(res.data.createEvent.event.id);
      }
    });
  }

  private uploadImage(id: any) {
    this.eventService.uploadFile(this.fileForUpload, id).subscribe((res) => {
      console.log(res.data);
    });
  }

  private validateEvent(): IEvent {
    const configValue = this.configForm.value;
    if (this.eventForm.invalid) {
      return;
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
      programDate = mergeDatetTime(
        configValue.programDate,
        configValue.programTime
      );
      if (startEvent.getTime() > programDate.getTime()) {
        // la fecha de programacion no puede ser mayor a la fecha de inicio
        this.modal.error({
          nzTitle: 'ERROR',
          nzContent:
            'la fecha de programacion no puede ser mayor a la fecha de inicio',
        });

        return;
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
