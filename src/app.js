/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
//var allMenu = [];
var Settings = require('settings');
var Vibe = require('ui/vibe');
//var Vector2 = require('vector2');

var menuUI = new UI.Menu({
  sections: [{
    title: 'Remoter'
  }]
});

showMainMenu();

// Модуль конфигуряния (пеечитывает настройки в момент сохранения или если отсутсвуют в памяти телефона)
Settings.config(
  { url: 'http://kilex.ru/pebble/settings.php?set_url='+Settings.option('server_url') },
  function(e) {
    getSettings();
    // Show the raw response if parsing failed
    if (e.failed) {
      console.log('failed:'+e.response);
    }
  }
);

function getSettings()
{
    if (!Settings.option('server_url')) {
      Settings.option('server_url','http://kilex.ru/pebble/list.json');
    }
    ajax(
      {
        url: Settings.option('server_url'),
        type: 'json'
      },
      function(data) {
        // Получили дерево меню, сохранили.
        console.log('saved');
        Settings.option('menu',data);
      },
      function(error) {
        console.log(error);
      }
    );
  
}

function loadMenu()
{
//  var options = Settings.option();
//  console.log("stringify: "+JSON.stringify(options));
  if (Settings.option('menu')) {
    console.log("from cache");
  }
  else {
    console.log("not in cache");
    getSettings();   
  }
  return Settings.option('menu');
}

function showMainMenu() {
  // Затягиваем массив с менюшкой из настроек или с урла
  var menuArr = loadMenu();

/*    var menuUI = new UI.Menu({
    sections: [{
      title: 'Remoter',
      items: [{
        title: 'First Item',
        subtitle: 'Some subtitle',
        icon: 'images/icon_home.png'
      }]
    }]
  });*/
  
  menuUI.show();

  // Генерим главное меню
  var mainMenu=menuArr.main;
  generateMenu(menuUI,mainMenu);
}

function generateMenu(menuObj,menuArr) {
  // Наливает итемы в объект (в нулевую секцию)
    for(var item in menuArr)
    {
      menuObj.item(0, item, { title: menuArr[item].name, subtitle: menuArr[item].desription, type: menuArr[item].type, value: menuArr[item].value, icon: menuArr[item].icon});
      //console.log('generator',item, menyArr[item].name);
    }

  menuObj.on('select', function(e) { 
    // Кликалка на объекты меню
    itemSelected(e, menuObj);
  });
  menuObj.on('longSelect', function(e) { 
    console.log('reload');
    Vibe.vibrate('short');
    //menuObj.items(0, {});
    getSettings();
  });
  menuObj.on('click', 'back', function(e) { 
    //  При выходе из сабменю - уничтожаем его.
    menuObj.remove();
  });
}

function itemSelected(e,menuObj) {
//  console.log('Selected item: ' + e.section + ' ' + e.item);
//  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
//  console.log('The item is titled "' + e.item.title + '" value=' + e.item.value + ' type=' + e.item.type);
  if (e.item.type==='url') {
    // Дергалка урлов. результат заменяет дескрипшен - ok/error
    menuObj.item(e.sectionIndex, e.itemIndex, {subtitle: 'getting...'});
    ajax(
      {
        url: e.item.value,
        //type: 'json'
      },
      function(data) {
        //console.log('url getted:'+data);
        menuObj.item(e.sectionIndex, e.itemIndex, {subtitle: 'ok'});
      },
      function(error) {
        console.log(error);
        menuObj.item(e.sectionIndex, e.itemIndex, {subtitle: 'error'});
      }
    );
  }
  if (e.item.type==='json') {
    // Тоже самое что дергалка урлов, но вместо ока выводит результат json -> result
    menuObj.item(e.sectionIndex, e.itemIndex, {subtitle: 'getting...'});
    ajax(
      {
        url: e.item.value,
        type: 'json'
      },
      function(data) {
        console.log('url getted:'+data);
        menuObj.item(e.sectionIndex, e.itemIndex, {subtitle: data.result});
      },
      function(error) {
        console.log(error);
        menuObj.item(e.sectionIndex, e.itemIndex, {subtitle: 'error'});
      }
    );
  }
  if (e.item.type==='menu') {
    // Подменю - указываем имя подменю
    console.log("openning submenu "+e.item.value);
    var submenu = new UI.Menu({
      sections: [{
        title: e.item.value
      }]
    });
    var menuArr = loadMenu();
    var submenyarr=menuArr.submenu[e.item.value];
    generateMenu(submenu,submenyarr);
    submenu.show();
  }
  if (e.item.type === 'card') {
    // Карточка с результатами из json
    var card = new UI.Card({
      title: 'title',
      body: 'loading...',
      scrollable: true
    });
    card.show();
    ajax({ url: e.item.value, type: 'json' },
      function(data) {
        card.body(data.result.toString());
        card.title(data.title.toString());
      },
      function(error) {
        console.log(error);
        card.body('error');
      }
    );
  /*  card.on('click', 'back', function(e) { 
    //  При выходе из сабменю - уничтожаем его.
      this.remove();
    });
  }*/
  } 
}
