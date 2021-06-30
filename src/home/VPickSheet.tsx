import { VPage } from "tonva-react";
import { ReturnGetPickupDetail, ReturnGetPickupMain } from "uq-app/uqs/JkWarehouse";
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
		let {JkDeliver} = this.controller.uqs;
		let {id, picker} = this.main;
		return <div className="p-3">
			<div>{JkDeliver.IDRender(id)}</div>
			<div>
				{this.detail.map(v => {
					let {id} = v;
					return <div key={id}>
						{JkDeliver.OrderDetail.render(id)}
					</div>;
				})}
			</div>
			{
				!picker && <div className="my-3">
					<button className="btn btn-success" onClick={() => this.picking(id)}>开始拣货</button>
				</div>
			}
		</div>;
	}

	private picking = async (pickup: number) => {
		await this.controller.picking(pickup);
		this.closePage();
		this.openVPage(VPicking, [this.main, this.detail])
	}
}