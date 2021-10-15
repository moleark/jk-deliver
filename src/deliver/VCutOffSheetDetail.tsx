import { VPage, List, LMR, DropdownAction, DropdownActions } from 'tonva-react';
import { CDeliver } from "./CDeliver";
// import { ReturnGetCutOffMainMain, ReturnGetCutOffMainDetail } from "uq-app/uqs/JkDeliver";
// import { VReceiptList } from './VReceiptList';
import { tvPackx } from '../tools/tvPackx';
import JsBarcode from 'jsbarcode';
import printJS from 'print-js';
import { format } from 'date-fns';

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

        let result = `{\"ret\":[{\"Id\":\"MV20210827S0A_33816882\",\"OrderNo\":\"DDZJS008290952342\",\"ExpressOrderNo\":\"MV20210827S0A\",\"VcityCode\":\"010\",
        \"SiteNo\":\"BH63-66\",\"SiteName\":\"北京_中关村营业所_花园路营业厅\",\"ExpressStatus\":\"0\",\"ExpressErrorCode\":\"OK\",\"ProvinceName\":\"北京市\",
        \"TownNme\":\"\",\"CityName\":\"北京市\",\"ConsigneeName\":\"张康\",\"ConsigneeMobile\":\"18611114263\",\"ConsigneeTelephone\":\"010-59309000\",
        \"ConsigneeUnitName\":\"百灵威测试\",\"ExpressCode\":\"ZJS008290952342\",\"ShipperUnitName\":\"J&K Scientific Ltd\",\"AcceptanceUnitName\":\"\",
        \"DeclaredValue\":\"0\",\"CollectionAmount\":\"0.00\",\"ImportantHints\":\"订单批号:2109270001\\n提醒注意：（汽运禁航）（务必本人或专人签收）\\n临时理货号：5\",
        \"Createdate\":\"2021-10-09\",\"ConsigneeAddressDetail\":\"北京市北京市朝阳区北辰西路69号峻峰华亭A座5层\"},
        {\"Id\":\"MV20210827S0A_33816882\",\"OrderNo\":\"DDZJS008290952342\",\"ExpressOrderNo\":\"MV20210827S0A\",\"VcityCode\":\"010\",
        \"SiteNo\":\"BH63-66\",\"SiteName\":\"北京_中关村营业所_花园路营业厅\",\"ExpressStatus\":\"0\",\"ExpressErrorCode\":\"OK\",\"ProvinceName\":\"北京市\",
        \"TownNme\":\"\",\"CityName\":\"北京市\",\"ConsigneeName\":\"张康\",\"ConsigneeMobile\":\"18611114263\",\"ConsigneeTelephone\":\"010-59309000\",
        \"ConsigneeUnitName\":\"百灵威测试\",\"ExpressCode\":\"ZJS008290952342\",\"ShipperUnitName\":\"J&K Scientific Ltd\",\"AcceptanceUnitName\":\"\",
        \"DeclaredValue\":\"0\",\"CollectionAmount\":\"0.00\",\"ImportantHints\":\"订单批号:2109270001\\n提醒注意：（汽运禁航）（务必本人或专人签收）\\n临时理货号：5\",
        \"Createdate\":\"2021-10-09\",\"ConsigneeAddressDetail\":\"北京市北京市朝阳区北辰西路69号峻峰华亭A座5层\"}]}`;
        let jsonResult: any[] = JSON.parse(result).ret;
        jsonResult.forEach((e: any) => {
            if (e.ExpressStatus === "0") {
                let deliverMainId: number = Number(e.Id.split('_')[1]);
                this.updateWaybillNumber(deliverMainId, 41, e.ExpressCode);	//更新快递单号
            } else {
                console.log(e.ExpressStatus + ',' + e.ExceptionMessage);
            }
        });
        let { openZJSExpressSheetList } = this.controller;
        await openZJSExpressSheetList(jsonResult);
        return;


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

        let result = `{ \"ret\":[{\"id\":\"SHMV20210603Z516Z_33816892\",\"proCode\":\"标快\",\"waybillNumber\":\"SF1331875979567\",
        \"destRouteLabel\":\"010W-AE-003\",\"ConsigneeName\":\"张康\",\"ConsigneeMobile\":\"18611114263\",\"ConsigneeUnitName\":\"百灵威测试\",
        \"ConsigneeAddress\":\"北京市北京市朝阳区北辰西路69号峻峰华亭A座5层\",\"senderName\":\"龚肃斌\",\"senderTel\":\"13818181523\",\"senderCompany\":\"J&K\",
        \"senderAddress\":\"上海市浦东新区唐镇上丰路955号3号门\",\"codingMappingOut\":\"3A\",\"twoDimensionCode\":\"MMM={'k1':'010W','k2':'010AE','k3':'003','k4':'T6','k5':'SF1331875979567','k6':'','k7':'53528168'}\",
        \"remark\":\"订单批号:2109270001\\n提醒注意：（汽运禁航）（务必本人或专人签收）\\n临时理货号：10\",\"waybillNumber_col\":\"SF1331875979567\",\"proName\":\"陆运包裹\"},
        {\"id\":\"SHMV20210603Z516Z_33816892\",\"proCode\":\"标快\",\"waybillNumber\":\"SF1331875979567\",
        \"destRouteLabel\":\"010W-AE-003\",\"ConsigneeName\":\"张康\",\"ConsigneeMobile\":\"18611114263\",\"ConsigneeUnitName\":\"百灵威测试\",
        \"ConsigneeAddress\":\"北京市北京市朝阳区北辰西路69号峻峰华亭A座5层\",\"senderName\":\"龚肃斌\",\"senderTel\":\"13818181523\",\"senderCompany\":\"J&K\",
        \"senderAddress\":\"上海市浦东新区唐镇上丰路955号3号门\",\"codingMappingOut\":\"3A\",\"twoDimensionCode\":\"MMM={'k1':'010W','k2':'010AE','k3':'003','k4':'T6','k5':'SF1331875979567','k6':'','k7':'53528168'}\",
        \"remark\":\"订单批号:2109270001\\n提醒注意：（汽运禁航）（务必本人或专人签收）\\n临时理货号：10\",\"waybillNumber_col\":\"SF1331875979567\",\"proName\":\"陆运包裹\"}]}`;
        let jsonResult: any[] = JSON.parse(result).ret; // JSON.parse(ret);
        jsonResult.forEach((element: any) => {

            let deliverMainId: number = Number(element.id.split('_')[1]);
            this.updateWaybillNumber(deliverMainId, 32, element.waybillNumber);	//更新快递单号
        });
        let { openSFExpressSheetList } = this.controller;
        await openSFExpressSheetList(jsonResult);
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
                    let deliverMainId: number = Number(element.id.split('_')[1]);
                    this.updateWaybillNumber(deliverMainId, 32, element.waybillNumber);	//更新快递单号
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
            item, tallyShould, content, productExt } = cutOffItem;
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
                    <span>{ProductX.tv(pack.owner)}</span>
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
                                alert((o.target as HTMLInputElement).value);
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
            <List items={this.detail} item={{ render: this.renderCutOffItem }} none="无拣货数据" />

            <div id="hawblayout_print" style={{ display: 'none' }}>
                <iframe id="mainbody" width="0" height="0"></iframe>
            </div>
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