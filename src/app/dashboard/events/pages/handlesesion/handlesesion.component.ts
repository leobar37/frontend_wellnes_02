import { EventState } from 'src/app/@core/models/eventmodels/enums.event';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-handlesesion',
  templateUrl: './handlesesion.component.html',
  styleUrls: ['../../events.component.scss'],
})
export class HandlesesionComponent implements OnInit {
  formSesion: FormGroup;

  sesions = Array(8)
    .fill(1)
    .map((_, i) => {
      return {
        name: `sesion ${i}`,
        time: new Date(),
      };
    });
  constructor(private fb: FormBuilder) {
    console.log(this.sesions);
  }

  ngOnInit(): void {
    this.formSesion = this.fb.group({});
  }
}
