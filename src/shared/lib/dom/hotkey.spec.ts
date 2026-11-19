import { hotkey } from './hotkey';

function press(target: EventTarget, init: KeyboardEventInit): KeyboardEvent {
    const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(event);
    return event;
}

describe('hotkey', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('пропускает только нужную клавишу вне полей ввода и отменяет действие браузера', () => {
        const pressed: string[] = [];
        const subscription = hotkey(document, '/').subscribe((event) => pressed.push(event.key));
        const input = document.body.appendChild(document.createElement('input'));

        const slash = press(document.body, { key: '/' });
        const other = press(document.body, { key: 'a' });
        const inField = press(input, { key: '/' });
        const withCtrl = press(document.body, { key: '/', ctrlKey: true });
        subscription.unsubscribe();

        expect(pressed).toEqual(['/']);
        expect(slash.defaultPrevented).toBe(true);
        expect([other, inField, withCtrl].some((event) => event.defaultPrevented)).toBe(false);
    });

    it('после отписки обработчик снят', () => {
        hotkey(document, '/').subscribe().unsubscribe();

        expect(press(document.body, { key: '/' }).defaultPrevented).toBe(false);
    });
});
