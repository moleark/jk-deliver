import { tv, Page, VPage, LMR, List } from "tonva-react";
import { ReturnGetDeliverDetail, ReturnGetDeliverMain } from "uq-app/uqs/JkDeliver";
import { CHome } from "./CHome";

export class VDelivering extends VPage<CHome> {
	private main: ReturnGetDeliverMain;
	private detail: any[];

	init(param: [ReturnGetDeliverMain, ReturnGetDeliverDetail[]]) {
		let [main, detail] = param;
		this.main = main;
		this.detail = detail;
	}

	header() { return this.main.no + ' 发前确认' }
	right() {
		return <button className="btn btn-sm btn-primary mr-2" onClick={this.doneDeliver}>确认发货</button>;
	}

	private renderDeliverItem = (deliverItem: any, index: number) => {

		let { JkDeliver, JkProduct } = this.controller.uqs;
		let { ProductX } = JkProduct;
		let PackX = ProductX.div('packx');
		let { id, product, item, deliverDone, productExt, deliverShould } = deliverItem;
		console.log(productExt);
		let pack = PackX.getObj(item);


		// let productExt = await getProductExtention(product);
		// console.log(productExt);
		let storage = "";

		let right = <div>
			<div className="row px-1">
				<label className="text-muted">应发：</label ><span className="text-info">{deliverShould}</span>
			</div>
			<div className="row px-1 text-justify">
				<label className="text-muted">实发：</label >
				<input type="text" className="form-control input-sm col-5" onChange={o => deliverItem.deliverShould = o.target.value} defaultValue={deliverShould} />
			</div>
		</div>;

		return <LMR key={id} right={right}>
			<div className="">
				<div className="row col-12 py-1">
					<span className="col-8 pl-1">{ProductX.tv(product)} </span>
					<span className="col-4 pl-1">{tvPackx(pack)}</span>
				</div>
				<div className="row col-12 py-1">
					<span className="col-12 pl-1"> 名称？：{ProductX.tv(product)}</span>
				</div>
				<div className="row col-12 py-1">
					<span className="col-12 pl-1">{productExt}</span>
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

		let { openDeliveryReceiptList } = this.controller;
		let footer = <div className="fixed-bottom">
			<button type="button" className="btn btn-primary w-100" onClick={() => openDeliveryReceiptList(this.main, this.detail)} >回执单</button>
		</div>;

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
			<div>
				<List items={this.detail} item={{ render: this.renderDeliverItem }} none="无拣货数据" />
			</div>
			<div className="float-right py-2">
				<span className="px-2 text-info small">应发总瓶数：<strong>{deliverTotal}</strong></span>
			</div>
			{ }
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