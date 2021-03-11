export interface Story {
  storyId: string;
  order: number;
  column: number;
  title: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export type Stories = Story[];

export type CreateStoryDto = Partial<Story>;

export type UpdateStoryDto = Required<Pick<Story, 'storyId'>> &
  Partial<Omit<Story, 'storyId'>>;

export type DeleteStoryDto = string;
