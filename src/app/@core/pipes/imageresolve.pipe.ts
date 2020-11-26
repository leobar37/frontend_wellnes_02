import { isBase64 } from './../../helpers/helpers';
import { environment } from './../../../environments/environment';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Pipe({
  name: 'imageresolve',
})
export class ImageresolvePipe implements PipeTransform {
  constructor(public str: DomSanitizer) {}
  transform(value: string): SafeUrl {
    const url = this.str.bypassSecurityTrustUrl(
      `${environment.apiUrl}/${value}`
    );
    return url;
  }
}
