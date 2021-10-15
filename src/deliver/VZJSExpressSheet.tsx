import { List, VPage, FA } from 'tonva-react';
import { CDeliver } from './CDeliver';
import printJS from 'print-js';
//import "./printStyle/ZJSExpressSheet.css";
import Barcode from './printHelper/BarcodeImg';

// 宅急送电子面单打印界面
export class VZJSExpressSheet extends VPage<CDeliver> {
    private detail: any[];

    init(param: [any[]]) {
        this.detail = param;
        setTimeout(() => {
            // 此处为了打开界面马上执行打印；增加延时机制则成功哪怕延迟0毫秒也正常执行;
            this.printPage();
        }, 0);
    }

    // 打印页面
    private printPage = async () => {
        // size: portrait || landscape; 设置横(landscape)\纵向(portrait)打印
        const style = '@media print {@page {size:portrait}}';
        let focuser = setInterval(() => window.dispatchEvent(new Event('focus')), 500);

        printJS({
            printable: 'printZJSHtml',   // 要打印内容的id
            type: 'html',               // 可以打印html,img详细的可以在官方文档 https://printjs.crabbly.com/中查询
            scanStyles: false,           // 不适用默认样式
            style: style,               // 亦可使用引入的外部css
            css: '/printStyle/ZJSExpressSheet.css',
            onPrintDialogClose: () => { clearInterval(focuser); this.backPage(); }  // 取消打印回调
        });
    }

    header() { return ' 宅急送电子面单打印' }

    right() {
        return <div className="d-flex justify-content-between mr-1 my-2" onClick={() => this.printPage()}>
            <span className="p-1"><FA className="mr-1 cursor-pointer text-info" name="print" /></span>
        </div>;
    }

    private renderExpressSheetList = (sheetItem: any, index: number) => {

        let { Id, ExpressStatus, ExpressCode, ConsigneeAddressDetail, ConsigneeUnitName, VcityCode, SiteNo, SiteName, ProvinceName,
            CityName, TownNme, ConsigneeName, ConsigneeMobile, ConsigneeTelephone, ExpressOrderNo, ImportantHints, Createdate, ExceptionMessage } = sheetItem;

        return <div className="zjs_expressSheetItem">
            <div className="zjs_top">
                <span className="SiteName">{SiteName}</span>
                <span className="L">L</span>
            </div>
            <div className="zjs_jointCode">
                <span id="VcityCode">{VcityCode}</span>
                <span id="Spilt">-</span>
                <span id="SiteNo">{SiteNo}</span>
            </div>
            <div className="zjs_barcode">
                <Barcode value={ExpressCode} format={"CODE128"} height={35} width={2} fontSize={14} displayValue={true}
                    textAlign={"center"} textMargin={1} margin={1} />
            </div>
            <div className="zjs_receiver">
                <table className="receiver_table" cellSpacing={0} cellPadding={0}>
                    <tbody>
                        <tr>
                            <td id="info" rowSpan={2} ><span>收件人</span></td>
                            <td id="address"><span className="ConsigneeAddressDetail">{ConsigneeAddressDetail + ",(" + ConsigneeUnitName + ")"}</span></td>
                        </tr>
                        <tr>
                            <td>
                                <span id="contactName" className="ConsigneeName">{ConsigneeName} </span>
                                <span id="contactMobile" className="ConsigneeMobile">{ConsigneeMobile} </span>
                                <span id="ConsigneeTelephone">{ConsigneeTelephone}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="zjs_sender">
                <table className="sender_table" cellSpacing={0} cellPadding={0}>
                    <tbody>
                        <tr>
                            <td id="info" rowSpan={2}><span>寄件人</span></td>
                            <td id="address"><span>北京 北京 大厂县 东燕郊潮白河工业区</span></td>
                            <td id="check"><span>已验收</span></td>
                        </tr>
                        <tr>
                            <td id="name"><span>李晨辉  400-666-7788</span></td>
                            <td id="realName"><span>已实名</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="zjs_notice">
                <table className="notice_table1" cellSpacing={0} cellPadding={0}>
                    <tbody>
                        <tr>
                            <td>
                                <span>重要提示：</span>
                                <span id="ImportantHints">{ImportantHints}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="notice_table2" cellSpacing={0} cellPadding={0}>
                    <tbody>
                        <tr>
                            <td><span id="notice1">品名：样品</span></td>
                            <td><span id="notice2">总代收款：</span></td>
                        </tr>
                        <tr>
                            <td><span id="notice3">件数：一件      计费重量：0.5公斤</span></td>
                            <td><span id="notice4">￥0.00元</span></td>
                        </tr>
                        <tr>
                            <td rowSpan={2}><span id="notice5">签收人：</span></td>
                            <td><span id="notice6">打印单位：J&K Scientific Ltd</span></td>
                        </tr>
                        <tr>
                            <td><span id="notice7">打印时间：</span>
                                <span id="Createdate">{Createdate}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="zjs_orderInfo">
                <table className="orderInfo_Table1" cellSpacing={0} cellPadding={0}>
                    <tbody>
                        <tr>
                            <td><span id="info1">条码号：</span>
                                <span id="ExpressCode">{ExpressCode}</span>
                            </td>
                            <td><span id="info2">代收款：0.00元</span></td>
                        </tr>
                        <tr>
                            <td><span id="info3">客户单号：</span>
                                <span className="ExpressOrderNo">{ExpressOrderNo}</span>
                            </td>
                            <td><span id="info4">计费重量：0.5公斤</span></td>
                        </tr>
                        <tr>
                            <td><span id="info5">品名：样品</span></td>
                        </tr>
                    </tbody>
                </table>
                <table className="orderInfo_Table2" cellSpacing={0} cellPadding={0}>
                    <tbody>
                        <tr>
                            <td><span id="info6">寄件人：李晨辉  400-666-7788    北京  北京  大厂县</span></td>
                        </tr>
                        <tr>
                            <td>
                                <span id="info7">收件人：</span>
                                <span className="ConsigneeName">{ConsigneeName}</span>
                                <span className="ConsigneeMobile">{ConsigneeMobile}</span>
                                <span className="ConsigneeAddressDetail">{ConsigneeAddressDetail + ",(" + ConsigneeUnitName + ")"}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="zjs_bottom">
                <table className="bottom_table1" cellSpacing={0} cellPadding={0} >
                    <tbody>
                        <tr>
                            <td>
                                <span id="info1">收件人：</span>
                                <span id="ConsigneeName">{ConsigneeName}</span>
                                <span id="ConsigneeMobile">{ConsigneeMobile}</span>
                                <span id="ProvinceName">{ProvinceName}</span>
                                <span id="CityName">{CityName}</span>
                                <span id="TownNme">{TownNme}</span>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <span id="info2">客户单号：</span>
                                <span id="ExpressOrderNo">{ExpressOrderNo}</span>
                                <span id="info3">品名：样品</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table className="bottom_table2" cellSpacing={0} cellPadding={0}>
                    <tbody>
                        <tr>
                            <td>
                                <div className="info4">
                                    <Barcode value={ExpressCode} format={"CODE128"} height={30} width={1} fontSize={10} displayValue={false}
                                        textAlign={"center"} textMargin={1} margin={1} />
                                </div>
                            </td>
                            <td><span className="info5">件数：共 1 件</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>;
    }

    content() {
        let expressSheetList = <div className="zjs_expressSheetList">
            <List items={this.detail} item={{ render: this.renderExpressSheetList }} none="无宅急送电子面单数据" />
        </div>

        return <div id="printZJSHtml">
            {expressSheetList}
        </div>;
    }
}