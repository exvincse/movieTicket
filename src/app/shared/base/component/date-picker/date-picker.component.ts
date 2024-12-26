import { CommonModule } from "@angular/common";
import {
    AfterViewInit,
    Component, ElementRef, EventEmitter, forwardRef, Input,
    Output,
    ViewChild
} from "@angular/core";
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from "@angular/forms";
import * as flatpickr from "flatpickr";
// eslint-disable-next-line import/extensions
import Chinese from "flatpickr/dist/l10n/zh-tw.js";
import { Instance } from "flatpickr/dist/types/instance";

/**
 * DatePickerComponent
 */
@Component({
    selector: "app-date-picker",
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: "./date-picker.component.html",
    styleUrl: "./date-picker.component.scss",
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => DatePickerComponent),
            multi: true,
        },
    ],
})
export class DatePickerComponent implements AfterViewInit {
    @ViewChild("datepicker") datepicker: ElementRef | undefined;
    @Output() touched = new EventEmitter<void>();
    @Input() placeholder = "";
    @Input() isError = false;
    value = "";

    bindEl: Instance | undefined;

    /**
     * ngOnInit
     */
    ngAfterViewInit(): void {
        if (this.datepicker) {
            this.bindEl = flatpickr.default(this.datepicker.nativeElement, {
                locale: Chinese.zh_tw,
                dateFormat: "Y-m-d",
                /**
                 * onChange
                 * @param selectedDates selectedDates
                 * @param dateStr dateStr
                 */
                onChange: (selectedDates: Date[], dateStr: string) => {
                    this.onChange(dateStr);
                    this.value = dateStr;
                }
            });
        }
    }

    /**
     * onChange
     */
    onChange: (value: string) => void = () => { };
    /**
     * onTouched
     */
    onTouched: () => void = () => { };

    /**
     * writeValue
     * @param value value
     */
    writeValue(value: string): void {
        this.value = value || "";
    }

    /**
     * registerOnChange
     * @param fn fn
     */
    registerOnChange(fn: (value: string) => void): void {
        this.onChange = fn;
    }

    /**
     * registerOnTouched
     * @param fn fn
     */
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
}
