export class PostProduct{
    constructor(
        public name: any,
        public price: any,
        public game_id: any,
        public description: any,
        public platform_id: any
    ){}
}

export class PutProduct{
    constructor(
        public name: any,
        public price: any,
        public game_id: any,
        public description: any,
        public id: any,
    ){}
}

export class PutProductAdmin{
    constructor(
        public name: any,
        public price: any,
        public game_id: any,
        public description: any,
        public id: any,
        public product_status_id: any,
    ){}
}