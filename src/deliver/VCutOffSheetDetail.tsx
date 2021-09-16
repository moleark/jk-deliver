import { VPage, List, LMR, FA, DropdownAction, DropdownActions } from 'tonva-react';
import { CDeliver } from "./CDeliver";
import { ReturnGetCutOffMainMain, ReturnGetCutOffMainDetail } from "uq-app/uqs/JkDeliver";
import { VReceiptList } from './VReceiptList';
import { tvPackx } from '../tools/tvPackx';

const W3CWebSocket = require('websocket').w3cwebsocket;
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

export class VCutOffSheetDetail extends VPage<CDeliver> {

    private main: any;
    private detail: any[];
    private trayNumberListInfo: any[] = [];
    private webSocket: WebSocket;

    init(param: [any, any[]]) {
        let [main, detail] = param;
        this.main = main;
        this.detail = detail;
        this.webSocketConnect();    // 建立 webSocket 连接，用于京东快递打印
        this.toRepeatSortByTrayNumber();
    }

    /**
     * 根据托盘号重新分组
     */
    private toRepeatSortByTrayNumber = () => {
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
                this.trayNumberListInfo.push({
                    trayNumber: cutOffDetail[index]['trayNumber'], customer: cutOffDetail[index]['customer'],
                    contact: cutOffDetail[index]['contact'], deliverMain: cutOffDetail[index]['delivermain'], deliverDetail: cutOffDetail[index]['deliverDetail'],
                    trayProductCount: trayProductCount, trayProductPrice: trayProductPrice, trayProductList: trayProductList
                });
            }
        }
    }

    private updateWaybillNumber = (deliverMain: string, waybillNumber: string) => {
        console.log('修改发运单号');
    }

    header() {
        let { no } = this.main;
        return '截单号：' + no
    }

    /**
     * 打印京东电子面单
     */
    private pringJingDong = async () => {
        let dataList: any[] = [];
        this.trayNumberListInfo.forEach((e: any) => {
            dataList.push({
                Id: e.deliverDetail, SaleOrderId: '', Oinvoice: '', TrayNumber: e.trayNumber, WarehouseId: '', ConsigneeName: e.contact, ConsigneeUnitName: e.contact,
                ConsigneeAddressDetail: e.contact, ConsigneeTelephone: e.contact, ConsigneeMobile: e.contact, IsBaoJia: '0', BaoJia: '', Remark: ''
            });
        });
        let requestData = { data: dataList };
        let formData = JSON.stringify(requestData);

        try {
            let res = await window.fetch('http://localhost:38311/api/warehouse/GetJDExpressCode', {
                method: 'post',
                mode: 'cors',
                headers: { 'Content-Type': 'text/plain;application/json;charset=utf-8', 'Accept': 'application/json' },
                body: formData
            });

            if (res.ok) {
                let result = await res.json();
                let jsonResult: any[] = result.ret; // JSON.parse(ret);
                jsonResult.forEach((element: any) => {
                    if (element.ResultCode === "1") {
                        // 发送socket命令消息
                        let printData: string = "9XR7FEUvv/J9BWiMc02qM8IBW3f+j592F4nskdvvGT0CvnKb8dpvQlqwklpmF7VGwdcM5MHMiln+0d8wSjY7S7lAgOPrZz4W0Vj9sROipFu16wJ1aZQ8oB5JHCYzrUTL6Zo6KmaTbc66Yd6e29oYsXF6ueiIaj2Li0QH/ymRq6PbCNhbKcH4XCLvJhroitt1rVYHO30if7/jW1ojiPp8N7FZNA/lvEZII7MdRXyx8qoX7Z/Thy9jM8wvRUz5tMAD+uVzds+OPqhQJjlJSWgkizvzPNlXwzGnlhJYCni/kn3y9wNJFeqyJU9QyUNt4y2WxlBmY4XvWZilOdh7Z+K7btK42JBWziUzygbVJDmESj/P/hcfjTlayYHFArdcrHh4cCwyV9wPIXZcmDxBVv13vp4gAWBiA2nN9tsKiouXUFgDTfwUuUy/7D8Ek46aOBBuXSJAKQrhiFjQRde2RLb04stNWDM8WOf8tGU1n1o6H6bMjtdlJJ0UpqqccYi6Z454ftsOduUriUmvfCBpeYouxmilpFhSKYbpnXQtDTC0RfupZvXauaLnunDY50SLy2GqzcKe5/PY2LZkhi96rwMs4HOTYOiAAYgR+tT/7R9qAetltqBt+Eq8BemPaYEOGTz6u+W1K/cY0JqJOMqx3nFBd6eccSYvDKYe5jUFVbMZUdKnhE5s6OSd9PVnvgYc34lOTOG/zlKp/g0vAGTjMhwtly3sgMd7xeEo2FnZXjXy7jTSqIK6Il9Mo5seESJVHwT8so1WYYjjezXBfA/YXiB3Os5Zbu0MVM5SGv7iuuz61HaxOWEnldYmfa/6eVdg1XtaGcSzVR1lgZq3PK+6RDsXfksp/cFRhLSc+J8juH1T6GWeSla0rkE/vmizLMqDYCx3y2TVlkLmUrX8Hyz+mslyZNel9qhlDc+mVkUnyOEK5eryDRpRth9eUY+XAF35aIvm59Tt6iJH97x4PTXfvlNU6y2y9f5fU1gKJwh4eIP7gmrCwG1hbk1iv1HYpjIziKia1Cp+cVkEjgT9rkKZvs1FryNjPusT1l9PoH++AFUiCXC4ymwPuUHfOVxmEaNdJoVw3pLo5nUOYQCGAFWPOfxgIe/+pfQj4bpONn77jSqiL8PWpYZB2hBZcIknLtVLv0tq/JLcfT2D9sUsAq1d3qbjl84fzkqhUsU9N1OR1pU+0Q5jYhDlMSf8a6n4jBU2paQIUsFUZ/Ov9+98puaxPlSNo6e8bYkNwN/SZ85g4ET5FsEb235dw58AneeluRaZQjruhLh3uKfKVQFkKiwKJThdZxCzbO0zgqm2QT0YomKdJz+VIbSADmyK9QVnQp/HYnXXWSbA2sa/LE+2jSjY5kND0SkJiy8h/QfXHRCwamMaGnGQGO8eGfCgh1ehhoFnT1NAJJNpdh21CAeV5CcqaV6abhiSP1TS0SN2oSeCX0fj1kWaIxdvRH1Qu9OmXUiUsPQs6fRo/SsYOvtXq77IvLL27eKEuuq92y2+XL7ulyoYqPu9GgcFYJes1P8zidFNDl1a+y2S54gx64uNYH8fmGBLUuOXs60aZF1UW3pW24HD8iVuIIpkiTVQJ8s+39NFUxdkdSGjajdBtcTQwcZoEC+mDwEZYRvWHtIPI6I64gAk6XzBxb7PfqHSY6MR3kMUVeGu";		//1、打印数据
                        // let printData: string = element.PrintData;		//1、打印数据
                        var temp = element.StandardTemplate;	//2、打印模版
                        var tempUser = "";					    //3、打印自定义模版
                        var printDataUser = "";				    //4、打印自定义数据
                        var printCmd = "print";				    //5、打印指令
                        var printName = "HPRT R42D";		    //6、打印机名称
                        var text = "{\"orderType\": \"" + printCmd + "\", \"parameters\": {\"printName\": \"" + printName + "\", 		\"tempUrl\": \"" + temp + "\", \"customTempUrl\": \"" + tempUser + "\", \"customData\": [" + printDataUser + "], 	\"printData\": [\"" + printData + "\"] } }";
                        this.webSocket.send(text);
                        this.updateWaybillNumber('运单号', '快递单号');	//更新快递单号
                    } else {
                        console.log(element.ResultMsg + element.Id);
                    }
                });
                // return result;
            } else {
                console.log(res);
            }
        } catch (error) {
            console.log(error);
        }
    }

    private pringYunDa = async () => {

        let dataList: any[] = [];
        this.trayNumberListInfo.forEach((e: any) => {
            dataList.push({
                Id: e.deliverDetail, SaleOrderId: '', Oinvoice: '', TrayNumber: e.trayNumber, WarehouseId: '', ConsigneeName: e.contact, ConsigneeUnitName: e.contact,
                ConsigneeAddressDetail: e.contact, ConsigneeTelephone: e.contact, ConsigneeMobile: e.contact, IsBaoJia: '0', BaoJia: '', Remark: ''
            });
        });
        let requestData = { data: dataList };
        let formData = JSON.stringify(requestData);

        try {
            let res = await window.fetch('http://localhost:38311/api/warehouse/GetYDExpressCode', {
                method: 'post',
                mode: 'cors',
                headers: { 'Content-Type': 'text/plain;application/json;charset=utf-8', 'Accept': 'application/json' },
                body: formData
            });

            if (res.ok) {
                let result = await res.json();
                let jsonResult: any[] = result.ret; // JSON.parse(ret);
                let PdfInfos: string = "";
                jsonResult.forEach((element: any) => {
                    if (element.ExpressStatus === "1") {
                        PdfInfos += element.PdfInfo + "@";
                        this.updateWaybillNumber('运单号', '快递单号');	//更新快递单号
                    } else {
                        console.log(element.ExpressStatus);
                    }
                });
                // printaction(PdfInfos);
                var url = "http://127.0.0.1:9090/ydecx/service/mailpx/printDirect.pdf?t=" + new Date().getTime();
                let pdfform: any = <form></form>;
                pdfform.attr('id', 'pdfform');
                pdfform.attr('style', 'display:none');   //在form表单中添加查询参数
                pdfform.attr('target', 'mainbody');
                pdfform.attr('method', 'post');
                pdfform.attr('action', url);
                let tname: any = <input type='hidden' />;
                tname.attr("name", "tname");
                tname.attr("value", "mailtmp_s8");
                let docname: any = <input type='hidden' />;
                docname.attr("name", "docname");
                docname.attr("value", "mailpdfm1");
                let value: any = <input type='hidden' />;
                value.attr("name", "value");
                value.attr("value", PdfInfos);
                // $('#hawblayout_print').append(pdfform);
                pdfform.append(tname);
                pdfform.append(docname);
                pdfform.append(value);
                pdfform.submit();
            } else {
                console.log(res);
            }
        } catch (error) {
            console.log(error);
        }
    }
    private pringZhaiJiSong = async () => {
        let dataList: any[] = [];
        this.trayNumberListInfo.forEach((e: any) => {
            dataList.push({
                Id: e.deliverDetail, SaleOrderId: '', Oinvoice: '', TrayNumber: e.trayNumber, WarehouseId: '', ConsigneeName: e.contact, ConsigneeUnitName: e.contact,
                ConsigneeAddressDetail: e.contact, ConsigneeTelephone: e.contact, ConsigneeMobile: e.contact, IsBaoJia: '0', BaoJia: '', Remark: ''
            });
        });
        let requestData = { data: dataList };
        let formData = JSON.stringify(requestData);


        try {
            let res = await window.fetch('http://localhost:38311/api/warehouse/GetZJSExpressCode', {
                method: 'post',
                mode: 'cors',
                headers: { 'Content-Type': 'text/plain;application/json;charset=utf-8', 'Accept': 'application/json' },
                body: formData
            });

            if (res.ok) {
                let result = await res.json();
                let jsonResult: any[] = result.ret; // JSON.parse(ret);
                let PdfInfos: string = "";
                jsonResult.forEach((element: any) => {
                    if (element.ExpressStatus === "0") {
                        this.updateWaybillNumber('运单号', '快递单号');	//更新快递单号
                        /*
                        $("#barcodeTarget2").empty().barcode(element.ExpressCode, "code128", { barWidth: 2, barHeight: 50, fontSize: 14, fontOptions: "bold", showHRI: true });
                        $("#barcodeTarget").empty().barcode(element.ExpressCode, "code128", { barWidth: 1, barHeight: 30, fontSize: 10, fontOptions: "bold", showHRI: true });
                        $(".ConsigneeAddressDetail").text(element.ConsigneeAddressDetail + ",(" + element.ConsigneeUnitName + ")");

                        $(".VcityCode").text(element.VcityCode);
                        $(".SiteNo").text(element.SiteNo);
                        $(".SiteName").text(element.SiteName);
                        $(".ProvinceName").text(element.ProvinceName);
                        $(".CityName").text(element.CityName);
                        $(".TownNme").text(element.TownNme);
                        //$(".CityNme1").text(ExpressReturn.CityName + ExpressReturn.TownNme);
                        $(".ConsigneeName").text(element.ConsigneeName);
                        $(".ConsigneeMobile").text(element.ConsigneeMobile);
                        $(".ConsigneeTelephone").text(element.ConsigneeTelephone);
                        $(".ShipperUnitName").text(element.ShipperUnitName);
                        $(".AcceptanceUnitName").text(element.AcceptanceUnitName);
                        $(".DeclaredValue").text(element.DeclaredValue);
                        $(".ConsigneeUnitName").text(element.ConsigneeUnitName);
                        $(".ExpressOrderNo").text(element.ExpressOrderNo);
                        $(".CollectionAmount").text(element.CollectionAmount);
                        $(".ImportantHints").text(element.ImportantHints);
                        $(".Createdate").text(element.Createdate);
                        $(".ExpressCode").text(element.ExpressCode);
                        var printhtml = $("#PrintZJSHtml").html();
                        //var Url = "PintExpress?invoiceId=" + InvoiceNr + "&sellerId=" + SellerId;
                        //打印文件名称
                        LODOP.PRINT_INIT(ExpressReturn.ExpressCode + "宅急送快递单");
                        //打印纸大小
                        LODOP.SET_PRINT_PAGESIZE(0, "10cm", "15cm", "10*15")
                        LODOP.ADD_PRINT_HTM(0, 0, "100%", "15cm", printhtml);
                        LODOP.SET_PRINTER_INDEX("Xprinter XP-460B");
                        LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS", true);
                        var Pid = LODOP.PRINT();
                        return LODOP.GET_VALUE("PRINT_STATUS_TEXT", Pid);
                        */
                    } else {
                        console.log(element.ExpressStatus + ',' + element.ExceptionMessage);
                    }
                });
            } else {
                console.log(res);
            }
        } catch (error) {
            console.log(error);
        }
    }
    private pringShunFeng = async () => {
        let dataList: any[] = [];
        this.trayNumberListInfo.forEach((e: any) => {
            dataList.push({
                Id: e.deliverDetail, SaleOrderId: '', Oinvoice: '', TrayNumber: e.trayNumber, WarehouseId: '', ConsigneeName: e.contact, ConsigneeUnitName: e.contact,
                ConsigneeAddressDetail: e.contact, ConsigneeTelephone: e.contact, ConsigneeMobile: e.contact, IsBaoJia: '0', BaoJia: '', Remark: ''
            });
        });
        let requestData = { data: dataList };
        let formData = JSON.stringify(requestData);


        try {
            let res = await window.fetch('http://localhost:38311/api/warehouse/GetSFExpressCode', {
                method: 'post',
                mode: 'cors',
                headers: { 'Content-Type': 'text/plain;application/json;charset=utf-8', 'Accept': 'application/json' },
                body: formData
            });

            if (res.ok) {
                let result = await res.json();
                let jsonResult: any[] = result.ret; // JSON.parse(ret);
                let PdfInfos: string = "";
                jsonResult.forEach((element: any) => {
                    if (element.ExpressStatus === "0") {
                        this.updateWaybillNumber('运单号', '快递单号');	//更新快递单号
                        /*
                        $("#SF_proCode").text(ExpressReturn.proCode);
                        JsBarcode("#SF_waybillNumber", ExpressReturn.waybillNumber, { format: "CODE128A", height: 30, width: 2, displayValue: false });
                        $("#SF_waybillNumber_text").text(ExpressReturn.waybillNumber);
                        $("#SF_destRouteLabel").text(ExpressReturn.destRouteLabel);

                        $("#SF_Consignee").text(ExpressReturn.ConsigneeName + " " + ExpressReturn.ConsigneeMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') + " " + ExpressReturn.ConsigneeUnitName);
                        $("#SF_ConsigneeAddress").text(ExpressReturn.ConsigneeAddress);

                        $("#SF_Sender").text(ExpressReturn.senderName + " " + ExpressReturn.senderTel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') + " " + ExpressReturn.senderCompany);
                        $("#SF_SenderAddress").text(ExpressReturn.senderAddress);

                        $("#SF_codingMappingOut").text(ExpressReturn.codingMappingOut);

                        document.getElementById('SF_twoDimensionCode').innerHTML = "";
                        var qrcode = new QRCode(document.getElementById("SF_twoDimensionCode"), {
                            width: 100,
                            height: 100
                        });

                        qrcode.makeCode(ExpressReturn.twoDimensionCode);
                        alert("点击确认开始打印");
                        $("#SF_remark").text(ExpressReturn.remark + "\n提醒注意：（汽运禁航） （务必本人或专人签收）");
                        JsBarcode("#SF_waybillNumber_col", ExpressReturn.waybillNumber, { format: "CODE128A", height: 30, width: 2, displayValue: false });

                        var testDiv = document.getElementById("SF_waybillNumber_col");
                        testDiv.style.styleFloat = "left";

                        document.getElementById("PrintSFHtml").style.display = "";//显示
                        if (type == 0) {
                            bdhtml = window.document.body.innerHTML;
                            sprnstr = "<!--startprint-->"; //开始打印标识字符串有17个字符
                            eprnstr = "<!--endprint-->"; //结束打印标识字符串
                            prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17); //从开始打印标识之后的内容
                            prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr)); //截取开始标识和结束标识之间的内容
                            window.document.body.innerHTML = prnhtml; //把需要打印的指定内容赋给body.innerHTML
                            window.print(); //调用浏览器的打印功能打印指定区域
                            window.document.body.innerHTML = bdhtml; // 最后还原页面
                        }
                        */

                    } else {
                        console.log(element.ExpressStatus);
                    }
                });
            } else {
                console.log(res);
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 回执单打印
     */
    private printReceiptList = async () => {
        let { openDeliveryReceiptList } = this.controller;
        await openDeliveryReceiptList(this.main, this.trayNumberListInfo);
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
                action: this.printReceiptList
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

        let { deliverMain, trayNumber, contact, customer, carrier, waybillNumber, deliverTime, deliverDetail,
            item, product, tallyShould, content, productExt } = cutOffItem;
        let pack = PackX.getObj(item);

        let note: string = '';
        let apointCarrier: string = '';
        if (content) {
            let jsonContect = JSON.parse(content);
            note = jsonContect.deliverNotes;
            apointCarrier = jsonContect.shouldExpressLogistics[0];
        }

        let expressLogistics = <select className="form-control col-8 px-0 mx-0" defaultValue={carrier == undefined ? apointCarrier : carrier} onChange={o => { alert(o.target.value); cutOffItem.carrier = o.target.value; }}>
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

    private webSocketConnect = () => {
        // 建立w3c标准的websocket对象，传入ws地址
        this.webSocket = new W3CWebSocket('ws://localhost:9113');
        try {
            // 报错的回调函数
            this.webSocket.onerror = (e: any) => {
                console.log('Connection Error');
                console.log(e);
            };
            //当WebSocket创建成功时，触发onopen事件
            this.webSocket.onopen = () => {
                console.log('WebSocket Client Connected');
            };
            //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
            this.webSocket.onclose = () => {
                console.log("京东打印服务已断开，请刷新界面或者查看本地服务是否正常！");
            };
            //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
            this.webSocket.onmessage = (e: any) => {
                if (typeof e.data === 'string') {
                    console.log("Received: '" + e.data + "'");
                }
            };
        } catch (exception) {
            alert("连接京东打印服务有错误发生");
        }
    }
}