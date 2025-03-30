import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { DatePickerComponent } from "./date-picker.component";

describe("DatePickerComponent", () => {
    let component: DatePickerComponent;
    let fixture: ComponentFixture<DatePickerComponent>;
    const onChange = jasmine.createSpy("onChange");
    const onTouched = jasmine.createSpy("onTouched");

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DatePickerComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DatePickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    beforeEach(() => {
        onChange.calls.reset();
        onTouched.calls.reset();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("測試placeholder", () => {
        component.placeholder = "112234";
        fixture.detectChanges();
        const input = fixture.debugElement.query(By.css(".o-inputbox"));
        expect(input.nativeElement.placeholder).toBe("112234");
    });

    it("測試class .is-error", () => {
        component.isError = true;
        const input = fixture.debugElement.query(By.css(".o-inputbox"));
        fixture.detectChanges();
        expect(input.nativeElement.classList.contains("is-error")).toBeTrue();
    });

    it("測試ngmodal", () => {
        const input = fixture.debugElement.query(By.css(".o-inputbox"));
        input.nativeElement.value = "123";
        input.nativeElement.dispatchEvent(new Event("input"));
        fixture.detectChanges();

        expect(input.nativeElement.value).toBe("123");
    });

    it("測試write value", () => {
        component.writeValue("456");
        fixture.detectChanges();
        expect(component.value).toBe("456");
    });

    it("測試onChange", () => {
        component.registerOnChange(onChange);
        component.onChange("789");
        fixture.detectChanges();
        expect(onChange).toHaveBeenCalled();
    });

    it("測試onTouched", () => {
        component.registerOnTouched(onTouched);
        component.onTouched();
        fixture.detectChanges();
        expect(onTouched).toHaveBeenCalled();
    });
});
