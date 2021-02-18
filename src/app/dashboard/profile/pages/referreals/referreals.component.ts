import { IUser } from '@core/models/User';
import { map, pluck, toArray, mergeMap, tap } from 'rxjs/operators';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-referreals',
  templateUrl: './referreals.component.html',
  styleUrls: ['../../profile.component.scss'],
  // encapsulation: ViewEncapsulation.None,
})
export class ReferrealsComponent implements OnInit {
  referreals: IUser[] = [];
  private recolectSubs = [];

  constructor(private profileSevice: ProfileService) {}

  ngOnInit(): void {
    this.adaptReferreals();
  }

  private adaptReferreals() {
    this.recolectSubs.push(
      this.profileSevice
        .getUser(null, 'referreals')
        .pipe(
          tap(() => (this.referreals = [])),
          pluck('data', 'getUser', 'user', 'referreals'),
          mergeMap(from),
          tap((el) => this.referreals.push(el))
        )
        .subscribe(() => {
          console.log(this.referreals);
        })
    );
  }
}
