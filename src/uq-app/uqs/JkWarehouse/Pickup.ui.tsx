import { Res, setRes, TFunc, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { Pickup } from "./JkWarehouse";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	no: {
		"name": "no",
		"type": "string",
		"isKey": true,
		"widget": "string",
		"label": "No"
	} as FieldItemString,
	warehouse: {
		"name": "warehouse",
		"type": "id",
		"isKey": false,
		"label": "Warehouse"
	} as FieldItemId,
	picker: {
		"name": "picker",
		"type": "id",
		"isKey": false,
		"label": "Picker"
	} as FieldItemId,
	startTime: {
		"name": "startTime",
		"isKey": false,
		"label": "StartTime"
	} as undefined,
	finishTime: {
		"name": "finishTime",
		"isKey": false,
		"label": "FinishTime"
	} as undefined,
	$owner: {
		"name": "$owner",
		"type": "integer",
		"isKey": false,
		"widget": "updown",
		"label": "$owner"
	} as FieldItemInt,
	$create: {
		"name": "$create",
		"isKey": false,
		"label": "$create"
	} as undefined,
};
/*==fields==*/

const fieldArr: FieldItem[] = [
	fields.no, fields.warehouse, fields.picker, fields.startTime, fields.finishTime, fields.$owner, fields.$create, 
];

export const ui: UI = {
	label: "Pickup",
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

export function render(item: Pickup):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
