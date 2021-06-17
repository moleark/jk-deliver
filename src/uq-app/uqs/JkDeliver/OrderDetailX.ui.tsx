import { Res, setRes, TFunc, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemInt, FieldItemNum, FieldItemString, FieldItemId } from "tonva-react";
import { OrderDetailX } from "./JkDeliver";

/*--fields--*/
const fields = {
	id: {
		"name": "id",
		"type": "id",
		"isKey": false,
		"label": "Id"
	} as FieldItemId,
	needInsuredWhenDelivery: {
		"name": "needInsuredWhenDelivery",
		"isKey": false,
		"label": "NeedInsuredWhenDelivery"
	} as undefined,
};
/*==fields==*/

const fieldArr: FieldItem[] = [
	fields.needInsuredWhenDelivery, 
];

export const ui: UI = {
	label: "OrderDetailX",
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

export function render(item: OrderDetailX):JSX.Element {
	return <>{JSON.stringify(item)}</>;
};
