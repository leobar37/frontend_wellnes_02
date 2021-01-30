import { Pipe, PipeTransform } from '@angular/core';
import { NgModule } from '@angular/core';
@Pipe({
  name: 'shortParagraph',
})
export class ShortParagraphPipe implements PipeTransform {
  transform(value: string, count: number): string {
    return value.substring(0, count ?? 150) + '...';
  }
}

@NgModule({
  declarations: [ShortParagraphPipe],
  exports: [ShortParagraphPipe],
})
export class PipeShortParagraphModule {}
