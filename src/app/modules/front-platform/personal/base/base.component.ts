import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
    FormBuilder, FormGroup, FormsModule, ReactiveFormsModule
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import moment from "moment";
import { lastValueFrom } from "rxjs";

import { UserRepositoryService } from "../../../../core/api/middleware/user/user-repository.service";
import { AddressEntity, DistrictEntity } from "../../../../core/models/entities/user/user-address-entity";
import { AddressOutputModelEntity } from "../../../../core/models/outputViewModels/user/user-address-output-model";
import { FormValidatorService } from "../../../../services/form-validator/form-validator.service";
import { DatePickerComponent } from "../../../../shared/base/component/date-picker/date-picker.component";
import { StopPropagationDirective } from "../../../../shared/base/directives/stopPropagation/stop-propagation-directive.directive";
import { UserStoreService } from "../../../../store/user/service/user-store.service";

/**
 * BaseComponent
 */
@Component({
    selector: "app-base",
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        StopPropagationDirective,
        DatePickerComponent
    ],
    templateUrl: "./base.component.html",
    styleUrl: "./base.component.scss"
})
export class BaseComponent implements OnInit {
    /**
     * constructor
     * @param userRepositoryService UserRepositoryService
     * @param userStoreService UserStoreService
     * @param formValidatorService FormValidatorService
     * @param route ActivatedRoute
     * @param fb FormBuilder
     */
    constructor(
        public userRepositoryService: UserRepositoryService,
        public userStoreService: UserStoreService,
        public formValidatorService: FormValidatorService,
        public route: ActivatedRoute,
        public fb: FormBuilder
    ) {
        this.personalForm = this.fb.group({
            userNo: [""],
            name: [""],
            email: [""],
            countyCode: [""],
            districtCode: [""],
            postalCode: [""],
            sexCode: ["001"],
            address: [""],
            birthday: [moment().format("YYYY-MM-DD"), [this.formValidatorService.dateFormatValidator()]]
        });

        this.personalForm.get("postalCode")?.disable();

        this.personalForm.get("countyCode")?.valueChanges.subscribe((res) => {
            if (res !== "") {
                this.district = this.loaction.find((item) => item.countyCode === res)?.district || [];

                this.personalForm.patchValue({
                    district: [""],
                    postalCode: [""]
                });
            }
        });

        this.personalForm.get("districtCode")?.valueChanges.subscribe((res) => {
            if (res !== "") {
                const district = this.district.find((item) => item.districtCode === res);
                if (district) {
                    this.personalForm.get("postalCode")?.setValue(district.postalCode);
                }
            }
        });
    }

    loaction: AddressEntity[] = [];

    district: DistrictEntity[] = [];

    personalForm: FormGroup;

    /**
     * ngOnInit
     */
    async ngOnInit() {
        await this.getLocation();

        this.userStoreService.getUserData().subscribe((res) => {
            this.personalForm.patchValue({
                ...res,
                birthday: moment(res?.birthday).format("YYYY-MM-DD")
            });
        });
    }

    /**
     * 取得縣市鄉鎮
     */
    async getLocation() {
        this.loaction = (await lastValueFrom(this.userRepositoryService.getLocation<AddressOutputModelEntity>())).result || [];
    }

    /**
     * 送出修改後資料
     */
    putUserData() {
        const userData = this.personalForm.getRawValue();
        const params = {
            ...userData
        };

        this.userRepositoryService.putUserProfile(params).subscribe((res) => {
            console.log(res);
        });
    }
}
