export class SigninModel {
    constructor(private email: any, private password: any) { }
}

export class SignupModel {
    constructor(
        public nickname: any,
        public email: any,
        public firstname: any,
        public lastname: any,
        public birthdate: any,
        public role: any,
        public password: any,
        public telegram?: any,
        public discord?: any,
    ) { }
}

export class UserEdit {
    constructor(
        public nickname: any,
        public email: any,
        public firstname: any,
        public lastname: any,
        public birthdate: any,
        public password?: any,
        public telegram?: any,
        public discord?: any,
    ) { }
}

export class UserGetSalesman {
    constructor(
        public id?: any,
        public name?: any,
    ) { }
}