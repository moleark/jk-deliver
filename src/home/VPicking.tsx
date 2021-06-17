import { VPage } from "tonva-react";
import { Pickup, PickupDetail } from "uq-app/uqs/JkDeliver";
import { CHome } from "./CHome";

export class VPicking extends VPage<CHome> {
	private pickupData: [Pickup, PickupDetail[]];

	init(param: [Pickup, PickupDetail[]]) {
		this.pickupData = param;
	}

	header() {return '拣货中...'}
	right() {
		let [pickupMain] = this.pickupData;
		let {id} = pickupMain;
		return <button className="btn btn-sm btn-primary mr-2" onClick={() => this.donePickup(id)}>拣货完成</button>;
	}
	content() {
		let {JkDeliver} = this.controller.uqs;
		let [pickupMain, pickupDetail] = this.pickupData;
		let {id} = pickupMain;
		return <div className="p-3">
			<div>{JkDeliver.IDRender(id)}</div>
			<div>
				{pickupDetail.map(v => {
					let {id} = v;
					return <div key={id}>
						{JkDeliver.OrderDetail.render(id)}
					</div>;
				})}
			</div>
		</div>;
	}

	private async donePickup(pickupId: number) {
		await this.controller.donePickup(pickupId);
		this.closePage();
	}
}
