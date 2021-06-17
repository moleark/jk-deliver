import { observer } from 'mobx-react';
import { VPage, Page, List, tv } from 'tonva-react';
import { COutBound } from "./COutBound";
//import logo from 'images/logo.png';
//import printJS from 'print-js';
// import './printStyle/OffShelfList.css';
//import { autorun, observable } from 'mobx';
//import { values } from 'lodash';

export class VOutBoundOrderDetail extends VPage<COutBound> {

    outBoundOrderDetail: any[];
    outBoundOrderId: any;

    async open(outBoundOrderInfo: any) {

        this.outBoundOrderId = outBoundOrderInfo.outBoundOrderId;
        this.outBoundOrderDetail = outBoundOrderInfo.outBoundOrderInfo;
        this.openPage(this.page);
    }

    private renderOutBoundOrderDetail = (outBoundOrderDetail: any, index: number) => {

        let { $id, coaQuantity, consigneeAddress, consigneeMobile, consigneeName, consigneeTelphone, consigneeUnitName, consigneeZipcode, currency, expressLogistics,
            isAppointLot, isNeedDelivery, msdsQuantity, needInsuredWhenDelivery, outBoundOrder, outBoundReason, pack, product, purchaseBillQuantity, quantity,
            receiptQuantity, deliveryData, relationId, shelfBlock, showPriceWhenPrintReceipt, trayNumber, unitPrice, warehouse, deliveryNotes } = outBoundOrderDetail;

        let { setDeliveryNumber } = this.controller;

        return <div id="itemDetail" className="row d-flex px-1 py-1">

            <div className="col-12">
                <div className="row py-1">
                    <div className="col-3 text-muted pr-0">产品编号：</div>
                    <div className="col-4 pl-0"><strong>{tv(product, (values: any) => <>{values.origin}</>)}</strong></div>
                    <div className="col-2 text-muted pr-0">包装：</div>
                    <div className="col-3 pl-0"><strong>{tv(pack, (values: any) => <>{tvPackx(values)}</>)}</strong></div>
                </div>

                <div className="row py-1">
                    <div className="col-3 text-muted pr-0">收货人：</div>
                    <div className="col-4 pl-0"><strong>{consigneeName}</strong></div>
                    <div className="col-2 text-muted pr-0">数量：</div>
                    <div className="col-3 pl-0"><strong>{quantity}</strong></div>
                </div>

                <div className="row py-1">
                    <div className="col-3 text-muted pr-0">发运方式：</div>
                    <div className="col-9 pl-0"><strong>{tv(expressLogistics, (values: any) => <>{values.name}</>)}</strong></div>
                </div>
                <div className="row py-1">
                    <div className="col-3 text-muted pr-0">运单号：</div>
                    <div className="col-7 pl-0"><input type="text" onKeyUp={() => setDeliveryNumber(this.event, index)} className="form-control"></input></div>
                </div>

                <div className="row py-1">
                    {item('收货单位', consigneeUnitName)}
                </div>

                <div className="row py-1">
                    {item('收货地址', consigneeAddress)}
                </div>

                <div className="row py-1">
                    {item('随货资料', deliveryData)}
                </div>

                <div className="row py-1">
                    {item('发货备注', deliveryNotes)}
                </div>
            </div>
        </div>
    };

    private page = observer(() => {

        let header = <header>
            <div className="px-0"><span>出库单详情</span></div>
        </header>

        let outBoundOrderDetail = <div id="itemList">
            <List items={this.outBoundOrderDetail} item={{ render: this.renderOutBoundOrderDetail }} none="无出库单明细" />
        </div>

        let outBoundOrderInfo: any = { outBoundOrderId: this.outBoundOrderId, outBoundOrderDetailInfo: this.outBoundOrderDetail }
        let { openOffShelfListPage, openTallyListPage, openDeliveryListPage, openAccompanyingGoodsInfo, openDeliveryReceiptList, openNonDeliveryReceiptList } = this.controller;

        let footer = <div className="row d-block px-1">
            <div className="row col-12" >
                <div className="col-3 px-1">
                    <button type="button" className="w-100 btn btn-primary align-self-center px-1" onClick={() => openOffShelfListPage(outBoundOrderInfo)} >出库单</button>
                </div>
                <div className="col-3 px-1">
                    <button type="button" className="w-100 btn btn-primary align-self-center px-1" onClick={() => openTallyListPage(outBoundOrderInfo)} >理货单</button>
                </div>
                <div className="col-3 px-1">
                    <button type="button" className="w-100 btn btn-primary align-self-center px-1" onClick={() => openDeliveryListPage(outBoundOrderInfo)} >发货单</button>
                </div>
                <div className="col-3 px-1">
                    <button type="button" className="w-100 btn btn-primary align-self-center px-1" onClick={() => openAccompanyingGoodsInfo(outBoundOrderInfo)} >随货资料</button>
                </div>
            </div>
            <div className="row col-12" >
                <div className="col-6 px-1">
                    <button type="button" className="w-100 btn btn-primary align-self-center px-1" onClick={() => openDeliveryReceiptList(outBoundOrderInfo)}>送货服务回执</button>
                </div>
                <div className="col-6 px-1">
                    <button type="button" className="w-100 btn btn-primary align-self-center px-1" onClick={() => openNonDeliveryReceiptList(outBoundOrderInfo)}>非送货服务回执</button>
                </div>
            </div>
        </div >

        return <Page header={header} footer={footer}>
            <div id="outBoundOrderDetails" className="d-block">
                {outBoundOrderDetail}
            </div>
        </Page >
    });
}

const tvPackx = (values: any) => {
    let { radiox, radioy, unit } = values;
    if (radiox !== 1) return <>{radiox} * {radioy}{unit}</>;
    return <>{radioy}{unit}</>
}

function item(caption: string, value: any) {
    if (value === null || value === undefined) return null;
    return <>
        <div className="col-3 text-muted pr-0">{caption}：</div>
        <div className="col-9 pl-0"><strong>{value}</strong></div>
    </>
}