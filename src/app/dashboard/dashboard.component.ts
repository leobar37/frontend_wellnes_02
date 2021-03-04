import { StatusUserService } from './services/status-user.service';
import { JwtService } from './../services/jwt.service';
import { SidebarService, Imenu } from './services/sidebar.service';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from '@core/modules/alert/alert.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { ConfirmEmailService } from './services/confirm-email.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [ConfirmEmailService]
})
export class DashboardComponent implements OnInit, OnDestroy {
  collapsableWidth = 0;
  widthSidebar = '256px';
  isCollapsed = false;
  menu: Imenu[];
  mediaObserbable: Subscription;
  constructor(
    private media: MediaObserver,
    public sidebarSesvice: SidebarService,
    private alertService: AlertService,
    private jwtService: JwtService,
    private activateRoute: ActivatedRoute,
    private emailService: ConfirmEmailService,
    private router: Router,
    private statusUser: StatusUserService
  ) {
    this.menu = sidebarSesvice.getSidebar;
  }

  unsuscribe() {
    console.log('unsuscribe');

    this.statusUser.sub.unsubscribe();
  }
  ngOnInit(): void {
    this.sidebarChangue();
    this.prepareDashboardAlerts();
    this.listeRoutes();
  }

  private prepareDashboardAlerts(): void {
    const confirmEmail = () => {
      const user = this.jwtService.getUserOfToken();

      if (!user.comfirmed) {
        this.alertService.addAlert({
          message: 'Su email todavía no esta confirmado',
          description:
            'Necesita confirmar su email: Dispone de un dia o su cuenta puede ser cancelada, puede cambiar su email en su perfil',
          type: 'warning',
          icon: true,
          closable: true,
          id: 'emailconfirm'
        });
      }
    };
    confirmEmail();
  }
  private listeRoutes() {
    const user = this.jwtService.getUserOfToken();
    if (!user.comfirmed) {
      this.activateRoute.queryParams.subscribe((params: Params) => {
        if ('confirmation' in params) {
          this.emailService.confirmUser(params.confirmation).subscribe({
            next: () => {
              this.alertService.addAlert({
                id: 'emailconfirm',
                type: 'success',
                message: 'Su email ha sido confirmado',
                closable: true,
                icon: true
              });
              this.router.navigate([]);
            }
          });
        }
      });
    }
  }
  private sidebarChangue() {
    this.mediaObserbable = this.media
      .asObservable()
      .subscribe((data: MediaChange[]) => {
        const existMd = data.some(
          ({ mqAlias }) => mqAlias.toLocaleLowerCase() === 'gt-xs'
        );
        if (existMd) {
          this.collapsableWidth = 80;
          this.widthSidebar = '256px';
        } else {
          this.collapsableWidth = 0;
          this.widthSidebar = '180px';
        }
      });
  }
  ngOnDestroy(): void {
    this.mediaObserbable.unsubscribe();
  }
}
