export const CUSTOMER = 'Покупатель';
export const SALESMAN = 'Продавец';
export const ADMINISTRATOR = 'Администратор';

export let TABLE_ACCESS_ROUTE: any = {
  applications: [SALESMAN, ADMINISTRATOR],
  parameters: [ADMINISTRATOR],
  'game-create': [ADMINISTRATOR, CUSTOMER, SALESMAN],
  'my-products': [SALESMAN],
  'my-keys': [CUSTOMER],
  'prod-not-proc': [ADMINISTRATOR]
};

export let LINKS = [
  { title: 'Заявки', link: 'applications' },
  { title: 'Параметры', link: 'parameters' },
  { title: 'Игры', link: 'game-create' },
  { title: 'Мои продукты', link: 'my-products' },
  { title: 'Мои ключи', link: 'my-keys' },
  { title: 'Необр. продукты', link: 'prod-not-proc' }
];
