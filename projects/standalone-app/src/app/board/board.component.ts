import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StoryDataService } from './state/story-data.service';
import {
  CreateStoryDto,
  DeleteStoryDto,
  Stories,
  UpdateStoryDto,
} from './state/story';
import { CommonModule } from '@angular/common';
import { BoardUiComponent } from './ui/board-ui.component';

@Component({
  selector: 'ngrx-board-component',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
  standalone: true,
  imports: [CommonModule, BoardUiComponent],
})
export class BoardComponent implements OnInit {
  stories$: Observable<Stories[]> = this.storyDataService.groupedStories$;

  constructor(private storyDataService: StoryDataService) {}

  ngOnInit(): void {
    this.storyDataService.getAll();
  }

  add(story: CreateStoryDto): void {
    this.storyDataService.add(story, { isOptimistic: false });
  }

  update(story: UpdateStoryDto): void {
    this.storyDataService.update(story, { isOptimistic: true });
  }

  loadAll(): void {
    this.storyDataService.getAll();
  }

  delete(id: DeleteStoryDto): void {
    this.storyDataService.delete(id);
  }
}
