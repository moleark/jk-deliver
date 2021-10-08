import { VPage } from "tonva-react";
import { ReturnGetPickupDetail, ReturnGetPickupMain } from "uq-app/uqs/JkWarehouse/JkWarehouse";
import { CHome } from "./CHome";
import { VPicking } from "./VPicking";

export class VPickSheet extends VPage<CHome> {
	private main: ReturnGetPickupMain;
	private detail: ReturnGetPickupDetail[];

	init(param: [ReturnGetPickupMain, ReturnGetPickupDetail[]]) {
		let [main, detail] = param;
		this.main = main;
		this.detail = detail;
	}

	header() {
		return '拣货单';
	}

	content() {
		let { JkDeliver } = this.controller.uqs;
		let { id, no, picker } = this.main;

		let pickTotal: number = 0;
		this.detail.forEach(element => {
			pickTotal += element.shouldQuantity;
		});

		/*
		<div>{JkDeliver.IDRender(id)}</div>
			<div>
				{this.detail.map(v => {
					let { id } = v;
					return <div key={id}>
						{JkDeliver.OrderDetail.render(id)}
					</div>;
				})}
			</div>
		*/
		return <div className="p-3 px-1 py-1">

			<div className="row col-12 px-1 py-1 float-left">
				<span><strong>{no}</strong></span>
			</div>
			<div className="row col-12 px-1 py-1 float-left">
				<span className="text-info small">应拣货总瓶数：<strong>{pickTotal}</strong></span>
			</div>
			<div className="row col-12 px-1 py-1">
				{
					!picker && <div className="my-3">
						<button className="btn btn-success" onClick={() => this.picking(id)}>开始拣货</button>
					</div>
				}
			</div>
		</div>;
	}

	/**
	 * 开始拣货
	 * @param pickup 拣货单号
	 */
	private picking = async (pickup: number) => {
		await this.controller.picking(pickup);
		this.closePage();
		this.openVPage(VPicking, [this.main, this.detail])
	}
}