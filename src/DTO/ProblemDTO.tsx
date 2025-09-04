export interface ProblemDTO{    
    type: 'essay' | 'multiple_choices';
    number: number;
    content: string;
    figure?: string | null;
    options?: string | null;
    correct_answer?: string | null;
    selected_answer?: string | null;
}

export class ProblemDTOClass implements ProblemDTO {
    constructor(
      public type: 'essay' | 'multiple_choices',
      public number: number,
      public content: string,
      public figure?: string | null,
      public options?: string | null,
      public correct_answer?: string | null,
      public selected_answer?: string | null
    ) {}
  }