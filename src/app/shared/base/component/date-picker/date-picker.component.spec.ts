import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { DatePickerComponent } from "./date-picker.component";

describe("DatePickerComponent", () => {
    let component: DatePickerComponent;
    let fixture: ComponentFixture<DatePickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DatePickerComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DatePickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
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
        const spy = jasmine.createSpy("onChange");
        component.registerOnChange(spy);
        component.onChange("789");
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    });

    it("測試onTouched", () => {
        const spy = jasmine.createSpy("onTouched");
        component.registerOnTouched(spy);
        component.onTouched();
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
    });

    // describe("Input properties", () => {
    //     it("should set placeholder", () => {
    //         const placeholder = "Select date";
    //         component.placeholder = placeholder;
    //         fixture.detectChanges();

    //         const input = fixture.debugElement.query(By.css("input"));
    //         expect(input.nativeElement.placeholder).toBe(placeholder);
    //     });

    //     it("should set error class", () => {
    //         component.isError = true;
    //         fixture.detectChanges();

    //         const input = fixture.debugElement.query(By.css("input"));
    //         expect(input.nativeElement.classList.contains("is-error")).toBeTrue();
    //     });
    // });

    // describe("Form Control implementation", () => {
    //     it("should implement writeValue", () => {
    //         const testValue = "2024-01-01";
    //         component.writeValue(testValue);
    //         expect(component.value).toBe(testValue);
    //     });

    //     it("should register onChange", () => {
    //         const spy = jasmine.createSpy("onChange");
    //         component.registerOnChange(spy);
    //         component.onChange("2024-01-01");
    //         expect(spy).toHaveBeenCalledWith("2024-01-01");
    //     });

    //     it("should register onTouched", () => {
    //         const spy = jasmine.createSpy("onTouched");
    //         component.registerOnTouched(spy);
    //         component.onTouched();
    //         expect(spy).toHaveBeenCalled();
    //     });
    // });

    // describe("NgModel binding", () => {
    //     it("should update value on input change", () => {
    //         const input = fixture.debugElement.query(By.css("input"));
    //         const testValue = "2024-01-01";

    //         input.nativeElement.value = testValue;
    //         input.nativeElement.dispatchEvent(new Event("input"));
    //         fixture.detectChanges();

    //         expect(component.value).toBe(testValue);
    //     });
    // });
});
