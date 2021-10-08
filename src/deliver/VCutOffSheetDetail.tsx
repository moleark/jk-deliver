import { VPage, List, LMR, FA, DropdownAction, DropdownActions } from 'tonva-react';
import { CDeliver } from "./CDeliver";
import { ReturnGetCutOffMainMain, ReturnGetCutOffMainDetail } from "uq-app/uqs/JkDeliver";
import { VReceiptList } from './VReceiptList';
import { tvPackx } from '../tools/tvPackx';
import JsBarcode from 'jsbarcode';
import printJS from 'print-js';
import QRCode from 'qrcodejs2';
// import { lodopInitMethod } from 'lodop-printer';

// websocket京东打印服务使用
const W3CWebSocket = require('websocket').w3cwebsocket;
// 显示产品安全信息
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
                        if (cutOffDetail[indexB]['showPrice'] === 1) {
                            trayProductPrice += cutOffDetail[indexB]['tallyShould'] * cutOffDetail[indexB]['price'];
                        }
                    }
                }
                arrId.push(cutOffDetail[index]['trayNumber']);
                this.trayNumberListInfo.push({
                    trayNumber: cutOffDetail[index]['trayNumber'], customer: cutOffDetail[index]['customer'], carrier: cutOffDetail[index]['carrier'],
                    contactDetail: cutOffDetail[index]['contactDetail'], productDetail: cutOffDetail[index]['productDetail'],
                    deliverMain: cutOffDetail[index]['deliverMain'], deliverDetail: cutOffDetail[index]['deliverDetail'],
                    orderMainNo: cutOffDetail[index]['orderMainNo'], content: cutOffDetail[index]['content'],
                    trayProductCount: trayProductCount, trayProductPrice: trayProductPrice, trayProductList: trayProductList
                });
            }
        }
    }

    /**
     * 修改发货单承运商和运单号
     * @param deliverMain 发货单
     * @param carrier 承运商
     * @param waybillNumber 运单号
     */
    private updateWaybillNumber = async (deliverMain: number, carrier: number, waybillNumber: string) => {
        await this.controller.updateWaybillNumber(deliverMain, carrier, waybillNumber);
    }

    /**
     * 修改发货单承运商
     * @param deliverMain 发货单
     * @param carrier 承运商
     */
    private updateCarrier = async (deliverMain: number, carrier: number) => {
        await this.controller.updateDeliverCarrier(deliverMain, carrier);
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
        let { no: cutOffMainNo, warehouseDetail } = this.main;

        this.trayNumberListInfo.filter(v => v.carrier === 16).forEach((e: any) => {
            let warehouseNo = warehouseDetail?.no;
            /*if (e.content) {
                let formatContent: string = String(e.content).replace(/\r\n/g, "").replace(/\r/g, "").replace(/\n/g, "");
                let jsonContect: any = JSON.parse(formatContent);
                remark = jsonContect.deliverNotes;
            }*/
            let remark: string = "订单批号:" + cutOffMainNo + ",货号:" + e.trayNumber + ",提醒注意：（汽运禁航）（务必本人或专人签收）";
            dataList.push({
                Id: e.orderMainNo + '_' + e.deliverMain, SaleOrderId: e.orderMainNo, Oinvoice: cutOffMainNo,
                TrayNumber: e.trayNumber, WarehouseId: warehouseNo, ConsigneeName: e.contactDetail?.name,
                ConsigneeUnitName: e.contactDetail?.organizationName, ConsigneeAddressDetail: e.contactDetail?.addressString,
                ConsigneeTelephone: e.contactDetail?.telephone, ConsigneeMobile: e.contactDetail?.mobile, IsBaoJia: '0', BaoJia: e.trayProductPrice, Remark: remark
            });
        });
        if (dataList.length > 0) {
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
                    jsonResult.forEach((e: any) => {
                        if (e.ResultCode === "1") {
                            // 发送socket命令消息
                            // let printData: string = "9XR7FEUvv/J9BWiMc02qM8IBW3f+j592F4nskdvvGT0CvnKb8dpvQlqwklpmF7VGwdcM5MHMiln+0d8wSjY7S7lAgOPrZz4W0Vj9sROipFu16wJ1aZQ8oB5JHCYzrUTL6Zo6KmaTbc66Yd6e29oYsXF6ueiIaj2Li0QH/ymRq6PbCNhbKcH4XCLvJhroitt1rVYHO30if7/jW1ojiPp8N7FZNA/lvEZII7MdRXyx8qoX7Z/Thy9jM8wvRUz5tMAD+uVzds+OPqhQJjlJSWgkizvzPNlXwzGnlhJYCni/kn3y9wNJFeqyJU9QyUNt4y2WxlBmY4XvWZilOdh7Z+K7btK42JBWziUzygbVJDmESj/P/hcfjTlayYHFArdcrHh4cCwyV9wPIXZcmDxBVv13vp4gAWBiA2nN9tsKiouXUFgDTfwUuUy/7D8Ek46aOBBuXSJAKQrhiFjQRde2RLb04stNWDM8WOf8tGU1n1o6H6bMjtdlJJ0UpqqccYi6Z454ftsOduUriUmvfCBpeYouxmilpFhSKYbpnXQtDTC0RfupZvXauaLnunDY50SLy2GqzcKe5/PY2LZkhi96rwMs4HOTYOiAAYgR+tT/7R9qAetltqBt+Eq8BemPaYEOGTz6u+W1K/cY0JqJOMqx3nFBd6eccSYvDKYe5jUFVbMZUdKnhE5s6OSd9PVnvgYc34lOTOG/zlKp/g0vAGTjMhwtly3sgMd7xeEo2FnZXjXy7jTSqIK6Il9Mo5seESJVHwT8so1WYYjjezXBfA/YXiB3Os5Zbu0MVM5SGv7iuuz61HaxOWEnldYmfa/6eVdg1XtaGcSzVR1lgZq3PK+6RDsXfksp/cFRhLSc+J8juH1T6GWeSla0rkE/vmizLMqDYCx3y2TVlkLmUrX8Hyz+mslyZNel9qhlDc+mVkUnyOEK5eryDRpRth9eUY+XAF35aIvm59Tt6iJH97x4PTXfvlNU6y2y9f5fU1gKJwh4eIP7gmrCwG1hbk1iv1HYpjIziKia1Cp+cVkEjgT9rkKZvs1FryNjPusT1l9PoH++AFUiCXC4ymwPuUHfOVxmEaNdJoVw3pLo5nUOYQCGAFWPOfxgIe/+pfQj4bpONn77jSqiL8PWpYZB2hBZcIknLtVLv0tq/JLcfT2D9sUsAq1d3qbjl84fzkqhUsU9N1OR1pU+0Q5jYhDlMSf8a6n4jBU2paQIUsFUZ/Ov9+98puaxPlSNo6e8bYkNwN/SZ85g4ET5FsEb235dw58AneeluRaZQjruhLh3uKfKVQFkKiwKJThdZxCzbO0zgqm2QT0YomKdJz+VIbSADmyK9QVnQp/HYnXXWSbA2sa/LE+2jSjY5kND0SkJiy8h/QfXHRCwamMaGnGQGO8eGfCgh1ehhoFnT1NAJJNpdh21CAeV5CcqaV6abhiSP1TS0SN2oSeCX0fj1kWaIxdvRH1Qu9OmXUiUsPQs6fRo/SsYOvtXq77IvLL27eKEuuq92y2+XL7ulyoYqPu9GgcFYJes1P8zidFNDl1a+y2S54gx64uNYH8fmGBLUuOXs60aZF1UW3pW24HD8iVuIIpkiTVQJ8s+39NFUxdkdSGjajdBtcTQwcZoEC+mDwEZYRvWHtIPI6I64gAk6XzBxb7PfqHSY6MR3kMUVeGu";		//1、打印数据
                            let printData: string = e.PrintData;	//1、打印数据
                            var temp = e.StandardTemplate;	        //2、打印模版
                            var tempUser = "";					    //3、打印自定义模版
                            var printDataUser = "";				    //4、打印自定义数据
                            var printCmd = "print";				    //5、打印指令
                            var printName = "HPRT R42D";		    //6、打印机名称
                            var text = "{\"orderType\": \"" + printCmd + "\", \"parameters\": {\"printName\": \"" + printName + "\", 		\"tempUrl\": \"" + temp + "\", \"customTempUrl\": \"" + tempUser + "\", \"customData\": [" + printDataUser + "], 	\"printData\": [\"" + printData + "\"] } }";
                            this.webSocket.send(text);
                            let deliverMainId: number = Number(e.Id.split('_')[1]);
                            this.updateWaybillNumber(deliverMainId, 16, e.DeliveryId);	//更新快递单号
                        } else {
                            console.log(e.ResultMsg + e.Id);
                        }
                    });
                } else {
                    console.log(res);
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            alert('没有选中的数据');
        }
    }

    /**
     * 打印韵达电子面单
     */
    private pringYunDa = async () => {
        let dataList: any[] = [];
        let { no: cutOffMainNo, warehouseDetail } = this.main;


        this.trayNumberListInfo.filter(v => v.carrier === 1).forEach((e: any) => {

            let warehouseNo = warehouseDetail?.no;
            let remark: string = "订单批号:" + cutOffMainNo + "\n" + "提醒注意：（汽运禁航） （务必本人或专人签收）" + "\n" + "临时理货号：" + e.trayNumber;

            dataList.push({
                Id: e.orderMainNo + '_' + e.deliverMain, SaleOrderIds: e.orderMainNo, PickListId: cutOffMainNo, CustomerId: "",
                TrayNumber: e.trayNumber, WarehouseId: warehouseNo, ConsigneeName: e.contactDetail?.name, ConsigneeCity: e.contactDetail?.cityName,
                ConsigneeUnitName: e.contactDetail?.organizationName, ConsigneeAddressDetail: e.contactDetail?.addressString,
                ConsigneeTelephone: e.contactDetail?.telephone, ConsigneeMobile: e.contactDetail?.mobile, IsBaoJia: '0', BaoJia: e.trayProductPrice, Remark: remark
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
                        this.updateWaybillNumber(1, 1, '快递单号');	//更新快递单号
                    } else {
                        console.log(element.ExpressStatus);
                    }
                });

                // printaction(PdfInfos);
                // \\211.5.2.14 王亚静电脑ip
                // var url = "http://127.0.0.1:9090/ydecx/service/mailpx/printDirect.pdf?t=" + new Date().getTime();
                var url = "http://211.5.2.14:9090/ydecx/service/mailpx/printDirect.pdf?t=" + new Date().getTime();
                var pdfform = document.createElement("form");
                pdfform.id = "pdfform";
                pdfform.style.display = "none";
                pdfform.target = "mainbody";
                pdfform.method = "post";
                pdfform.action = url;
                var tname = document.createElement("input");
                tname.name = "tname";
                tname.type = "hidden";
                tname.value = "mailtmp_s8";
                var docname = document.createElement("input");
                docname.type = "hidden";
                docname.name = "docname";
                docname.value = "mailpdfm1";
                var value = document.createElement("input");
                value.type = "hidden";
                value.name = "value";
                value.value = PdfInfos;

                document.getElementById('hawblayout_print').append(pdfform);
                pdfform.appeappendChildnd(tname);
                pdfform.appendChild(docname);
                pdfform.appendChild(value);
                pdfform.submit();
            } else {
                console.log(res);
            }
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * 打印宅急送电子面单
     */
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
                        this.updateWaybillNumber(1, 1, '快递单号');	//更新快递单号
                        // $("#barcodeTarget2").empty().barcode(element.ExpressCode, "code128", { barWidth: 2, barHeight: 50, fontSize: 14, fontOptions: "bold", showHRI: true });
                        // $("#barcodeTarget").empty().barcode(element.ExpressCode, "code128", { barWidth: 1, barHeight: 30, fontSize: 10, fontOptions: "bold", showHRI: true });
                        JsBarcode('barcodeTarget2', element.ExpressCode, { format: 'CODE128', width: 2, height: 50, fontSize: 14, fontOptions: 'bold', displayValue: true });
                        JsBarcode('barcodeTarget', element.ExpressCode, { format: 'CODE128', width: 1, height: 30, fontSize: 10, fontOptions: 'bold', displayValue: true });
                        var spanConsigneeAddressDetail = document.getElementsByClassName("ConsigneeAddressDetail");
                        for (let index = 0; index < spanConsigneeAddressDetail.length; index++) {
                            spanConsigneeAddressDetail[index].innerHTML = element.ConsigneeAddressDetail + ",(" + element.ConsigneeUnitName + ")";
                        }
                        document.getElementById("VcityCode").innerText = element.VcityCode;
                        document.getElementById("SiteNo").innerText = element.SiteNo;
                        document.getElementById("SiteName").innerText = element.SiteName;
                        document.getElementById("ProvinceName").innerText = element.ProvinceName;
                        document.getElementById("CityName").innerText = element.CityName;
                        document.getElementById("TownNme").innerText = element.TownNme;
                        var spanConsigneeName = document.getElementsByClassName("ConsigneeName");
                        for (let index = 0; index < spanConsigneeName.length; index++) {
                            spanConsigneeName[index].innerHTML = element.ConsigneeName;
                        }
                        var spanConsigneeMobile = document.getElementsByClassName("ConsigneeMobile");
                        for (let index = 0; index < spanConsigneeMobile.length; index++) {
                            spanConsigneeMobile[index].innerHTML = element.ConsigneeMobile;
                        }
                        document.getElementById("ConsigneeTelephone").innerText = element.ConsigneeTelephone;
                        var spanExpressOrderNo = document.getElementsByClassName("ExpressOrderNo");
                        for (let index = 0; index < spanExpressOrderNo.length; index++) {
                            spanExpressOrderNo[index].innerHTML = element.ExpressOrderNo;
                        }
                        document.getElementById("ImportantHints").innerText = element.ImportantHints;
                        document.getElementById("Createdate").innerText = element.Createdate;
                        document.getElementById("ExpressCode").innerText = element.ExpressCode;
                        setTimeout(() => {
                            // 增加延时机制则成功哪怕延迟1毫秒也正常执行;
                            printJS({
                                printable: 'PrintZJSHtml', // 要打印内容的id
                                type: 'html',               // 可以打印html,img详细的可以在官方文档https://printjs.crabbly.com/中查询
                                scanStyles: true,          // 默认样式
                                documentTitle: '.'
                            });
                        }, 1);

                        // $(".ShipperUnitName").text(element.ShipperUnitName); // null
                        // $(".AcceptanceUnitName").text(element.AcceptanceUnitName); // null
                        // $(".DeclaredValue").text(element.DeclaredValue);    // null
                        // $(".ConsigneeUnitName").text(element.ConsigneeUnitName); // null
                        // $(".CollectionAmount").text(element.CollectionAmount); // null

                        /* var printhtml = document.getElementById("PrintZJSHtml").innerHTML;
                        //打印文件名称
                        LODOP.PRINT_INIT(ExpressReturn.ExpressCode + "宅急送快递单");
                        //打印纸大小
                        LODOP.SET_PRINT_PAGESIZE(0, "10cm", "15cm", "10*15")
                        LODOP.ADD_PRINT_HTM(0, 0, "100%", "15cm", printhtml);
                        LODOP.SET_PRINTER_INDEX("Xprinter XP-460B");
                        LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS", true);
                        var Pid = LODOP.PRINT();
                        return LODOP.GET_VALUE("PRINT_STATUS_TEXT", Pid); */
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

    /**
     * 打印顺丰电子面单
     */
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

                    this.updateWaybillNumber(1, 1, '快递单号');	//更新快递单号

                    document.getElementById("SF_proCode").innerText = element.proCode;
                    JsBarcode("#SF_waybillNumber", element.waybillNumber, { format: "CODE128A", height: 30, width: 2, displayValue: false });
                    document.getElementById("SF_waybillNumber_text").innerText = element.waybillNumber;
                    document.getElementById("SF_destRouteLabel").innerText = element.destRouteLabel;
                    document.getElementById("SF_Consignee").innerText = element.ConsigneeName + " " + element.ConsigneeMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') + " " + element.ConsigneeUnitName;
                    document.getElementById("SF_ConsigneeAddress").innerText = element.SF_ConsigneeAddress;
                    document.getElementById("SF_Sender").innerText = element.senderName + " " + element.senderTel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') + " " + element.senderCompany;
                    document.getElementById("SF_SenderAddress").innerText = element.senderAddress;
                    document.getElementById("SF_codingMappingOut").innerText = element.codingMappingOut;
                    document.getElementById('SF_twoDimensionCode').innerHTML = "";
                    // var qrcode = 
                    new QRCode("SF_twoDimensionCode", {
                        text: element.twoDimensionCode,
                        width: 100,
                        height: 100
                    });

                    alert("点击确认开始打印");
                    document.getElementById('SF_remark').innerHTML = element.remark + "\n提醒注意：（汽运禁航） （务必本人或专人签收）";
                    JsBarcode("#SF_waybillNumber_col", element.waybillNumber, { format: "CODE128A", height: 30, width: 2, displayValue: false });

                    var testDiv = document.getElementById("SF_waybillNumber_col");
                    testDiv.style.float = "left";

                    var printhtml = document.getElementById("#PrintSFHtml").innerHTML;
                    document.getElementById("PrintSFHtml").style.display = "";//显示
                    setTimeout(() => {
                        // 增加延时机制则成功哪怕延迟1毫秒也正常执行;
                        printJS({
                            printable: 'PrintSFHtml', // 要打印内容的id
                            type: 'html',               // 可以打印html,img详细的可以在官方文档https://printjs.crabbly.com/中查询
                            scanStyles: true,          // 默认样式
                            documentTitle: '.'
                        });
                    }, 1);

                    /*
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

        let { carrierList } = this.controller;
        let { JkDeliver, JkProduct, JkCustomer, JkWarehouse } = this.controller.uqs;
        let { ProductX } = JkProduct;
        let PackX = ProductX.div('packx');
        let { Customer, Contact } = JkCustomer;
        //let { ExpressLogistics } = JkWarehouse;

        let { deliverMain, trayNumber, contact, customer, carrier, waybillNumber, deliverTime, deliverDetail,
            item, product, tallyShould, content, productExt } = cutOffItem;
        let pack = PackX.getObj(item);

        let note: string;
        // let apointCarrierId: any;
        if (content) {
            let formatContent: string = String(content).replace(/\r\n/g, "").replace(/\r/g, "").replace(/\n/g, "");
            let jsonContect: any = JSON.parse(formatContent);
            note = jsonContect.deliverNotes;
            // let apointCarrier: any = jsonContect.shouldExpressLogistics[0];
            // apointCarrierId = carrierList.find((e: any) => e.no === apointCarrier)?.id;
        }

        let carriers = <select className="form-control col-8 px-0 mx-0" defaultValue={carrier === undefined ? 0 : carrier}
            onChange={o => {
                // cutOffItem.carrier = o.target.value;
                this.detail[index].carrier = o.target.value;
                this.updateCarrier(deliverMain, Number(o.target.value))
            }}>
            {carrierList.map((el: any) => {
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
                    {carriers}
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

            <div id="hawblayout_print" style={{ display: 'none' }}>
                <iframe id="mainbody" width="0" height="0"></iframe>
            </div>

            <div id="PrintZJSHtml" style={{ display: 'none', width: '10cm', fontFamily: '黑体', height: '15cm' }}>
                <div style={{ width: '10cm', height: '0.5cm' }}>
                    <p>
                        <span id="SiteName" style={{ fontFamily: '黑体', fontSize: '18px', fontWeight: 'bold', textAlign: 'center', width: '9cm' }} ></span>
                        <span style={{ fontFamily: '黑体', fontSize: '24px', fontWeight: 'bold', textAlign: 'right' }}>L</span>
                    </p>
                </div>
                <div style={{ width: '9.3cm', height: '0.3cm', textAlign: 'center' }}>
                    <p>
                        <span id="VcityCode" style={{ fontFamily: '黑体', fontSize: '36px', fontWeight: 'bold' }} ></span>
                        <span style={{ fontFamily: '黑体', fontSize: '36px', fontWeight: 'bold' }}>-</span>
                        <span id="SiteNo" style={{ fontFamily: '黑体', fontSize: '36px', fontWeight: 'bold' }}></span>
                    </p>
                </div>
                <div style={{ width: '9.3cm', height: '1.3cm', textAlign: 'center' }}>
                    <div id="barcodeTarget2"></div>
                </div>
                <div style={{ width: '10cm', fontFamily: '黑体', height: '1.6cm' }}>
                    <table cellSpacing={0} cellPadding={0} style={{ margin: '0px', padding: '0px', height: '1.6cm', borderCollapse: 'collapse', borderTop: '2px solid #000', borderBottom: '2px solid #000', width: '100%' }}>
                        <tr>
                            <td height="1.6cm" style={{ borderRight: '1px solid #000', textAlign: 'center', width: '4%', writingMode: 'vertical-lr' }} rowSpan={2} ><span style={{ fontSize: '12px', fontFamily: '黑体' }}>收件人</span></td>
                            <td><span className="ConsigneeAddressDetail" style={{ fontFamily: '黑体', fontSize: '13px', fontWeight: 'bold' }}></span></td>
                        </tr>
                        <tr>
                            <td><span className="ConsigneeName" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '14px', width: '3cm' }}></span><span className="ConsigneeMobile" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '13px', width: '3cm' }}></span><span className="ConsigneeTelephone" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '13px' }}></span></td>
                        </tr>
                    </table>
                </div>
                <div style={{ width: '10cm', fontFamily: '黑体', height: '0.9cm' }}>
                    <table style={{ margin: '0px', padding: '0px', height: '0.9cm', borderCollapse: 'collapse', borderBottom: '2px solid #000', width: '100%' }} cellSpacing={0} cellPadding={0}>
                        <tr>
                            <td height="0.9cm" rowSpan={2} style={{ borderRight: '1px solid #000', textAlign: 'center', width: '4%', writingMode: 'vertical-lr' }}><span style={{ fontSize: '7px', fontFamily: '黑体' }}>寄件人</span></td>
                            <td style={{ marginLeft: '2cm', width: '82%' }}><span style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '10px' }}>北京 北京 大厂县 东燕郊潮白河工业区</span></td>
                            <td style={{ borderLeft: '1px solid #000', textAlign: 'left', width: '14%' }}><span style={{ fontSize: '9px', fontFamily: '黑体', fontWeight: 'bold' }}>已验收</span></td>
                        </tr>
                        <tr>
                            <td style={{ marginLeft: '2cm', width: '82%' }}><span style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '10px' }}>李晨辉  400-666-7788</span></td>
                            <td style={{ borderLeft: '1px solid #000', textAlign: 'left', width: '14%' }}><span style={{ fontSize: '9px', fontFamily: '黑体', fontWeight: 'bold' }}>已实名</span></td>
                        </tr>
                    </table>
                </div>
                <div style={{ width: '10cm', fontFamily: '黑体', height: '2.9cm' }}>
                    <table style={{ margin: '0px', padding: '0px', height: '1cm', borderTopWidth: '0px', borderCollapse: 'collapse' }} cellSpacing={0} cellPadding={0}>
                        <tr>
                            <td><span style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: '黑体' }}>重要提示：</span><span className="ImportantHints" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px' }}></span></td>
                        </tr>
                    </table>
                    <table style={{ margin: '0px', padding: '0px', height: '1.9cm', borderCollapse: 'collapse', borderBottom: '2px solid #000', width: '100%' }} cellSpacing={0} cellPadding={0}>
                        <tr>
                            <td><span style={{ fontSize: '9px', fontFamily: '黑体', width: '4cm' }}>品名：样品</span></td>
                            <td><span style={{ fontSize: '11px', fontWeight: 'bold', fontFamily: '黑体' }}>总代收款：</span></td>
                        </tr>
                        <tr>
                            <td><span style={{ fontSize: '9px', fontFamily: '黑体', width: '4cm' }}>件数：一件      计费重量：0.5公斤</span></td>
                            <td><span style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: '黑体' }}>￥0.00元</span></td>
                        </tr>
                        <tr>
                            <td rowSpan={2}><span style={{ fontSize: '18px', fontFamily: '黑体', fontWeight: 'bold', width: '4cm' }}>签收人：</span></td>
                            <td><span style={{ fontSize: '9px', fontFamily: '黑体' }}>打印单位：J&K Scientific Ltd</span></td>
                        </tr>
                        <tr>
                            <td><span style={{ fontSize: '9px', fontFamily: '黑体', fontWeight: 'bold' }}>打印时间：</span><span className="Createdate" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '9px' }}></span></td>
                        </tr>
                    </table>
                </div>
                <div style={{ width: '10cm', fontFamily: '黑体', height: '3cm' }}>
                    <table style={{ margin: '0px', padding: '0px', height: '1.7cm', borderTopWidth: '0px', borderCollapse: 'collapse', border: '0px' }} cellSpacing={0} cellPadding={0}>
                        <tr>
                            <td><span style={{ fontSize: '12px', fontFamily: '黑体', fontWeight: 'bold' }}>条码号：</span><span className="ExpressCode" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', width: '5cm' }}></span></td>
                            <td><span style={{ fontSize: '12px', fontFamily: '黑体', fontWeight: 'bold' }}>代收款：0.00元</span></td>
                        </tr>
                        <tr>
                            <td><span style={{ fontSize: '12px', fontFamily: '黑体', fontWeight: 'bold' }}>客户单号：</span><span className="ExpressOrderNo" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', width: '5cm' }}></span></td>
                            <td><span style={{ fontSize: '10px', fontFamily: '黑体' }}>计费重量：0.5公斤</span></td>
                        </tr>
                        <tr>
                            <td><span style={{ fontSize: '10px', fontFamily: '黑体' }}>品名：样品</span></td>
                        </tr>
                    </table>
                    <table style={{ margin: '0px', padding: '0px', height: '1.3cm', borderBottom: '2px solid #000', width: '100%', borderCollapse: 'collapse' }} cellSpacing={0} cellPadding={0}>
                        <tr>
                            <td><span style={{ fontSize: '12px', fontFamily: '黑体', fontWeight: 'bold' }}>寄件人：李晨辉  400-666-7788    北京  北京  大厂县</span></td>
                        </tr>
                        <tr>
                            <td><span style={{ fontSize: '12px', fontFamily: '黑体', fontWeight: 'bold' }}>收件人：</span><span className="ConsigneeName" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', marginRight: '3px' }}></span><span className="ConsigneeMobile" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', marginRight: '3px' }}></span><span className="ConsigneeAddressDetail" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '8px', marginLeft: '6px' }}></span></td>
                        </tr>
                    </table>
                </div>
                <div style={{ width: '10cm', fontFamily: '黑体', height: '2.4cm' }}>
                    <table style={{ margin: '0px', padding: '0px', height: '1cm', borderTopWidth: '0px', borderCollapse: 'collapse', border: '0px' }} cellSpacing={0} cellPadding={0} >
                        <tr>
                            <td><span style={{ fontSize: '12px', fontFamily: '黑体', fontWeight: 'bold' }}>收件人：</span><span className="ConsigneeName" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', marginRight: '3px' }}></span><span className="ConsigneeMobile" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', marginRight: '3px' }}></span><span id="ProvinceName" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', marginRight: '3px' }}></span><span id="CityName" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', marginRight: '3px' }}></span><span id="TownNme" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', marginLeft: '3px' }}></span></td>
                        </tr>
                        <tr>
                            <td><span style={{ fontSize: '12px', fontFamily: '黑体', fontWeight: 'bold' }}>客户单号：</span><span className="ExpressOrderNo" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '10px', width: '4.6cm' }}></span><span style={{ fontSize: '10px', fontFamily: '黑体' }}>品名：样品</span></td>
                        </tr>
                    </table>
                    <table style={{ margin: '0px', padding: '0px', height: '1.4cm', borderTopWidth: '0px', borderCollapse: 'collapse', border: '0px' }} cellSpacing={0} cellPadding={0}>
                        <tr>
                            <td>
                                <div style={{ width: '6cm', height: '1.4cm' }}>
                                    <div id="barcodeTarget" style={{ marginLeft: '0.5cm' }}></div>
                                </div>
                            </td>
                            <td><span style={{ fontSize: '10px', fontFamily: '黑体' }}>件数：共 1 件</span></td>
                        </tr>
                    </table>
                </div>
            </div>


            <div id="PrintSFHtml" style={{ height: '13cm', width: '7.6cm', borderStyle: 'dashed', border: '1px dashed #000', display: 'none' }}>
                <div>
                    <table style={{ width: '7.6cm' }}>
                        <tr>
                            <td align='right' colSpan={2} style={{ height: '1.4cm', borderBottom: '1px dashed #000' }}>
                                <label id="SF_proCode" style={{ fontFamily: 'SimHei', fontSize: '26pt', marginRight: '0.3cm', lineHeight: '26pt' }}></label>
                                <br />
                                <label style={{ fontFamily: 'STSong', fontSize: '6pt', marginRight: '3cm' }}>打印时间: <span id="cg"></span></label>
                            </td>
                        </tr>
                        <tr style={{ borderBottom: '1px dashed #000', textAlign: 'center' }}>
                            <td style={{ height: '2.1cm', width: '7.6cm' }} colSpan={2}>
                                <table style={{ width: '100%' }}>
                                    <tr>
                                        <td colSpan={2} align='center'><img id="SF_waybillNumber" style={{ width: '6.6cm', height: '1.3cm', lineHeight: '1.3cm' }} /></td>
                                    </tr>
                                    <tr>
                                        <td align="right"> </td>
                                        <td align="center"><label id="SF_waybillNumber_text" style={{ fontFamily: 'SimHei', fontSize: '10pt', fontWeight: 'bolder' }}></label></td>
                                    </tr>
                                    <tr style={{ display: 'none' }}>
                                        <td align="right"><label style={{ fontFamily: 'SimHei', fontSize: '10pt', fontWeight: 'bolder' }}> </label></td>
                                        <td align="center"><label style={{ fontFamily: 'SimHei', fontSize: '10pt', fontWeight: 'bolder' }}> </label></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr style={{ borderBottom: '1px dashed #000', textAlign: 'center' }}><td style={{ height: '0.8cm', width: '7.6cm' }} colSpan={2}><label id="SF_destRouteLabel" style={{ fontFamily: 'SimHei', fontSize: '22pt', fontWeight: 'bolder', lineHeight: '22pt' }}></label></td></tr>
                        <tr>
                            <td style={{ borderRight: '1px dashed #000' }}>
                                <table>
                                    <tr>
                                        <td>
                                            <table>
                                                <tr style={{ borderBottom: '1px dashed #000' }}>
                                                    <td align="center" style={{ height: '1.9cm', width: '6cm' }} colSpan={2}>
                                                        <table style={{ width: '100%' }}>
                                                            <tr style={{ height: '1.9cm' }}>
                                                                <td align="center"><label style={{ width: '1cm', fontFamily: 'STSong', fontSize: '10pt', fontWeight: 'bolder' }}>收</label></td>
                                                                <td>
                                                                    <div id="SF_Consignee" style={{
                                                                        whiteSpace: 'normal', msWordBreak: 'break-all', wordWrap: 'break-word', lineHeight: '10pt', fontFamily: 'STSong', fontSize: '9pt'
                                                                    }}></div>
                                                                    <div id="SF_ConsigneeAddress" style={{ whiteSpace: 'normal', msWordBreak: 'break-all', wordWrap: 'break-word', lineHeight: '10pt', fontFamily: 'STSong', fontSize: '9pt' }}></div>
                                                                </td>
                                                            </tr>
                                                            <tr style={{ height: '0.8cm' }}>
                                                                <td align="center"><label style={{ width: '1cm', fontFamily: 'STSong', fontSize: '10pt', fontWeight: 'bolder' }}>寄</label></td>
                                                                <td>
                                                                    <div id="SF_Sender" style={{ whiteSpace: 'normal', msWordBreak: 'break-all', wordWrap: 'break-word', lineHeight: '7pt', fontFamily: 'STSong', fontSize: '6pt' }}></div>
                                                                    <div id="SF_SenderAddress" style={{ whiteSpace: 'normal', msWordBreak: 'break-all', wordWrap: 'break-word', lineHeight: '7pt', fontFamily: 'STSong', fontSize: '6pt' }}></div>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ borderRight: '1px dashed #000' }}>
                                                        <table>
                                                            <tr>
                                                                <td align="center" style={{ height: '0.6cm', width: '3.2cm', borderBottom: '1px dashed #000' }}>
                                                                    <label style={{ fontFamily: 'STSong', fontSize: '9pt', fontWeight: 'bolder' }}> </label>
                                                                    <label style={{ fontFamily: 'STSong', fontSize: '9pt', fontWeight: 'bolder' }}> </label>
                                                                    <label style={{ fontFamily: 'STSong', fontSize: '9pt', fontWeight: 'bolder' }}>已验视</label>
                                                                </td>
                                                            </tr>
                                                            <tr><td align="center" style={{ height: '1.2cm', width: '3.2cm', borderBottom: '1px dashed #000' }}> </td></tr>
                                                            <tr><td align="center" style={{ height: '1.2cm', width: '3.2cm', borderBottom: '1px dashed #000' }}><label id="SF_codingMappingOut" style={{ fontFamily: 'SimHei', fontSize: '40pt', fontWeight: 'bolder', lineHeight: '40pt' }}></label></td></tr>
                                                        </table>
                                                    </td>
                                                    <td align="center" style={{ height: '3cm', width: '2.8cm', borderBottom: '1px dashed #000' }}>
                                                        <div id="SF_twoDimensionCode" style={{ width: '2.5cm', height: '2.5cm', marginTop: '0.25cm', marginRight: '0.15cm' }}></div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ height: '0.6cm', width: '6cm', borderBottom: '1px dashed #000' }} colSpan={2}><label style={{ fontFamily: 'STSong', fontSize: '6pt', fontWeight: 'bolder' }}>签收:</label></td>
                                    </tr>
                                    <tr>
                                        <td align="center" style={{ height: '1.55cm', width: '6cm' }} colSpan={2}>
                                            <table style={{ width: '100%' }}>
                                                <tr><td><label id="SF_remark" style={{ fontFamily: 'STSong', fontSize: '5pt', fontWeight: 'bolder' }}></label><br /></td></tr>
                                                <tr><td align="center"><label style={{ fontFamily: 'STSong', fontSize: '20pt', fontWeight: 'bolder' }}> </label></td></tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td>
                                <table>
                                    <tr style={{ borderBottom: '1px dashed #000' }}>
                                        <td align="center" style={{ height: '7cm', width: '1.6cm' }}><img id="SF_waybillNumber_col" style={{ height: '1.3cm', width: '6cm', marginLeft: '-4.5cm', marginBottom: '-7.4cm', transform: 'rotate(90deg)', transformOrigin: 'right top 0px' }} /></td>

                                    </tr>
                                    <tr>
                                        <td align="center" style={{ height: '1.05cm', width: '1.6cm' }}><label id="SF_proName" style={{ fontFamily: 'STSong', fontSize: '9pt', fontWeight: 'bolder' }}>陆运包裹</label></td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </div >
        </div>;
    }

    /**
     * webSocket连接
     */
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