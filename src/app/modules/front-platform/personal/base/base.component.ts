import { CommonModule } from "@angular/common";
import {
    Component, OnInit, TemplateRef, ViewChild
} from "@angular/core";
import {
    FormBuilder, FormGroup, FormsModule, ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import moment from "moment";
import { lastValueFrom } from "rxjs";

import { UserRepositoryService } from "../../../../core/api/middleware/user/user-repository.service";
import { AddressEntity, DistrictEntity } from "../../../../core/models/entities/user/user-address-entity";
import { AddressOutputModelEntity } from "../../../../core/models/outputViewModels/user/user-address-output-model";
import { FormValidatorService } from "../../../../services/form-validator/form-validator.service";
import { DatePickerComponent } from "../../../../shared/base/component/date-picker/date-picker.component";
import { SweetAlertService } from "../../../../shared/base/component/sweet-alert/service/sweet-alert.service";
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
    @ViewChild("customTemplate") customTemplate!: TemplateRef<any>;

    /**
     * constructor
     * @param userRepositoryService UserRepositoryService
     * @param userStoreService UserStoreService
     * @param formValidatorService FormValidatorService
     * @param route ActivatedRoute
     * @param fb FormBuilder
     * @param sweetAlertService SweetAlertService
     */
    constructor(
        public userRepositoryService: UserRepositoryService,
        public userStoreService: UserStoreService,
        public formValidatorService: FormValidatorService,
        public route: ActivatedRoute,
        public fb: FormBuilder,
        public sweetAlertService: SweetAlertService
    ) {
        this.personalForm = this.fb.group({
            userNo: [""],
            name: ["", [Validators.required, Validators.maxLength(5)]],
            // email: [""],
            countyCode: [""],
            districtCode: [""],
            postalCode: [""],
            sexCode: ["001"],
            address: ["", [Validators.maxLength(50)]],
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

    isModifySuccess = true;

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
                this.isModifySuccess = res.result;

                if (this.isModifySuccess === true) {
                    this.userRepositoryService.getUserProfile();
                }

                this.sweetAlertService.open(this.customTemplate, {
                    icon: this.isModifySuccess ? "success" : "error"
                });
            });
        }
    }
}
