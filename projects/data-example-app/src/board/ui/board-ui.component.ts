import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  CreateStoryDto,
  DeleteStoryDto,
  Stories,
  Story,
  UpdateStoryDto,
} from '../../state/story';

@Component({
  selector: 'ngrx-board-ui',
  templateUrl: './board-ui.component.html',
  styleUrls: ['./board-ui.component.scss'],
})
export class BoardUiComponent {
  @Input() stories: Stories[] = [];

  @Output() add = new EventEmitter<CreateStoryDto>();

  @Output() delete = new EventEmitter<DeleteStoryDto>();

  @Output() update = new EventEmitter<UpdateStoryDto>();

  addNew(column: number, stories: Stories): void {
    this.add.emit({
      order: stories.length,
      column,
      title: `Order ${stories.length} Column ${column}`,
      description: '',
    });
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
