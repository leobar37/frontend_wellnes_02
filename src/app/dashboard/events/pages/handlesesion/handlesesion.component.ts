import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-handlesesion',
  templateUrl: './handlesesion.component.html',
  styleUrls: ['../../events.component.scss'],
})
export class HandlesesionComponent implements OnInit {
  sesions = Array(8)
    .fill(1)
    .map((_, i) => {
      return {
        name: `sesion ${i}`,
        time: new Date(),
      };
    });
  constructor() {
    console.log(this.sesions);
  }

  ngOnInit(): void {}
}
