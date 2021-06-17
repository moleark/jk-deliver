import { Page, VPage } from 'tonva-react';
import { COutBound } from './COutBound';

export class VOutBound extends VPage<COutBound> {

	/*
    async open(param?: any) {
        this.openPage(this.page);
    }

    render(param: any): JSX.Element {
        //return <this.content />
        return <this.content />;

    }

    private page = () => {
        return <Page header={false}>
            <this.content />
        </Page >;
    };
	*/
	header() {return false;}

    content = () => {
        return <>
            <div>
                ---
            </div>
        </>
    };
}