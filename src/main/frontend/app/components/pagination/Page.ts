export interface Page<T> {
    content: T[],
    pageNumber: number,
    last: boolean,
    totalPages: number,
    totalElements: number,
    first: true,
    size: number,
    number: number,
    numberOfElements: number,
    empty: boolean
}

export const DefaultPage: Page<unknown> = {
    content: [],
    pageNumber: 0,
    last: false,
    totalPages: 0,
    totalElements: 0,
    first: true,
    size: 20,
    number: 0,
    numberOfElements: 0,
    empty: true
}