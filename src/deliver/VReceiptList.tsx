import { observer } from 'mobx-react';
import { List, Page, VPage, tv, FA, PropGrid, EasyDate, LMR } from 'tonva-react';
import { COutBound } from './COutBound';
import './printStyle/ReceiptList.css';
import printJS from 'print-js';
import jklogo from 'images/jklogo.png';

export class VReceiptList extends VPage<COutBound> {

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

        let style = '@page {size:landscape}' + '@media print {'
            + `.trayNumberList_DR{width:100%;flex:1 1;display:grid;flex-wrap:wrap}
            .trayNumberList_DR ul.va-list{list-style:none;background-color:#f0f0f0;padding:0;margin-bottom:-1px}
            .trayNumberList_DR ul.va-list>li{display:flex;flex-direction:row;flex-wrap:wrap;margin-bottom:1px;background-color:white;page-break-before:always}
            .trayNumberList_DR ul.va-list>li>div{flex:1 1;display:grid;flex-direction:row}
            .top{width:100%;padding-bottom:5px}.top tr{width:100%}.td_left{display:flex;padding-bottom:5px;font-weight:600;width:25%}
            .td_left div{display:flex;padding-top:40px}.td_left span{font-size:15px}
            .td_right{width:8%;text-align:right;padding-right:10px;font-size:18px}
            .deliveryInfo{width:100%;border:1px;padding-bottom:5px}.deliveryInfo_tr_1{width:100%;font-size:16px}
            .deliveryInfo_td_1{width:9%}.deliveryInfo_td_2{width:8%}.deliveryInfo_td_3{width:9%}
            .deliveryInfo_td_4{width:25%}.deliveryInfo_td_5{width:5%}.deliveryInfo_td_6{width:13%}
            .deliveryInfo_td_7{width:9%}.deliveryInfo_td_8{width:8%}.title{width:100%;font-size:16px;height:38px;padding-bottom:0}
            .title_div_1{text-align:left;width:10%;float:left}.title_div_2{text-align:left;width:30%;float:left}
            .title_div_3{text-align:left;width:8%;float:left}.title_div_4{text-align:center;width:4%;float:left}
            .title_div_5{text-align:center;width:9%;float:left}.title_div_6{text-align:center;width:4%;float:left}
            .title_div_7{text-align:left;width:10%;float:left}.title_div_8{text-align:left;width:8%;float:left}
            .title_div_9{text-align:left;width:8%;float:left}.title_div_10{text-align:left;width:9%;float:left}
            .trayNumberItem_DR{width:100%;flex:1 1;display:grid;flex-wrap:wrap;margin-top:-15px}
            .trayNumberItem_DR ul.va-list{list-style:none;background-color:#f0f0f0;padding:0;margin-bottom:-1px}
            .trayNumberItem_DR ul.va-list>li{display:flex;flex-direction:row;flex-wrap:wrap;margin-bottom:1px;background-color:white;page-break-before:avoid}
            .trayNumberItem_DR ul.va-list>li>div{flex:1 1;display:grid;flex-direction:row}
            .dataListItem_DR{width:100%;border-bottom:1px solid #000}.dataListItem_DR_tr{width:100%;font-size:16px;height:26px}
            .dataListItem_DR_tr_td_1{width:10%;text-align:left}.dataListItem_DR_tr_td_2{width:30%;text-align:left}
            .dataListItem_DR_tr_td_3{text-align:left;width:8%}.dataListItem_DR_tr_td_4{width:4%;text-align:center}
            .dataListItem_DR_tr_td_5{width:9%;text-align:center}.dataListItem_DR_tr_td_6{width:4%;text-align:center}
            .dataListItem_DR_tr_td_7{width:10%;text-align:left}.dataListItem_DR_tr_td_8{width:8%;text-align:left}
            .dataListItem_DR_tr_td_9{width:8%;text-align:left}.dataListItem_DR_tr_td_10{width:9%;text-align:left}
            .footer{padding-top:11px;text-align:right}.footer span{width:70px;border-bottom:1px solid Black;padding:3px 20px 3px 20px}`
            + '}';
        let focuser = setInterval(() => window.dispatchEvent(new Event('focus')), 500);

        printJS({
            printable: 'receiptListDiv', // 要打印内容的id
            type: 'html',               // 可以打印html,img详细的可以在官方文档 https://printjs.crabbly.com/中查询
            scanStyles: false,          // 不适用默认样式
            style: style,               // 亦可使用引入的外部css
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

        let { JkDeliver, JkProduct } = this.controller.uqs;
        let { ProductX } = JkProduct;
        let PackX = ProductX.div('packx');
        let { product, item, tallyShould, showPriceWhenPrintReceipt, productExt, price } = productItem;
        let pack = PackX.getObj(item);

        let storageCondition: string = '';
        if (productExt) {
            let jsonProductExt = JSON.parse(productExt);
            storageCondition = jsonProductExt.SpecialRequirement;
        }

        return <div className="dataListItem_DR">
            <table cellPadding={0} cellSpacing={0}>
                <tr className="dataListItem_DR_tr">
                    <td className="dataListItem_DR_tr_td_1">{ProductX.tv(product)}</td>
                    <td className="dataListItem_DR_tr_td_2">{tv(product, (values: any) => <>{values.descriptionC.length > 27 ? String(values.descriptionC).substr(0, 27) : values.descriptionC}</>)}</td>
                    <td className="dataListItem_DR_tr_td_3">{storageCondition}</td>
                    <td className="dataListItem_DR_tr_td_4">{tallyShould}</td>
                    <td className="dataListItem_DR_tr_td_5">{tvPackx(pack)}</td>
                    <td className="dataListItem_DR_tr_td_6">{price}</td>
                    <td className="dataListItem_DR_tr_td_7">{ }</td>
                    <td className="dataListItem_DR_tr_td_8">{ }</td>
                    <td className="dataListItem_DR_tr_td_9">{ }</td>
                    <td className="dataListItem_DR_tr_td_10">{ }</td>
                </tr>
            </table>
        </div>
    }

    private renderTrayList = (trayItem: any, index: number) => {

        let { no } = this.main;
        let { trayNumber, customer, contact, trayProductCount, trayProductPrice } = trayItem;

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
                    <td className="deliveryInfo_td_2">{ }</td>
                    <td className="deliveryInfo_td_3"><strong>收货单位：</strong></td>
                    <td className="deliveryInfo_td_4">{'xxx'}</td>
                    <td className="deliveryInfo_td_5"><strong>电话：</strong></td>
                    <td className="deliveryInfo_td_6"> {'xxx'}</td>
                    <td className="deliveryInfo_td_7"><strong>发货方式:</strong></td>
                    <td className="deliveryInfo_td_8">{'xxx'}</td>
                </tr>
                <tr>
                    <td><strong>收货人：</strong></td>
                    <td> {'xxx'}</td>
                    <td><strong>收货地址：</strong></td>
                    <td className="deliveryInfo_td_9" colSpan={3} align="left">{'xxx'}</td>
                    <td><strong>邮编：</strong></td>
                    <td>{'xxx'}</td>
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
            总价：<span>{trayProductPrice}</span>
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

const tvPackx = (values: any) => {
    let { radiox, radioy, unit } = values;
    if (radiox !== 1) return <>{radiox} * {radioy}{unit}</>;
    return <>{radioy}{unit}</>;
}