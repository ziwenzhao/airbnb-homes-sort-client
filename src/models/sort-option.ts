export class SortOption {
    label: SortOptionLable;
    value: SortValue;
}

export class SortValue {
    field: SortField;
    direction: SortDirection;
}

type SortOptionLable = 'Price' | 'Rating' | 'Reviews';

enum SortDirection {
    Asc,
    Des
}

enum SortField {
    Price,
    Rating,
    Reviews
}

export const defaultSortOptions: SortOption[] = [
    {
        label: 'Price',
        value: {
            field: SortField.Price,
            direction: SortDirection.Asc
        }
    },
    {
        label: 'Rating',
        value: {
            field: SortField.Rating,
            direction: SortDirection.Des
        }
    },
    {
        label: 'Reviews',
        value: {
            field: SortField.Reviews,
            direction: SortDirection.Des
        }
    },
];
