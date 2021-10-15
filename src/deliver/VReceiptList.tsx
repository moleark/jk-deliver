import { observer } from 'mobx-react';
import { List, Page, VPage, tv, FA, PropGrid, EasyDate, LMR } from 'tonva-react';
import { CDeliver } from './CDeliver';
//import './printStyle/ReceiptList.css';
import printJS from 'print-js';
import jklogo from 'images/jklogo.png';
import { tvPackx } from 'tools/tvPackx';

export class VReceiptList extends VPage<CDeliver> {
    private main: any;
    private detail: any[];

    init(param: [any, any[]]) {
        let [main, detail] = param;
        this.main = main;
        this.detail = detail;
        setTimeout(() => {
            // 此处为了打开界面马上执行打印；增加延时机制则成功哪怕延迟0毫秒也正常执行;
            this.printPage();
        }, 0);
    }

    // 打印页面
    private printPage = async () => {
        // size: portrait || landscape; 设置横(landscape)\纵向(portrait)打印
        const style = '@page {size:landscape}' + '@media print {}';
        let focuser = setInterval(() => window.dispatchEvent(new Event('focus')), 500);

        printJS({
            printable: 'receiptListDiv', // 要打印内容的id
            type: 'html',               // 可以打印html,img详细的可以在官方文档 https://printjs.crabbly.com/中查询
            scanStyles: false,          // 不适用默认样式
            style: style,               // 亦可使用引入的外部css
            css: '/printStyle/ReceiptList.css',
            documentTitle: '回执单',
            onPrintDialogClose: () => { clearInterval(focuser); this.backPage(); }  // 取消打印回调
        });
    }

    header() { return ' 回执单打印' }

    right() {
        return <div className="d-flex justify-content-between mr-1 my-2" onClick={() => this.printPage()}>
            <span className="p-1"><FA className="mr-1 cursor-pointer text-info" name="print" /></span>
        </div>;
    }

    private renderProductList = (productItem: any, index: number) => {

        // let { expressLogisticsList } = this.controller;
        let { JkDeliver, JkProduct } = this.controller.uqs;
        let { ProductX } = JkProduct;
        let PackX = ProductX.div('packx');
        let { product, item, tallyShould, showPrice, productExt, productDetail, price, content } = productItem;
        let pack = PackX.getObj(item);
        let endUserName: string;
        let PO: string;
        let orderIdOfBuyer: string;

        let storageCondition: string = '';
        if (productExt) {
            let jsonProductExt = JSON.parse(productExt);
            storageCondition = jsonProductExt.SpecialRequirement;
        }
        if (content) {
            let formatContent: string = String(content).replace(/\r\n/g, "").replace(/\r/g, "").replace(/\n/g, "");
            let jsonContect: any = JSON.parse(formatContent);
            endUserName = jsonContect?.enduser;
            PO = jsonContect?.pono;
            orderIdOfBuyer = jsonContect?.cusomerSystemID + ' ' + jsonContect?.orderIdOfBuyer;
            // let apointCarrier: any = jsonContect.shouldExpressLogistics[0];
            // apointCarrierId = expressLogisticsList.find((e: any) => e.no === apointCarrier)?.id;
        }

        return <div className="dataListItem_DR">
            <table cellPadding={0} cellSpacing={0}>
                <tr className="dataListItem_DR_tr">
                    <td className="dataListItem_DR_tr_td_1">{productDetail?.origin}</td>
                    <td className="dataListItem_DR_tr_td_2">{productDetail?.descriptionC.length > 15 ? String(productDetail.descriptionC).substr(0, 15) : productDetail.descriptionC}</td>
                    <td className="dataListItem_DR_tr_td_3">{storageCondition}</td>
                    <td className="dataListItem_DR_tr_td_4">{tallyShould}</td>
                    <td className="dataListItem_DR_tr_td_5">{tvPackx(pack)}</td>
                    <td className="dataListItem_DR_tr_td_6">{(showPrice === 1) ? price : '-'}</td>
                    <td className="dataListItem_DR_tr_td_7">{ }</td>
                    <td className="dataListItem_DR_tr_td_8">{PO}</td>
                    <td className="dataListItem_DR_tr_td_9">{endUserName}</td>
                    <td className="dataListItem_DR_tr_td_10">{orderIdOfBuyer}</td>
                </tr>
            </table>
        </div>
    }

    private renderTrayList = (trayItem: any, index: number) => {

        let { no } = this.main;
        let { JkCustomer, JkDeliver } = this.controller.uqs;
        let { Customer, BuyerAccount } = JkCustomer;
        let { Carrier } = JkDeliver;
        let { trayNumber, customerAccount, contactDetail, carrier, trayProductCount, trayProductPrice } = trayItem;

        let top = <div className="top">
            <table cellPadding={0} cellSpacing={0}>
                <tr>
                    <td align="left" className="td_left">
                        <img src={jklogo} alt="Logo" />
                        <div><span>{trayNumber}</span></div>
                    </td>
                    <td align="right" className="td_right large">
                        <strong>{no}</strong><br />
                    </td>
                </tr>
            </table>
        </div>

        let deliveryInfo = <div className="deliveryInfo">
            <table cellPadding={0} cellSpacing={0}>
                <tr className="deliveryInfo_tr_1">
                    <td className="deliveryInfo_td_1"><strong>订货人：</strong></td>
                    <td className="deliveryInfo_td_2">{BuyerAccount.tv(customerAccount)}</td>
                    <td className="deliveryInfo_td_3"><strong>收货单位：</strong></td>
                    <td className="deliveryInfo_td_4">{contactDetail?.organizationName}</td>
                    <td className="deliveryInfo_td_5"><strong>电话：</strong></td>
                    <td className="deliveryInfo_td_6"> {contactDetail?.mobile}</td>
                    <td className="deliveryInfo_td_7"><strong>发货方式:</strong></td>
                    <td className="deliveryInfo_td_8">{(carrier) ? Carrier.tv(carrier) : ''}</td>
                </tr>
                <tr>
                    <td><strong>收货人：</strong></td>
                    <td> {contactDetail?.name}</td>
                    <td><strong>收货地址：</strong></td>
                    <td className="deliveryInfo_td_9" colSpan={3} align="left">{contactDetail?.addressString}</td>
                    <td><strong>邮编：</strong></td>
                    <td>{ }</td>
                </tr>
            </table >
        </div>

        let title = <div className="title">
            <div className="title_div_1"><span><strong>产品编号</strong></span></div>
            <div className="title_div_2"><span><strong>中英文品名（中文仅供参考）</strong></span></div>
            <div className="title_div_3"><span><strong>储运条件</strong></span></div>
            <div className="title_div_4"><span><strong>数量</strong></span></div>
            <div className="title_div_5"><span><strong>包装</strong></span></div>
            <div className="title_div_6"><span><strong>单价</strong></span></div>
            <div className="title_div_7"><span><strong>CAS/合同号</strong></span></div>
            <div className="title_div_8"><span><strong>PO#</strong></span></div>
            <div className="title_div_9"><span><strong>最终用户</strong></span></div>
            <div className="title_div_10"><span><strong>用户订单号</strong></span></div>
        </div >;

        let footer = <div className="footer">
            数量：<span>{trayProductCount}</span> &nbsp;
            总价：<span>{trayProductPrice > 0 ? trayProductPrice : '-'}</span>
        </div>

        return <div className="p-1 bg-white" >
            {top}
            {deliveryInfo}
            {title}
            <div className="trayNumberItem_DR">
                <List items={trayItem.trayProductList} item={{ render: this.renderProductList }} none="无产品数据" />
            </div>
            {footer}
        </div>;
    }

    content() {
        let trayNumberList = <div className="trayNumberList_DR">
            <List items={this.detail} item={{ render: this.renderTrayList }} none="无发货数据" />
        </div>

        return <div id="receiptListDiv">
            {trayNumberList}
        </div>;
    }
}