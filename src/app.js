/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
//var allMenu = [];
var Settings = require('settings');
//var Vector2 = require('vector2');

var menuUI = new UI.Menu({
  sections: [{
    title: 'Remoter'
  }]
});

showMainMenu();

Settings.config(
  { url: 'http://kilex.ru/pebble/settings.php?set_url='+Settings.option('server_url') },
  function(e) {
    console.log('configuration complete:');
    getSettings();

    // Show the parsed response
    // console.log(JSON.stringify(e.options));
    
    // Show the raw response if parsing failed
    if (e.failed) {
      console.log('failed:'+e.response);
    }
  }
);

function getSettings()
{
    ajax(
      {
        url: Settings.option('server_url'),
        type: 'json'
      },
      function(data) {
        console.log('full dump:'+data);
        //var sections = data.main;

        //for(var sec in sections)
        //{
        //  var row=sections[sec];
        //  console.log(sec, row.name, row.type, row.value);
        //}
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
  // Готовим секцию

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
/*  for(var item in mainMenu)
    {
      menuUI.item(0, item, { title: mainMenu[item].name, subtitle: mainMenu[item].desription, type: mainMenu[item].type, value: mainMenu[item].value});
      console.log(item, mainMenu[item].name);
    }
  
  menuUI.on('select', function(e) { 
    itemSelected(e, 0);
  });*/
}

function generateMenu(menuObj,menyArr) {
  // Наливает итемы в объект (в нулевую секцию)
    for(var item in menyArr)
    {
      menuObj.item(0, item, { title: menyArr[item].name, subtitle: menyArr[item].desription, type: menyArr[item].type, value: menyArr[item].value});
      //console.log('generator',item, menyArr[item].name);
    }
  
  menuObj.on('select', function(e) { 
    itemSelected(e, menuObj);
  });
  menuObj.on('click', 'back', function(e) { 
    menuObj.remove();
  });
}

function itemSelected(e,menuObj) {
//  console.log('Selected item: ' + e.section + ' ' + e.item);
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '" value=' + e.item.value + ' type=' + e.item.type);
  if (e.item.type==='url') {
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
    console.log("openning submenu "+e.item.value);
    var submenu = new UI.Menu({
      sections: [{
        title: e.item.value
      }]
    });
    var menuArr = loadMenu();
    var submenyarr=menuArr.menues[e.item.value];
    generateMenu(submenu,submenyarr);
    submenu.show();
  }
}