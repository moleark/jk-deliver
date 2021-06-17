import { VPage } from "tonva-react";
import { ResultPick } from "uq-app/uqs/JkDeliver";
import { CHome } from "./CHome";

export class VPrepare extends VPage<CHome> {
	private resultPick:ResultPick;

	init(param: ResultPick) {
		this.resultPick = param;
	}
	header() {return '准备拣货单和发运单'}
	get back(): 'close'|'back'|'none' {return 'close'}
	content() {
		let {pickups, delivers} = this.resultPick;
		return <div className="p-3">
			<div>已生成拣货单：{JSON.stringify(pickups)}</div>
			<div>已生成发运单：{JSON.stringify(delivers)}</div>
		</div>;
	}
}