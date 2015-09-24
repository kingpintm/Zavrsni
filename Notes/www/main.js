var cnt = false;
var id1;
var id2;
document.addEventListener("deviceready", opendbs, false);
document.addEventListener("deviceready", addcategory, false);


function deletecat(x)
{
   var r = confirm("Are you sure you want to delete this row?");
   if (r == true) {
	 var db = window.sqlitePlugin.openDatabase("dbnotes", "1.0", "Notes", -1);
	
 id2 = x.id;
  db.transaction(deletecatlist,errorCB, successCB);
 } 

}

function deletecatlist(tx)
{
	tx.executeSql('DELETE FROM Category WHERE id like ?',[id2]);
	addcategory();
}

function showcatlist()
{
	addcategory();
}
function showcat()
{
	document.getElementById("notes_new").style.visibility="hidden";
	document.getElementById('catname').style.visibility="visible"
	document.getElementById('cattekst').style.visibility="visible"
	document.getElementById('catsubmit').style.visibility="visible"
	document.getElementById("new_cat").style.visibility="visible";
	addcategory();
}

function addcategory()
{
var db = null;
db = window.sqlitePlugin.openDatabase("dbnotes", "1.0", "Notes", -1);
 db.transaction(categoryDB, errorCB, successCB);
}

function categoryDB(tx)
{
	

	var selectcat=document.getElementById('catname').value;	
	if(selectcat == "")
	{
			queryCat(tx);
	}
	else{
	tx.executeSql('INSERT INTO Category (category_name) VALUES (?)', [selectcat]);
	document.getElementById('catname').value = "";
		queryCat(tx);
}}


function queryCat(tx) {
	
	if(cnt ===true)
	{
		 tx.executeSql("SELECT id, category_name from Category;", [], catSuccess, errorCB);
	}
	else{
	 tx.executeSql('INSERT  INTO Category(category_name) VALUES (?)', ["Private"]);
	 	 tx.executeSql('INSERT  INTO Category(category_name) VALUES (?)', ["Home"]);
		 	 tx.executeSql('INSERT  INTO Category(category_name) VALUES (?)', ["Work"]);
cnt = true;
 tx.executeSql("SELECT id, category_name from Category;", [], catSuccess, errorCB);
}
}


function catSuccess(tx, results) {

	 var len = results.rows.length;
	selectrows= document.getElementById("select");
	selectrows1= document.getElementById("selects");

	for (var i = 0; i < len; i++) 
	  {
		var y=  document.getElementById("select");
		
		var option = document.createElement("option");
		option.text = results.rows.item(i).category_name;
		y.add(option);
	
	 }  
for (var i = 0; i < len; i++) 
	  {
	
		var z=  document.getElementById("selects");
		var option = document.createElement("option");
		option.text = results.rows.item(i).category_name;
		
		z.add(option);
	 }  
	
for (var j = 0;j < len; j++) 
 {	
  	

 var jid = results.rows.item(j).id;


document.getElementById("container").innerHTML += "<li id='liid' onclick='deletecat(this);'>" + results.rows.item(j).category_name + "</li>"
document.getElementById('liid').setAttribute('id',jid);


    } 

  	var usedNames = {};
	$("select > option").each(function () {
		if(usedNames[this.text]) {
			$(this).remove();
		} else {
        usedNames[this.text] = this.value;
		}
});
 
}

function catend(){

	document.getElementById("notes_new").style.visibility="visible";
	document.getElementById('catname').style.visibility="hidden"
	document.getElementById('cattekst').style.visibility="hidden"
	document.getElementById('catsubmit').style.visibility="hidden"
	document.getElementById("new_cat").style.visibility="hidden";
	addcategory();
	
}





function opendbs()
{  
 var db = window.sqlitePlugin.openDatabase("dbnotes", "1.0", "Notes", -1);
    console.log("baza otvorena");
 db.transaction(populateDB, errorCB, successCB);

}

// create table
function populateDB(tx) {
//tx.executeSql('DROP TABLE IF EXISTS Category')
tx.executeSql('CREATE TABLE IF NOT EXISTS Notes (id integer primary key, Note text, Date integer, Colour text, Category text, Checked text)');
	tx.executeSql('CREATE TABLE IF NOT EXISTS Category (id integer primary key, category_name text)');
tx.executeSql('CREATE TABLE IF NOT EXISTS Notes_Category (id integer primary key, id id_note, id id_category)');



var checkbox = document.getElementById("todo").checked;
var note=document.getElementById('txtinput').value;
var date=document.getElementById('dateinput').value;
var colors=document.getElementById('colorinput').value;
var select=document.getElementById('select').value;	

if(note=='')
    {
       queryDB(tx);
    }
else{
	
	var category= tx.executeSql('SELECT Category from Category WHERE id like ?', [select]);
	var category_id= tx.executeSql('SELECT id from Category WHERE Category like ?', [category]);
	var note_id= tx.executeSql('SELECT id from Note WHERE Note like ?', [note]);
	
	
	tx.executeSql('INSERT INTO Notes (Note, Date, Colour, Category, Checked) VALUES (?,?,?,?,?)', [note, date, colors, select, checkbox]);
	tx.executeSql('INSERT INTO Notes_Category (id_note, id_category) VALUES (?,?)', [note_id,category_id]);
	queryDB(tx);
}

	document.getElementById('txtinput').value = "";
	document.getElementById('dateinput').value ="";
	document.getElementById('colorinput').value ="";
	document.getElementById("notes_new").style.visibility="hidden";
	document.getElementById("segment_note").style.visibility="visible";
}




function deleterow(x)
{
   var r = confirm("Are you sure you want to delete this note?");
    if (r == true) {
	 var db = window.sqlitePlugin.openDatabase("dbnotes", "1.0", "Notes", -1);
	 console.log(x.id);
 id1 = x.id;
  db.transaction(deletenote,errorCB, successCB);
 } 
else{
var elemText = document.getElementById('editable');
elemText.setAttribute("contenteditable", "true");
}
}

function deletenote(tx)
{

	tx.executeSql('DELETE FROM Notes WHERE id = ?', [id1]);
	queryDB(tx);
 
  
}

// form the query 
function queryDB(tx) {
 tx.executeSql("SELECT id, Note, Date, Colour, Category, Checked from Notes;", [], querySuccess, errorCB);
}


// Display the results
function querySuccess(tx, results) {
var slika = "<img src=close.png>";
 var len = results.rows.length;
document.getElementById("output").innerHTML="";
 for (var i = 0; i < len; i++) 
 {	
var x = results.rows.item(i).id;
if(results.rows.item(i).Checked === "true")
{
	 document.getElementById("output").innerHTML += "<table id='newTasks' class='newTasks' onmousedown='deleterow(this)'; ><tr id='editable'><td><li>" +results.rows.item(i).Note +  "</td><td></td><td>" + results.rows.item(i).Date +"</li></td><td>" + slika + "</td></tr></table>";
}
 else{
  document.getElementById("output").innerHTML += "<table id='newTasks' class='newTasks' onmousedown='deleterow(this)'; ><tr id='editable' ><td>" +results.rows.item(i).Note +  "</td><td></td><td>" + results.rows.item(i).Date +"</td><td>" + slika + "</td></tr></table>";
 }
 document.getElementById('newTasks').setAttribute('id',x);
 document.getElementById(x).style.background = results.rows.item(i).Colour;
  var time = results.rows.item(i).Date;
 var category = results.rows.item(i).Category;
 var notetxt =  results.rows.item(i).Note;
  var d = new Date();
    var n = d.getTime();
	

 console.log(time)
 if (time == null || time == undefined || time == "")  
 {
	 continue;
 }
 else{
	    var da = new Date(time);
    var na = da.valueOf();
	 if (n < na)
	 {
 scheduleDelayed(x,time,category,notetxt);
	 }
}
 }
 }



function search_note()
{
		 var db = window.sqlitePlugin.openDatabase("dbnotes", "1.0", "Notes", -1);
	     db.transaction(search,errorCB, successCB);
		
}

function search(tx)
{
	search_text = document.getElementById('search').value;
	tx.executeSql("SELECT id, Note, Date, Colour from Notes WHERE Note like ?;", [search_text], querySuccess, errorCB);
	if(!search_text){
		tx.executeSql("SELECT id, Note, Date, Colour from Notes;", [], querySuccess, errorCB);
	}

}



function select_note()
{
	var cnt
	var db 
	cnt = 0
	if (cnt == 1)
	{db = null}
else{
   db = window.sqlitePlugin.openDatabase("dbnotes", "1.0", "Notes",0);
	db.transaction(select,errorCB, successCB);
	cnt = 1;
	}
}

function select(tx)
{
	selections = document.getElementById('selects').value;
if(selections=='All')
{
		queryDB(tx);
}
else{
	var select_id = tx.executeSql("SELECT id, category_name from Category WHERE category_name like ?;", [selections], querySuccess, errorCB);
	var  category_id = tx.executeSql("SELECT id_note, id_category from Notes_Category WHERE id_category like?;"[results.rows.item(i).Category;], querySuccess, errorCB)
	tx.executeSql("SELECT id, Note, Date, Colour from Notes WHERE id like ?;", [category_id], querySuccess, errorCB);	

	}
	tx = null;

}

// Transaction error callback
function errorCB(err) {
console.log("Erroressing SQL: " + err.code);

}
// Success error callback
function successCB() {
}


function show_note() {
		
if(document.getElementById("segment_note").style.visibility == "hidden")
{
document.getElementById("segment_note").style.visibility="visible";
document.getElementById("notes_new").style.visibility="hidden";

}
else
{
document.getElementById("segment_note").style.visibility="hidden";
}
opendbs()
}

function new_note() {
if(document.getElementById("notes_new").style.visibility == "hidden")
{
document.getElementById("notes_new").style.visibility="visible";
document.getElementById("segment_note").style.visibility="hidden";
	
document.getElementById('colorinput').value="#F9EFAF";
addcategory();
}
else
{
document.getElementById("notes_new").style.visibility="hidden";
addcategory();
}
}






            var id = 1, dialog;

            callback = function () {
                cordova.plugins.notification.local.getIds(function (ids) {
                    showToast('IDs: ' + ids.join(' ,'));
                });
            };

            showToast = function (text) {
                setTimeout(function () {
                    if (device.platform != 'windows') {
                        window.plugins.toast.showShortBottom(text);
                    } else {
                        showDialog(text);
                    }
                }, 100);
            };

            showDialog = function (text) {
                if (dialog) {
                    dialog.content = text;
                    return;
                }

                dialog = new Windows.UI.Popups.MessageDialog(text);

                dialog.showAsync().done(function () {
                    dialog = null;
                });
            };

  
		
		
                   scheduleDelayed = function (x,time,category,notetxt) {
			   var d = new Date(time);
    var n = d.valueOf();

    document.getElementById("sched").innerHTML = n;


                var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';

                cordova.plugins.notification.local.schedule({
                    id: x,
                    title: category,
					text: notetxt,
                    at: n,
                    sound: sound,
                    badge: 12
                });
            };
			
			
			    update = function () {
                cordova.plugins.notification.local.update({
                    id: 1,
                    text: 'Updated Message 1',
                    json: { updated: true }
                });
            };

            updateInterval = function () {
                cordova.plugins.notification.local.update({
                    id: 1,
                    text: 'Updated Message 1',
                    every: 'minute'
                });
            };
			
			  setDefaultTitle = function () {
                cordova.plugins.notification.local.setDefaults({
                    title: 'New Default Title'
                });
            };
			
			  document.addEventListener('deviceready', function () {

                cordova.plugins.notification.local.on('schedule', function (notification) {
                    console.log('onschedule', arguments);
                    // showToast('scheduled: ' + notification.id);
                });

        
            }, false);
			
			  app.initialize();