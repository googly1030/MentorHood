export interface Author {
  id: string;
  name: string;
  image?: string;
  initials: string;
}

export interface Question {
  id: string;
  title: string;
  content: string;
  authors: Author[];
  upvotes: number;
  answers: number;
  timestamp: string;
  categoryId: string;
}

export interface Answer {
  id: string;
  content: string;
  author: Author;
  upvotes: number;
  timestamp: string;
  questionId: string;
}