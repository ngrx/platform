import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'bcEllipsis' })
export class EllipsisPipe implements PipeTransform {
  transform(str: string, strLength: number = 250) {
    const withoutHtml = str.replace(/(<([^>]+)>)/ig, '');

    if (str.length >= strLength) {
      return `${withoutHtml.slice(0, strLength)}...`;
    }

    return withoutHtml;
  }
}
