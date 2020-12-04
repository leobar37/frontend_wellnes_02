import { IEvent } from './../../../../@core/models/eventmodels/event.model';
import { EventService } from './../../services/event.service';
import { mergeDatetTime } from './../../../../helpers/helpers';
import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { getBase64 } from 'src/app/helpers/helpers';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { setHours, setMinutes } from 'date-fns';
@Component({
  selector: 'app-handleevent',
  templateUrl: './handleevent.component.html',
  styleUrls: ['../../events.component.scss'],
})
export class HandleeventComponent implements OnInit {
  previewImage: string;
  eventForm: FormGroup;
  configForm: FormGroup;

  constructor(
    private msg: NzMessageService,
    private fb: FormBuilder,
    private eventService: EventService
  ) {}
  ngOnInit(): void {
    this.buildForm();
  }
  /**
   * upload file
   */
  buildForm(): void {
    this.configForm = this.fb.group({
      includeComment: this.fb.control(false),
      programEvent: this.fb.control(false),
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
          this.msg.success('en hora buena');
          this.previewImage = image;
        }
      };
      imagetest.src = URL.createObjectURL(info.file);
    });
    return of(null);
  };

  saveEvent(): void {
    console.log(this.eventForm.errors);
    console.log(this.eventForm.invalid);
    console.log(this.eventForm.value);

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
    const configValue = this.configForm.value;
    let programDate = null;
    if (configValue.programEvent) {
      programDate = mergeDatetTime(
        configValue.programDate,
        configValue.programTime
      );
    }

    this.eventService.addEvent({
      name: title,
      startEvent: startEvent,
      description: description,
      publishedDate: programDate != null ? programDate : null,
    } as IEvent);
  }
}
