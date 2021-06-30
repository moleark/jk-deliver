import { Res, setRes, TFunc, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { DxDeliver } from "./JkDeliver";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	staff: {
		"name": "staff",
		"type": "id",
		"isKey": false,
		"label": "Staff"
	} as FieldItemId,
	rows: {
		"name": "rows",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "Rows"
	} as FieldItemInt,
	pickRows: {
		"name": "pickRows",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "PickRows"
	} as FieldItemInt,
	deliverTime: {
		"name": "deliverTime",
		"isKey": false,
		"label": "DeliverTime"
	} as undefined,
};
/*==fields==*/

const fieldArr: FieldItem[] = [
	fields.staff, fields.rows, fields.pickRows, fields.deliverTime, 
];

export const ui: UI = {
	label: "DxDeliver",
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

export function render(item: DxDeliver):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
