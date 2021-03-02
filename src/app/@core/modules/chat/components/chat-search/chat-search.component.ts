import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-chat-search',
  template: `
    <div class="chat-card-search">
      <mat-form-field appearance="legacy">
        <mat-label>Buscar</mat-label>
        <input
          matInput
          autocomplete="off"
          placeholder="Nombre del asesor, fecha "
        />
        <mat-icon matSuffix>search</mat-icon>
      </mat-form-field>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class ChatSearchComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
