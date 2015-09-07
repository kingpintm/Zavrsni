var id1;
document.addEventListener("deviceready", opendbs, false);

function opendbs()
{  
 var db = window.sqlitePlugin.openDatabase("dbnotes", "1.0", "Notes", -1);
    console.log("baza otvorena");
 db.transaction(populateDB, errorCB, successCB);

}

// create table
function populateDB(tx) {
tx.executeSql('DROP TABLE IF EXISTS Category')
tx.executeSql('CREATE TABLE IF NOT EXISTS Notes (id integer primary key, Note text, Date integer, Colour text)');
tx.executeSql('CREATE TABLE IF NOT EXISTS Category (id integer primary key, Category text)');
tx.executeSql('CREATE TABLE IF NOT EXISTS Notes_Category (id integer primary key, id id_note, id id_category)');


tx.executeSql('INSERT IGNORE INTO Category(Category) VALUES (?,?,?)', ['private', 'home', 'work']);


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
	
	tx.executeSql('INSERT INTO Notes (Note, Date, Colour) VALUES (?,?,?)', [note, date, colors]);
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
 tx.executeSql("SELECT id, Note, Date, Colour from Notes;", [], querySuccess, errorCB);
}


// Display the results
function querySuccess(tx, results) {
document.getElementById("output").innerHTML="";
 var len = results.rows.length;
	
 for (var i = 0; i < len; i++) 
 {	
 var x = results.rows.item(i).id;
 document.getElementById("output").innerHTML += "<table id='newTasks' class='newTasks' onmousedown='deleterow(this);' ><tr id='editable'><td>"/*+ results.rows.item(i).id*/ +  "</td><td>" +results.rows.item(i).Note +  "</td><td></td><td>" + results.rows.item(i).Date + /*results.rows.item(i).Category + */"</td><td>" + "</td></tr></table>";
 document.getElementById('newTasks').setAttribute('id',x);
 document.getElementById(x).style.background = results.rows.item(i).Colour;
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
var  category_id = tx.executeSql("SELECT id_note, id_category from Notes_Category WHERE id_category like?;"[select_id], querySuccess, errorCB)
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
}

function new_note() {
if(document.getElementById("notes_new").style.visibility == "hidden")
{
document.getElementById("notes_new").style.visibility="visible";
document.getElementById("segment_note").style.visibility="hidden";
document.getElementById('colorinput').value="#F9EFAF";
}
else
{
document.getElementById("notes_new").style.visibility="hidden";
}
}
