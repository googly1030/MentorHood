export interface Author {
  id: string;
  name: string;
  image?: string;
  initials: string;
}

export interface Question {
  _id: string;
  title: string;
  content: string;
  authors: Author[];
  upvotes: number;
  answers: number;
  timestamp: string;
  category_id: string;
  created_at: string;
  updated_at: string;
}

export interface Answer {
  _id: string;
  content: string;
  author: Author;
  upvotes: number;
  created_at: string;
  updated_at: string;
  question_id: string;
}