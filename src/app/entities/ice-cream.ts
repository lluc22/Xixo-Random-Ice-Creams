export class IceCream{
    label!: string;
    id!: number;
    baseColor?: string;
    baseColorVarName?: string;
    topping?: boolean = false;
    toppingColor?: string;

    constructor() {
    }
}