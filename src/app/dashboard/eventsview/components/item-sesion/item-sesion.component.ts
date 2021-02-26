import { Isesion } from '@core/models/eventmodels/sesion.model';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
// <mat-card
// fxLayout
// *ngIf="sesion?.sesionCover"
// class="item_sesion"
// >
// <div fxFlex="70%">
//   <img [src]="sesion.sesionCover | resolveUrl" />
//   <h3 class="title  text-capitalize">
//     {{ sesion.nameSesion }}
//   </h3>
//   <p class="paragraph">
//     {{ sesion.description | shortParagraph: 80 }}
//   </p>
//   <button nz-button nzType="primary" (click)="clickItem()">ver</button>
// </div>
// <div class="side_right" fxFlex="15%" fxLayout fxLayoutAlign="end center">
//   <span> {{ sesion.startSesion | date }} </span>
// </div>
// </mat-card>
@Component({
  selector: 'app-item-sesion',
  template: `
    <div fxLayout class="container_sesion_item">
      <img [alt]="" [src]="sesion.sesionCover | resolveUrl" />
    </div>
  `,
  styleUrls: ['./item-sesion.component.scss'],
})
export class ItemSesionComponent implements OnInit {
  private source: Isesion;
  @Input('sesion') set sesion(ev: Isesion) {
    console.log(ev.sesionCover);
    ev.nameSesion;
    this.source = ev;
  }
  get sesion() {
    return this.source;
  }

  @Output() readonly selectItem = new EventEmitter<Isesion>();
  constructor() {
    // this.sesion.sesionCover;
  }
  ngOnInit(): void {}
  public clickItem() {
    this.selectItem.emit(this.sesion);
  }
}
