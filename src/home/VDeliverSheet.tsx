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
		let {rows, pickRows} = this.main;
		let h = '发运单';
		if (pickRows < rows) h += ' - 拣货中';
		return h;
	}

	content() {
		let {JkDeliver} = this.controller.uqs;
		let {id, staff, rows, pickRows} = this.main;
		let state: any;
		if (staff) {
			state = <>{this.renderUser(staff)} 在理货</>;
		}
		else if (rows === pickRows) {
			state = <button className="btn btn-success" onClick={() => this.piling(id)}>开始理货</button>;
		}
		else {
			state = <>拣货中...</>;
		}
		return <div className="p-3">
			<div>{JkDeliver.IDRender(id)}</div>
			<div>
				{this.detail.map(v => {
					let {id, item, product, deliverShould} = v;
					return <div key={id}>
						id:{id} product:{product} item:{item} deliver:{deliverShould}
					</div>;
				})}
			</div>
			<div className="my-3">{state}</div>
		</div>;
	}

	private piling = async (id: number) => {
		await this.controller.piling(id);
		this.closePage();
		this.openVPage(VDelivering, [this.main, this.detail])
	}
}
