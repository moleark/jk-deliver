// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Res, setRes, TFunc, UI, uqStringify } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { PickupDetail } from "./JkWarehouse";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	main: {
		"name": "main",
		"type": "id",
		"isKey": false,
		"label": "Main"
	} as FieldItemId,
	deliverDetail: {
		"name": "deliverDetail",
		"type": "id",
		"isKey": false,
		"label": "DeliverDetail"
	} as FieldItemId,
	orderDetail: {
		"name": "orderDetail",
		"type": "id",
		"isKey": false,
		"label": "OrderDetail"
	} as FieldItemId,
	shelfBlock: {
		"name": "shelfBlock",
		"type": "id",
		"isKey": false,
		"label": "ShelfBlock"
	} as FieldItemId,
	quantity: {
		"name": "quantity",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "Quantity"
	} as FieldItemNum,
	pickDone: {
		"name": "pickDone",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "PickDone"
	} as FieldItemNum,
	pickState: {
		"name": "pickState",
		"isKey": false,
		"label": "PickState"
	} as undefined,
};
/*==fields==*/

const fieldArr: FieldItem[] = [
	fields.main, fields.deliverDetail, fields.orderDetail, fields.shelfBlock, fields.quantity, fields.pickDone, fields.pickState, 
];

export const ui: UI = {
	label: "PickupDetail",
	fieldArr,
	fields,
};

const resRaw: Res<any> = {
	$zh: {
	},
	$en: {
	}
};
const res: any = {};
setRes(res, resRaw);

export const t:TFunc = (str:string|JSX.Element): string|JSX.Element => {
	return res[str as string] ?? str;
}

export function render(item: PickupDetail):JSX.Element {
	return <>{uqStringify(item)}</>;
};
