export class GamePost{
    constructor(
        public name: any,
        public description: any,
        public release_date: any,
        public publisher_id: any,
        public platforms_ids: any,
        public genres_ids: any,
    ){}
}
export class GameChange{
    constructor(
        public name: any,
        public description: any,
        public release_date: any,
        public publisher_id: any,
        public platforms_ids: any,
        public genres_ids: any,
        public id: any,
    ){}
}