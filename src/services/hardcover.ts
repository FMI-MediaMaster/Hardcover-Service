import fetch from 'node-fetch';
import config from '@media-master/load-dotenv';
import errors from '@media-master/http-errors';
import {
    Query,
    BookOption,
    OptionsSearchResponse,
    ResponseBody,
    Hit,
    BookInfo,
    BookResult,
    InfoSearchResponse
} from '@types';

export default class HardcoverService {
    private readonly headers: Record<string, string>;

    constructor() {
        this.headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.HARDCOVER_ACCESS_TOKEN}`,
        };
    };

    private request = async <T>(query: string): Promise<T | undefined> => {
        const url = new URL('https://api.hardcover.app/v1/graphql');
        const response = await fetch(url, {
            method: 'POST',
            headers: this.headers,
            body: JSON.stringify({ 'query': query }),
        });

        if (!response.ok) return undefined;

        return ((await response.json() as ResponseBody)['data']) as T;
    };

    private mapSearchResult = (hit: Hit): BookOption => {
        const { document } = hit;
       
        return {
            id: document.id,
            title: document.title
        };
    };

    private getOptions = async (name: string): Promise<BookOption[]> => {
        const query = `
            query {
                search(
                    query: "${name}",
                    query_type: "book",
                    per_page: 30,
                    page: 1
                ) {
                    results
                }
            }
        `;

        const data = await this.request<OptionsSearchResponse>(query);
        return data?.search?.results?.hits?.map(this.mapSearchResult) ?? [];
    };

    private getBookById = async (id: string) => {
        const query = `
            query {
                books_by_pk(id: ${id}) {
                    id
                    title
                    subtitle
                    contributions {
                        author {
                            name
                        }
                    }
                    description
                    release_date
                    image {
                        height
                        width
                        ratio
                        url
                    }
                    pages
                    rating
                    ratings_count
                    book_series {
                        position
                        series {
                            name
                        }
                    }
                    taggings(
                        distinct_on: tag_id
                        where: {
                            tag: {
                                tag_category: {
                                    id: { _eq: 1 }
                                }
                            }
                        }
                    ) {
                        tag {
                            tag
                            tag_category {
                                category
                            }
                        }
                    }
                }
            }
        `

        const data = await this.request<InfoSearchResponse>(query);
        return data?.books_by_pk;
    }

    private getInfo = async (id: string): Promise<BookInfo> => {
        const book = await this.getBookById(id) as BookResult;
        if (!book?.id) throw errors.notFound('Book not found');

        return {
            title: book.title,
            subtitle: book.subtitle ?? '',
            authors: book.contributions?.map(c => c.author.name) ?? [],
            description: book.description,
            release_date: book.release_date,
            pages: book.pages,
            rating: book.rating,
            ratings_count: book.ratings_count,
            book_series: book.book_series?.[0]?.series?.name ?? '',
            book_series_position: book.book_series?.[0]?.position ?? 1,
            genres: book.taggings?.map(t => t.tag.tag.trim()) ?? [],
            image: book.image
        };
    };

    public handle = async (method: string, query: Query): Promise<unknown> => {
        const methodMap: Record<string, (param: string) => Promise<unknown>> = {
            options: this.getOptions,
            info: this.getInfo
        };

        if (!(method in methodMap)) {
            throw errors.notFound(
                'Invalid endpoint! Use /[options|info]'
            );
        }

        const param = query[method === 'options' ? 'name' : 'id'];
        if (param === undefined) throw errors.badRequest(`Missing parameter for the ${method} endpoint`);

        return await methodMap[method](param);
    };
};
