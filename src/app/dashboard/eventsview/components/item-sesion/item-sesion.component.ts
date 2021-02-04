import { Isesion } from '@core/models/eventmodels/sesion.model';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-item-sesion',
  template: ` <mat-card fxLayout class="item_sesion">
    <div fxFlex="70%">
      <h3 class="title  text-capitalize">
        {{ sesion.nameSesion }}
      </h3>
      <p class="paragraph">
        {{ sesion.description | shortParagraph: 80 }}
      </p>
      <button nz-button nzType="primary" (click)="clickItem()">ver</button>
    </div>
    <div class="side_right" fxFlex="15%" fxLayout fxLayoutAlign="end center">
      <span> {{ sesion.startSesion | date }} </span>
    </div>
  </mat-card>`,
  styleUrls: ['./item-sesion.component.scss'],
})
export class ItemSesionComponent implements OnInit {
  @Input('sesion') sesion: Isesion;
  @Output() readonly selectItem = new EventEmitter<Isesion>();
  constructor() {}
  ngOnInit(): void {}
  public clickItem() {
    this.selectItem.emit(this.sesion);
  }
}
