import {
    ComponentFixture, fakeAsync, TestBed, tick
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { ActivatedRoute, provideRouter } from "@angular/router";
import { TicketRepositoryService } from "@app/core/api/middleware/ticket/ticket-repository.service";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import { UserStoreService } from "@app/store/user/service/user-store.service";
import moment from "moment";
import { of, Subject } from "rxjs";

import { TmdbRepositoryService } from "../../../core/api/middleware/tmdb/tmdb-repository.service";
import { StopPropagationDirective } from "../../../shared/base/directives/stop-propagation/stop-propagation.directive";
import { SwiperDirective } from "../../../shared/base/directives/swiper/swiper.directive";
import { IssueTicketComponent } from "./issue-ticket.component";

describe("IssueTicketComponent", () => {
    let component: IssueTicketComponent;
    let fixture: ComponentFixture<IssueTicketComponent>;

    let swiperElement: SwiperDirective;
    let stopPropagationElement: StopPropagationDirective;

    const mergeDetailMock = {
        list: { genres: [{ name: "動作" }], title: "測試電影" },
        credits: {
            crew: [{ job: "Director", name: "導演A" }],
            cast: [
                { order: 1, name: "演員1" },
                { order: 2, name: "演員2" },
                { order: 3, name: "演員3" },
            ],
        },
        rate: {
            results: [{ iso_3166_1: "US", release_dates: [{ certification: "R" }] }],
        },
    };

    const sweetAlertServiceMock = {
        instance: {
            afterClose: new Subject()
        }
    };

    const ticketCategoryMock = [
        {
            categoryCode: "001",
            categoryName: "aaa",
            cost: 150
        },
        {
            categoryCode: "002",
            categoryName: "bbb",
            cost: 100
        }
    ];

    const ticketLanguageMock = [
        {
            categoryCode: "001",
            categoryName: "aaa"
        },
        {
            categoryCode: "002",
            categoryName: "bbb"
        }
    ];

    const selectSeatMock = [
        {
            column: 10,
            seat: 2
        },
        {
            column: 10,
            seat: 3
        }
    ];

    const tmdbRepositoryService = jasmine.createSpyObj("TmdbRepositoryService", ["getMovieMergeDetail"]);
    const ticketRepositoryService = jasmine.createSpyObj("TicketRepositoryService", [
        "getTicketCategory",
        "getTicketLanguage",
        "postSealTicket",
        "postSelectSeat"
    ]);
    const sweetAlertService = jasmine.createSpyObj("SweetAlertService", ["open"]);
    const userStoreService = jasmine.createSpyObj("UserStoreService", ["getUserData"]);

    beforeEach(() => {
        sweetAlertService.open.and.returnValue(sweetAlertServiceMock);

        tmdbRepositoryService.getMovieMergeDetail.and.returnValue(of(mergeDetailMock));

        ticketRepositoryService.getTicketCategory.and.returnValue(of({ result: ticketCategoryMock }));
        ticketRepositoryService.getTicketLanguage.and.returnValue(of({ result: ticketLanguageMock }));

        ticketRepositoryService.postSelectSeat.and.returnValue(of({ result: selectSeatMock }));

        sweetAlertService.open.calls.reset();
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [IssueTicketComponent],
            providers: [
                provideRouter([]),
                { provide: TmdbRepositoryService, useValue: tmdbRepositoryService },
                { provide: TicketRepositoryService, useValue: ticketRepositoryService },
                { provide: SweetAlertService, useValue: sweetAlertService },
                { provide: UserStoreService, useValue: userStoreService },
                {
                    provide: ActivatedRoute,
                    useValue: { snapshot: { params: { id: "123" } } },
                },
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(IssueTicketComponent);
        component = fixture.componentInstance;

        swiperElement = fixture.debugElement.query(By.directive(SwiperDirective)).injector.get(SwiperDirective);
        swiperElement.el = {
            nativeElement: {
                initialize: jasmine.createSpy("initialize")
            } as any
        };

        stopPropagationElement = fixture.debugElement.query(By.directive(StopPropagationDirective)).injector.get(StopPropagationDirective);
        stopPropagationElement.onClick = jasmine.createSpy("onClick");

        fixture.detectChanges();
    });

    it("建立元件", () => {
        expect(component).toBeTruthy();
    });

    it("取得電影合併資料", fakeAsync(() => {
        component.getMovieDetail();
        tick();

        expect(component.movieDetail.title).toBe("測試電影");
        expect(component.movieDetail.director).toBe("導演A");
        expect(component.movieDetail.cast).toBe("演員1、演員2、演員3");
        expect(component.movieDetail.rate).toBe("R");
        expect(component.movieDetail.rateImg).toBe("rating_18");
    }));

    it("取得電影票卷分類", () => {
        expect(component.ticketCategory).toEqual(ticketCategoryMock);
    });

    it("取得電影票卷語言", () => {
        expect(component.ticketLanguage).toEqual(ticketLanguageMock);
    });

    it("掛載swiper", () => {
        expect(swiperElement.el.nativeElement.initialize).toHaveBeenCalled();
    });

    it("連結事件是否被註銷", () => {
        stopPropagationElement.onClick(new Event("click"));

        expect(stopPropagationElement.onClick).toHaveBeenCalled();
    });

    it("選取座位", () => {
        component.selectSeat();

        expect(component.disableSeatSeat).toEqual(selectSeatMock);
        expect(component.isHiddenSelectSeat).toBe(false);
    });

    it("選擇票種", () => {
        component.selectTickCategory(2, 1);
        expect(component.ticketSelect.ticketCategory[1].count).toBe(2);
    });

    it("取得總票數", () => {
        component.selectTickCategory(2, 1);
        expect(component.tickCategoryCount).toBe(2);
    });

    it("選擇日期", () => {
        component.selectTicketDate("2025-11-05");

        expect(component.ticketSelect.date).toBe("2025-11-05");
        expect(component.ticketSelect.ticketLanguageCode).toBe("");
        expect(component.ticketSelect.ticketLanguageName).toBe("");
        expect(component.ticketSelect.time).toBe("");
        expect(component.isHiddenSelectSeat).toBeTrue();
        expect(component.ticketTime.every((item) => item.isDisable === false)).toBeTrue();
    });

    it("選擇時間", () => {
        const mockItem = { categoryCode: "001", categoryName: "English" };
        const mockTime = "10:00 AM";

        component.selectTicketTime(mockItem, mockTime);

        expect(component.ticketSelect.ticketLanguageCode).toBe("001");
        expect(component.ticketSelect.ticketLanguageName).toBe("English");
        expect(component.ticketSelect.time).toBe("10:00 AM");
        expect(component.ticketSelect.ticketCategory.every((x) => x.count === 0)).toBeTrue();
    });

    it("取得電影票卷上映時間", () => {
        expect(component.date.length).toBe(5);
        expect(component.date[0]).toBe(moment().format("YYYY-MM-DD"));
        expect(component.date[4]).toBe(moment().add(4, "d").format("YYYY-MM-DD"));
    });
});
