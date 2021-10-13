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
	biz: {
		"name": "biz",
		"type": "id",
		"isKey": false,
		"label": "Biz"
	} as FieldItemId,
	item: {
		"name": "item",
		"type": "id",
		"isKey": false,
		"label": "Item"
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
	lotNumber: {
		"name": "lotNumber",
		"type": "string",
		"isKey": false,
		"widget": "string",
		"label": "LotNumber"
	} as FieldItemString,
	json: {
		"name": "json",
		"isKey": false,
		"label": "Json"
	} as undefined,
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
	fields.main, fields.biz, fields.item, fields.shelfBlock, fields.quantity, fields.lotNumber, fields.json, fields.pickDone, fields.pickState, 
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
