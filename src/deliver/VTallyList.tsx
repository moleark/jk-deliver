import * as React from 'react';
import { observer } from 'mobx-react';
import { List, Page, VPage, tv, FA } from 'tonva-react';
import { COutBound } from './COutBound';
import './printStyle/TallyList.css';
import printJS from 'print-js';

export class VTallyList extends VPage<COutBound> {

    outBoundOrderInfo: any[];
    outBoundOrderId: any;
    tempCount: number = 0;            // 循环控制数据明细列表，默认为0
    firstTempheight: number = 0;      // 首页动态数据要显示的高度
    nextTempheight: number = 0;       // 下一页动态数据要显示的高度
    pageHeight: number = 630;           // 当前页面显示高度

    async open(outBoundOrderInfo?: any) {

        this.outBoundOrderInfo = outBoundOrderInfo.outBoundOrderDetailInfo;
        this.outBoundOrderId = outBoundOrderInfo.outBoundOrderId;
        // document.title = "出库单号：" + this.outBoundOrderId;
        this.openPage(this.page);

        setTimeout(() => {
            // 此处为了拆分页面信息拼接表头表尾分页；直接执行报错，增加延时机制则成功哪怕延迟0毫秒也正常执行;
            this.createNewPrintHtml();
        }, 1);
    }

    /* 创建html */
    private createOtherHtml = async (temptype: string, itemListUlLi: HTMLCollectionOf<HTMLLIElement>): Promise<string> => {

        let height: number = 0;
        let tempHeight: number = this.firstTempheight;
        let html: string = "<div id=\"dataListDiv\" class=\"dataList_T\"><ul class=\"va-list\">";

        if (temptype == "last") {
            tempHeight = this.firstTempheight;
        } else if (temptype == "next") {
            tempHeight = this.nextTempheight;
        } else {
            tempHeight = this.firstTempheight;
        }

        for (let index = this.tempCount; index < itemListUlLi.length; index++) {

            let rowHeight = itemListUlLi[index].clientHeight;
            height += rowHeight;

            if (height < tempHeight) {
                if (this.tempCount == (itemListUlLi.length - 1) && temptype == "next") {
                    return html;
                } else {
                    html = html + "<li class=\"\">" + itemListUlLi[index].innerHTML + "</li>";
                    this.tempCount++;
                }
            }
        }
        html += "</ul></div>";
        return html;
    }

    // 拼接页面分页
    private createNewPrintHtml = async () => {

        let topDivHeight = document.getElementById('topDiv').clientHeight;  // top头部信息高度        
        let titleDiv = document.getElementById('titleDiv').clientHeight;    // title标题信息高度        
        let dataListDivHeight = document.getElementById('dataListDiv').clientHeight;  // 数据列表整体高度
        let footerDiv = document.getElementById('footerDiv').clientHeight;  // footer尾部信息高度
        this.firstTempheight = (this.pageHeight - topDivHeight - titleDiv); // 首页动态高度设置
        this.nextTempheight = (this.pageHeight - topDivHeight - titleDiv);  // 中间页动态高度设置
        /*
        alert("显示器显示高度：" + this.pageHeight);
        alert("topDiv高度：" + topDivHeight);
        alert("titleDiv高度：" + titleDiv);
        alert("itemListDiv高度：" + dataListDivHeight);
        alert("footerDiv高度：" + footerDiv);
        alert("首页动态高度设置高度：" + this.firstTempheight);
        alert("中间页动态高度高度：" + this.nextTempheight);
        */
        let elem: string = document.getElementById('dataListDiv').innerHTML;    // 数据列表Div内容
        let itemList: Element = document.getElementById('dataListDiv');         // 获取 itemListDiv Div元素
        let itemListUl: Element = itemList.getElementsByClassName('va-list')[0];    // 获取 itemListDiv 下ul元素
        let itemListUlLi: HTMLCollectionOf<HTMLLIElement> = itemListUl.getElementsByTagName('li');  // 获取itemListDiv ul 下li元素

        let pageHtml: string = "";  // 页面
        let breakHtml: string = "<div style='page-break-before:always;'></div>";  // 分页
        let headHtml: string = document.getElementById('topDiv').outerHTML;         // 头部信息
        let titleHtml: string = document.getElementById('titleDiv').outerHTML;      // 表头信息
        let bodyHtml = "";                                                          // 数据列表信息
        let reportHtm: string = document.getElementById('operationDiv').outerHTML;  // 报告信息
        let footerHtml: string = document.getElementById('footerDiv').outerHTML;    // 底部信息

        if (elem.length > 0) {
            let pageNum: number = 0;

            if (dataListDivHeight <= (this.pageHeight - topDivHeight - titleDiv - footerDiv)) {
                pageNum = 1;
            } else {
                pageNum = Math.ceil(dataListDivHeight / (this.pageHeight - topDivHeight - titleDiv - footerDiv));  // 计算分页页码，丢弃小数部分，保留整数部分
            }

            if (pageNum == 1) {

                bodyHtml = await this.createOtherHtml("first", itemListUlLi);
                pageHtml = pageHtml + headHtml + titleHtml + bodyHtml + footerHtml;
            } else {

                for (let index = 0; index < pageNum; index++) {
                    let nexttablebodyhtml: string = "";
                    if (index == 0) {
                        // 首页
                        nexttablebodyhtml = await this.createOtherHtml("first", itemListUlLi);
                        pageHtml = pageHtml + headHtml + titleHtml + nexttablebodyhtml + footerHtml + breakHtml;
                    } else {
                        if (index == (pageNum - 1) || (this.tempCount + 1) == itemListUlLi.length) {
                            // 尾页
                            let lastbodyhtml: string = await this.createOtherHtml("last", itemListUlLi);
                            pageHtml = pageHtml + headHtml + titleHtml + lastbodyhtml + footerHtml + breakHtml + reportHtm;
                        } else {
                            // 中间页
                            nexttablebodyhtml = await this.createOtherHtml("next", itemListUlLi);
                            pageHtml = pageHtml + headHtml + titleHtml + nexttablebodyhtml + footerHtml + breakHtml;
                        }
                    }
                }
            }
            document.getElementById("tallyListPage").innerHTML = pageHtml;
        }
    }

    // 打印页面
    private printPage = async () => {

        // size: portrait || landscape; 设置横纵向打印
        let style = '@page {size:landscape}' + '@media print {'
            + `main *{box-sizing:border-box}.printPage_T{width:100%;page-break-before:auto;page-break-after:always;background-color:white}
            .top_T{width:100%;height:40px;border-bottom:3px solid black;background-color:white}.hLeft_T{width:40%;float:left;text-align:left;padding:5px;font-size:18px;font-weight:600}
            .hcenter_T{width:40%;float:left;text-align:left;font-weight:bold;font-size:24px;padding-left:1%}.hright_T{width:12%;float:left;text-align:left;padding:5px;font-size:15px}
            .title_T{width:100%;background-color:white;text-align:center;padding:0;font-size:15px}.title_T table{width:100%;padding:0}
            .th-1{width:35mm;text-align:left}.th-2{width:30mm;text-align:left}.th-3{width:30mm;text-align:left}.th-4{width:11mm;text-align:left}
            .th-5{width:13mm;text-align:left}.th-6{width:30mm;text-align:left}.th-7{width:40mm;text-align:left}.th-8{width:25mm;text-align:left}
            .th-9{width:45mm;text-align:left}.dataList_T{width:100%;padding-top:1px;background-color:white}.dataList_T ul{display:block;list-style-type:disc;margin-block-start:.1em;margin-block-end:.4em;margin-inline-start:0;margin-inline-end:0;padding-inline-start:40px;border-bottom:1px solid #000}
            .dataList_T ul.va-list{list-style:none;padding:0}.dataList_T ul.va-list li{display:flex;flex-direction:row;flex-wrap:nowrap;height:25px;line-height:25px;border-bottom:1px solid #000}
            .item_T{width:100%;height:auto;background-color:white;display:flex;padding:0;font-family:Arial,Helvetica,sans-serif;font-size:14px}
            .item_T-1{width:35mm;text-align:left}.item_T-2{width:35mm;text-align:left}.item_T-3{width:31mm;text-align:left}
            .item_T-4{width:12mm;text-align:left}.item_T-5{width:13mm;text-align:left}.item_T-6{width:30mm;text-align:left}
            .item_T-7{width:42mm;text-align:left}.item_T-8{width:25mm;text-align:left}.item_T-9{width:46mm;text-align:left}
            .footer_T{width:99%;height:25px;padding:1px;background-color:white}.footer_T Div{text-align:center;margin:1px auto;margin-top:1px}
            .footer_T span{width:100%;font-size:13px;font-weight:500;text-align:center}.operation_T{width:100%;background-color:white;font-size:14px}
            .operationReport{padding-top:15px;margin-top:15px;background-color:white}.operationReport1{font-size:22px;font-weight:600;border-bottom:5px solid black;width:100%;text-align:left}
            .operationReport2{width:68%;float:left;text-align:left;padding-top:10px;padding-right:5px;height:320px}
            .operationReport2 div{border:1px solid black;height:300px}.operationReport3{width:31%;float:right;text-align:left;padding-top:10px;padding-left:5px;height:320px}
            .operationReport3 div{border:1px solid black;height:300px}`
            + '}';
        let focuser = setInterval(() => window.dispatchEvent(new Event('focus')), 500);

        printJS({
            printable: 'tallyListPage', // 要打印内容的id
            type: 'html',               // 可以打印html,img详细的可以在官方文档https://printjs.crabbly.com/中查询
            scanStyles: false,          // 不适用默认样式
            style: style,               // 亦可使用引入的外部css;
            documentTitle: '.',
            onPrintDialogClose: () => { clearInterval(focuser); this.backPage(); }  //取消打印回调
        });
    }

    private renderOutBoundOrderDetail = (outBoundOrderDetail: any) => {

        let { consigneeName, consigneeUnitName, pack, product, quantity, trayNumber, appointLot } = outBoundOrderDetail;

        let unitName = (consigneeUnitName.length > 9) ? consigneeUnitName.substr(0, 9) : consigneeUnitName;
        let { getProductExtention } = this.controller;
        let storage = ''; // getProductExtention(product.id);

        return <div className="item_T">
            <div className="item_T-1">{tv(product, (values: any) => <>{values.origin}</>)}</div>
            <div className="item_T-2">{appointLot}</div>
            <div className="item_T-3">{tv(pack, (values: any) => <>{tvPackx(values)}</>)}</div>
            <div className="item_T-4">{quantity}</div>
            <div className="item_T-5"><strong>{trayNumber}</strong></div>
            <div className="item_T-6">{storage}</div>
            <div className="item_T-7">{unitName}</div>
            <div className="item_T-8">{consigneeName}</div>
            <div className="item_T-9">{tv(product, (values: any) => <>{values.description.length > 27 ? String(values.description).substr(0, 27) : values.description}</>)}</div>
        </div>
    };

    private page = observer(() => {

        let topDiv = <div id="topDiv" className="top_T">
            <div className="hLeft_T"><span>{this.outBoundOrderId}</span></div>
            <div className="hcenter_T"><span>现货理货单</span></div>
            <div className="hright_T"><span>经手人：</span></div>
        </div>

        let titleDiv = <div id="titleDiv" className="title_T">
            <table>
                <tbody>
                    <tr>
                        <th className="th-1">产品编号</th>
                        <th className="th-2">Lot号</th>
                        <th className="th-3">包装</th>
                        <th className="th-4">瓶数</th>
                        <th className="th-5">理货号</th>
                        <th className="th-6">储藏条件</th>
                        <th className="th-7">订货人单位名</th>
                        <th className="th-8">收货人</th>
                        <th className="th-9">英文名</th>
                    </tr>
                </tbody>
            </table>
        </div>

        let dataListDiv = <div id="dataListDiv" className="dataList_T">
            <List items={this.outBoundOrderInfo} item={{ render: this.renderOutBoundOrderDetail }} none="无理货单数据" />
        </div>

        let operationReportDiv = <div id="operationDiv" className="operation_T">

            <div id="operationTitle" className="top_T">
                <div className="hLeft"><span>{this.outBoundOrderId}</span></div>
                <div className="hcenter"><span>理货单（以箱号排序）</span></div>
                <div className="hright"><span>经手人：</span></div>
            </div>

            <div id="OperationReportDiv" className="operationReport">

                <div className="operationReport1">
                    <span>库房操作情况反馈</span>
                </div>

                <div className="operationReport2">
                    <div>
                        操作报告：
                    </div>
                    操作人签字/日期:
                </div>

                <div className="operationReport3">
                    <div>
                        解决结果：
                    </div>
                    问题负责人/解决日期:
                </div>
            </div>
        </div>

        let footerDiv = <div id="footerDiv" className="footer_T">
            <div><span>精准 + 严谨是百灵威人的行为准则</span></div>
        </div>

        let right = <div className="d-flex justify-content-between mr-1 my-2" onClick={() => this.printPage()}>
            <span className="p-1"><FA className="mr-1 cursor-pointer text-info" name="print" /></span>
        </div>;

        return <Page header="理货单打印" right={right}>
            <div id="tallyListPage" className="printPage_T">
                {topDiv}
                {titleDiv}
                {dataListDiv}
                {footerDiv}
                {operationReportDiv}
            </div>
        </Page >
    });
}

const tvPackx = (values: any) => {
    let { radiox, radioy, unit } = values;
    if (radiox !== 1) return <>{radiox} * {radioy}{unit}</>;
    return <>{radioy}{unit}</>;
}