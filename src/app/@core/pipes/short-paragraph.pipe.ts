import { Pipe, PipeTransform } from '@angular/core';
import { NgModule } from '@angular/core';
@Pipe({
  name: 'shortParagraph'
})
export class ShortParagraphPipe implements PipeTransform {
  transform(value: string, count: number): string {
    let points = true;
    let paragraphCount = 150;
    if (count) {
      points = !(value.length === count);
    } else {
      points = !(paragraphCount === value.length);
    }

    return value.substring(0, count ?? paragraphCount) + (points ? '...' : '');
  }
}

@NgModule({
  declarations: [ShortParagraphPipe],
  exports: [ShortParagraphPipe]
})
export class PipeShortParagraphModule {}
