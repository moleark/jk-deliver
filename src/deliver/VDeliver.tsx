import { observer } from "mobx-react";
import React from "react";
import { List, VPage } from "tonva-react";
import { ReturnWarehousePendingDeliverRet } from "uq-app/uqs/JkDeliver";
import { CDeliver } from "./CDeliver";

export class VDeliver extends VPage<CDeliver> {
	header() {return '发货'}
	content() {
		return React.createElement(observer(() => {
			let {warehousePendingDeliver, loadCustomerPendingDeliver} = this.controller;
			return <div className="my-2">
				<List items={warehousePendingDeliver} 
					item={{render: this.renderPending, onClick: loadCustomerPendingDeliver}} />
			</div>
		}));
	}

	private renderPending = (row: ReturnWarehousePendingDeliverRet, index: number): JSX.Element => {
		let {warehouse, rowCount} = row;
		return <div className="px-3 py-2">
			warehouse:{warehouse} rowCount:{rowCount}
		</div>
	}
}