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
	deliver: {
		"name": "deliver",
		"type": "number",
		"isKey": false,
		"widget": "number",
		"label": "Deliver"
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
	fields.deliver, fields.deliverDone, fields.returnDone, 
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
