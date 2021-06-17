import { observer } from 'mobx-react';
import { List, Page, VPage, tv, FA } from 'tonva-react';
import { COutBound } from './COutBound';
import './printStyle/OffShelfList.css';
import printJS from 'print-js';
import logo from 'images/logo.png';
// import ReactDOM from 'react-dom';

export class VOffShelfList extends VPage<COutBound> {

    outBoundOrderInfo: any[];
    outBoundOrderId: any;
    tempCount: number = 0;            // 循环控制数据明细列表，默认为0
    firstTempheight: number = 0;      // 首页动态数据要显示的高度
    nextTempheight: number = 0;       // 下一页动态数据要显示的高度
    pageHeight: number = window.innerHeight - 10;    // 当前页面显示高度

    async open(outBoundOrderInfo?: any) {

        this.outBoundOrderInfo = outBoundOrderInfo.outBoundOrderDetailInfo;
        this.outBoundOrderId = outBoundOrderInfo.outBoundOrderId;
        this.openPage(this.page);

        setTimeout(() => {
            // 此处为了拆分页面信息拼接表头表尾分页；直接执行报错，增加延时机制则成功哪怕延迟0毫秒也正常执行;
            this.createNewPrintHtml();
        }, 0);
    }

    /* 创建html */
    private createOtherHtml = async (temptype: string, itemListUlLi: HTMLCollectionOf<HTMLLIElement>): Promise<string> => {

        let height: number = 0;
        let tempHeight: number = this.firstTempheight;
        let html: string = "<div id=\"itemListDiv\" class=\"itemList_O\"><ul class=\"va-list\">";

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

    private createNewPrintHtml = async () => {

        let topDivHeight = document.getElementById('topDiv').clientHeight;  // top头部信息高度        
        let titleDiv = document.getElementById('titleDiv').clientHeight;    // title标题信息高度        
        let itemListDivHeight = document.getElementById('itemListDiv').clientHeight;  // 数据列表整体高度
        let footerDiv = document.getElementById('footerDiv').clientHeight;  // footer尾部信息高度
        this.firstTempheight = (this.pageHeight - topDivHeight - titleDiv); // 首页动态高度设置
        this.nextTempheight = (this.pageHeight - topDivHeight - titleDiv);  // 中间页动态高度设置

        /*
            alert("显示器显示高度：" + this.pageHeight);
            alert("topDiv高度：" + topDivHeight);
            alert("titleDiv高度：" + titleDiv);
            alert("itemListDiv高度：" + itemListDivHeight);
            alert("footerDiv高度：" + footerDiv);
            alert("首页动态高度设置高度：" + this.firstTempheight);
            alert("中间页动态高度高度：" + this.nextTempheight);
        */

        let elem: string = document.getElementById('itemListDiv').innerHTML;    // 数据列表Div内容
        let itemList: Element = document.getElementById('itemListDiv');         // 获取 itemListDiv Div元素
        let itemListUl: Element = itemList.getElementsByClassName('va-list')[0];    // 获取 itemListDiv 下ul元素
        let itemListUlLi: HTMLCollectionOf<HTMLLIElement> = itemListUl.getElementsByTagName('li');  // 获取itemListDiv ul 下li元素

        let pageHtml: string = "";  // 页面
        let breakHtml: string = "<div style='page-break-before:always;'></div>";  // 分页
        let headHtml: string = document.getElementById('topDiv').outerHTML;         // 头部信息
        let titleHtml: string = document.getElementById('titleDiv').outerHTML;      // 表头信息
        let bodyHtml = "";                                                          // 数据列表信息
        let footerHtml: string = document.getElementById('footerDiv').outerHTML;    // 底部信息

        if (elem.length > 0) {
            let pageNum: number = 0;

            if (itemListDivHeight <= (this.pageHeight - topDivHeight - titleDiv - footerDiv)) {
                pageNum = 1;
            } else {
                pageNum = Math.ceil(itemListDivHeight / (this.pageHeight - topDivHeight - titleDiv - footerDiv));  // 计算分页页码，丢弃小数部分，保留整数部分
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
                        pageHtml = pageHtml + headHtml + titleHtml + nexttablebodyhtml + breakHtml;
                    } else {
                        if (index == (pageNum - 1) || (this.tempCount + 1) == itemListUlLi.length) {
                            // 尾页
                            let lastbodyhtml: string = await this.createOtherHtml("last", itemListUlLi);
                            pageHtml = pageHtml + headHtml + titleHtml + lastbodyhtml + footerHtml;
                        } else {
                            // 中间页
                            nexttablebodyhtml = await this.createOtherHtml("next", itemListUlLi);
                            pageHtml = pageHtml + headHtml + titleHtml + nexttablebodyhtml + breakHtml;
                        }
                    }
                }
            }
            document.getElementById("shelfListPage").innerHTML = pageHtml;
        }
    }

    // 打印页面
    private printPage = async () => {

        // size: portrait || landscape; 设置横纵向打印
        let style = '@page {size:portrait}' + '@media print {'
            + `main *{box-sizing:border-box}.printPage_O{width:100%;page-break-before:auto;page-break-after:always;background-color:white}
            .header_O{width:100%;height:50px;padding:1px;background-color:white}.hLeft_O{width:18%;float:left;text-align:left;padding-left:1px}
            .hLeft_O img{height:50px;width:50px}.hcenter_O{width:40%;float:left;text-align:right;font-weight:bold;font-size:28px;padding-top:5px}
            .hright_O{width:30%;float:right}.hright_O ul{list-style-type:none;padding-top:2px}.hright_O ul li{height:30px;line-height:30px}
            .title_O{width:100%;background-color:white;text-align:center;font-size:16px}.title_O table{width:100%}
            .title_O tbody{width:100%}.th-1{width:15mm;padding:0;text-align:left}.th-2{width:35mm;text-align:left}
            .th-3{width:35mm;text-align:left}.th-4{width:30mm;text-align:left}.th-5{width:30mm;text-align:left}.th-6{width:20mm;text-align:left}
            .th-7{width:35mm;text-align:center}.itemList_O{width:100%;padding-top:1px;background-color:white}.itemList_O ul{display:block;list-style-type:disc;margin-block-start:.1em;margin-block-end:1em;margin-inline-start:0;margin-inline-end:0;padding-inline-start:40px;border-bottom:1px solid #000}
            .itemList_O ul.va-list{list-style:none;padding:0;margin-bottom:15px}.itemList_O ul.va-list li{display:flex;flex-direction:row;flex-wrap:nowrap;height:25px;line-height:25px;border-bottom:1px solid #000}
            .item_O{width:100%;height:auto;background-color:white;display:flex;padding:1px;font-family:Arial,Helvetica,sans-serif;font-size:15px}
            .item_O-1{width:12mm;text-align:left}.item_O-2{width:50mm;text-align:left}.item_O-3{width:45mm;text-align:left}
            .item_O-4{width:40mm;text-align:left}.item_O-5{width:40mm;text-align:left}.item_O-6{width:20mm;text-align:left}
            .item_O-7{width:40mm;text-align:left}.footer_O{width:100%;height:30px;line-height:30px;text-align:left;background-color:white}
            .footerDiv_O{float:right}.footerDiv_O ul{list-style-type:none;margin:1}.footerDiv_O ul li{float:left}
            .footerDiv_O span{width:100px;border-bottom:1px solid Black;padding:10px 110px 10px 10px}`
            + '}';
        let focuser = setInterval(() => window.dispatchEvent(new Event('focus')), 500);

        printJS({
            printable: 'shelfListPage', // 要打印内容的id
            type: 'html',               // 可以打印html,img详细的可以在官方文档https://printjs.crabbly.com/中查询
            scanStyles: false,          // 不适用默认样式
            style: style,               // 亦可使用引入的外部css;
            // css: 'OffShelfList.css',
            documentTitle: "出库单号：" + this.outBoundOrderId,
            onPrintDialogClose: () => { clearInterval(focuser); this.backPage(); }  //取消打印回调
        });
    };

    private renderOutBoundOrderDetail = (outBoundOrderDetail: any) => {

        let { consigneeUnitName, outBoundOrder, outBoundReason, pack, product, quantity, shelfBlock, trayNumber, appointLot } = outBoundOrderDetail;

        let unitName = (consigneeUnitName.length > 7) ? consigneeUnitName.substr(0, 7) : consigneeUnitName;

        return <div className="item_O">
            <div className="item_O-1"><strong>{trayNumber}</strong></div>
            <div className="item_O-2">{tv(shelfBlock, (values: any) => <>{values.name}</>)}</div>
            <div className="item_O-3">{tv(product, (values: any) => <>{values.origin}</>)}</div>
            <div className="item_O-4">{appointLot}</div>
            <div className="item_O-5">{tv(pack, (values: any) => <>{tvPackx(values)}</>)}</div>
            <div className="item_O-6">{quantity}</div>
            <div className="item_O-7">{unitName}</div>
        </div>
    };

    private sortHjh = (a: any, b: any) => {

        return a.shelfBlock - b.shelfBlock;
    }

    private page = observer(() => {

        let topDiv = <div id="topDiv" className="header_O">
            <div className="hLeft_O">
                <img src={logo} alt="Logo" />
            </div>
            <div className="hcenter_O">
                <span>百灵威出库单</span>
            </div>
            <div className="hright_O">
                <ul>
                    <li><span> {this.controller.warehouse.name} </span></li>
                </ul>
            </div>
        </div >

        let titleDiv = <div id="titleDiv" className="title_O">
            <table>
                <tbody>
                    <tr>
                        <th className="th-1">理货号</th>
                        <th className="th-2">货架号</th>
                        <th className="th-3">产品</th>
                        <th className="th-4">Lot</th>
                        <th className="th-5">包装</th>
                        <th className="th-6">出库量</th>
                        <th className="th-7">单位</th>
                    </tr>
                </tbody>
            </table>
        </div>

        let itemList = <div id="itemListDiv" className="itemList_O">
            <List items={this.outBoundOrderInfo.sort(this.sortHjh)} item={{ render: this.renderOutBoundOrderDetail }} none="无出库单数据" />
        </div>

        let footerDiv = <div id="footerDiv" className="footer_O">
            <div className="footerDiv_O">
                <ul>
                    <li>制单人：<span></span></li>
                    <li>出库人：<span></span></li>
                    <li>核对人：<span></span></li>
                </ul>
            </div>
        </div>

        let right = <div className="d-flex justify-content-between mr-1 my-2" onClick={() => this.printPage()}>
            <span className="p-1"><FA className="mr-1 cursor-pointer text-info" name="print" /></span>
        </div>;

        return <Page header="出库单打印" right={right}>

            <div id="shelfListPage" className="printPage_O">
                {topDiv}
                {titleDiv}
                {itemList}
                {footerDiv}
            </div >
        </Page>
    });
}

const tvPackx = (values: any) => {
    let { radiox, radioy, unit } = values;
    if (radiox !== 1) return <>{radiox} * {radioy}{unit}</>;
    return <>{radioy}{unit}</>;
}