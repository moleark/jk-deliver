import { observer } from 'mobx-react';
import { List, Page, VPage, tv, FA, PropGrid, EasyDate } from 'tonva-react';
import { COutBound } from './COutBound';
import './printStyle/ReceiptList.css';
import printJS from 'print-js';
import logo from 'images/logo.png';
//import { format, addHours } from 'date-fns';

export class VNonDeliveryReceiptList extends VPage<COutBound> {

    nonDeliveryReceiptListInfo: any[];
    trayNumberList: any[];
    outBoundOrderId: any;
    tempCount: number = 0;            // 循环控制数据明细列表，默认为0
    firstTempheight: number = 0;      // 首页动态数据要显示的高度
    nextTempheight: number = 0;       // 下一页动态数据要显示的高度
    pageHeight: number = 680;         // 当前页面显示高度

    async open(outBoundOrderInfo?: any) {

        this.nonDeliveryReceiptListInfo = outBoundOrderInfo;
        this.openPage(this.page);
    }

    // 打印页面
    private printPage = async () => {

        // size: portrait || landscape; 设置横(landscape)\纵向(portrait)打印
        let style = '@page {size:landscape}' + '@media print {'
            + `.breakPage{page-break-before:always}.top{width:100%;padding-bottom:5px}.top tr{width:100%}.td_left{display:flex;padding-bottom:5px;font-size:25px;font-weight:600;width:25%}
            .td_left div{display:flex;padding-top:40px}.td_left span{font-size:15px}.td_right{width:8%;text-align:right;padding-right:10px;font-size:15px}
            .deliveryInfo{width:100%;border:1px;padding-bottom:5px}.deliveryInfo_tr_1{width:100%;font-size:16px}
            .deliveryInfo_td_1{width:9%}.deliveryInfo_td_2{width:8%}.deliveryInfo_td_3{width:9%}.deliveryInfo_td_4{width:25%}
            .deliveryInfo_td_5{width:5%}.deliveryInfo_td_6{width:13%}.deliveryInfo_td_7{width:9%}.deliveryInfo_td_8{width:8%}
            .title{width:100%;padding-bottom:5px}.title_tr{width:100%;font-size:16px}.title_tr_td_1{text-align:left;width:8%}
            .title_tr_td_2{text-align:left;width:20%}.title_tr_td_3{text-align:center;width:7%}.title_tr_td_4{text-align:center;width:4%}
            .title_tr_td_5{text-align:center;width:7%}.title_tr_td_6{text-align:center;width:4%}.title_tr_td_7{text-align:center;width:9%}
            .title_tr_td_8{text-align:center;width:8%}.title_tr_td_9{text-align:center;width:8%}.title_tr_td_10{text-align:center;width:8%}
            .dataListItem_DR{width:100%;display:grid;flex-direction:row;border-bottom:1px solid #000}.dataListItem_DR_tr{width:100%;font-size:16px;height:26px}
            .dataListItem_DR_tr_td_1{text-align:left;width:8%}.dataListItem_DR_tr_td_2{text-align:left;width:20%}
            .dataListItem_DR_tr_td_3{text-align:center;width:7%}.dataListItem_DR_tr_td_4{text-align:center;width:4%}
            .dataListItem_DR_tr_td_5{text-align:center;width:7%}.dataListItem_DR_tr_td_6{text-align:center;width:4%}
            .dataListItem_DR_tr_td_7{text-align:center;width:9%}.dataListItem_DR_tr_td_8{text-align:center;width:8%}
            .dataListItem_DR_tr_td_9{text-align:center;width:8%}.dataListItem_DR_tr_td_10{text-align:center;width:8%}
            .dataList_DR{width:100%}.dataList_DR ul{display:block;list-style-type:disc;margin-block-start:0;margin-block-end:1em;margin-inline-start:0;margin-inline-end:0;padding-inline-start:40px;border-bottom:1px solid #000;width:100%}
            .dataList_DR ul.va-list{list-style:none;padding:0;margin-bottom:-1px;background-color:#f0f0f0}.dataList_DR ul.va-list li{display:flex;flex-direction:row;flex-wrap:nowrap;margin-bottom:1px;background-color:white;page-break-before:always}
            .dataList_DR ul.va-list>li>div{flex:1 1;display:flex;flex-direction:row;flex-wrap:wrap}.dataListDetail_DR{width:100%}
            .dataListDetail_DR ul.va-list li{display:flex;flex-direction:row;flex-wrap:nowrap;margin-bottom:1px;background-color:white;page-break-before:avoid}
            .dataListDetail_DR ul.va-list>li>div{flex:1 1;display:grid;flex-direction:row}.footer{padding-top:11px;width:85%;text-align:right;float:right}
            .footer span{width:70px;border-bottom:1px solid Black;padding:3px 20px 3px 20px}`
            + '}';
        let focuser = setInterval(() => window.dispatchEvent(new Event('focus')), 500);

        printJS({
            printable: 'nonDeliveryReceiptPage', // 要打印内容的id
            type: 'html',               // 可以打印html,img详细的可以在官方文档 https://printjs.crabbly.com/中查询
            scanStyles: false,          // 不适用默认样式
            style: style,               // 亦可使用引入的外部css
            documentTitle: '.',
            onPrintDialogClose: () => { clearInterval(focuser); this.backPage(); }  // 取消打印回调
        });
    }

    private renderTrayNumberDetail = (deliveryReceiptListInfo: any) => {

        let { showPriceWhenPrintReceipt, product, pack, quantity, unitPrice } = deliveryReceiptListInfo;

        return <div className="dataListItem_DR">
            <table cellPadding={0} cellSpacing={0}>
                <tr className="dataListItem_DR_tr">
                    <td className="dataListItem_DR_tr_td_1">{tv(product, (values: any) => <>{values.origin}</>)}</td>
                    <td className="dataListItem_DR_tr_td_2">{tv(product, (values: any) => <>{values.descriptionC.length > 27 ? String(values.descriptionC).substr(0, 27) : values.descriptionC}</>)}</td>
                    <td className="dataListItem_DR_tr_td_3">{ }</td>
                    <td className="dataListItem_DR_tr_td_4">{quantity}</td>
                    <td className="dataListItem_DR_tr_td_5">{tv(pack, (values: any) => <>{tvPackx(values)}</>)}</td>
                    <td className="dataListItem_DR_tr_td_6">{showPriceWhenPrintReceipt == 1 ? unitPrice : '-'}</td>
                    <td className="dataListItem_DR_tr_td_7">{ }</td>
                    <td className="dataListItem_DR_tr_td_8">{ }</td>
                    <td className="dataListItem_DR_tr_td_9">{ }</td>
                    <td className="dataListItem_DR_tr_td_10">{ }</td>
                </tr>
            </table>
        </div>
    };

    private renderTrayNumberList = (deliveryReceiptListInfo: any) => {
        let top = <div className="top">
            <table cellPadding={0} cellSpacing={0}>
                <tr>
                    <td align="left" className="td_left">
                        <img src={logo} alt="Logo" />
                        <div><span >{deliveryReceiptListInfo.trayNumber}</span></div>
                    </td>
                    <td align="right" className="td_right">
                        { }<br />
                        {deliveryReceiptListInfo.outBoundOrderId}<br />
                        {<EasyDate date={Date.now()} /> /*format(Date.now(), 'yyyy/MM/dd')*/}
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
                    <td className="deliveryInfo_td_4">{deliveryReceiptListInfo.consigneeUnitName}</td>
                    <td className="deliveryInfo_td_5"><strong>电话：</strong></td>
                    <td className="deliveryInfo_td_6"> {deliveryReceiptListInfo.consigneeMobile}</td>
                    <td className="deliveryInfo_td_7"><strong>发货方式:</strong></td>
                    <td className="deliveryInfo_td_8">{deliveryReceiptListInfo.ExpressType}</td>
                </tr>
                <tr>
                    <td><strong>收货人：</strong></td>
                    <td> {deliveryReceiptListInfo.consigneeName}</td>
                    <td><strong>收货地址：</strong></td>
                    <td className="deliveryInfo_td_9" colSpan={3} align="left">{deliveryReceiptListInfo.consigneeAddress}</td>
                    <td><strong>邮编：</strong></td>
                    <td>{deliveryReceiptListInfo.consigneeZipcode}</td>
                </tr>
            </table >
        </div>

        let title = <div className="title">
            <table cellPadding={0} cellSpacing={0}>
                <tr className="title_tr">
                    <th className="title_tr_td_1">产品编号</th>
                    <th className="title_tr_td_2">中英文品名（中文仅供参考）</th>
                    <th className="title_tr_td_3">储运条件</th>
                    <th className="title_tr_td_4">数量</th>
                    <th className="title_tr_td_5">包装</th>
                    <th className="title_tr_td_6">单价</th>
                    <th className="title_tr_td_7">CAS / 合同号</th>
                    <th className="title_tr_td_8">PO#</th>
                    <th className="title_tr_td_9">最终用户</th>
                    <th className="title_tr_td_10">用户订单号</th>
                </tr>
            </table>
        </div >

        let footer = <div className="footer">
            数量：<span>{deliveryReceiptListInfo.taryProductCount}</span> &nbsp;
            总价：<span>{deliveryReceiptListInfo.isViewPrice == 1 ? deliveryReceiptListInfo.trayProductPrice : '-'}&nbsp;{deliveryReceiptListInfo.trayPriceCurrency}</span>
        </div>

        return <div className="dataListDetail_DR">
            {top}
            {deliveryInfo}
            {title}
            <List items={deliveryReceiptListInfo.deliveryReceiptListInfo} item={{ render: this.renderTrayNumberDetail }} none="无发货数据" />
            {footer}
        </div>
    };

    private page = observer(() => {

        let dataListDiv = <div id="dataListDiv" className="dataList_DR">
            <List items={this.nonDeliveryReceiptListInfo} item={{ render: this.renderTrayNumberList }} none="无发货数据" />
        </div>

        let right = <div className="d-flex justify-content-between mr-1 my-2" onClick={() => this.printPage()}>
            <span className="p-1"><FA className="mr-1 cursor-pointer text-info" name="print" /></span>
        </div>

        return <Page header="送货服务回执单打印" right={right}>
            <div id="nonDeliveryReceiptPage">
                {dataListDiv}
            </div>
        </Page >
    });
}

const tvPackx = (values: any) => {
    let { radiox, radioy, unit } = values;
    if (radiox !== 1) return <>{radiox} * {radioy}{unit}</>;
    return <>{radioy}{unit}</>;
}