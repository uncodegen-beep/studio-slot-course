import { DestroyRef, inject } from '@angular/core';

/**
 * setInterval, который сам остановится вместе с компонентом, директивой или сервисом.
 * Вызывать в контексте внедрения: в конструкторе или инициализаторе поля
 */
export function useInterval(callback: () => void, ms: number): void {
    const id = setInterval(callback, ms);
    inject(DestroyRef).onDestroy(() => clearInterval(id));
}
