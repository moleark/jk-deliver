import { Res, setRes, TFunc, UI } from "tonva-react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FieldItem, FieldItemNumber, FieldItemString, FieldItemId } from "tonva-react";
import { TuidBuyerAccount } from "./JkCustomer";

const resRaw: Res<any> = {
	$zh: {
	},
	$en: {
	}
};
const res: any = {};
setRes(res, resRaw);

export const t: TFunc = (str: string | JSX.Element): string | JSX.Element => {
	return res[str as string] ?? str;
}

export function render(item: TuidBuyerAccount): JSX.Element {
	//return <>{JSON.stringify(item)}</>;
	return <>{item.description}</>;
};
