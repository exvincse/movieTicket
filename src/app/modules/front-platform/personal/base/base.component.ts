import { CommonModule } from "@angular/common";
import {
    Component, OnInit
} from "@angular/core";
import {
    FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,
    Validators
} from "@angular/forms";
import moment from "moment";
import { filter, lastValueFrom, tap } from "rxjs";

import { UserRepositoryService } from "../../../../core/api/middleware/user/user-repository.service";
import { AddressEntity, DistrictEntity } from "../../../../core/models/entities/user/user-address-entity";
import { AddressOutputModelEntity } from "../../../../core/models/outputViewModels/user/user-address-output-model";
import { FormValidatorService } from "../../../../services/form-validator/form-validator.service";
import { DatePickerComponent } from "../../../../shared/base/component/date-picker/date-picker.component";
import { TextAlertComponent } from "../../../../shared/base/component/sweet-alert/base-component/text-alert/text-alert.component";
import { SweetAlertService } from "../../../../shared/base/component/sweet-alert/service/sweet-alert.service";
import { StopPropagationDirective } from "../../../../shared/base/directives/stop-propagation/stop-propagation.directive";
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
     * @param fb FormBuilder
     * @param sweetAlertService SweetAlertService
     */
    constructor(
        public userRepositoryService: UserRepositoryService,
        public userStoreService: UserStoreService,
        public formValidatorService: FormValidatorService,
        public fb: FormBuilder,
        public sweetAlertService: SweetAlertService
    ) {
        this.personalForm = this.fb.group({
            userNo: "",
            name: ["", [Validators.required, Validators.maxLength(30)]],
            countyCode: "",
            districtCode: "",
            postalCode: "",
            sexCode: "001",
            address: ["", [Validators.maxLength(50)]],
            birthday: [moment().format("YYYY-MM-DD"), [this.formValidatorService.dateFormatValidator()]]
        });

        this.personalForm.get("postalCode")?.disable();

        this.personalForm.get("countyCode")?.valueChanges
            .pipe(
                filter((item) => item !== ""),
                tap((res) => {
                    this.district = this.loaction.find((item) => item.countyCode === res)?.district || [];

                    this.personalForm.patchValue({
                        district: "",
                        postalCode: ""
                    });
                })
            ).subscribe();

        this.personalForm.get("districtCode")?.valueChanges
            .pipe(
                filter((item) => item !== ""),
                tap((res) => {
                    const district = this.district.find((item) => item.districtCode === res);
                    if (district) {
                        this.personalForm.get("postalCode")?.setValue(district.postalCode);
                    }
                })
            )
            .subscribe();
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
        if (this.personalForm.valid === true) {
            const userData = this.personalForm.getRawValue();
            const params = {
                ...userData
            };

            this.userRepositoryService.putUserProfile(params).subscribe((res) => {
                if (res.result === true) {
                    this.userRepositoryService.getUserProfile();
                }

                this.sweetAlertService.open(TextAlertComponent, {
                    icon: res.result ? "success" : "error",
                    data: {
                        text: res.result ? "修改成功" : "修改失敗"
                    }
                });
            });
        }
    }
}
