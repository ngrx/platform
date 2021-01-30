import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  DeleteStoryDto,
  Stories,
  Story,
  UpdateStoryDto,
} from '../../state/story';

@Component({
  selector: 'ngrx-data-nestjs-minimal-boilerplate-kanban-board-ui',
  templateUrl: './board-ui.component.html',
  styleUrls: ['./board-ui.component.scss'],
})
export class BoardUiComponent {
  @Input() stories: Stories[] = [];

  @Output() add = new EventEmitter<Story>();

  @Output() delete = new EventEmitter<DeleteStoryDto>();

  @Output() update = new EventEmitter<UpdateStoryDto>();

  addNew(column: number, stories: Stories): void {
    // `as any` because of: https://github.com/ngrx/platform/pull/2899
    this.add.emit({
      order: stories.length,
      column,
      title: `Order ${stories.length} Column ${column}`,
      description: '',
    } as any);
  }

  dropStory(event: CdkDragDrop<Stories, Story>, column: number): void {
    this.update.emit({
      column,
      order: event.currentIndex,
      storyId: event.item.data.storyId,
    });
  }

  updateStory(story: Story, title: string): void {
    this.update.emit({
      storyId: story.storyId,
      title,
    });
  }
}
