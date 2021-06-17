import { observer } from 'mobx-react';
import { List, Page, VPage, tv, FA } from 'tonva-react';
import { COutBound } from './COutBound';
import './printStyle/DeliveryList.css';
import printJS from 'print-js';
import { isUndefined } from 'lodash';

export class VDeliveryList extends VPage<COutBound> {

    outBoundOrderInfo: any[];
    outBoundOrderId: any;
    tempCount: number = 0;            // 循环控制数据明细列表，默认为0
    firstTempheight: number = 0;      // 首页动态数据要显示的高度
    nextTempheight: number = 0;       // 下一页动态数据要显示的高度
    pageHeight: number = 680;         // 当前页面显示高度

    async open(outBoundOrderInfo?: any) {

        this.outBoundOrderInfo = outBoundOrderInfo.deliveryListInfo;

        this.outBoundOrderId = outBoundOrderInfo.outBoundOrderId;
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
        let html: string = "<div id=\"dataListDiv\" class=\"dataList_D\"><ul class=\"va-list\">";

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
        let dataListDivHeight = document.getElementById('dataListDiv').clientHeight;  // 数据列表整体高度
        let footerDiv = document.getElementById('footerDiv').clientHeight;  // footer尾部信息高度
        this.firstTempheight = (this.pageHeight - topDivHeight - footerDiv); // 首页动态高度设置
        this.nextTempheight = (this.pageHeight - topDivHeight - footerDiv);  // 中间页动态高度设置

        /*
        alert("显示器显示高度：" + this.pageHeight);
        alert("topDiv高度：" + topDivHeight);
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
        // let titleHtml: string = document.getElementById('titleDiv').outerHTML;      // 表头信息
        let bodyHtml = "";                                                          // 数据列表信息
        let footerHtml: string = document.getElementById('footerDiv').outerHTML;    // 底部信息

        if (elem.length > 0) {
            let pageNum: number = 0;

            if (dataListDivHeight <= (this.pageHeight - topDivHeight - footerDiv)) {
                pageNum = 1;
            } else {
                pageNum = Math.ceil(dataListDivHeight / (this.pageHeight - topDivHeight - footerDiv));  // 计算分页页码，丢弃小数部分，保留整数部分
            }

            if (pageNum == 1) {

                bodyHtml = await this.createOtherHtml("first", itemListUlLi);
                pageHtml = pageHtml + headHtml + bodyHtml + footerHtml;
            } else {

                for (let index = 0; index < pageNum; index++) {
                    let nexttablebodyhtml: string = "";
                    if (index == 0) {
                        // 首页
                        nexttablebodyhtml = await this.createOtherHtml("first", itemListUlLi);
                        pageHtml = pageHtml + headHtml + nexttablebodyhtml + footerHtml + breakHtml;
                    } else {
                        if (index == (pageNum - 1) || (this.tempCount + 1) == itemListUlLi.length) {
                            // 尾页
                            let lastbodyhtml: string = await this.createOtherHtml("last", itemListUlLi);
                            pageHtml = pageHtml + headHtml + lastbodyhtml + footerHtml;
                        } else {
                            // 中间页
                            nexttablebodyhtml = await this.createOtherHtml("next", itemListUlLi);
                            pageHtml = pageHtml + headHtml + nexttablebodyhtml + footerHtml + breakHtml;
                        }
                    }
                }
            }
            document.getElementById("deliveryListPage").innerHTML = pageHtml;
        }
    }

    // 打印页面
    private printPage = async () => {

        // size: portrait || landscape; 设置横(landscape)\纵向(portrait)打印
        let style = '@page {size:landscape}' + '@media print {'
            + `.printPage_D{width:100%;page-break-before:auto;page-break-after:always;background-color:white}.top_D{width:100%;height:35px;border-bottom:3px solid black;background-color:white}
            .hLeft_D{width:32%;float:left;text-align:left;padding:1px;font-size:18px;font-weight:600}.hcenter_D{width:20%;float:left;text-align:left;font-weight:bold;font-size:24px;padding-left:1%}
            .hright_D{width:45%;float:left}.hright_D div{width:100%}.hright_D ul{list-style-type:none}.hright_D ul li{display:inline;width:45%;float:left}
            .dataList_D{width:100%;padding-top:0;background-color:white}.dataList_D ul{display:block;list-style-type:disc;margin-block-start:.1em;margin-block-end:.4em;margin-inline-start:0;margin-inline-end:0;padding-inline-start:40px;border-bottom:1px solid #000}
            .dataList_D ul.va-list{list-style:none;padding:0}.dataList_D ul.va-list li{display:flex;flex-direction:row;flex-wrap:nowrap;border-bottom:1px solid #000}
            .itemTable_D{border:0;width:100%}.item_D{width:100%;height:30px;background-color:white;font-family:Arial,Helvetica,sans-serif;font-size:15px}
            .item_D tr{width:100%;padding:0}.item_D-1{width:1%;text-align:left;font-size:15px}.item_D-2{width:6%;text-align:left;font-size:16px}
            .item_D-3{width:.1%;text-align:left}.item_D-4{width:5%;text-align:left}.item_D-5{width:6%;text-align:left}
            .item_D-6{width:8%;text-align:left}.item_D-7{width:30%;text-align:left}.footer_D{width:99%;height:10px;padding:0;background-color:white}
            .footer_D Div{text-align:center;margin:1px auto;margin-top:1px}.footer_D span{width:100%;font-size:13px;font-weight:500;text-align:center}`
            + '}';
        let focuser = setInterval(() => window.dispatchEvent(new Event('focus')), 500);

        printJS({
            printable: 'deliveryListPage', // 要打印内容的id
            type: 'html',               // 可以打印html,img详细的可以在官方文档https://printjs.crabbly.com/中查询
            scanStyles: false,          // 不适用默认样式
            style: style,               // 亦可使用引入的外部css;
            documentTitle: '.',
            onPrintDialogClose: () => { clearInterval(focuser); this.backPage(); }  //取消打印回调
        });
    }

    private renderOutBoundOrderDetail = (outBoundOrderDetail: any) => {

        let { trayNumber, outBoundReason, consigneeName, consigneeUnitName, consigneeAddress, deliveryNotes, deliveryData } = outBoundOrderDetail;

        return <table className="item_D">
            <tr>
                <td className="item_D-1"><b>{trayNumber}</b></td>
                <td className="item_D-2">{consigneeName}</td>
                <td className="item_D-3"></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <td colSpan={3} rowSpan={2}><b>{tv(outBoundReason, (values: any) => <>{values.name}</>)}</b></td>
                <td className="item_D-4">订单备注：</td>
                <td colSpan={3}><b>{isUndefined(deliveryNotes) ? '' : deliveryNotes}</b></td>
            </tr>
            <tr>
                <td>收货人：</td>
                <td className="item_D-5"><b>{consigneeName}</b></td>
                <td className="item_D-6">{consigneeUnitName}</td>
                <td className="item_D-7">{consigneeAddress}</td>
            </tr>
            <tr><td colSpan={7}></td></tr>
        </table >
    };

    private page = observer(() => {

        let topDiv = <div id="topDiv" className="top_D">
            <div className="hLeft_D"><span>{this.outBoundOrderId}</span></div>
            <div className="hcenter_D"><span>发货单</span></div>
            <div className="hright_D">
                <div><ul>
                    <li>资料录入员：<span></span></li>
                    <li>经手人：<span></span></li>
                </ul></div>
            </div>
        </div>

        let dataListDiv = <div id="dataListDiv" className="dataList_D">
            <List items={this.outBoundOrderInfo} item={{ render: this.renderOutBoundOrderDetail }} none="无发货单数据" />
        </div>

        let footerDiv = <div id="footerDiv" className="footer_D">
            <div><span>精准 + 严谨是百灵威人的行为准则！   （地址不详不发送）   公司内部文件注意保管，未经许可不得复印</span></div>
        </div>

        let right = <div className="d-flex justify-content-between mr-1 my-2" onClick={() => this.printPage()}>
            <span className="p-1"><FA className="mr-1 cursor-pointer text-info" name="print" /></span>
        </div>;

        return <Page header="发货单打印" right={right}>
            <div id="deliveryListPage" className="printPage_D">
                {topDiv}
                {dataListDiv}
                {footerDiv}
            </div>
        </Page >
    });
}

const tvPackx = (values: any) => {
    let { radiox, radioy, unit } = values;
    if (radiox !== 1) return <>{radiox} * {radioy}{unit}</>;
    return <>{radioy}{unit}</>;
}