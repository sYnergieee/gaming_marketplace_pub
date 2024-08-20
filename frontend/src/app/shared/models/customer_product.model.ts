export class PostCustProduct{
    constructor(
        public product_id: any,
    ){}
}

export class PutCustProduct{
    constructor(
        public key_id: any,
        public review: any,
        public customer_status_id: any,
    ){}
}

export class PutCustProductAdmin{
    constructor(
        public key_id: any,
        public review: any,
        public customer_status_id: any,
        public customer_id: any,
    ){}
}