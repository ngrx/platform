import { EntityMetadata } from '@ngrx/data';
import { Story } from './story';

export const storyEntityMetadata: EntityMetadata<Story> = {
  entityName: 'Story',
  selectId: (entity: Story): string => entity.storyId,
  sortComparer: (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
  filterFn: (entities, pattern) =>
    entities.filter(
      (entity) =>
        entity.title?.includes(pattern) || entity.title?.includes(pattern)
    ),
};
