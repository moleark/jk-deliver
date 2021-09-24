// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Res, setRes, TFunc, UI, uqStringify } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { DxDeliverDetail } from "./JkDeliver";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	deliverDone: {
		"name": "deliverDone",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "DeliverDone"
	} as FieldItemNum,
	pickDone: {
		"name": "pickDone",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "PickDone"
	} as FieldItemNum,
	deliverReturn: {
		"name": "deliverReturn",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "DeliverReturn"
	} as FieldItemNum,
	returnDone: {
		"name": "returnDone",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "ReturnDone"
	} as FieldItemNum,
};
/*==fields==*/

const fieldArr: FieldItem[] = [
	fields.deliverDone, fields.pickDone, fields.deliverReturn, fields.returnDone, 
];

export const ui: UI = {
	label: "DxDeliverDetail",
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

export function render(item: DxDeliverDetail):JSX.Element {
	return <>{uqStringify(item)}</>;
};
