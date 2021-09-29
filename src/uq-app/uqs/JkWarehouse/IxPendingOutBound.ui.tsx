// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Res, setRes, TFunc, UI, uqStringify } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { IxPendingOutBound } from "./JkWarehouse";

/*--fields--*/
const fields = {
	ixx: {
		"name": "ixx",
		"type": "id",
		"isKey": false,
		"label": "Ixx"
	} as FieldItemId,
	ix: {
		"name": "ix",
		"type": "id",
		"isKey": false,
		"label": "Ix"
	} as FieldItemId,
	xi: {
		"name": "xi",
		"type": "id",
		"isKey": false,
		"label": "Xi"
	} as FieldItemId,
	orderDetail: {
		"name": "orderDetail",
		"type": "id",
		"isKey": false,
		"label": "OrderDetail"
	} as FieldItemId,
	quantity: {
		"name": "quantity",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "Quantity"
	} as FieldItemNum,
	lotNumber: {
		"name": "lotNumber",
		"type": "string",
		"isKey": false,
		"widget": "string",
		"label": "LotNumber"
	} as FieldItemString,
};
/*==fields==*/

const fieldArr: FieldItem[] = [
	fields.ixx, fields.xi, fields.orderDetail, fields.quantity, fields.lotNumber, 
];

export const ui: UI = {
	label: "IxPendingOutBound",
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

export function render(item: IxPendingOutBound):JSX.Element {
	return <>{uqStringify(item)}</>;
};
