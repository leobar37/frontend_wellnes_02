import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForms();
  }
  private buildForms(): void {
    this.formSesion = this.fb.group({
      duration: this.fb.control(null),
      linkRoom: this.fb.control(null, [Validators.required]),
      startDateSesion: this.fb.control(null, [Validators.required]),
      startTimeSesion: this.fb.control(null),
      nameSesion: this.fb.control(''),
      description: this.fb.control(''),
    });
  }
}
