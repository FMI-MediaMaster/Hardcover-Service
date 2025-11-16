import runMetadataTests, { Fields } from '@media-master/metadata-service-tests';
import { Express } from 'express';
import { describe } from 'vitest';
import app from '../src/app';

const server = app as Express;

describe('Controller', () => {
    const endpoint: string = '';
    const validMap: object = {
        'The brothers Karamazov': '212258',
        'Before the Coffee Gets Cold': '436167',
        'The Kite Runner': '71101',
    };
    const invalidMap: object = {
        'adasdasa': '-1',
        '': 'nothing',
        'nonExistentBook': 'nonExistentId',
    };
    const fieldsMap: Record<string, Fields> = {
        options: {
            id: { type: 'string', },
            title: { type: 'string' },
        },
        info: {
            title: { type: 'string' },
            subtitle: { type: 'string', empty: true },
            authors: { type: 'stringArray' },
            description: { type: 'string' },
            release_date: { type: 'string' },
            pages: { type: 'number' },
            rating: { type: 'number', empty: true },
            ratings_count: { type: 'number', empty: true },
            book_series: { type: 'string', empty: true },
            book_series_position: { type: 'number', empty: true },
            genres: { type: 'stringArray' },
            image: { type: 'object', empty: true },
        },
    };
    runMetadataTests(
        server,
        endpoint,
        { validMap, invalidMap, fieldsMap, type: 'book' }
    );
});

