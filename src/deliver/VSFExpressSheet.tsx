import { List, VPage, FA } from 'tonva-react';
import { CDeliver } from './CDeliver';
import printJS from 'print-js';
import QRCode from 'qrcode.react';
import "../../public/printStyle/SFExpressSheet.css";
import Barcode from './printHelper/BarcodeImg';

// 顺丰电子面单打印界面
export class VSFExpressSheet extends VPage<CDeliver> {
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
        const style = '@media print { @page {size:portrait} }';
        let focuser = setInterval(() => window.dispatchEvent(new Event('focus')), 500);

        printJS({
            printable: 'printSFHtml',   // 要打印内容的id
            type: 'html',               // 可以打印html,img详细的可以在官方文档 https://printjs.crabbly.com/中查询
            scanStyles: false,           // 不适用默认样式
            style: style,               // 亦可使用引入的外部css
            css: '/printStyle/SFExpressSheet.css',
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

        return <div className="sf_expressSheetItem">
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
        let expressSheetList = <div className="sf_expressSheetList">
            <List items={this.detail} item={{ render: this.renderExpressSheetList }} none="无顺丰电子面单数据" />
        </div>

        return <div id="printSFHtml">
            {expressSheetList}
        </div>;
    }
}