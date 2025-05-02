export interface IWord {
  id: string;
  nameRO: string;
  nameEN: string;
  imageUrl: string | string[];
  audioUrl: string | string[];
}

export interface ILesson {
  id: string;
  nameRO: string;
  nameEN: string;
  videoUrl: string;
  words: IWord[];
}
