export interface TextPart {
    readonly text: string;
    readonly match: boolean;
}

/**
 * Делит текст на части: совпадения с запросом и всё остальное — для подсветки через <mark>.
 * Без регистра, все вхождения. Регулярные выражения не нужны: спецсимволы запроса не ломают поиск
 */
export function highlight(text: string, query: string): readonly TextPart[] {
    const needle = query.trim().toLowerCase();
    if (!needle) {
        return [{ text, match: false }];
    }
    const haystack = text.toLowerCase();
    const parts: TextPart[] = [];
    let from = 0;
    for (let at = haystack.indexOf(needle); at !== -1; at = haystack.indexOf(needle, from)) {
        if (at > from) {
            parts.push({ text: text.slice(from, at), match: false });
        }
        parts.push({ text: text.slice(at, at + needle.length), match: true });
        from = at + needle.length;
    }
    if (from < text.length) {
        parts.push({ text: text.slice(from), match: false });
    }
    return parts;
}
