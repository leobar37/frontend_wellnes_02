import { Isesion } from '@core/models/eventmodels/sesion.model';

import {
  Component,
  OnInit,
  Output,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { es } from 'date-fns/locale';

@Component({
  selector: 'app-list-sesions',
  templateUrl: './list-sesions.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListSesionsComponent implements OnInit, OnChanges {
  @Input() sesions: Isesion[];
  @Output() clickSesionEvent = new EventEmitter<number>();
  options = {
    locale: es,
    addSuffix: true,
  };
  public titlecard = '';
  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sesions']) {
      this.titlecard = `sesiones : ${this.sesions.length}`;
    }
  }

  ngOnInit(): void {}
  selectItem(id: number) {
    this.clickSesionEvent.emit(id);
  }
}
