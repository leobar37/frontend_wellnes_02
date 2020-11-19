import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-socialprovider',
  template: `
    <div class="contain_social_method">
      <h3 class="text-lowercase">Ingresa con una red social:</h3>
      <div class="icons">
        <a>
          <i class="fab fa-facebook-f"></i>
        </a>

        <a>
          <i class="fab fa-google"></i>
        </a>
      </div>
    </div>
  `,
  styleUrls: ['../../auth.styles.scss'],
})
export class SocialproviderComponent implements OnInit {
  constructor() {
    console.log('load component');
  }
  ngOnInit(): void {}
}
