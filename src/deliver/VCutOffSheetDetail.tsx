import { VPage, List, LMR, DropdownAction, DropdownActions } from 'tonva-react';
import { CDeliver } from "./CDeliver";
// import { ReturnGetCutOffMainMain, ReturnGetCutOffMainDetail } from "uq-app/uqs/JkDeliver";
// import { VReceiptList } from './VReceiptList';
import { tvPackx } from '../tools/tvPackx';
import JsBarcode from 'jsbarcode';
import printJS from 'print-js';
import QRCode from 'qrcode';
import { format } from 'date-fns';
import getLodop from './printHelper/LodopFuncs';
// import { lodopInitMethod } from 'lodop-printer';
//const QRCode = require('qrcode');

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
                Id: e.orderMainNo + '_' + e.deliverMain, SaleOrderIds: e.orderMainNo, PickListId: cutOffMainNo, CustomerId: e.customer,
                TrayNumber: e.trayNumber, WarehouseId: warehouseNo, ConsigneeName: e.contactDetail?.name, ConsigneeCity: e.contactDetail?.cityName,
                ConsigneeUnitName: e.contactDetail?.organizationName, ConsigneeAddressDetail: e.contactDetail?.addressString,
                ConsigneeTelephone: e.contactDetail?.telephone, ConsigneeMobile: e.contactDetail?.mobile,
                ConsigneeZipCode: e.contactDetail.addressDetail.zipCode === undefined ? '' : e.contactDetail.addressDetail.zipCode,
                IsBaoJia: '0', BaoJia: e.trayProductPrice, Remark: remark
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
                jsonResult.forEach((e: any) => {
                    if (e.ExpressStatus === "1") {
                        PdfInfos += e.PdfInfo + "@";
                        let deliverMainId: number = Number(e.Id.split('_')[1]);
                        this.updateWaybillNumber(deliverMainId, 1, e.ExpressCode);	//更新快递单号
                    } else {
                        console.log(e.ExpressStatus);
                    }
                });
                var url = "http://127.0.0.1:9090/ydecx/service/mailpx/printDirect.pdf?t=" + new Date().getTime();
                var pdfform = document.createElement("form");
                pdfform.id = "pdfform";
                pdfform.style.display = "none";
                pdfform.target = "mainbody";
                pdfform.method = "post";
                pdfform.action = url;

                var tname = document.createElement("input");
                tname.type = "hidden";
                tname.name = "tname";
                tname.value = "mailtmp_s8";
                pdfform.appendChild(tname);

                var docname = document.createElement("input");
                docname.type = "hidden";
                docname.name = "docname";
                docname.value = "mailpdfm1";
                pdfform.appendChild(docname);

                var value = document.createElement("input");
                value.type = "hidden";
                value.name = "value";
                value.value = "tpr9Rwyil5fPDuYgQDQTYj0bPDsMM7ecozYjEfEeJ+w686rLE/xD+QwNKK1TxavdSFnDMzCmTFdaVUdg7HIwDRPEH1Twnrk0cEUV8kKOR6rjlJ/b8yRYbU+FeOJx/bkkhf2tK+tZ8Pt+pof3TgUwpFS+8HN88A++//r8sqxisDD8WgENkUMxp0i+FL1ByTzgPbzg1+irj1MPGRM5X+dn6LUVuFwDosZ2AqG7uPwOxTZgFnJMb3tU5AEkaSa3Kcr2iaAkftjDvQejWG6i6XS0lPv4sRWCNivTCfSuYm+KWCPS2e5Ystj11vPKr+fj9CXrZSjmKWuYQQmZtEvW1Eh9EAjAiqfz4iipBnHRtiDwm/xQxRKQeMMqKq1pEkgA9wHjC9sTWQNQx+2lh2phReutiAF2vpgiPJY4XhKTxlkLWBiLCa9YIV0oAiDc2bm6pxrV9iC8xRxmEQk288Xue4LIYZoqcBHQ0D1mZUsHyneGw7Lk4AYtGRj…b0Uw+5ZeGmKUrwc43a9z8jS+GtOQI3tB7HkOJMWQ+NEPWLf7XOwBqJZT5EdunK6K0w4FCw/55JS3fIqFvECGaEonFLW1bxA24vYBckL0deL2j3KPztO27nVymqyxj2ygFtHTNa5Wn/dtTNS8YvOEjsKYUw5BOjhDs6bdSKoiy6AxedY8uj7HbNhmm/ayaASuporWZp8U0yIuXcHkV9f646TYXSmQh1wOpBlB4AZoDzHD5O/jbwdxj5660gx4JY7sv4GhbuDLS8CkQDGGUWhNgBPr9uOHloZI44vxEtJLWLFhxJSdDJ9WjsbsYV6Su/pZ/h/2YtfL6Vz4l4stWSUd08xhPi5s8IKtwPXGTQOga/JwkzquK4ofjRd2Sny0Y4JPhrw6/S87GJCD+f1CG4hoTQ/l14EPdGLq4YUKVpHnoAZlk4ynRkSJI2fmY2WlMqVoZSihE3mdvvYIVZTgS11R90KBows1V+aPSnQ48opOwFmn3UPFbB";
                pdfform.appendChild(value);

                var div = document.getElementById('hawblayout_print');
                div.append(pdfform);
                pdfform.submit();
                div.removeChild(pdfform);
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

        //let result = "{\"ret\":[{\"Id\":\"MV20210827S0A_33816882\",\"OrderNo\":\"DDZJS008290952342\",\"ExpressOrderNo\":\"MV20210827S0A\",\"VcityCode\":\"010\",\"SiteNo\":\"BH63-66\",\"SiteName\":\"北京_中关村营业所_花园路营业厅\",\"ExpressStatus\":\"0\",\"ExpressErrorCode\":\"OK\",\"ProvinceName\":\"北京市\",\"TownNme\":\"\",\"CityName\":\"北京市\",\"ConsigneeName\":\"张康\",\"ConsigneeMobile\":\"18611114263\",\"ConsigneeTelephone\":\"010-59309000\",\"ConsigneeUnitName\":\"百灵威测试\",\"ExpressCode\":\"ZJS008290952342\",\"ShipperUnitName\":\"J&K Scientific Ltd\",\"AcceptanceUnitName\":\"\",\"DeclaredValue\":\"0\",\"CollectionAmount\":\"0.00\",\"ImportantHints\":\"订单批号:2109270001\\n提醒注意：（汽运禁航）（务必本人或专人签收）\\n临时理货号：5\",\"Createdate\":\"2021-10-09\",\"ConsigneeAddressDetail\":\"北京市北京市朝阳区北辰西路69号峻峰华亭A座5层\"}]}";
        //let jsonResult: any[] = JSON.parse(result).ret;
        let dataList: any[] = [];
        let { no: cutOffMainNo, warehouseDetail } = this.main;

        this.trayNumberListInfo.filter(v => v.carrier === 41).forEach((e: any) => {
            let remark: string = "订单批号:" + cutOffMainNo + "\n" + "提醒注意：（汽运禁航） （务必本人或专人签收）" + "\n" + "临时理货号：" + e.trayNumber;
            let warehouseNo = warehouseDetail?.no;
            dataList.push({
                Id: e.orderMainNo + '_' + e.deliverMain, WarehouseId: warehouseNo, SaleOrderIds: e.orderMainNo, ConsigneeName: e.contactDetail?.name,
                ConsigneeUnitName: e.contactDetail?.organizationName, ConsigneeTelephone: e.contactDetail?.telephone,
                ConsigneeMobile: e.contactDetail?.mobile, ConsigneeProvince: e.contactDetail?.provinceName,
                ConsigneeCity: e.contactDetail?.cityName, ConsigneeAddressDetail: e.contactDetail?.addressString,
                IsBaoJia: '0', BaoJia: e.trayProductPrice, Remark: remark
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

                jsonResult.forEach((e: any) => {
                    if (e.ExpressStatus === "0") {
                        let deliverMainId: number = Number(e.Id.split('_')[1]);
                        this.updateWaybillNumber(deliverMainId, 41, e.ExpressCode);	//更新快递单号

                        document.getElementById("barcodeTarget2").innerHTML = "";
                        JsBarcode("#barcodeTarget2", e.ExpressCode, {
                            format: "CODE128", width: 2, height: 35, fontSize: 14, fontOptions: 'bold italic', displayValue: true,
                            textAlign: "center",    //设置文本的水平对齐方式
                            textMargin: 1,          //设置条形码和文本之间的间距
                            margin: 1               //设置条形码周围的空白边距
                        });
                        document.getElementById("barcodeTarget").innerHTML = "";
                        JsBarcode("#barcodeTarget", e.ExpressCode, {
                            format: 'CODE128', width: 1, height: 30, fontSize: 10, fontOptions: 'bold', displayValue: true,
                            textAlign: "center",    //设置文本的水平对齐方式
                            textMargin: 1,          //设置条形码和文本之间的间距
                            margin: 1               //设置条形码周围的空白边距
                        });
                        var spanConsigneeAddressDetail = document.getElementsByClassName("ConsigneeAddressDetail");
                        for (let index = 0; index < spanConsigneeAddressDetail.length; index++) {
                            spanConsigneeAddressDetail[index].innerHTML = e.ConsigneeAddressDetail + ",(" + e.ConsigneeUnitName + ")";
                        }
                        document.getElementById("VcityCode").innerText = e.VcityCode;
                        document.getElementById("SiteNo").innerText = e.SiteNo;
                        document.getElementById("SiteName").innerText = e.SiteName;
                        document.getElementById("ProvinceName").innerText = e.ProvinceName;
                        document.getElementById("CityName").innerText = e.CityName;
                        document.getElementById("TownNme").innerText = e.TownNme;
                        var spanConsigneeName = document.getElementsByClassName("ConsigneeName");
                        for (let index = 0; index < spanConsigneeName.length; index++) {
                            spanConsigneeName[index].innerHTML = e.ConsigneeName;
                        }
                        var spanConsigneeMobile = document.getElementsByClassName("ConsigneeMobile");
                        for (let index = 0; index < spanConsigneeMobile.length; index++) {
                            spanConsigneeMobile[index].innerHTML = e.ConsigneeMobile;
                        }
                        document.getElementById("ConsigneeTelephone").innerText = e.ConsigneeTelephone;
                        var spanExpressOrderNo = document.getElementsByClassName("ExpressOrderNo");
                        for (let index = 0; index < spanExpressOrderNo.length; index++) {
                            spanExpressOrderNo[index].innerHTML = e.ExpressOrderNo;
                        }
                        document.getElementById("ImportantHints").innerText = e.ImportantHints;
                        document.getElementById("Createdate").innerText = e.Createdate;
                        document.getElementById("ExpressCode").innerText = e.ExpressCode;

                        let LODOP = getLodop();
                        var printhtml = document.getElementById("PrintZJSHtml").innerHTML;
                        //打印文件名称
                        LODOP.PRINT_INIT(e.ExpressCode + "宅急送快递单");
                        //打印纸大小
                        LODOP.SET_PRINT_PAGESIZE(0, "10cm", "15cm", "10*15");
                        LODOP.ADD_PRINT_HTM(0, 0, "100%", "15cm", printhtml);
                        LODOP.SET_PRINTER_INDEX("Xprinter XP-460B");
                        LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS", true);
                        var Pid = LODOP.PRINT();
                        return LODOP.GET_VALUE("PRINT_STATUS_TEXT", Pid);
                    } else {
                        console.log(e.ExpressStatus + ',' + e.ExceptionMessage);
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

        let result = "{ \"ret\":[{\"id\":\"SHMV20210603Z516Z_33816892\",\"proCode\":\"标快\",\"waybillNumber\":\"SF1331875979567\",\"destRouteLabel\":\"010W-AE-003\",\"ConsigneeName\":\"张康\",\"ConsigneeMobile\":\"18611114263\",\"ConsigneeUnitName\":\"百灵威测试\",\"ConsigneeAddress\":\"北京市北京市朝阳区北辰西路69号峻峰华亭A座5层\",\"senderName\":\"龚肃斌\",\"senderTel\":\"13818181523\",\"senderCompany\":\"J&K\",\"senderAddress\":\"上海市浦东新区唐镇上丰路955号3号门\",\"codingMappingOut\":\"3A\",\"twoDimensionCode\":\"MMM={'k1':'010W','k2':'010AE','k3':'003','k4':'T6','k5':'SF1331875979567','k6':'','k7':'53528168'}\",\"remark\":\"订单批号:2109270001\\n提醒注意：（汽运禁航）（务必本人或专人签收）\\n临时理货号：10\",\"waybillNumber_col\":\"SF1331875979567\",\"proName\":\"陆运包裹\"}]}";
        let jsonResult: any[] = JSON.parse(result).ret; // JSON.parse(ret);
        jsonResult.forEach((element: any) => {

            let deliverMainId: number = Number(element.id.split('_')[1]);
            this.updateWaybillNumber(deliverMainId, 32, element.waybillNumber);	//更新快递单号

            document.getElementById("SF_proCode").innerText = element.proCode;
            document.getElementById("SF_waybillNumber").innerHTML = "";
            JsBarcode("#SF_waybillNumber", element.waybillNumber, {
                format: "CODE128", width: 1, height: 45, fontSize: 15, displayValue: true,
                textAlign: "center",    //设置文本的水平对齐方式
                textMargin: 10,          //设置条形码和文本之间的间距
                margin: 2               //设置条形码周围的空白边距
            });
            document.getElementById("SF_waybillNumber_text").innerText = element.waybillNumber;
            document.getElementById("SF_destRouteLabel").innerText = element.destRouteLabel;
            document.getElementById("SF_Consignee").innerText = element.ConsigneeName + " " + element.ConsigneeMobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') + " " + element.ConsigneeUnitName;
            document.getElementById("SF_ConsigneeAddress").innerText = element.ConsigneeAddress;
            document.getElementById("SF_Sender").innerText = element.senderName + " " + element.senderTel.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') + " " + element.senderCompany;
            document.getElementById("SF_SenderAddress").innerText = element.senderAddress;
            document.getElementById("SF_codingMappingOut").innerText = element.codingMappingOut;
            document.getElementById('SF_twoDimensionCode').innerHTML = "";

            QRCode.toCanvas(document.getElementById("SF_twoDimensionCode"), element.twoDimensionCode, {
                width: 100
            }, function (error: any) {
                if (error) console.log(error);
                console.log();
            });

            alert("点击确认开始打印");
            document.getElementById('SF_remark').innerHTML = element.remark;
            JsBarcode("#SF_waybillNumber_col", element.waybillNumber, { format: "CODE128A", height: 30, width: 2, displayValue: false });

            var testDiv = document.getElementById("SF_waybillNumber_col");
            testDiv.style.float = "left";

            /*var bdhtml = window.document.body.innerHTML;
            var prnhtml = document.getElementById("PrintSFHtml").outerHTML;
            window.document.body.innerHTML = prnhtml; //把需要打印的指定内容赋给body.innerHTML

            window.print(); //调用浏览器的打印功能打印指定区域
            //window.print(); //调用浏览器的打印功能打印指定区域
            window.document.body.innerHTML = bdhtml; // 最后还原页面*/

            //var printhtml = document.getElementById("PrintSFHtml").outerHTML;
            //document.getElementById("PrintSFHtml").style.display = "";//显示
            /*setTimeout(() => {
                // 增加延时机制则成功哪怕延迟1毫秒也正常执行;
                printJS({
                    printable: 'PrintSFHtml', // 要打印内容的id
                    type: 'html',               // 可以打印html,img详细的可以在官方文档https://printjs.crabbly.com/中查询
                    //scanStyles: true,          // 默认样式
                    documentTitle: '.'
                });
            }, 1);*/

            var printhtml = document.getElementById("PrintSFHtml").innerHTML;
            document.getElementById("PrintSFHtml").style.display = "";//显示
            let LODOP = getLodop();
            //打印文件名称
            LODOP.PRINT_INIT(element.waybillNumber + "宅急送快递单");
            //打印纸大小
            LODOP.SET_PRINT_PAGESIZE(0, "7.6cm", "13cm", "7.6*13");
            LODOP.ADD_PRINT_HTM(0, 0, "100%", "13cm", printhtml);
            LODOP.SET_PRINTER_INDEX("211.5.9.23 上的 HP LaserJet Pro MFP M125-M126 PCLmS");
            LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS", true);
            var Pid = LODOP.PRINT();
            return LODOP.GET_VALUE("PRINT_STATUS_TEXT", Pid);

        });
        return;

        let dataList: any[] = [];
        let { no: cutOffMainNo, warehouseDetail } = this.main;
        this.trayNumberListInfo.filter(v => v.carrier === 32).forEach((e: any) => {
            let remark: string = "订单批号:" + cutOffMainNo + "\n" + "提醒注意：（汽运禁航） （务必本人或专人签收）" + "\n" + "临时理货号：" + e.trayNumber;
            let warehouseNo = warehouseDetail?.no;
            dataList.push({
                Id: e.orderMainNo + '_' + e.deliverMain, ConsigneeName: e.contactDetail?.name,
                ConsigneeUnitName: e.contactDetail?.organizationName, ConsigneeTelephone: e.contactDetail?.telephone,
                ConsigneeMobile: e.contactDetail?.mobile, ConsigneeAddressDetail: e.contactDetail?.addressString,
                IsBaoJia: '0', BaoJia: e.trayProductPrice, Remark: remark
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
                jsonResult.forEach((element: any) => {

                    let deliverMainId: number = Number(element.Id.split('_')[1]);
                    this.updateWaybillNumber(deliverMainId, 32, element.ExpressCode);	//更新快递单号

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
                    QRCode.toCanvas(document.getElementById("SF_twoDimensionCode"), element.twoDimensionCode, {
                        width: 100
                    }, function (error: any) {
                        if (error) console.log(error);
                        console.log();
                    });

                    alert("点击确认开始打印");
                    document.getElementById('SF_remark').innerHTML = element.remark;
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
                this.updateCarrier(deliverMain, Number(o.target.value));
            }}>
            {carrierList.map((el: any) => {
                return <option key={el.id} value={el.id}>{el.name}</option>;
            })}
        </select>;

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
                {<div className="col-3 pl-0 pr-0 form-inline">
                    <span className="text-muted small">{deliverTime ? format(deliverTime, 'yyyy/MM/dd HH:mm:ss') : ''} </span>
                </div>}
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


            <div id="hawblayout_print" style={{ display: 'none' }}>
                <iframe id="mainbody" width="0" height="0"></iframe>
            </div>

            <div id="PrintZJSHtml" style={{ display: 'none', width: '10cm', fontFamily: '黑体', height: '15cm' }}>
                <div style={{ width: '10cm', height: '0.3cm', textAlign: 'center' }}>
                    <p>
                        <span id="SiteName" style={{ fontFamily: '黑体', fontSize: '18px', fontWeight: 'bold', width: '9cm' }} ></span>
                        <span style={{ fontFamily: '黑体', fontSize: '24px', fontWeight: 'bold', float: 'right' }}>L</span>
                    </p>
                </div>
                <div style={{ width: '10cm', height: '1.0cm', textAlign: 'center' }}>
                    <p>
                        <span id="VcityCode" style={{ fontFamily: '黑体', fontSize: '32px', fontWeight: 'bold' }} ></span>
                        <span style={{ fontFamily: '黑体', fontSize: '32px', fontWeight: 'bold' }}>-</span>
                        <span id="SiteNo" style={{ fontFamily: '黑体', fontSize: '32px', fontWeight: 'bold' }}></span>
                    </p>
                </div>
                <div style={{ width: '10cm', height: '1.5cm', textAlign: 'center' }}>
                    <img id="barcodeTarget2" ></img>
                </div>
                <div style={{ width: '10cm', fontFamily: '黑体', height: '1.6cm' }}>
                    <table cellSpacing={0} cellPadding={0} style={{ margin: '0px', padding: '0px', height: '1.6cm', borderCollapse: 'collapse', borderTop: '2px solid #000', borderBottom: '2px solid #000', width: '100%' }}>
                        <tbody>
                            <tr>
                                <td height="1.6cm" style={{ borderRight: '1px solid #000', textAlign: 'center', width: '4%', writingMode: 'vertical-lr' }} rowSpan={2} ><span style={{ fontSize: '12px', fontFamily: '黑体' }}>收件人</span></td>
                                <td><span className="ConsigneeAddressDetail" style={{ fontFamily: '黑体', fontSize: '13px', fontWeight: 'bold' }}></span></td>
                            </tr>
                            <tr>
                                <td><span className="ConsigneeName" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '14px', width: '3cm' }}></span><span className="ConsigneeMobile" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '13px', width: '3cm' }}></span><span id="ConsigneeTelephone" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '13px' }}></span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ width: '10cm', fontFamily: '黑体', height: '0.9cm' }}>
                    <table style={{ margin: '0px', padding: '0px', height: '0.9cm', borderCollapse: 'collapse', borderBottom: '2px solid #000', width: '100%' }} cellSpacing={0} cellPadding={0}>
                        <tbody>
                            <tr>
                                <td height="0.9cm" rowSpan={2} style={{ borderRight: '1px solid #000', textAlign: 'center', width: '4%', writingMode: 'vertical-lr' }}><span style={{ fontSize: '7px', fontFamily: '黑体' }}>寄件人</span></td>
                                <td style={{ marginLeft: '2cm', width: '82%' }}><span style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '10px' }}>北京 北京 大厂县 东燕郊潮白河工业区</span></td>
                                <td style={{ borderLeft: '1px solid #000', textAlign: 'left', width: '14%' }}><span style={{ fontSize: '9px', fontFamily: '黑体', fontWeight: 'bold' }}>已验收</span></td>
                            </tr>
                            <tr>
                                <td style={{ marginLeft: '2cm', width: '82%' }}><span style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '10px' }}>李晨辉  400-666-7788</span></td>
                                <td style={{ borderLeft: '1px solid #000', textAlign: 'left', width: '14%' }}><span style={{ fontSize: '9px', fontFamily: '黑体', fontWeight: 'bold' }}>已实名</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ width: '10cm', fontFamily: '黑体', height: '2.9cm' }}>
                    <table style={{ margin: '0px', padding: '0px', height: '1cm', borderTopWidth: '0px', borderCollapse: 'collapse' }} cellSpacing={0} cellPadding={0}>
                        <tbody>
                            <tr>
                                <td><span style={{ fontSize: '12px', fontWeight: 'bold', fontFamily: '黑体' }}>重要提示：</span><span id="ImportantHints" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px' }}></span></td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ margin: '0px', padding: '0px', height: '1.9cm', borderCollapse: 'collapse', borderBottom: '2px solid #000', width: '100%' }} cellSpacing={0} cellPadding={0}>
                        <tbody>
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
                                <td><span style={{ fontSize: '9px', fontFamily: '黑体', fontWeight: 'bold' }}>打印时间：</span><span id="Createdate" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '9px' }}></span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ width: '10cm', fontFamily: '黑体', height: '3cm' }}>
                    <table style={{ margin: '0px', padding: '0px', height: '1.7cm', borderTopWidth: '0px', borderCollapse: 'collapse', border: '0px' }} cellSpacing={0} cellPadding={0}>
                        <tbody>
                            <tr>
                                <td><span style={{ fontSize: '12px', fontFamily: '黑体', fontWeight: 'bold' }}>条码号：</span><span id="ExpressCode" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', width: '5cm' }}></span></td>
                                <td><span style={{ fontSize: '12px', fontFamily: '黑体', fontWeight: 'bold' }}>代收款：0.00元</span></td>
                            </tr>
                            <tr>
                                <td><span style={{ fontSize: '12px', fontFamily: '黑体', fontWeight: 'bold' }}>客户单号：</span><span className="ExpressOrderNo" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', width: '5cm' }}></span></td>
                                <td><span style={{ fontSize: '10px', fontFamily: '黑体' }}>计费重量：0.5公斤</span></td>
                            </tr>
                            <tr>
                                <td><span style={{ fontSize: '10px', fontFamily: '黑体' }}>品名：样品</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ margin: '0px', padding: '0px', height: '1.3cm', borderBottom: '2px solid #000', width: '100%', borderCollapse: 'collapse' }} cellSpacing={0} cellPadding={0}>
                        <tbody>
                            <tr>
                                <td><span style={{ fontSize: '12px', fontFamily: '黑体', fontWeight: 'bold' }}>寄件人：李晨辉  400-666-7788    北京  北京  大厂县</span></td>
                            </tr>
                            <tr>
                                <td><span style={{ fontSize: '12px', fontFamily: '黑体', fontWeight: 'bold' }}>收件人：</span><span className="ConsigneeName" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', marginRight: '3px' }}></span><span className="ConsigneeMobile" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', marginRight: '3px' }}></span><span className="ConsigneeAddressDetail" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '8px', marginLeft: '6px' }}></span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div style={{ width: '10cm', fontFamily: '黑体', height: '2.4cm' }}>
                    <table style={{ margin: '0px', padding: '0px', height: '1cm', borderTopWidth: '0px', borderCollapse: 'collapse', border: '0px' }} cellSpacing={0} cellPadding={0} >
                        <tbody>
                            <tr>
                                <td><span style={{ fontSize: '12px', fontFamily: '黑体', fontWeight: 'bold' }}>收件人：</span><span className="ConsigneeName" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', marginRight: '3px' }}></span><span className="ConsigneeMobile" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', marginRight: '3px' }}></span><span id="ProvinceName" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', marginRight: '3px' }}></span><span id="CityName" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', marginRight: '3px' }}></span><span id="TownNme" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '12px', marginLeft: '3px' }}></span></td>
                            </tr>
                            <tr>
                                <td><span style={{ fontSize: '12px', fontFamily: '黑体', fontWeight: 'bold' }}>客户单号：</span><span className="ExpressOrderNo" style={{ fontFamily: '黑体', fontWeight: 'bold', fontSize: '10px', width: '4.6cm' }}></span><span style={{ fontSize: '10px', fontFamily: '黑体' }}>品名：样品</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ margin: '0px', padding: '0px', height: '1.4cm', borderTopWidth: '0px', borderCollapse: 'collapse', border: '0px' }} cellSpacing={0} cellPadding={0}>
                        <tbody>
                            <tr>
                                <td>
                                    <div style={{ width: '6cm', height: '1.4cm' }}>
                                        <img id="barcodeTarget" style={{ marginLeft: '0.5cm' }}></img>
                                    </div>
                                </td>
                                <td><span style={{ fontSize: '10px', fontFamily: '黑体' }}>件数：共 1 件</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            <div id="PrintSFHtml" style={{ height: '130mm', width: '76mm', borderStyle: 'dashed', border: '1px dashed #000' }}>
                <div style={{ width: '76mm', height: '14mm', borderBottom: '1px dashed #000' }}>
                    <div style={{ textAlign: 'right', fontFamily: 'SimHei', fontSize: '26pt', marginRight: '3mm', lineHeight: '26pt' }}>
                        <span id="SF_proCode">标快</span>
                    </div>
                    <div style={{ textAlign: 'center', fontFamily: 'STSong', fontSize: '6pt' }}>
                        <span>打印时间: {new Date().toLocaleString()}</span>
                    </div>
                </div>
                <div style={{ borderBottom: '1px dashed #000', textAlign: 'center', height: '24mm', width: '76mm' }}>
                    <img id="SF_waybillNumber" style={{ width: '60mm', height: '20mm' }}></img>
                </div>
                <div style={{ borderBottom: '1px dashed #000', textAlign: 'center', height: '10mm', width: '76mm' }}>
                    <span id="SF_destRouteLabel" style={{ fontFamily: 'SimHei', fontSize: '22pt', fontWeight: 'bolder', lineHeight: '22pt' }}></span>
                </div>
                <div style={{ borderRight: '1px dashed #000', width: '76mm', height: '82mm' }}>
                    <div style={{ borderRight: '1px dashed #000', width: '60mm', height: '82mm', float: 'left' }}>
                        <div style={{ width: '60mm', height: '19mm' }}>
                            <div style={{ width: '5mm', height: '19mm', float: 'left', paddingLeft: '0mm', paddingTop: '0mm' }}>
                                <span style={{ width: '1cm', fontFamily: 'STSong', fontSize: '10pt', fontWeight: 'bolder' }}>收</span>
                            </div>
                            <div style={{ width: '54mm', height: '19mm', float: 'left' }}>
                                <div id="SF_Consignee" style={{
                                    whiteSpace: 'normal', msWordBreak: 'break-all', wordWrap: 'break-word', lineHeight: '10pt', fontFamily: 'STSong', fontSize: '9pt'
                                }}></div>
                                <div id="SF_ConsigneeAddress" style={{ whiteSpace: 'normal', msWordBreak: 'break-all', wordWrap: 'break-word', lineHeight: '10pt', fontFamily: 'STSong', fontSize: '9pt' }}></div>
                            </div>
                        </div>
                        <div style={{ borderBottom: '1px dashed #000', width: '60mm', height: '8mm' }}>
                            <div style={{ width: '5mm', height: '8mm', float: 'left', paddingLeft: '0mm', paddingTop: '0mm' }}>
                                <label style={{ width: '1cm', fontFamily: 'STSong', fontSize: '10pt', fontWeight: 'bolder' }}>寄</label>
                            </div>
                            <div style={{ width: '54mm', height: '8mm', float: 'left' }}>
                                <div id="SF_Sender" style={{ whiteSpace: 'normal', msWordBreak: 'break-all', wordWrap: 'break-word', lineHeight: '7pt', fontFamily: 'STSong', fontSize: '6pt' }}></div>
                                <div id="SF_SenderAddress" style={{ whiteSpace: 'normal', msWordBreak: 'break-all', wordWrap: 'break-word', lineHeight: '7pt', fontFamily: 'STSong', fontSize: '6pt' }}></div>
                            </div>
                        </div>
                        <div style={{ borderBottom: '1px dashed #000', width: '60mm', height: '30mm' }}>
                            <div style={{ borderRight: '1px dashed #000', width: '32mm', height: '30mm', display: 'left' }}>
                                <div style={{ borderBottom: '1px dashed #000', width: '32mm', height: '6mm' }}>
                                    <span style={{ fontFamily: 'STSong', fontSize: '9pt', fontWeight: 'bolder' }}>已验视</span>
                                </div>
                                <div style={{ borderBottom: '1px dashed #000', width: '32mm', height: '12mm' }}>
                                    &nbsp;
                                </div>
                                <div style={{ borderBottom: '1px dashed #000', width: '32mm', height: '12mm' }}>
                                    <label id="SF_codingMappingOut" style={{ fontFamily: 'SimHei', fontSize: '40pt', fontWeight: 'bolder', lineHeight: '40pt' }}></label>
                                </div>
                            </div>
                            <div style={{ width: '27mm', height: '30mm', display: 'left', textAlign: 'center' }}>
                                <canvas id="SF_twoDimensionCode" style={{ width: '25mm', height: '25mm', marginTop: '2.5mm', marginRight: '1.5mm' }}></canvas>
                            </div>
                        </div>
                        <div style={{ borderBottom: '1px dashed #000', width: '60mm', height: '6mm' }}>
                            <span style={{ fontFamily: 'STSong', fontSize: '6pt', fontWeight: 'bolder' }}>签收:</span>
                        </div>
                        <div style={{ borderBottom: '1px dashed #000', width: '60mm', height: '19mm' }}>
                            <label id="SF_remark" style={{ fontFamily: 'STSong', fontSize: '5pt', fontWeight: 'bolder' }}></label>
                        </div>
                    </div>
                    <div style={{ width: '15mm', height: '82mm', float: 'right' }}>
                        <div style={{ width: '15mm', height: '70mm', paddingLeft: '15mm', transform: 'rotate(90deg)', transformOrigin: 'right top 0px' }}>
                            <img id="SF_waybillNumber_col" style={{ width: '60mm', height: '15mm', marginLeft: '5mm' }} ></img>
                        </div>
                        <div style={{ borderTop: '1px dashed #000', width: '15mm', height: '12mm' }}>
                            <label id="SF_proName" style={{ fontFamily: 'STSong', fontSize: '9pt', fontWeight: 'bolder' }}>陆运包裹</label>
                        </div>
                    </div>
                </div>
            </div>

            <div id="PrintSFHtml2" style={{ height: '13cm', width: '7.6cm', borderStyle: 'dashed', border: '1px dashed #000' }}>
                <table style={{ width: '7.6cm' }}>
                    <tbody>
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
                                    <tbody>
                                        <tr>
                                            <td colSpan={2} align='center'>
                                                <div style={{ width: '6.6cm', height: '1.3cm', textAlign: 'center' }} >
                                                    <img id="SF_waybillNumber"></img>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td align="right"> </td>
                                            <td align="center"><label id="SF_waybillNumber_text" style={{ fontFamily: 'SimHei', fontSize: '10pt', fontWeight: 'bolder' }}></label></td>
                                        </tr>
                                        <tr style={{ display: 'none' }}>
                                            <td align="right"><label style={{ fontFamily: 'SimHei', fontSize: '10pt', fontWeight: 'bolder' }}> </label></td>
                                            <td align="center"><label style={{ fontFamily: 'SimHei', fontSize: '10pt', fontWeight: 'bolder' }}> </label></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr style={{ borderBottom: '1px dashed #000', textAlign: 'center' }}><td style={{ height: '0.8cm', width: '7.6cm' }} colSpan={2}><label id="SF_destRouteLabel" style={{ fontFamily: 'SimHei', fontSize: '22pt', fontWeight: 'bolder', lineHeight: '22pt' }}></label></td></tr>
                        <tr>
                            <td style={{ borderRight: '1px dashed #000' }}>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <table>
                                                    <tbody>
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
                                                                <canvas id="SF_twoDimensionCode" style={{ width: '2.5cm', height: '2.5cm', marginTop: '0.25cm', marginRight: '0.15cm' }}></canvas>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ height: '0.6cm', width: '6cm', borderBottom: '1px dashed #000' }} colSpan={2}><label style={{ fontFamily: 'STSong', fontSize: '6pt', fontWeight: 'bolder' }}>签收:</label></td>
                                        </tr>
                                        <tr>
                                            <td align="center" style={{ height: '1.55cm', width: '6cm' }} colSpan={2}>
                                                <table style={{ width: '100%' }}>
                                                    <tbody>
                                                        <tr><td><label id="SF_remark" style={{ fontFamily: 'STSong', fontSize: '5pt', fontWeight: 'bolder' }}></label><br /></td></tr>
                                                        <tr><td align="center"><label style={{ fontFamily: 'STSong', fontSize: '20pt', fontWeight: 'bolder' }}> </label></td></tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td>
                                <table>
                                    <tbody>
                                        <tr style={{ borderBottom: '1px dashed #000' }}>
                                            <td align="center" style={{ height: '7cm', width: '1.6cm' }}>
                                                <div>
                                                    <img id="SF_waybillNumber_col" style={{ height: '1.3cm', width: '6cm', marginLeft: '-4.5cm', marginBottom: '-7.4cm', transform: 'rotate(90deg)', transformOrigin: 'right top 0px' }} />
                                                </div>
                                            </td>

                                        </tr>
                                        <tr>
                                            <td align="center" style={{ height: '1.05cm', width: '1.6cm' }}><label id="SF_proName" style={{ fontFamily: 'STSong', fontSize: '9pt', fontWeight: 'bolder' }}>陆运包裹</label></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <List items={this.detail} item={{ render: this.renderCutOffItem }} none="无拣货数据" />
        </div >;
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