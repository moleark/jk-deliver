import { Context, Form, IntSchema, List, LMR, Page, Schema, UiNumberItem, UiSchema, VPage } from "tonva-react";
import { CDeliver, CustomerPendingDeliver } from "./CDeliver";

export class VCustomerDeliver extends VPage<CDeliver> {
	header() { return '发货至客户' }
	content() {
		let { customer, customerOrderDetails } = this.controller;
		return <div className="">
			<div className="px-3 my-2">customer: {customer}</div>
			<List items={customerOrderDetails}
				item={{ render: this.renderCustomerOrderDetail }} />
			<div className="px-3 my-2">
				<button className="btn btn-primary" onClick={this.submit}>提交</button>
			</div>
		</div>
	}

	private submit = async () => {
		let { customer, customerOrderDetails } = this.controller;
		await this.controller.doneDeliver();
		this.closePage();
		this.openPageElement(<Page header="发货提交成功" back="close">
			<div className="px-3 my-2">customer: {customer}</div>
		</Page>);
		//<List items={customerOrderDetails.filter(v => v.deliverDone >= 0)}
		// item={{ render: this.renderDoneDetail }} />
	}

	private renderDoneDetail = (row: CustomerPendingDeliver, index: number): JSX.Element => {
		let { product, item, quantity } = row;
		let right = <div className="d-flex align-items-center">
			<div>实发</div>
			<div className="w-min-8c">{ }</div>
		</div>
		return <LMR className="px-3 py-2" right={right}>
			product:{product} pack:{item} 应发:{quantity}
		</LMR>
	}

	private renderCustomerOrderDetail = (row: CustomerPendingDeliver, index: number): JSX.Element => {
		let { product, item, quantity } = row;
		let schema: Schema = [
			{ name: 'deliverQuantity', type: 'integer', min: 0, max: quantity } as IntSchema
		];
		let onChanged = (context: Context, value: any, prev: any): Promise<void> => {
			row.deliverQuantity = value;
			return;
		}
		let uiSchema: UiSchema = {
			items: {
				deliverQuantity: {
					label: '实发',
					placeholder: '暂不发',
					defaultValue: quantity,
					className: 'text-right',
					onChanged,
				} as UiNumberItem
			}
		}
		let FieldContainer = (label: any, content: JSX.Element): JSX.Element => {
			return <div className="d-flex align-items-center">
				<div className="mr-2">{label}</div>
				<div className="w-8c">{content}</div>
			</div>;
		}
		let right = <Form schema={schema} uiSchema={uiSchema} FieldContainer={FieldContainer} />
		return <LMR className="px-3 py-2" right={right}>
			product:{product} pack:{item} 应发:{quantity}
		</LMR>
	}
}