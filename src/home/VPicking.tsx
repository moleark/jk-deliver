import { LMR, VPage, List } from "tonva-react";
import { ReturnGetPickupDetail, ReturnGetPickupMain } from "uq-app/uqs/JkWarehouse";
import { CHome } from "./CHome";

export class VPicking extends VPage<CHome> {
	private main: ReturnGetPickupMain;
	private detail: ReturnGetPickupDetail[];

	init(param: [ReturnGetPickupMain, ReturnGetPickupDetail[]]) {
		let [main, detail] = param;
		this.main = main;
		this.detail = detail;
	}

	header() { return '拣货单：' + this.main.no }

	/*right() {
		let { id } = this.main;
		return <button className="btn btn-sm btn-primary mr-2" onClick={() => this.donePickup(id)}>拣货完成</button>;
	}*/

	// 修改当前选中行颜色
	private onClickPickItem = (rowIndex: number) => {

		let pickListDiv = document.getElementById("pickListDiv").getElementsByTagName("ul")[0].getElementsByTagName("li");

		for (let index = 0; index < pickListDiv.length; index++) {
			if (index == rowIndex) {
				pickListDiv[index].getElementsByTagName("div")[0].style.backgroundColor = "#FFFF99";
			} else {
				pickListDiv[index].getElementsByTagName("div")[0].style.backgroundColor = "#FFFFFF";
			}
		}
	}

	private renderPickItem = (pickItem: any, index: number) => {

		let { JkProduct } = this.controller.uqs;
		let { ProductX } = JkProduct;
		let PackX = ProductX.div('packx');

		let { id: mainId } = this.main;
		let { id, product, item, quantity, shouldQuantity } = pickItem;
		let pack = PackX.getObj(item);	// JSON.stringify(pack)

		// <input className="box" type="checkbox" defaultChecked={false}></input>&nbsp;
		/**
		 * <div className="row px-1">
				<label className="text-muted">应捡：</label ><span className="text-info">{shouldQuantity}</span>
			</div>
			<div className="row px-1 text-justify">
				<label className="text-muted">实捡：</label >
				<input type="text" className="form-control col-5 px-0 mx-0" onChange={o => pickItem.quantity = o.target.value} defaultValue={quantity} />
			</div>
		 */
		let left = <div className="py-1 pr-2">{index + 1}</div>;
		let right = <div className="m-auto pr-2">
			<label className="small text-muted">
				<input type="checkbox"
					defaultChecked={false}
					onChange={e => this.donePickupItem(mainId, id, pickItem.quantity)} />
			</label>
		</div>;

		// {JkDeliver.OrderDetail.render(id)}	ProductX.tv(product)	tv(product, v => v.origin)	JSON.stringify(pack)
		return <LMR className="px-1 py-1" key={id} left={left} right={right} onClick={() => this.onClickPickItem(index)}>
			<div className="row col-12 py-1">
				<span className="col-2 text-muted px-1">编号: </span>
				<span className="col-5 pl-1">{ProductX.tv(product)} </span>
				<span className="col-2 text-muted px-1">包装: </span>
				<span className="col-3 pl-1">{tvPackx(pack)}</span>
			</div>
			<div className="row col-12 py-1">
				<span className="col-2 text-muted px-1">货位: </span>
				<span className="col-5 pl-1">{'xxxxxxxxxxx'}</span>
				<span className="col-2 text-muted px-1">Lot: </span>
				<span className="col-3 pl-1">{'lotxxxxx'}</span>
			</div>
			<div className="row col-12 py-1">
				<span className="col-2 text-muted px-1">应拣: </span>
				<span className="col-5 text-info">{shouldQuantity}</span>
				<span className="col-2 text-muted px-1">实捡: </span>
				<input type="text" className="form-control col-3 text-info" onChange={o => pickItem.quantity = o.target.value} defaultValue={quantity} />
			</div>
		</LMR>;
	};

	content() {

		// let [pickupMain, pickupDetail] = this.pickupData;
		let pickTotal: number = 0;
		this.detail.forEach(element => {
			pickTotal += element.quantity;
		});

		return <div id="pickListDiv" className="p-1 bg-white">
			<List items={this.detail} item={{ render: this.renderPickItem }} none="无拣货数据" />
			<div className="float-right py-3">
				<span className="px-2 text-info small">应拣总瓶数：<strong>{pickTotal}</strong></span>
			</div>
		</div>;
	}

	private async donePickupItem(pickupId: number, orderDetail: number, pickQuantity: number) {

		alert("pickupId:" + pickupId + ",orderDetail:" + orderDetail + ",pickQuantity:" + pickQuantity);
	}

	private async donePickup(pickupId: number) {
		await this.controller.donePickup(pickupId, this.detail);
		this.closePage();
	}
}

const tvPackx = (values: any) => {
	let { radiox, radioy, unit } = values;
	if (radiox !== 1) return <>{radiox} * {radioy}{unit}</>;
	return <>{radioy}{unit}</>;
}