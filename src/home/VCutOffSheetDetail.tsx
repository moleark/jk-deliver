import { VPage, List, LMR } from 'tonva-react';
import { CDeliver } from "../deliver/CDeliver";
import { ReturnGetCutOffMainMain, ReturnGetCutOffMainDetail } from "uq-app/uqs/JkDeliver";
import { CHome } from './CHome';

const SymbolSrcs: any[] = [
    { name: "LK", src: "GHS02.gif" },
    { name: "LM", src: "GSH04.gif" },
    { name: "LN", src: "GHS07.gif" },
    { name: "LO", src: "GHS03.gif" },
    { name: "LP", src: "GHS05.gif" },
    { name: "LQ", src: "GHS09.gif" },
    { name: "LR", src: "GHS01.gif" },
    { name: "LS", src: "GHS06.gif" },
    { name: "LT", src: "GHS08.gif" }
];

export class VCutOffSheetDetail extends VPage<CHome> {

    private main: any;
    private detail: any[];
    init(param: [any, any[]]) {
        let [main, detail] = param;
        this.main = main;
        this.detail = detail;
    }

    header() {
        let { id, no } = this.main;
        return '截单号：' + no
    }

    right() {
        return <div></div>
    }

    // 修改当前选中行颜色
    private onClickCutOffItem = (rowIndex: number) => {

        let cutOffItemListLiDiv = document.getElementById("cutOffItemListDiv").getElementsByTagName("ul")[0].getElementsByTagName("li");

        for (let index = 0; index < cutOffItemListLiDiv.length; index++) {
            if (index == rowIndex) {
                cutOffItemListLiDiv[index].getElementsByTagName("div")[0].style.backgroundColor = "#FFFF99";
            } else {
                cutOffItemListLiDiv[index].getElementsByTagName("div")[0].style.backgroundColor = "#FFFFFF";
            }
        }
    }

    private renderCutOffItem = (cutOffItem: any, index: number) => {

        let { expressLogisticsList } = this.controller;
        let { JkDeliver, JkProduct, JkCustomer, JkWarehouse } = this.controller.uqs;
        let { ProductX } = JkProduct;
        let PackX = ProductX.div('packx');
        let { Customer, Contact } = JkCustomer;
        let { ExpressLogistics } = JkWarehouse;

        let { deliverMain, trayNumber, contact, customer, apointCarrier, carrier, waybillNumber, deliverTime, deliverDetail,
            item, product, tallyShould, content, productExt } = cutOffItem;
        let pack = PackX.getObj(item);
        let right = <div></div>;
        let jsonContect = JSON.parse(content);
        let note = jsonContect.deliverNotes;

        let expressLogistics = <select className="form-control col-6 px-0 mx-0" defaultValue={carrier ? apointCarrier : 0} onChange={o => { alert(o.target.value); cutOffItem.carrier = o.target.value; }}>
            {expressLogisticsList.map((el: any) => {
                return <option value={el.id}>{el.name}</option>
            })}
        </select>

        let hazard: string = "";
        let symbol: any;
        if (productExt) {
            let jsonProductExt = JSON.parse(productExt);
            hazard = jsonProductExt.Hazard;
            symbol = SymbolSrcs.map((o: any, ind: number) => {
                if (hazard.indexOf(o.name) > -1) {
                    return <img key={ind} className="w-3c mr-1" src={"/image/security/" + o.src} alt="" />;
                }
                return '';
            });
        }

        return <LMR key={deliverDetail} right={right} onClick={() => this.onClickCutOffItem(index)} >
            <div className="py-1">

                <div className="row col-12 py-1">
                    <div className="col-6">
                        <label className="text-muted">产品: </label>
                        <span>{ProductX.tv(product)}</span>
                    </div>
                    <div className="col-6">
                        <label className="text-muted">包装: </label>
                        <span> {tvPackx(pack)}</span>
                    </div>
                </div>
                <div className="row col-12 py-1">
                    <div className="col-6">
                        <label className="text-muted">数量：</label>
                        <span><b>{tallyShould}</b></span>
                    </div>
                    <div className="col-6">
                        <label className="text-muted">危险标志：</label>
                        <span> {symbol}</span>
                    </div>
                </div>
                <div className="row col-12 py-1">
                    <div className="col-6 form-inline">
                        <label className="text-muted">发运方式：</label>
                        {expressLogistics}
                    </div>
                    <div className="col-6">
                        <label className="text-muted">保价：</label>
                        <span> { }</span>
                    </div>
                </div>
                <div className="row col-12 py-1">
                    <div className="col-6 form-inline">
                        <label className="text-muted">快递单号：</label >
                        <input type="text" className="form-control col-6 px-0 mx-0" onChange={o => cutOffItem.waybillNumber = o.target.value} defaultValue={waybillNumber} />
                    </div>
                    <div className="col-6">
                        <label className="text-muted">发运时间：</label>
                        <span >{deliverTime}</span>
                    </div>
                </div>
                <div className="row col-12 py-1">
                    <div className="col-12">
                        <label className="text-muted">备注：</label>
                        <span >{note}</span>
                    </div>
                </div>
            </div>
        </ LMR >;
        /*
         <div className="row col-12 py-1">
                    <span className="col-9">单位：{ } </span>
                    <span className="col-3">订货人：{Customer.tv(customer)}</span>
                </div>
                <div className="row col-12 py-1">
                    <span className="col-12">地址：{Contact.tv(contact)} </span>
                </div>
                <span className="col-6"> 收货人：{Contact.tv(contact)}</span>
        */
    }

    content() {
        return <div id="cutOffItemListDiv" className="px-1 py-1 bg-white">
            <List items={this.detail} item={{ render: this.renderCutOffItem }} none="无拣货数据" />
        </div>;
    }
}

const tvPackx = (values: any) => {
    let { radiox, radioy, unit } = values;
    if (radiox !== 1) return <>{radiox} * {radioy}{unit}</>;
    return <>{radioy}{unit}</>;
}