Universal remote for pebble
===============

Универсальная утилита для pebble, написанная с применением фреймворка pebble.js
Предоставляет простой способ создать многоуровневое меню с возможностю дергать какие либо урлы (пока только GET запросы)  

Для работоспособности необходимо в настройках указать ссылку на JSON массив с подготовленной иерархией меню. Меню целиком помещается в кеш, чтобы перечитать иерархию необходимо зайти в настройки и нажать SAVE.
> Как вариант еще можно удерживать кнопку SELECT затем после вибрации выйти и снова зайти в приложение.

## Типы элементов
Поддерживается 3 типа элементов - `url`, `json`, `card` и `menu`
### url
Просто дергает урл и выдает `ok` в случае успеха или `error` в случае неудачи
```php
array(
    'name'=>'url test',
    'type'=>'url',
    'value'=>'http://kilex.ru'
    ),
```
### json
Тоже самое что и url, но ждет от сервера json ответа и выдает поле `result` вместо `ok`
```php
array(
    'name'=>'json test',
    'type'=>'json',
    'value'=>'http://kilex.ru/pebble/json.php'
    ),
```
### card
Работает примерно как json, только результат выводит на отдельном экране и кроме `result` принимает еще `title`
```php
array(
    'name'=>'card test',
    'type'=>'card',
    'value'=>'http://kilex.ru/pebble/json.php',
    'icon'=>'images/icon_home.png'
    ),
```
### menu
Позволяет организовать иерархию - вызывает submenu, данные для которого берутся из одноименного поля массива `submenu`. Поддерживается многоуровневая иерархия.

## Пример иерархии

```php
$result=array(
'main'=>array(
    array(
        'name'=>'yandex test',
        'type'=>'url',
        'value'=>'http://ya.ru'
        ),
    array(
        'name'=>'kilex.ru test',
        'type'=>'url',
        'value'=>'http://kilex.ru'
        ),
    array(
        'name'=>'json test',
        'type'=>'json',
        'value'=>'http://kilex.ru/pebble/json.php'
        ),
    array(
        'name'=>'card test',
        'type'=>'card',
        'value'=>'http://kilex.ru/pebble/json.php',
        'icon'=>'images/icon_home.png'
        ),
    array(
        'name'=>'date json',
        'type'=>'json',
        'value'=>'http://kilex.ru/pebble/aux.php',
        ),
    array(
        'name'=>'date card',
        'type'=>'card',
        'value'=>'http://kilex.ru/pebble/aux.php',
        ),
    array(
        'name'=>'menu',
        'type'=>'menu',
        'value'=>'menu1'
        ),
    array(
        'name'=>'error test',
        'type'=>'url',
        'desription'=>'last record',
        'value'=>'http://kilex.ru/pebble/test.php'
        )

    ),
  'submenu'=>array(
    'menu1'=>array(
        array(
            'name'=>'one url',
            'type'=>'url',
            'value'=>'http://kilex.ru/pebble/json.php'
        ),
        array(
            'name'=>'two json',
            'type'=>'json',
            'value'=>'http://kilex.ru/pebble/json.php'
        ),
        array(
            'name'=>'menu2 in',
            'type'=>'menu',
            'value'=>'menu2'
        )
    ),
    'menu2'=>array(
        array(
            'name'=>'menu2 one url',
            'type'=>'url',
            'value'=>'http://kilex.ru/pebble/json.php'
        ),
        array(
            'name'=>'menu2 two json',
            'type'=>'json',
            'value'=>'http://kilex.ru/pebble/json.php'
        )
    )
);

echo json_encode($result);
    
```
