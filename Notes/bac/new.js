var id1;

document.addEventListener("deviceready", opendbs, false);


function opendbs()
{  
 var db = window.sqlitePlugin.openDatabase("dbnotes", "1.0", "Noter", -1);
    console.log("baza otvorena");
 db.transaction(populateDB, errorCB, successCB);

}

// create table
function populateDB(tx) {
 //tx.executeSql('DROP TABLE IF EXISTS Notes');
 tx.executeSql('CREATE TABLE IF NOT EXISTS Notes (id integer primary key, Note text, Date integer)');
   var note=document.getElementById('txtinput').value;
    var date=document.getElementById('dateinput').value;
if(note=='')
    {
       queryDB(tx);
    }
    else{
 tx.executeSql('INSERT INTO Notes (Note, Date) VALUES (?,?)', [document.getElementById('txtinput').value,document.getElementById('dateinput').value]);
 
  queryDB(tx);

   }


   
}




function deleterow(x)
{
 var r = confirm("Are you sure you want to delete this note?");
    if (r == true) {
	 var db = window.sqlitePlugin.openDatabase("dbnotes", "1.0", "Noter", -1);
 console.log("Marina je extra super: " + x.id);
 id1 = x.id;
 console.log("Auto je extra super: " + x.id);
 db.transaction(brisirow,errorCB, successCB);
 } else {
    
    }
		
}

function brisirow(tx)
{
 tx.executeSql('DELETE FROM Notes WHERE id = ?', [id1]);
 history.go(0);

}

// form the query 
function queryDB(tx) {
 tx.executeSql("SELECT id, Note, Date from Notes;", [], querySuccess, errorCB);

}

// Display the results
function querySuccess(tx, results) {
document.getElementById("output").innerHTML="";

}



// Transaction error callback
function errorCB(err) {
console.log("Erroressing SQL: " + err.code);
}
// Success error callback
function successCB() {
}