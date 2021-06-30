import { LMR, VPage } from "tonva-react";
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

	header() {return '拣货中...'}
	right() {
		let {id} = this.main;
		return <button className="btn btn-sm btn-primary mr-2" onClick={() => this.donePickup(id)}>拣货完成</button>;
	}
	content() {
		let {JkDeliver} = this.controller.uqs;
		//let [pickupMain, pickupDetail] = this.pickupData;
		let {id} = this.main;
		return <div className="p-3">
			<div>{JkDeliver.IDRender(id)}</div>
			<div>
				{this.detail.map(v => {
					let {id, quantity, shouldQuantity} = v;
					let right = <div>应捡:{shouldQuantity} &nbsp; 实捡:{quantity}</div>;
					return <LMR key={id} right={right}>
						{JkDeliver.OrderDetail.render(id)} 
					</LMR>;
				})}
			</div>
		</div>;
	}

	private async donePickup(pickupId: number) {
		await this.controller.donePickup(pickupId, this.detail);
		this.closePage();
	}
}
