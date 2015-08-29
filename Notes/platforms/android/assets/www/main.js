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
//tx.executeSql('DROP TABLE IF EXISTS Notes')
tx.executeSql('CREATE TABLE IF NOT EXISTS Notes (id integer primary key, Note text, Date integer, Colour text)');
var note=document.getElementById('txtinput').value;
var date=document.getElementById('dateinput').value;
var colors=document.getElementById('colorinput').value;
	
if(note=='')
    {
       queryDB(tx);
    }
else{
	console.log(colors);
	tx.executeSql('INSERT INTO Notes (Note, Date, Colour) VALUES (?,?,?)', [note, date, colors]);
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
	console.log(id1);
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
 document.getElementById("output").innerHTML += "<table id='newTasks' class='newTasks' onmousedown='deleterow(this);' ><tr id='editable'><td>"/*+ results.rows.item(i).id*/ +  "</td><td>" +results.rows.item(i).Note +  "</td><td></td><td>" + results.rows.item(i).Date + /*results.rows.item(i).Colour +*/ "</td><td>" + "</td></tr></table>";
 document.getElementById('newTasks').setAttribute('id',x);
 document.getElementById(x).style.background = results.rows.item(i).Colour;
 } 
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
