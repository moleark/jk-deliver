import { observer } from "mobx-react";
import React from "react";
import { LMR, VPage, List, FA } from "tonva-react";
import { tvPackx } from "tools/tvPackx";
import { ReturnGetPickupDetail, ReturnGetPickupMain } from "uq-app/uqs/JkWarehouse/JkWarehouse";
import { CHome } from "./CHome";
import { makeObservable, observable } from "mobx";

export class VPicking extends VPage<CHome> {
	private main: ReturnGetPickupMain;
	detail: ReturnGetPickupDetail[];
	constructor(cApp: CHome) {
		super(cApp);
		makeObservable(this, {
			detail: observable
		});
	}

	init(param: [ReturnGetPickupMain, ReturnGetPickupDetail[]]) {
		let [main, detail] = param;
		this.main = main;
		this.detail = detail.sort((a: any, b: any) => { return this.compare(a, b) });
	}

	header() { return '拣货单：' + this.main.no }

	/**
	 * 自定义排序方法
	 * @param a 
	 * @param b 
	 * @returns 
	 */
	private compare = (a: any, b: any) => {
		let stateA: string = a["pickstate"] === 1 ? '1' : '0';
		let stateB: string = b["pickstate"] === 1 ? '1' : '0';
		let blockNameA: string = a["shelfBlockName"] === undefined ? '0' : a["shelfBlockName"];
		let blockNameB: string = b["shelfBlockName"] === undefined ? '0' : b["shelfBlockName"];
		return stateA.localeCompare(stateB) || blockNameA.localeCompare(blockNameB);
	}

	private renderPickItem = (pickItem: any, index: number) => {

		let { JkProduct, JkWarehouse } = this.controller.uqs;
		let { ProductX } = JkProduct;
		// let { ShelfBlock } = JkWarehouse;
		let PackX = ProductX.div('packx');

		// let { id: mainId } = this.main;
		let { id: pickupDetail, product, deliverDetail, shelfBlock, shelfBlockName, lotNumber, item, shouldQuantity, pickdone, pickstate } = pickItem;
		let pack = PackX.getObj(item);	// JSON.stringify(pack)

		// let left = <div className="py-1 pr-2">{index + 1}</div>;
		let isDone: boolean = (pickstate === 0 || pickstate === false) ? false : true;
		pickItem.pickstate = isDone;
		let right = <div className="m-auto pr-2">
			<label className="small text-muted">
				<input type="checkbox"
					defaultChecked={isDone}
					onChange={e => {
						if (e.target.checked === false) { return };
						pickItem.pickstate = e.target.checked;
						this.donePickupItem(pickupDetail, pickdone);
						this.detail.sort((a: any, b: any) => a["pickstate"] - b["pickstate"] || a["shelfBlockName"] - b["shelfBlockName"]);
					}}
				/>
			</label>
		</div>;

		// {JkDeliver.OrderDetail.render(id)}	ProductX.tv(product)	tv(product, v => v.origin)	JSON.stringify(pack)
		// onClick={() => this.onClickPickItem(index)}
		// {ShelfBlock.tv(shelfBlock)}
		return <LMR className="py-1 border-top border-light" key={pickupDetail} right={right}
			style={isDone === true ? { backgroundColor: "#C1FFC1" } : {}}>
			<div className="row col-12 py-1">
				<span className="col-2 text-muted px-1">货位: </span>
				<span className="col-9 pl-1"> <b>{shelfBlockName}</b></span>
			</div>
			<div className="row col-12 py-1">
				<span className="col-2 text-muted px-1">编号: </span>
				<span className="col-5 pl-1">{ProductX.tv(pack.owner)} </span>
				<span className="col-2 text-muted px-1">包装: </span>
				<span className="col-3 pl-1">{tvPackx(pack)}</span>
			</div>
			<div className="row col-12 py-1">
				<span className="col-2 text-muted px-1">Lot: </span>
				<span className="col-9 pl-1">{lotNumber}</span>
			</div>
			<div className="row col-12 py-1">
				<span className="col-2 text-muted px-1">应拣: </span>
				<span className="col-5 text-info">{shouldQuantity}</span>
				<span className="col-2 text-muted px-1">实捡: </span>
				<div className="col-3 form-inline p-0 m-0">
					<span className="col-1 pl-0" onClick={() => { if (pickItem.pickdone > 0) { pickItem.pickdone = Number(pickItem.pickdone) - 1; } }}>
						<FA name="minus" className="fa fa-minus-square fa-sm text-info" />
					</span>
					{React.createElement(observer(() => {
						return <input type="text" className="form-control col-7 px-0 mx-0 py-0 my-0 text-info" style={{ height: 'calc(1.0em + 0.5rem + 2px)' }}
							onChange={o => pickItem.pickdone = o.target.value} defaultValue={pickdone} />
					}))}
					<span className="col-1 pl-0" onClick={() => { pickItem.pickdone = Number(pickItem.pickdone) + 1; }}>
						<FA name="plus" className="fa fa-plus-square fa-sm text-info" />
					</span>
				</div>
			</div>
		</LMR >;
	};

	content() {
		let pickTotal: number = 0;
		this.detail.forEach(element => {
			pickTotal += element.shouldQuantity;
			if (element.pickstate === 0) {
				element.pickdone = element.shouldQuantity;
			}
		});

		return <div id="pickListDiv" className="p-1 bg-white">
			<div className="px-0 py-1 bg-light" style={{ borderBottom: '1px dashed #dee2e6' }}>
				<span className="px-1 text-info small">应拣总瓶数：<strong>{pickTotal}</strong></span>
			</div>
			{React.createElement(observer(() => {
				return <List items={this.detail} item={{ render: this.renderPickItem }} none="无拣货数据" />
			}))}
		</div>;
	}

	private async donePickupItem(pickupDetail: number, pickQuantity: number) {

		let { donePickSingle, donePickup } = this.controller;
		let { id: pickupId } = this.main;
		await donePickSingle(pickupDetail, pickQuantity);

		let isAllCheck: boolean = this.detail.every((e: any) => e.pickstate === true);
		if (isAllCheck) {
			let pickDetail: any[] = [];
			this.detail.forEach((d: any) => {
				pickDetail.push({ pickupDetail: d.pickupDetail, biz: d.deliverDetail, quantity: d.pickdone });
			});
			await donePickup(pickupId, pickDetail);
			this.closePage();
		}
	}
}