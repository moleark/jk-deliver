import { CUqBase } from "uq-app";
import { VFind } from "./VFind";

export class CFind extends CUqBase {
	protected async internalStart() {		
	}

	tab = () => this.renderView(VFind);
}
