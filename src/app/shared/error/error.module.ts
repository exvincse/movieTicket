import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InternetE403Component } from './internet-e403/internet-e403.component';
import { InternetE500Component } from './internet-e500/internet-e500.component';

/**
 * 錯誤狀態
 */
@NgModule({
    declarations: [
        InternetE403Component,
        InternetE500Component
    ],
    imports: [
        CommonModule
    ],
    exports: [
        InternetE403Component,
        InternetE500Component
    ]
})
export class ErrorModule { }
