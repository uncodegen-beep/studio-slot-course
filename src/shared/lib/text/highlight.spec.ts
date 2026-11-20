import { highlight } from './highlight';

describe('highlight', () => {
    it('без регистра, с сохранением исходных букв', () => {
        expect(highlight('Sound Garden', 'sou')).toEqual([
            { text: 'Sou', match: true },
            { text: 'nd Garden', match: false },
        ]);
    });

    it('все вхождения', () => {
        expect(highlight('banana', 'an').filter((part) => part.match)).toHaveLength(2);
    });

    it('пустой запрос и спецсимволы', () => {
        expect(highlight('Sound', ' ')).toEqual([{ text: 'Sound', match: false }]);
        expect(highlight('A.B', '.')).toEqual([
            { text: 'A', match: false },
            { text: '.', match: true },
            { text: 'B', match: false },
        ]);
    });
});
