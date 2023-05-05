import { inject, Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';

@Pipe({ name: 'test', standalone: true })
export class TestPipe implements PipeTransform {
  store = inject(Store);
  transform(s: number) {
    this.store.select('count');
    return s * 2;
  }
}
