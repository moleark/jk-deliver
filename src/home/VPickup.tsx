import { VPage } from "tonva-react";
import { Pickup, PickupDetail } from "uq-app/uqs/JkDeliver";
import { CHome } from "./CHome";
import { VPicking } from "./VPicking";

export class VPickup extends VPage<CHome> {
	private pickupData: [Pickup, PickupDetail[]];

	init(param: [Pickup, PickupDetail[]]) {
		this.pickupData = param;
	}

	header() {
		return '拣货单';
	}

	content() {
		let {JkDeliver} = this.controller.uqs;
		let [pickupMain, pickupDetail] = this.pickupData;
		let {id, picker} = pickupMain;
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
			{
				!picker && <div className="my-3">
					<button className="btn btn-success" onClick={() => this.startPickup(id)}>开始拣货</button>
				</div>
			}
		</div>;
	}

	private startPickup = async (pickup: number) => {
		await this.controller.startPickup(pickup);
		this.closePage();
		this.openVPage(VPicking, this.pickupData)
	}
}