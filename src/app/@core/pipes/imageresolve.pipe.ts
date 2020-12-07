import { UtilsService } from './../../services/utils.service';
import { isBase64 } from './../../helpers/helpers';
import { environment } from './../../../environments/environment';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Pipe({
  name: 'imageresolve',
})
export class ImageresolvePipe implements PipeTransform {
  constructor(private utils: UtilsService) {}
  transform(value: string): SafeUrl {
    return this.utils.resolvePathImage(value);
  }
}
