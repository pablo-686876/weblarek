# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```
## Сборка

```
npm run build
```

или

```
yarn build
```
# Интернет-магазин «Web-Larёk»
«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и  отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component
Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`


#### Класс Api
Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter
Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` -  хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

### Данные

Для приложения можно выделить две сущности, которые хранят данные - "Продукт" и "Покупатель". Для каждой сущности был создан свой интерфейс.

#### Интерфейс IProduct
Интерфейс будет хранить данные о товаре из каталога, предоставленного сервером. Поля данных заранее определены.

Для сущности "Продукт" были выделены следующие поля:
```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
} 
```
#### Интерфейс IBuyer
Интерфейс будет хранить данные о покупателе, который регистрирует заказ на сайте. Поля данных заранее определены.

Для сущности "Покупатель" были выделены следующие поля:
```
interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
} 
```

### Слой моделей - Model

#### Класс ProductCatalog
Конструктор:
`constructor()` - пустой конструктор, данные в класс попадают через методы класса.

Поля класса:

`items: IProduct[]` - массив всех товаров;

`current_item: IProduct` - товар, выбранный для подробного отображения.

Методы класса:

`setProducts(items: IProduct[]): void` - сохранение массива товаров, полученного с сервера;

`getProducts(): IProduct[]` - получение массива товаров;

`getProductbyId(id: string): IProduct | undefined` - получение товара по id, если он имеется в каталоге;

`setCurrentProduct(item: IProduct): void` - сохранение товара для подробного отображения;

`getCurrentProduct(): IProduct | null` - получение товара для подробного отображения.

#### Класс Cart

Конструктор:

`constructor()` - пустой конструктор, данные в класс попадают через методы класса.

Поля класса:

`items: IProduct[]` - массив всех товаров в корзине.

Методы класса:

`getCartList(): IProduct[]` - получение массива товаров из корзины;

`addProduct(item: IProduct): void` - добавление товара в корзину;

`deleteProduct(item: IProduct): void` - удаление товара из корзины;

`clearCart(): void` - удаление всех товаров из корзины;

`getCartSum(): number` - получение суммы всех товаров из корзины;

`getCartProductCount(): number` - получение количества товаров в корзине;

`isCartProductById(id: string): boolean` - проверка наличия товара в корзине по id.


#### Класс Buyer

Конструктор:

`constructor()` - пустой конструктор, данные в класс попадают через методы класса.

Поля класса:

`payment: TPayment` - тип оплаты;

`email: string` - почта;

`phone: string` - телефон;

`address: string` - адрес.

Методы класса:

`setBuyerData(buyer: IBuyer): void` - сохранение данных покупателя из формы в модель;

`getBuyerData(): IBuyer` - получение всех полей данных покупателя;

`clearBuyerData(): void` - очистка всех полей данных покупателя;

`validateBuyerData(): TBuyerErrors` - валидация данных полей покупателя. Возвращает список ошибок `errors`, если они есть.

### Слой коммуникации - Api

#### Класс WebApi
Конструктор:

`constructor(api: IApi)` - принимает объект, соответсвующий интерфейсу `IApi`.

Поля класса:

`api: IApi` - используемое api, соответсвующее интерфейсу `IApi`.

Методы класса:

`async getProductList(): Promise<IProduct[]>` - возвращает массив товаров с сервера, соответсвующий интерфейсу `IProduct`;

`async postOrder(data: IOrderRequest): Promise<IOrderResponse>` - создает заказ, данные берутся из `IOrderRequest`, ответ сервера соответсвует интерфейсу `IOrderResponse`.


### Слой представления - View

Все классы представления будут наследоваться от класса Component, содержащего метод `render`, с помощью которого будет строиться отображения всех компонентов приложения.

#### Класс Header
Конструктор:
`constructor(container: HTMLElement, private events: IEvents)` - конструктор принимает контейнер `HTMLElement`, блок разметки компонента, и экземпляр интерфейса `IEvents`, реализующий методы описания событий.

Поля класса:

`basketCounter: HTMLElement` - показатель количества товаров корзины;

`basketButton: HTMLButtonElement` - кнопка открытия корзины.

Методы класса:

`set counter(value: number)` - сеттер сохранения значения `value` в `basketCounter`;

#### Класс BasketView
Конструктор:
`constructor(container: HTMLElement, private events: IEvents)` - конструктор принимает контейнер `HTMLElement`, блок разметки компонента, и экземпляр интерфейса `IEvents`, реализующий методы описания событий.

Поля класса:

`totalPrice: HTMLElement` - показатель общей суммы товаров корзины;

`emptyElement: HTMLElement` - пустой блок, используется в случае отсутствия товаров в корзине;

`orderButton: HTMLButtonElement` - кнопка оформления заказа;

`basketList: HTMLElement` - блок списка товаров корзины.

Методы класса:

`set items(items: HTMLElement[])` - сеттер сохранения товаров корзины `items` в `basketList`;

`set price(price: number)` - сеттер сохранения общей суммы корзины `price` в `totalPrice`;

`set canOrder(items: HTMLElement[])` - сеттер блокировки оформления в корзине. Доступно тогда, когда в корзине есть товары. 

#### Класс Gallery
Конструктор:
`constructor(container: HTMLElement)` - конструктор принимает контейнер `HTMLElement`, блок разметки компонента.

Поля класса - отсутствуют.

Методы класса:

`set catalog(items: HTMLElement[])` - сеттер сохранения карточек товаров `items` в `container`.

#### Класс Modal
Конструктор:
`constructor(container: HTMLElement)` - конструктор принимает контейнер `HTMLElement`, блок разметки компонента.

Поля класса:

`closeButton: HTMLButtonElement` - кнопка закрытия модального окна;

`modalContent: HTMLElement` - блок контента модального окна.

Методы класса:

`set content(content: HTMLElement)` - сеттер сохранения кнтента мадального окна `content` в `modalContent`;

`open(content: HTMLElement)` - функция открытия модального окна;

`close()` - функция закрытия модального окна.

#### Класс SuccessOrder
Конструктор:
`constructor(container: HTMLElement, private events: IEvents)` конструктор принимает контейнер `HTMLElement`, блок разметки компонента, и экземпляр интерфейса `IEvents`, реализующий методы описания событий.

Поля класса:

`orderField: HTMLElement` - показатель суммы оформленной покупки;

`submitOrderButton: HTMLButtonElement` - кнопка закрытия модального окна.

Методы класса:

`set order(value: number)` - сеттер сохранения суммы покупки `value` в `orderField`.

#### Класс BaseCard
Родительский класс для всех представлений карточки товара в приложении.

Конструктор:
`constructor(container: HTMLElement)` конструктор принимает контейнер `HTMLElement`, блок разметки компонента.

Поля класса:

`titleElement: HTMLElement` - название товара;

`priceElement: HTMLElement` - стоимость товара.

Методы класса:

`set price(price: number | null)` - сеттер сохранения стоимости товара `price` в `priceElement`;

`set title(title: string)` - сеттер сохранения названия товара `title` в `titleElement`;

#### Класс CardBasket

Конструктор:
`constructor(container: HTMLElement, actions?: ICardActions)` конструктор принимает контейнер `HTMLElement`, блок разметки компонента, и обработчик событий `actions`.

Поля класса:

`deleteButton: HTMLButtonElement` - кнопка удаления товара из корзины;

`cardIndex: HTMLElement` - индекс товара в корзине.

Методы класса:

`set index(value: number)` - сеттер сохранения индекса товара `value` в `cardIndex`.

#### Класс CardCatalog

Конструктор:
`constructor(container: HTMLElement, actions?: ICardActions)` конструктор принимает контейнер `HTMLElement`, блок разметки компонента, и обработчик событий `actions`.

Поля класса:

`categoryElement: HTMLElement` - категория товара;

`imageElement: HTMLImageElement` - изображение товара.

Методы класса:

`set image(src: string)` - сеттер сохранения ссылки на изображение товара `src` в `imageElement`;

`set category(category: string)` - сеттер сохранения категории товара `category` в `categoryElement`;

`setCategoryClass(category: string, categoryElement: HTMLElement)` - вспомагательный метод для добавления класса в зависимости от значения категории карточки.

#### Класс CardPreview

Конструктор:
`constructor(container: HTMLElement, actions?: ICardActions)` конструктор принимает контейнер `HTMLElement`, блок разметки компонента, и обработчик событий `actions`.

Поля класса:

`categoryElement: HTMLElement` - категория товара;

`imageElement: HTMLImageElement` - изображение товара,

`descriptionElement: HTMLElement` - описание товара;

`purchaseButton: HTMLButtonElement` - кнопка добавления товара в корзину.

Методы класса:

`set image(src: string)` - сеттер сохранения ссылки на изображение товара `src` в `imageElement`;

`set category(category: string)` - сеттер сохранения категории товара `category` в `categoryElement`;

`set description(description: string)` - сеттер сохранения описания товара `description` в `descriptionElement`;

`protected set buttonText(text: string)` - сеттер определения текста кнопки карточки товара - "В корзину"/"Удалить из корзины";

`protected set isActive(isDisabled: boolean)` - сеттер блокировки кнопки покупки товара, в случае, если у товара нет цены.

`setCategoryClass(category: string, categoryElement: HTMLElement)` - вспомагательный метод для добавления класса в зависимости от значения категории карточки.

#### Класс BaseForm
Родительский класс для всех представлений формы в приложении.

Конструктор:
`constructor(container: HTMLElement, private events: IEvents)` конструктор принимает контейнер `HTMLElement`, блок разметки компонента, и экземпляр интерфейса `IEvents`, реализующий методы описания событий.

Поля класса:

`submitButton: HTMLButtonElement` - кнопка подтверждения формы;

`formErrors: HTMLElement` - объект ошибок формы;

`form: HTMLFormElement` - контейнер формы;

`formName: string` - название формы в разметке.

Методы класса:

`set errors(message: TBuyerErrors | null)` - сеттер сохранения ошибок валидации формы `message` в `formErrors`;

`set valid(isValid: boolean)` - сеттер обновления кнопки формы (заблокированная/доступная);

#### Класс ContactsForm

Конструктор:
`constructor(container: HTMLElement, private events: IEvents)` конструктор принимает контейнер `HTMLElement`, блок разметки компонента, и экземпляр интерфейса `IEvents`, реализующий методы описания событий.

Поля класса:

`emailInput: HTMLInputElement` - поле ввода почты в форму;

`phoneInput: HTMLInputElement` - поле ввода номера телефона в форому.

Методы класса:

`set email(email: string)` - сеттер сохранения почты пользователя `email` в `emailInput`;

`set phone(phone: string)` - сеттер сохранения телефона пользователя `phone` в `phoneInput`;

#### Класс OrderForm

Конструктор:
`constructor(container: HTMLElement, private events: IEvents)` конструктор принимает контейнер `HTMLElement`, блок разметки компонента, и экземпляр интерфейса `IEvents`, реализующий методы описания событий.

Поля класса:

`addressInput: HTMLInputElement` - поле ввода адреса в форму;

`paymentButtons: HTMLButtonElement[]` - массив кнопок выбора способа оплаты.

Методы класса:

`set address(address: string)` - сеттер сохранения адреса пользователя `address` в `addressInput`;

`set payment(payment: TPayment)` - сеттер сохранения способа оплаты пользователя `payment` в `paymentButtons`.

### Генерируемые события

- `view:basket-open` - открытие корзины;
- `view:basket-order` - оформление покупки товаров;
- `view:success-order-close` - закрытие модального окна успешно оформленного заказа;
- `view:form-changed` - изменение полей формы;
- `view:form-contacts-submit` - подтверждение формы `ContactsForm`;
- `view:form-order-submit` - подтверждение формы `OrderForm`;
- `model-basket:change-cart` - изменение корзины товаров;
- `model-catalog:set-products` - заполнение каталога товарами;
- `model-catalog:set-current-product` - установка текущего товара из модели каталога для подробного рассмотрения;
- `render:card-catalog-select` - выбор товара из каталога для подробного рассмотрения;
- `render:card-preview-purchase` - добавление/удаление товара из корзины в `Gallery`;
- `render:card-basket-delete` - удаление товара из корзины в `BasketView`;
- `model-buyer:data-changed` - изменение полей в формах.
