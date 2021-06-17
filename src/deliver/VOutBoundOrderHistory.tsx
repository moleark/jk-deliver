import { observer } from 'mobx-react';
import * as React from 'react';
import { VPage, Page, List, FA, LMR, tv, EasyTime, EasyDate } from 'tonva-react';
import { COutBound } from "./COutBound";
//import { format, addHours } from 'date-fns';
import { VOutBoundOrderDetail } from "./VOutBoundOrderDetail";

export class VOutBoundOrderHistory extends VPage<COutBound> {

    outBoundOrderList: any;
    async open(outBoundOrderList: any) {

        this.outBoundOrderList = outBoundOrderList;
        this.openPage(this.page);
    }

    public openOutBoundOrderDetailVPage = async (outBoundOrderId: any) => {

        this.controller.openOutBoundOrderDetailPage(outBoundOrderId);
    }

    private renderOutBoundOrder = (outBoundOrder: any) => {

        let { openOutBoundOrderDetailPage } = this.controller;
        let { $id, id: outBoundOrderId, warehouse, operator, state, createTime } = outBoundOrder;

        //let converter: number | Date = addHours(createTime, 8);
        let isConfirm: string = (state == 0) ? '未确认' : '已确认';

        return <div className="row d-flex px-2 py-1">
            <div className="col-12">
                <div className="row">
                    <div className="col-5" onClick={() => openOutBoundOrderDetailPage(outBoundOrderId)}>出库单号：<strong>{outBoundOrderId}</strong></div>
                    <div className="col-4">{tv(warehouse, v => <>{v.name}</>)}</div>
                    <div className="col-3" onClick={() => undefined}>

                    </div>
                </div>
                <div className="row py-1">
                    <div className="col-5">{<EasyTime date={createTime} /> /* ormat(converter, 'yyyy-MM-dd HH:mm')*/}</div>
                    <div className="col-4">{tv(operator, v => <>{v.name}</>)}</div>
                    <div className="col-3 text-muted" >{isConfirm}</div>
                </div>
            </div>
        </div>
    };

    private page = observer(() => {

        let header = <header>
            <div className="px-0"><span>出库单列表</span></div>
        </header>

        let outBoundOrderLists = <List items={this.outBoundOrderList} item={{ render: this.renderOutBoundOrder }} none="无出库单数据" />;

        return <Page header={header} back="close">
            {outBoundOrderLists}
        </Page>
    });
}