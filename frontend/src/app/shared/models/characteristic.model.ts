export class Characteristic{
    constructor(
        public id: any,
        public name: any,
        public unit: any,
    ){}
}
export class CharacteristicPost{
    constructor(
        public name: any,
        public unit: any,
    ){}
}
export class CharacteristicGame{
    constructor(
        public game_id: any,
        public characteristic_id: any,
        public value: any,
    ){}
}