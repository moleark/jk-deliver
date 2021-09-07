import { tv, Page, VPage, LMR, List } from "tonva-react";
import { ReturnGetDeliverDetail, ReturnGetDeliverMain } from "uq-app/uqs/JkDeliver";
import { CHome } from "./CHome";

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
		return <button className="btn btn-sm btn-primary mr-2" onClick={this.doneDeliver}>确认发货</button>;
	}

	// 修改当前选中行颜色
	private onClickDeliverItem = (rowIndex: number) => {

		let deliverListDiv = document.getElementById("deliverProductList").getElementsByTagName("ul")[0].getElementsByTagName("li");

		for (let index = 0; index < deliverListDiv.length; index++) {
			if (index == rowIndex) {
				deliverListDiv[index].getElementsByTagName("div")[0].style.backgroundColor = "#FFFF99";
			} else {
				deliverListDiv[index].getElementsByTagName("div")[0].style.backgroundColor = "#FFFFFF";
			}
		}
	}

	private renderDeliverItem = (deliverItem: any, index: number) => {

		let { JkDeliver, JkProduct } = this.controller.uqs;
		let { ProductX } = JkProduct;
		let PackX = ProductX.div('packx');
		let { id, product, item, deliverDone, productExt, deliverShould } = deliverItem;
		console.log(productExt);
		let pack = PackX.getObj(item);

		let storageCondition: string = '';
		if (productExt) {
			let jsonProductExt = JSON.parse(productExt);
			storageCondition = jsonProductExt.SpecialRequirement;
		}

		let left = <div className="py-1 pr-2">{index + 1}</div>;
		let right = <div>
			<div className="row px-1">
				<label className="text-muted">应发：</label ><span className="text-info">{deliverShould}</span>
			</div>
			<div className="row px-1 text-justify">
				<label className="text-muted">实发：</label >
				<input type="text" className="form-control input-sm col-5" onChange={o => deliverItem.deliverShould = o.target.value} defaultValue={deliverShould} />
			</div>
		</div>;

		return <LMR key={id} left={left} onClick={() => this.onClickDeliverItem(index)}>
			<div className="">
				<div className="row col-12 py-1">
					<span className="col-2 text-muted px-1">编号: </span>
					<span className="col-5 pl-1">{ProductX.tv(product)} </span>
					<span className="col-2 text-muted px-1">包装: </span>
					<span className="col-3 pl-1">{tvPackx(pack)}</span>
				</div>
				<div className="row col-12 py-1">
					<span className="col-2 text-muted px-1">储存条件: </span>
					<span className="col-12 pl-1">{storageCondition}</span>
				</div>
				<div className="row col-12 py-1">
					<span className="col-2 text-muted px-1">应发: </span>
					<span className="col-5 text-info">{deliverShould}</span>
					<span className="col-2 text-muted px-1">实发: </span>
					<input type="text" className="form-control input-sm col-3" onChange={o => deliverItem.deliverShould = o.target.value} defaultValue={deliverShould} />
				</div>
			</div>
		</LMR>;
	}

	content() {

		let deliverTotal: number = 0;
		let { getProductExtention } = this.controller;
		this.detail.forEach(async element => {
			deliverTotal += element.deliverShould;
			element.productExt = await getProductExtention(element.product);
			console.log(element.productExt);
		});

		return <div className="p-1 bg-white" >
			<div className="px-2 py-1">
				<div className="row col-12 px-1 py-1">
					<div className="col-6">收货人名称</div>
					<div className="col-6">收货人单位</div>
				</div>
				<div className="row col-12 px-1 py-1">
					<div className="col-6">收货人手机</div>
					<div className="col-6">收货人电话</div>
				</div>
				<div className="col-12 px-1 py-1">收货人邮箱</div>
				<div className="col-12 px-1 py-1">收货人地址</div>
				<div className="col-12 px-1 py-1">订单备注</div>
			</div>
			<hr />
			<div id='deliverProductList'>
				<List items={this.detail} item={{ render: this.renderDeliverItem }} none="无拣货数据" />
			</div>
			<div className="float-right py-2">
				<span className="px-2 text-info small">应发总瓶数：<strong>{deliverTotal}</strong></span>
			</div>
		</div>;
		// <div className="col-12 px-1 py-1">发运方式</div>
	}

	private doneDeliver = async () => {

		let { id } = this.main;
		this.detail.forEach(v => v.deliverDone = v.deliverShould);
		console.log(this.detail);
		//await this.controller.doneDeliver(id, this.detail);
		//this.closePage();
	}
}

const tvPackx = (values: any) => {
	let { radiox, radioy, unit } = values;
	if (radiox !== 1) return <>{radiox} * {radioy}{unit}</>;
	return <>{radioy}{unit}</>;
}