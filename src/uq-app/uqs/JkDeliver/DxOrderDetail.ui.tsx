import { Res, setRes, TFunc, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { DxOrderDetail } from "./JkDeliver";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	deliverShould: {
		"name": "deliverShould",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "DeliverShould"
	} as FieldItemNum,
	pickDone: {
		"name": "pickDone",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "PickDone"
	} as FieldItemNum,
	deliverDone: {
		"name": "deliverDone",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "DeliverDone"
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
	fields.deliverShould, fields.pickDone, fields.deliverDone, fields.returnDone, 
];

export const ui: UI = {
	label: "DxOrderDetail",
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

export function render(item: DxOrderDetail):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
