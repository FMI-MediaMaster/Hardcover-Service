export interface Query {
    name?: string;
    id?: string;
};

export interface OptionsSearchResponse {
    search?: Search;
};

interface Search {
    results: Results;
};

interface Results {
    hits: Hit[];
};

export interface Hit {
    document: Document;
};

interface Document {
    id: string;
    title: string;
};

export interface BookOption {
    id: string;
    title: string;
};

export interface ResponseBody {
    data?: object;
};

export interface BookInfo {
    title?: string;
    subtitle?: string;
    authors: string[];
    description?: string;
    release_date?: string;
    pages?: number;
    rating?: number;
    ratings_count?: number;
    book_series?: string;
    book_series_position?: number;
    genres?: string[];
    image: Image;
}

interface Contribution {
    author: {
        name: string;
    };
};

interface Image {
    url: string;
    width: number;
    height: number;
    ratio: number;
};

interface BookSeries {
    position: number;
    series: {
        name: string;
    };
};

interface Tagging {
    tag: {
        tag: string;
        tag_category: {
            category: string;
        };
    };
};

export interface BookResult {
    id: string;
    title?: string;
    subtitle?: string;
    contributions?: Contribution[];
    description?: string;
    release_date?: string;
    pages?: number;
    rating?: number;
    ratings_count?: number;
    book_series?: BookSeries[];
    taggings?: Tagging[];
    image: Image;
};

export interface InfoSearchResponse {
    books_by_pk: BookResult;
};
