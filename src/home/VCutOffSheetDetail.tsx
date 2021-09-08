import { VPage, List, LMR, FA, DropdownAction, DropdownActions } from 'tonva-react';
import { CDeliver } from "../deliver/CDeliver";
import { ReturnGetCutOffMainMain, ReturnGetCutOffMainDetail } from "uq-app/uqs/JkDeliver";
import { CHome } from './CHome';
import { VReceiptList } from '../deliver/VReceiptList';

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
        let { no } = this.main;
        return '截单号：' + no
    }

    private pringJingDong = async () => {
        alert('打印京东');
    }
    private pringYunDa = async () => {
        alert('打印韵达');
    }
    private pringZhaiJiSong = async () => {
        alert('打印宅急送');
    }
    private pringShunFeng = async () => {
        alert('打印顺丰');
    }
    private receiptList = async () => {

        let trayNumberListInfo: any[] = [];
        let arrId: any[] = [];
        let cutOffDetail: any[] = this.detail;

        // 把数据源根据临时理货号（托盘号）去重复，因为发货单是;
        for (let index = 0; index < cutOffDetail.length; index++) {
            if (arrId.indexOf(cutOffDetail[index]['trayNumber']) == -1 && cutOffDetail[index]['apointCarrier'] != 10) {

                let trayProductList: any[] = [];
                let trayProductCount: number = 0;
                let trayProductPrice: number = 0.00;

                for (let indexB = 0; indexB < cutOffDetail.length; indexB++) {
                    if (cutOffDetail[indexB]['trayNumber'] == cutOffDetail[index]['trayNumber']) {
                        trayProductList.push(cutOffDetail[indexB]);

                        trayProductCount += cutOffDetail[indexB]['tallyShould'];
                        trayProductPrice += cutOffDetail[indexB]['tallyShould'] * cutOffDetail[indexB]['price'];
                    }
                }
                arrId.push(cutOffDetail[index]['trayNumber']);
                trayNumberListInfo.push({
                    trayNumber: cutOffDetail[index]['trayNumber'], customer: cutOffDetail[index]['customer'],
                    contact: cutOffDetail[index]['contact'], deliverMain: cutOffDetail[index]['delivermain'], deliverDetail: cutOffDetail[index]['deliverDetail'],
                    trayProductCount: trayProductCount, trayProductPrice: trayProductPrice, trayProductList: trayProductList
                });
            }
        }
        let { openDeliveryReceiptList } = this.controller;
        await openDeliveryReceiptList(this.main, trayNumberListInfo);
    }

    right() {
        let { id } = this.main;
        let actions: DropdownAction[] = [
            {
                icon: 'print',
                caption: '京东',
                action: this.pringJingDong
            }, {
                icon: 'print',
                caption: '韵达',
                action: this.pringYunDa
            }, {
                icon: 'print',
                caption: '宅急送',
                action: this.pringZhaiJiSong
            }, {
                icon: 'print',
                caption: '顺丰',
                action: this.pringShunFeng
            }, {
                icon: 'print',
                caption: '回执单',
                action: this.receiptList
            }
        ];
        return <DropdownActions className="align-self-center mr-2 bg-transparent border-0 text-light" icon="tasks" actions={actions} />;
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

        let note: string = '';
        if (content) {
            let jsonContect = JSON.parse(content);
            note = jsonContect.deliverNotes;
        }

        let expressLogistics = <select className="form-control col-8 px-0 mx-0" defaultValue={carrier == undefined ? apointCarrier : 0} onChange={o => { alert(o.target.value); cutOffItem.carrier = o.target.value; }}>
            {expressLogisticsList.map((el: any) => {
                return <option value={el.id}>{el.name}</option>
            })}
        </select>

        let hazard: string = '';
        let symbol: any;
        if (productExt) {
            let jsonProductExt = JSON.parse(productExt);
            hazard = jsonProductExt.Hazard;
            symbol = SymbolSrcs.map((o: any, ind: number) => {
                if (hazard.indexOf(o.name) > -1) {
                    return <img key={ind} className="w-3c pr-1 d-block" src={"/image/security/" + o.src} alt="危险标识" />;
                }
                return '';
            });
        }

        let left = <div className="px-1 py-1">{index + 1}</div>;
        let right = <div className="m-auto">
            <div className="py-1 text-left">{symbol}</div>
            <div className="py-1 text-left">
                <div><button className="btn btn-primary btn-sm py-1" onClick={e => alert('打印')}>打印</button></div>
                <div><button className="btn btn-primary btn-sm my-1" onClick={e => alert('发运')}>发运</button></div>
            </div>
        </div>;

        return <LMR key={deliverDetail} left={left} right={right} onClick={() => this.onClickCutOffItem(index)}>

            <div className="row col-12 py-1 pr-0">
                <div className="col-5 pr-0">
                    <label className="text-muted">编号： </label>
                    <span>{ProductX.tv(product)}</span>
                </div>
                <div className="col-4 pr-0">
                    <label className="text-muted">包装： </label>
                    <span> {tvPackx(pack)}</span>
                </div>
                <div className="col-3 pl-0 pr-0">
                    <label className="text-muted">数量： </label>
                    {tallyShould}
                </div>
            </div>
            <div className="row col-12 py-1 pr-0">
                <div className="col-9 form-inline pr-0">
                    <label className="text-muted">承运商：</label>
                    {expressLogistics}
                </div>
                <div className="col-3 pl-0 pr-0">
                    <label className="text-muted">保价：</label>
                    <span> {'?'}</span>
                </div>
            </div>
            <div className="row col-12 py-1 pr-0">
                <div className="col-9 form-inline pr-0">
                    <label className="text-muted">运单号：</label >
                    <input type="text" className="form-control col-8 px-0 mx-0"
                        onKeyUp={o => {
                            if (o.key === 'Enter') {
                                cutOffItem.waybillNumber = (o.target as HTMLInputElement).value;
                                alert((o.target as HTMLInputElement).value)
                            }
                        }} defaultValue={waybillNumber} />
                </div>
                <div className="col-3 pl-0 pr-0 form-inline">
                    <span className="text-muted small">{deliverTime} 2021/09/02 15:58:01</span>
                </div>
            </div>
            <div className="row col-12 py-1 pr-0">
                <div className="col-12 pr-0">
                    <label className="text-muted">备注：</label>
                    <span className="small">{note}</span>
                </div>
            </div>
        </ LMR >;
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