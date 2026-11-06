import { TestBed } from "@angular/core/testing";

import { App } from "./app";

describe("App", () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [App],
        }).compileComponents();
    });

    it("создаётся и показывает название проекта", () => {
        const fixture = TestBed.createComponent(App);
        fixture.detectChanges();

        const title = (fixture.nativeElement as HTMLElement).querySelector(
            "h1",
        );
        expect(title?.textContent).toContain("StudioSlot");
    });
});
