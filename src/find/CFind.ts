import { CUqBase } from "uq-app";
import { VFind } from "./VFind";
import { VCutOffTypeSetting } from "./VCutOffTypeSetting";
import { VCutOffTypeEdit } from "./VCutOffTypeEdit";
import { CutOffType } from "uq-app/uqs/JkDeliver";

export class CFind extends CUqBase {

	outBoundReasonList: any[];
	cutOffTypeCustomerList: any[];
	protected async internalStart() {
	}

	tab = () => this.renderView(VFind);

	/**
	 * 打开截单类型设置界面
	 */
	onOpenCutOffTypeSetting = async () => {

		let ret: any = { list: {} }; //await JkDeliver.GetCutOffTypeList.query({});
		let { list } = ret;
		this.openVPage(VCutOffTypeSetting, list);
	};

	/**
	 * 打开新增截单类型界面
	 */
	openAddCutOffType = async () => {
		let { JkWarehouse, JkDeliver } = this.uqs;
		let outBoundReasonRet: any = await JkWarehouse.GetOutInBoundReasonList.query({});
		//let customerRet = await JkDeliver.GetCutOffCustomerList.query({});
		// this.outBoundReasonList = outBoundReasonRet.list;
		//this.cutOffTypeCustomerList = customerRet.list;
		console.log(this.cutOffTypeCustomerList);
		this.openVPage(VCutOffTypeEdit);
	};

	/**
	 * 保存截单类型
	 * @param cutOffType 
	 */
	saveCutOffType = async (cutOffType: CutOffType) => {
		/*
		if (cutOffType.tradeType === '') {
			cutOffType.tradeType = undefined;
		}
		let r = await this.uqs.JkDeliver.Acts({
			cutOffType: [
				{ id: cutOffType?.id, no: cutOffType.no, customer: cutOffType.customer, tradeType: cutOffType.tradeType }
			]
		});
		console.log(r);
		this.closePage(2);
		this.onOpenCutOffTypeSetting();
		*/
	};

	/**
	 * 打开截单类型编辑界面
	 * @param cutOffTypeId 
	 */
	openEditCutOffType = async (cutOffTypeId: number) => {

		let { JkDeliver, JkWarehouse } = this.uqs;
		let outBoundReasonRet: any = await JkWarehouse.GetOutInBoundReasonList.query({});
		//let customerRet = await JkDeliver.GetCutOffCustomerList.query({});
		// this.outBoundReasonList = outBoundReasonRet.list;
		//this.cutOffTypeCustomerList = customerRet.list;
		console.log(this.cutOffTypeCustomerList);
		let result = { ret: [{}] }; // await JkDeliver.GetCutOffType.query({ cutOffType: cutOffTypeId });
		let cutOffType = result.ret[0];
		this.openVPage(VCutOffTypeEdit, cutOffType);
	};

	/**
	 * 删除截单类型
	 * @param cutOffTypeId
	 */
	deleteCutOfftype = async (cutOffTypeId: any) => {
		//await this.uqs.JkDeliver.
		console.log('删除id：' + cutOffTypeId);
		await this.uqs.JkDeliver.Acts({});
		this.backPage();
		this.onOpenCutOffTypeSetting();
	};
}
