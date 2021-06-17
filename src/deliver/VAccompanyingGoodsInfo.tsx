import { observer } from 'mobx-react';
import { List, Page, VPage, tv, FA } from 'tonva-react';
import { COutBound } from './COutBound';
import './printStyle/AccompanyingGoodsInfo.css';
import printJS from 'print-js';

export class VAccompanyingGoodsInfo extends VPage<COutBound> {

    outBoundOrderInfo: any[];
    outBoundOrderId: any;
    tempCount: number = 0;            // 循环控制数据明细列表，默认为0
    firstTempheight: number = 0;      // 首页动态数据要显示的高度
    nextTempheight: number = 0;       // 下一页动态数据要显示的高度
    pageHeight: number = 680;         // 当前页面显示高度

    async open(outBoundOrderInfo?: any) {

        this.outBoundOrderInfo = outBoundOrderInfo.accompanyingGoodsInfo;
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
        let html: string = "<div id=\"dataListDiv\" class=\"dataList_A\"><ul class=\"va-list\">";

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
            document.getElementById("accompanyingGoodsInfoPage").innerHTML = pageHtml;
        }
    }

    // 打印页面
    private printPage = async () => {

        // size: portrait || landscape; 设置横(landscape)\纵向(portrait)打印
        let style = '@page {size:landscape}' + '@media print {'
            + `.printPage_A{width:100%;page-break-before:auto;page-break-after:always;background-color:white}.top_A{width:100%;height:35px;border-bottom:3px solid black;background-color:white}
            .hLeft_A{width:32%;float:left;text-align:left;padding:1px;font-size:18px;font-weight:600}.hcenter_A{width:20%;float:left;text-align:left;font-weight:bold;font-size:24px;padding-left:1%}
            .hright_A{width:45%;float:left}.hright_A div{width:100%}.hright_A ul{list-style-type:none}.hright_A ul li{display:inline;width:45%;float:left}
            .title_A{width:100%;background-color:white;text-align:center;padding:0;font-size:15px}.title_A table{width:100%;padding:0}
            .th-1{width:1%;text-align:left;font-size:15px}.th-2{width:6%;text-align:left;font-size:16px}.th-3{width:.1%;text-align:left}
            .th-4{width:5%;text-align:left}.th-5{width:6%;text-align:left}.th-6{width:8%;text-align:left}.th-7{width:30%;text-align:left}
            .th-8{width:25mm;text-align:left}.th-9{width:45mm;text-align:left}.dataList_A{width:100%;padding-top:0;background-color:white}
            .dataList_A ul{display:block;list-style-type:disc;margin-block-start:.1em;margin-block-end:.4em;margin-inline-start:0;margin-inline-end:0;padding-inline-start:40px;border-bottom:1px solid #000}
            .dataList_A ul.va-list{list-style:none;padding:0}.dataList_A ul.va-list li{display:flex;flex-direction:row;flex-wrap:nowrap;border-bottom:1px solid #000}
            .item_A{width:100%;height:30px;background-color:white;font-family:Arial,Helvetica,sans-serif;font-size:15px}
            .item_A tr{width:100%;padding:0}.item_A-1{width:1%;text-align:left;font-size:15px}.item_A-2{width:6%;text-align:left;font-size:16px}
            .item_A-3{width:.1%;text-align:left}.item_A-4{width:5%;text-align:left}.item_A-5{width:6%;text-align:left}
            .item_A-6{width:8%;text-align:left}.item_A-7{width:30%;text-align:left}.item_A-8{width:10%;text-align:left}
            .item_A-9{width:10%;text-align:left}.footer_A{width:99%;height:10px;padding:0;background-color:white}
            .footer_A Div{text-align:center;margin:1px auto;margin-top:1px}.footer_A span{width:100%;font-size:13px;font-weight:500;text-align:center}`
            + '}';
        let focuser = setInterval(() => window.dispatchEvent(new Event('focus')), 500);

        printJS({
            printable: 'accompanyingGoodsInfoPage', // 要打印内容的id
            type: 'html',               // 可以打印html,img详细的可以在官方文档https://printjs.crabbly.com/中查询
            scanStyles: false,          // 不适用默认样式
            style: style,               // 亦可使用引入的外部css;
            documentTitle: '.',
            onPrintDialogClose: () => { clearInterval(focuser); this.backPage(); }  //取消打印回调
        });
    }

    private renderOutBoundOrderDetail = (outBoundOrderDetail: any) => {

        let { trayNumber, outBoundReason, consigneeName, consigneeUnitName, consigneeAddress, product, pack, quantity, lot, deliveryNotes, deliveryData } = outBoundOrderDetail;

        return <div className="item_A">
            <div className="item_A-1"><strong>{trayNumber}</strong></div>
            <div className="item_A-2"></div>
            <div className="item_A-3">{tv(product, (values: any) => <>{values.origin}</>)}</div>
            <div className="item_A-4">{lot}</div>
            <div className="item_A-5">{tv(pack, (values: any) => <>{tvPackx(values)}</>)}</div>
            <div className="item_A-6">{quantity}</div>
            <div className="item_A-7">{consigneeUnitName}</div>
            <div className="item_A-8">{consigneeName}</div>
            <div className="item_A-9">{deliveryData}</div>
        </div>
    };

    private page = observer(() => {

        let topDiv = <div id="topDiv" className="top_A">
            <div className="hLeft_A"><span>{this.outBoundOrderId}</span></div>
            <div className="hcenter_A"><span>随货资料清单</span></div>
            <div className="hright_A">
                <div><ul>
                    <li>经手人：<span></span></li>
                </ul></div>
            </div>
        </div>

        let titleDiv = <div id="titleDiv" className="title_A">
            <table>
                <tbody>
                    <tr>
                        <th className="th-1">理货号</th>
                        <th className="th-2">订单号</th>
                        <th className="th-3">产品编号</th>
                        <th className="th-4">LOT号</th>
                        <th className="th-5">包装</th>
                        <th className="th-6">瓶数</th>
                        <th className="th-7">收货单位</th>
                        <th className="th-8">收货人</th>
                        <th className="th-9">随货资料</th>
                    </tr>
                </tbody>
            </table>
        </div>

        let dataListDiv = <div id="dataListDiv" className="dataList_A">
            <List items={this.outBoundOrderInfo} item={{ render: this.renderOutBoundOrderDetail }} none="无随货资料数据" />
        </div>

        let footerDiv = <div id="footerDiv" className="footer_A">
            <div></div>
        </div>

        let right = <div className="d-flex justify-content-between mr-1 my-2" onClick={() => this.printPage()}>
            <span className="p-1"><FA className="mr-1 cursor-pointer text-info" name="print" /></span>
        </div>;

        return <Page header="随货资料打印" right={right}>
            <div id="accompanyingGoodsInfoPage" className="printPage_A">
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