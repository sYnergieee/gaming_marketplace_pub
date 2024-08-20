export class RecoveryPost{
    constructor(
        public email: any,
    ){}
}
export class RecoveryChange{
    constructor(
        public code: any,
        public password: any
    ){}
}