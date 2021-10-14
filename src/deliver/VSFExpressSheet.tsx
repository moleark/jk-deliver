import { observer } from 'mobx-react';
import { List, Page, VPage, tv, FA, PropGrid, EasyDate, LMR } from 'tonva-react';
import { CDeliver } from './CDeliver';
import printJS from 'print-js';
import QRCode from 'qrcode.react';
import "/printStyle/ReceiptList.css'"
import Barcode from './printHelper/BarcodeImg';

// 顺丰电子面单打印界面
export class VSFExpressSheet extends VPage<CDeliver> {
    private detail: any[];

    init(param: [any[]]) {
        // let [main, detail] = param;
        this.detail = param;
        setTimeout(() => {
            // 此处为了打开界面马上执行打印；增加延时机制则成功哪怕延迟0毫秒也正常执行;
            this.printPage();
        }, 0);
    }

    // 打印页面
    private printPage = async () => {
        // size: portrait || landscape; 设置横(landscape)\纵向(portrait)打印
        const style = '@page {size:portrait}' + '@media print {'
            + `.expressSheetList{width:7.6cm}.expressSheetList ul.va-list{list-style:none;background-color:#f0f0f0;padding:0;margin-bottom:-1px}
            .expressSheetList ul.va-list>li{display:flex;flex-direction:row;flex-wrap:wrap;margin-bottom:1px;background-color:white;page-break-before:always}
            .expressSheetList ul.va-list>li>div{flex:1 1;display:block;flex-direction:row}.expressSheetItem{height:13cm;width:7.6cm;border-style:dashed;border:1px dashed #000}
            .sf_top{border-bottom:1px dashed #000;width:7.6cm;height:1.4cm}.sf_top .sf_proCode{text-align:right;width:7.6cm;height:1.0cm;font-family:SimHei;font-size:26pt;padding-right:.3cm;line-height:26pt}
            .sf_top .sf_top_time{text-align:center;font-family:STSong;font-size:6pt}.sf_middle1{border-bottom:1px dashed #000;text-align:center;height:2.3cm;width:7.6cm}
            .sf_middle1 img{line-height:1.3cm;padding-top:1.5mm}.sf_middle2{text-align:center;height:1cm;width:7.6cm;border-bottom:1px dashed #000}
            .sf_middle2 span{font-family:SimHei;font-size:22pt;font-weight:bolder;line-height:22pt}
            .sf_bottom{width:7.6cm;height:8cm}.sf_bottom_left{border-right:1px dashed #000;width:6cm;height:8cm;float:left}
            .sf_bottom_left .sf_receive{width:6cm;height:1.9cm}.sf_receive_left{width:.5cm;height:1.9cm;float:left;padding-left:0;padding-top:0}
            .sf_receive_left span{width:1cm;font-family:STSong;font-size:10pt;font-weight:bolder}
            .sf_receive_right{width:5.4cm;height:1.9cm;float:left}.sf_receive_right #SF_Consignee{white-space:normal;word-break:break-all;word-wrap:break-word;font-family:STSong;font-size:9pt}
            .sf_receive_right #SF_ConsigneeAddress{white-space:normal;Word-break:break-all;word-wrap:break-word;line-height:10pt;font-family:STSong;font-size:9pt}
            .sf_bottom_left .sf_send{border-bottom:1px dashed #000;width:6cm;height:.8cm}.sf_send_left{width:.5cm;height:.8cm;float:left;padding-left:0;padding-top:0}
            .sf_send_left span{width:1cm;font-family:STSong;font-size:10pt;font-weight:bolder}
            .sf_send_right{width:5.4cm;height:.8cm;float:left}.sf_send_right #SF_Sender{white-space:normal;Word-break:break-all;word-wrap:break-word;font-family:STSong;font-size:6pt}
            .sf_send_right #SF_SenderAddress{white-space:normal;Word-break:break-all;word-wrap:break-word;font-family:STSong;font-size:6pt}
            .sf_bottom_left .sf_qrcode{border-bottom:1px dashed #000;width:6cm;height:3cm}.sf_qrcode_left{border-right:1px dashed #000;width:3.2cm;height:3cm;float:left}
            .sf_qrcode_left1{border-bottom:1px dashed #000;width:3.2cm;height:.6cm;text-align:center}
            .sf_qrcode_left1 span{font-family:STSong;font-size:9pt;font-weight:bolder}.sf_qrcode_left2{border-bottom:1px dashed #000;width:3.2cm;height:1.2cm}
            .sf_qrcode_left3{width:3.2cm;height:1.2cm;text-align:center}.sf_qrcode_left3 #SF_codingMappingOut{font-family:SimHei;font-size:26pt;font-weight:bolder}
            .sf_qrcode_right{width:2.7cm;height:3cm;float:left;text-align:center}.sf_qrcode_right #qrCode{width:2.5cm;height:2.5cm;margin:1.5mm 1.5mm 1.5mm .5mm}
            .sf_bottom_left .sf_sign{border-bottom:1px dashed #000;width:6cm;height:.6cm}.sf_sign span{font-family:STSong;font-size:6pt;font-weight:bolder}
            .sf_bottom_left .sf_remark{width:6cm;height:2cm}.sf_remark #SF_remark{font-family:STSong;font-size:5pt;font-weight:bolder}
            .sf_bottom_right{width:1.5cm;height:8cm;float:right}.sf_bottom_right #barCode{height:7cm;width:1.6cm}
            .sf_bottom_right #barCode img{height:1.3cm;width:6cm;margin-left:-4.6cm;margin-bottom:-7.2cm;transform:rotate(90deg);transform-origin:right top 0}
            .sf_bottom_right #SF_proName{border-top:1px dashed #000;width:1.5cm;height:1.2cm}
            .sf_bottom_right #SF_proName span{font-family:STSong;font-size:8pt;font-weight:bolder}`
            + '}';
        let focuser = setInterval(() => window.dispatchEvent(new Event('focus')), 500);

        printJS({
            printable: 'printSFHtml',   // 要打印内容的id
            type: 'html',               // 可以打印html,img详细的可以在官方文档 https://printjs.crabbly.com/中查询
            scanStyles: false,           // 不适用默认样式
            //style: style,               // 亦可使用引入的外部css
            css: '/printStyle/ReceiptList.css',
            onPrintDialogClose: () => { clearInterval(focuser); }  // 取消打印回调 this.backPage();
        });
    }

    header() { return ' 顺丰电子面单打印' }

    right() {
        return <div className="d-flex justify-content-between mr-1 my-2" onClick={() => this.printPage()}>
            <span className="p-1"><FA className="mr-1 cursor-pointer text-info" name="print" /></span>
        </div>;
    }

    private renderExpressSheetList = (sheetItem: any, index: number) => {

        let { proCode, waybillNumber, destRouteLabel, ConsigneeName, ConsigneeMobile, ConsigneeUnitName, ConsigneeAddress, senderName,
            senderTel, senderCompany, senderAddress, codingMappingOut, twoDimensionCode, remark, } = sheetItem;

        return <div className="expressSheetItem">
            <div className="sf_top">
                <div className="sf_proCode">
                    <span> {proCode} </span>
                </div>
                <div className="sf_top_time">
                    <span>打印时间: {new Date().toLocaleString()}</span>
                </div>
            </div>
            <div className="sf_middle1">
                <Barcode value={waybillNumber} format={"CODE128A"} height={40} width={1} fontSize={15} displayValue={true}
                    textAlign={"center"} textMargin={10} margin={1} />
            </div>
            <div className="sf_middle2">
                <span>{destRouteLabel}</span>
            </div>
            <div className="sf_bottom">
                <div className="sf_bottom_left">
                    <div className="sf_receive">
                        <div className="sf_receive_left">
                            <span>收</span>
                        </div>
                        <div className="sf_receive_right">
                            <div id="SF_Consignee">
                                {ConsigneeName + " " + ConsigneeMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') + " " + ConsigneeUnitName}
                            </div>
                            <div id="SF_ConsigneeAddress">
                                {ConsigneeAddress}
                            </div>
                        </div>
                    </div>
                    <div className="sf_send">
                        <div className="sf_send_left">
                            <span>寄</span>
                        </div>
                        <div className="sf_send_right">
                            <div id="SF_Sender">
                                {senderName + " " + senderTel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') + " " + senderCompany}
                            </div>
                            <div id="SF_SenderAddress">
                                {senderAddress}
                            </div>
                        </div>
                    </div>
                    <div className="sf_qrcode">
                        <div className="sf_qrcode_left">
                            <div className="sf_qrcode_left1">
                                <span>已验视</span>
                            </div>
                            <div className="sf_qrcode_left2">
                                &nbsp;
                            </div>
                            <div className="sf_qrcode_left3">
                                <span id="SF_codingMappingOut">
                                    {codingMappingOut}
                                </span>
                            </div>
                        </div>
                        <div className="sf_qrcode_right">
                            <QRCode id="qrCode" value={twoDimensionCode} size={100} fgColor="#000000" />
                        </div>
                    </div>
                    <div className="sf_sign">
                        <span>签收:</span>
                    </div>
                    <div className="sf_remark">
                        <span id="SF_remark">{remark}</span>
                    </div>
                </div>
                <div className="sf_bottom_right">
                    <div id="barCode">
                        <Barcode value={waybillNumber} format={"CODE128A"} height={35} width={1} displayValue={false} textAlign={"center"} textMargin={10} margin={1} />
                    </div>
                    <div id="SF_proName">
                        <span>陆运包裹</span>
                    </div>
                </div>
            </div>
        </div >;
    }

    content() {
        let expressSheetList = <div className="expressSheetList">
            <List items={this.detail} item={{ render: this.renderExpressSheetList }} none="无顺丰电子面单数据" />
        </div>

        return <div id="printSFHtml">
            {expressSheetList}
        </div>;
    }
}