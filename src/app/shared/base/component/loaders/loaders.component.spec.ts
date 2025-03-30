import {
    ComponentFixture, fakeAsync, TestBed, tick
} from "@angular/core/testing";
import { LoaderService } from "@app/services/loader/loader.service";
import { BehaviorSubject } from "rxjs";

import { LoadersComponent } from "./loaders.component";

describe("LoadersComponent", () => {
    let component: LoadersComponent;
    let fixture: ComponentFixture<LoadersComponent>;
    let testSubject = new BehaviorSubject<boolean>(false);

    beforeEach(() => {
        testSubject = new BehaviorSubject<boolean>(false);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LoadersComponent],
            providers: [
                {
                    provide: LoaderService,
                    useValue: {
                        loading$: testSubject.asObservable()
                    }
                }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(LoadersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("監聽loading狀態true", () => {
        testSubject.next(true);
        component.isLoading.subscribe((value) => {
            expect(value).toBeTrue();
        });
    });

    it("監聽loading狀態false", fakeAsync(() => {
        testSubject.next(true);
        tick(500);
        testSubject.next(false);
        component.isLoading.subscribe((value) => {
            expect(value).toBeFalse();
        });
    }));
});
