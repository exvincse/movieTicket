import { TestBed } from "@angular/core/testing";
import { TicketOrderMumberInputModel } from "@app/core/models/inputViewModels/ticket/ticket-order-number-input.model";
import { TicketPersonalListLnputModel } from "@app/core/models/inputViewModels/ticket/ticket-personal-list-input.model";
import { TickSealSeatInputModel } from "@app/core/models/inputViewModels/ticket/ticket-seal-seat-input.model";
import { BaseApiOutputModel } from "@app/core/models/outputViewModels/base/base-api-output-model";
import { PaypalOrderOutputModel } from "@app/core/models/outputViewModels/paypal/paypal-order-output.model";
import { TicketLanguageOutputModelEntity } from "@app/core/models/outputViewModels/ticket/ticket-language-output-model";
import { TicketPersonalOutputModelEntity } from "@app/core/models/outputViewModels/ticket/ticket-presonal-list-output.model";
import { TicketSeatOutputModelEntity } from "@app/core/models/outputViewModels/ticket/ticket-seat-output.model";
import { of } from "rxjs";

import { RestfulApiService } from "../../restful/restful-api.service";
import { TicketRepositoryService } from "./ticket-repository.service";

describe("TicketRepositoryService", () => {
    let service: TicketRepositoryService;
    const restfulApiService = jasmine.createSpyObj("RestfulApiService", ["get", "post"]);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                TicketRepositoryService,
                { provide: RestfulApiService, useValue: restfulApiService }
            ]
        });

        service = TestBed.inject(TicketRepositoryService);
    });

    it("取得電影票卷分類", () => {
        const mockResponse = {
            statusCode: 200,
            message: "",
            result: [
                {
                    categoryCode: "123",
                    categoryName: "123",
                    cost: 150
                }
            ]
        };

        restfulApiService.get.and.returnValue(of(mockResponse));

        service.getTicketCategory().subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("取得電影票卷語言", () => {
        const mockResponse: TicketLanguageOutputModelEntity = {
            statusCode: 200,
            message: "",
            result: [
                {
                    categoryCode: "123",
                    categoryName: "123"
                }
            ]
        };

        restfulApiService.get.and.returnValue(of(mockResponse));

        service.getTicketLanguage().subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("取得已選座位", () => {
        const param = {
            movieId: 123456,
            movieTicketDateTime: "2025-11-04T11:30",
            ticketLanguageCode: "001"
        };

        const mockResponse: TicketSeatOutputModelEntity = {
            statusCode: 200,
            message: "",
            result: [
                {
                    column: 10,
                    seat: 2
                }
            ]
        };

        restfulApiService.post.and.returnValue(of(mockResponse));

        service.postSelectSeat(param).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("送出已選座位", () => {
        const mockParam: TickSealSeatInputModel = {
            movieId: 123,
            movieName: "123",
            ticketDateTime: "2025-11-07T11:40",
            ticketLanguageCode: "001",
            ticketLanguageName: "123",
            ticketCategory: [
                {
                    column: 12,
                    seat: 4
                }
            ],
            totalCost: 150
        };
        const mockResponse: BaseApiOutputModel<string | boolean> = {
            statusCode: 200,
            message: "",
            result: true
        };

        restfulApiService.post.and.returnValue(of(mockResponse));

        service.postSealTicket(mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("取得個人電影票列表", () => {
        const mockParam: TicketPersonalListLnputModel = {
            userNo: 101,
            pageIndex: 1,
            pageSize: 10
        };
        const mockResponse: TicketPersonalOutputModelEntity = {
            statusCode: 200,
            message: "",
            result: {
                totalPage: 101,
                pageIndex: 1,
                pageSize: 10,
                result: [
                    {
                        movieName: "123",
                        ticketDate: "123",
                        ticketLanguageName: "123",
                        ticketPersonalItem: [
                            {
                                ticketCategoryName: "123",
                                ticketColumn: 10,
                                ticketSeat: 4,
                                ticketMoney: 150
                            }
                        ],
                        ticketStatusName: "123",
                        ticketStatusId: 1,
                        createOrderId: "123",
                    }
                ]
            }
        };

        restfulApiService.get.and.returnValue(of(mockResponse));

        service.getPersonalTicketList(mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("取得paypal訂單連結", () => {
        const mockParam: TicketOrderMumberInputModel = {
            orderId: "123456"
        };
        const mockResponse: BaseApiOutputModel<string> = {
            statusCode: 200,
            message: "",
            result: "xxxx"
        };

        restfulApiService.get.and.returnValue(of(mockResponse));

        service.getOrderLink(mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });

    it("取得paypal訂單資料", () => {
        const mockParam: TicketOrderMumberInputModel = {
            orderId: "123456"
        };
        const mockResponse: BaseApiOutputModel<PaypalOrderOutputModel> = {
            statusCode: 200,
            message: "",
            result: {
                orderId: "xxxx",
                createTime: "2025-11-04T11:40",
                status: "xxxx",
                link: "xxxx",
                amount: "xxxx"
            }
        };

        restfulApiService.get.and.returnValue(of(mockResponse));

        service.getOrderDetail(mockParam).subscribe((res) => {
            expect(res).toEqual(mockResponse);
        });
    });
});
