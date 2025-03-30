import { ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { TicketRepositoryService } from "@app/core/api/middleware/ticket/ticket-repository.service";
import { SweetAlertService } from "@app/shared/base/component/sweet-alert/service/sweet-alert.service";
import { UserStoreService } from "@app/store/user/service/user-store.service";
import moment from "moment";
import { of, Subject } from "rxjs";

import { TmdbRepositoryService } from "../../../core/api/middleware/tmdb/tmdb-repository.service";
import { StopPropagationDirective } from "../../../shared/base/directives/stop-propagation/stop-propagation.directive";
import { SwiperDirective } from "../../../shared/base/directives/swiper/swiper.directive";
import { IssueTicketComponent } from "./issue-ticket.component";

const credits = {
    id: 912649,
    cast: [
        {
            adult: false,
            gender: 2,
            id: 1763709,
            known_for_department: "Acting",
            name: "亞倫·皮埃爾",
            original_name: "Aaron Pierre",
            popularity: 49.103,
            profile_path: "/hNwZWdT2KxKj1YLbipvtUhNjfAp.jpg",
            cast_id: 12,
            character: "Mufasa (voice)",
            credit_id: "61290e9ee8a3e100623cdc79",
            order: 0
        },
    ],
    crew: [
        {
            adult: false,
            gender: 2,
            id: 92784,
            known_for_department: "Directing",
            name: "Barry Jenkins",
            original_name: "Barry Jenkins",
            popularity: 9.317,
            profile_path: "/6nld5eQwiJmuLmyesk4EUeCaoo3.jpg",
            credit_id: "5fa9c38b1b7294003b96e62b",
            department: "Directing",
            job: "Director"
        }
    ]
};

const rate = {
    id: 912649,
    results: [
        {
            iso_3166_1: "US",
            release_dates: [
                {
                    certification: "PG",
                    descriptors: [],
                    iso_639_1: "",
                    note: "Los Angeles, California",
                    release_date: "2024-12-09T00:00:00.000Z",
                    type: 1
                },
            ]
        }
    ]
};

const detailMock = {
    adult: false,
    backdrop_path: "/oHPoF0Gzu8xwK4CtdXDaWdcuZxZ.jpg",
    belongs_to_collection: {
        id: 762512,
        name: "The Lion King (Reboot) Collection",
        poster_path: "/dGpIRn4Nqi63JO1RlKxjcPbQSAw.jpg",
        backdrop_path: "/jIgM7YNVft0YGeXsqrh3oG5TWLx.jpg"
    },
    budget: 200000000,
    genres: [
        {
            id: 12,
            name: "冒险"
        },
        {
            id: 10751,
            name: "家庭"
        },
        {
            id: 18,
            name: "剧情"
        },
        {
            id: 16,
            name: "动画"
        }
    ],
    homepage: "",
    id: 762509,
    imdb_id: "tt13186482",
    origin_country: [
        "US"
    ],
    original_language: "en",
    original_title: "Mufasa: The Lion King",
    overview: "123",
    popularity: 3139.872,
    poster_path: "/14XzKeHrKCjTIDUoct26Sbsh5T5.jpg",
    production_companies: [
        {
            id: 2,
            logo_path: "/wdrCwmRnLFJhEoH8GSfymY85KHT.png",
            name: "Walt Disney Pictures",
            origin_country: "US"
        }
    ],
    production_countries: [
        {
            iso_3166_1: "US",
            name: "United States of America"
        }
    ],
    release_date: "2024-12-18",
    revenue: 125644218,
    runtime: 118,
    spoken_languages: [
        {
            english_name: "English",
            iso_639_1: "en",
            name: "English"
        }
    ],
    status: "Released",
    tagline: "從孤兒 到異響 終成王",
    title: "獅子王：木法沙",
    video: false,
    vote_average: 7,
    vote_count: 193
};

describe("IssueTicketComponent", () => {
    let component: IssueTicketComponent;
    let fixture: ComponentFixture<IssueTicketComponent>;

    let swiperElement: SwiperDirective;
    let stopPropagationElement: StopPropagationDirective;

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

    const tmdbRepositoryService = jasmine.createSpyObj("TmdbRepositoryService", ["getMovieDetail", "getMovieDetailCredits", "getMovieDetailRate"]);
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

        tmdbRepositoryService.getMovieDetail.and.returnValue(of(detailMock));
        tmdbRepositoryService.getMovieDetailCredits.and.returnValue(of(credits));
        tmdbRepositoryService.getMovieDetailRate.and.returnValue(of(rate));

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
                { provide: UserStoreService, useValue: userStoreService }
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
