import { observer } from "mobx-react";
import React from "react";
import { VPage } from "tonva-react";
import { ReturnGetDeliverDetail, ReturnGetDeliverMain } from "uq-app/uqs/JkDeliver";
import { CHome } from "./CHome";
import { VDelivering } from "./VDelivering";

export class VDeliverSheet extends VPage<CHome> {
	private main: ReturnGetDeliverMain;
	private detail: ReturnGetDeliverDetail[];

	init(param: [ReturnGetDeliverMain, ReturnGetDeliverDetail[]]) {
		let [main, detail] = param;
		this.main = main;
		this.detail = detail;
	}

	header() {
		let { rows, pickRows } = this.main;
		let h = '发运单';
		if (pickRows < rows) h += ' - 拣货中';
		return h;
	}

	content() {
		let { JkProduct } = this.controller.uqs;
		let { id, no, staff, rows, pickRows } = this.main;
		let state: any;
		if (staff) {
			state = <>{this.renderUser(staff)} 在打包发运</>;
		} else {
			state = <button className="btn btn-success" onClick={() => this.piling(id)}>开始理货</button>;
		}
		// 拣货状态的判断，取消不限制
		/*else if (rows === pickRows) {
			state = <button className="btn btn-success" onClick={() => this.piling(id)}>开始理货</button>;
		}
		else {
			state = <>拣货中...</>;
		}*/

		let deliverTotal: number = 0;
		this.detail.forEach(element => {
			deliverTotal += element.deliverShould;
		});

		return <div className="p-3">

			<div className="row col-12 px-1 py-1 float-left">
				<span><strong>{no}</strong></span>
			</div>
			<div className="row col-12 px-1 py-1 float-left">
				<span className="text-info small">应发货总瓶数：<strong>{deliverTotal}</strong></span>
			</div>
			<div className="row col-12 px-1 py-1 my-3">{state}</div>
		</div>;
	}

	private piling = async (id: number) => {
		await this.controller.Delivering(id);
		this.closePage();
		this.openVPage(VDelivering, [this.main, this.detail])
	}
}
