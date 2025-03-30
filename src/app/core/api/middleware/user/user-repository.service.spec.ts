import { TestBed } from "@angular/core/testing";
import { UserStoreService } from "@app/store/user/service/user-store.service";

import { RestfulApiService } from "../../restful/restful-api.service";
import { UserRepositoryService } from "./user-repository.service";

describe("UserRepositoryService", () => {
    let service: UserRepositoryService;
    const restfulApiService = jasmine.createSpyObj("RestfulApiService", ["get", "post", "put"]);
    const userStoreService = jasmine.createSpyObj("UserStoreService", ["setUserData"]);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: RestfulApiService, useValue: restfulApiService },
                { provide: UserStoreService, useValue: userStoreService }
            ]
        });
        service = TestBed.inject(UserRepositoryService);
    });

    it("建立service", () => {
        expect(service).toBeTruthy();
    });
});
