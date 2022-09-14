import {
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
} from '@ngrx/data';
import { select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { selectStories } from './story.selectors';
import { Story } from './story';

@Injectable({
  providedIn: 'root',
})
export class StoryDataService extends EntityCollectionServiceBase<Story> {
  groupedStories$ = this.entities$.pipe(select(selectStories));

  constructor(serviceElementsFactory: EntityCollectionServiceElementsFactory) {
    super('Story', serviceElementsFactory);
  }
}
