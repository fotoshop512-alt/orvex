export interface Book {
    id: number;
    title: string;
    level: 'A' | 'B' | 'C';
    pages: BookPage[];
    coverColor: string;
}

export interface BookPage {
    pageNumber: number;
    content: string;
}

export interface BookWord {
    word: string;
    turkish: string;
    bookId: number;
    pageNumber: number;
}
