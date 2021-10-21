import { tv, Page, VPage, LMR, List } from "tonva-react";
import { tvPackx } from "tools/tvPackx";
import { CHome } from "./CHome";
// import { ReturnGetDeliverDetail, ReturnGetDeliverMain } from "uq-app/uqs/JkDeliver";

export class VDelivering extends VPage<CHome> {
	private main: any;
	private detail: any[];

	init(param: [any, any[]]) {
		let [main, detail] = param;
		this.main = main;
		this.detail = detail;
	}

	header() { return '发运单：' + this.main.no }
	right() {
		return <button className="btn btn-sm btn-primary mr-2" onClick={this.doneDeliver}>完成</button>;
	}

	// 修改当前选中行颜色
	private onClickDeliverItem = (rowIndex: number) => {

		let deliverListDiv = document.getElementById("deliverProductList").getElementsByTagName("ul")[0].getElementsByTagName("li");

		for (let index = 0; index < deliverListDiv.length; index++) {
			if (index == rowIndex) {
				deliverListDiv[index].getElementsByTagName("div")[0].style.backgroundColor = "#FFFACD";
			} else {
				deliverListDiv[index].getElementsByTagName("div")[0].style.backgroundColor = "#FFFFFF";
			}
		}
	}

	private renderDeliverItem = (deliverItem: any, index: number) => {

		let { JkProduct } = this.controller.uqs;
		let { ProductX } = JkProduct;
		let PackX = ProductX.div('packx');
		let { id, item, productExt, deliverShould } = deliverItem;
		let pack = PackX.getObj(item);

		let storageCondition: string = '';
		if (productExt) {
			let jsonProductExt = JSON.parse(productExt);
			storageCondition = jsonProductExt.SpecialRequirement;
		}

		let left = <div className="py-1 pr-2">{index + 1}</div>;

		return <LMR className="py-1" key={id} left={left} onClick={() => this.onClickDeliverItem(index)}>
			<div className="row col-12 py-1">
				<span className="col-2 text-muted px-1">产品: </span>
				<span className="col-5 pl-1">{ProductX.tv(pack.owner)} </span>
				<span className="col-2 text-muted px-1">包装: </span>
				<span className="col-3 pl-1">{tvPackx(pack)}</span>
			</div>
			<div className="row col-12 py-1">
				<span className="col-2 text-muted px-1">储运: </span>
				<span className="col-12 pl-1">{storageCondition}</span>
			</div>
			<div className="row col-12 py-1">
				<span className="col-2 text-muted px-1">应发: </span>
				<span className="col-5 text-info">{deliverShould}</span>
				<span className="col-2 text-muted px-1">实发: </span>
				<input type="text" className="form-control col-2 text-info" style={{ height: 'calc(1.0em + 0.5rem + 2px)' }}
					onChange={o => deliverItem.deliverShould = o.target.value} defaultValue={deliverShould}
				/>
			</div>
		</LMR>;
	}

	content() {

		let deliverTotal: number = 0;
		let { contactDetail } = this.main;
		this.detail.forEach(async element => {
			deliverTotal += element.deliverShould;
		});

		// <div className="col-12 px-1 py-1">订单备注:{ }</div>  // 暂时注释
		// <div className="col-12 px-1 py-1">发运方式</div>
		return <div className="p-1 bg-white" >
			<div className="px-1 py-1 bg-light">
				<div className="row col-12 px-1 py-1">
					<div className="col-5">{contactDetail?.name}</div>
					<div className="col-7 pl-0">{contactDetail?.organizationName}</div>
				</div>
				<div className="row col-12 px-1 py-1">
					<div className="col-5">{contactDetail?.mobile}</div>
					<div className="col-7 pl-0">{contactDetail?.telephone}</div>
				</div>
				<div className="col-12 px-1 py-1">{contactDetail?.email}</div>
				<div className="col-12 px-1 py-1">{contactDetail?.addressString}</div>
			</div>
			<div className="px-1 py-1 bg-light" style={{ borderBottom: '1px dashed #dee2e6' }}>
				<span className="px-1 text-info small">应发总瓶数：<strong>{deliverTotal}</strong></span>
			</div>
			<div id='deliverProductList'>
				<List items={this.detail} item={{ render: this.renderDeliverItem }} none="发货数据" />
			</div>
		</div>;
	}

	/**
	 * 发运完成
	 */
	private doneDeliver = async () => {
		let { id: deliverId } = this.main;
		await this.controller.doneDeliver(deliverId, this.detail);
		this.closePage();
	}
}