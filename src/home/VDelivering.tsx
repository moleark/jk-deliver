import { VPage, LMR } from "tonva-react";
import { ReturnGetDeliverDetail, ReturnGetDeliverMain } from "uq-app/uqs/JkDeliver";
import { CHome } from "./CHome";

export class VDelivering extends VPage<CHome> {
	private main: ReturnGetDeliverMain;
	private detail: ReturnGetDeliverDetail[];

	init(param: [ReturnGetDeliverMain, ReturnGetDeliverDetail[]]) {
		let [main, detail] = param;
		this.main = main;
		this.detail = detail;
	}

	header() {return '发运前确认'}
	right() {
		return <button className="btn btn-sm btn-primary mr-2" onClick={this.doneDeliver}>确认发货</button>;
	}
	content() {
		let {JkDeliver} = this.controller.uqs;
		//let [pickupMain, pickupDetail] = this.pickupData;
		let {id} = this.main;
		return <div className="p-3">
			<div>{JkDeliver.IDRender(id)}</div>
			<div>
				{this.detail.map(v => {
					let {id, pickDone, deliverShould} = v;
					let right = <div>应发:{deliverShould} &nbsp; 实发:{pickDone}</div>;
					return <LMR key={id} right={right}>
						{JkDeliver.OrderDetail.render(id)} 
					</LMR>;
				})}
			</div>
		</div>;
	}

	private doneDeliver = async () => {
		let {id} = this.main;
		this.detail.forEach(v => v.deliverDone = v.deliverShould);
		await this.controller.doneDeliver(id, this.detail);
		this.closePage();
	}
}
