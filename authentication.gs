function sendAuthEmail(email) {
  if (getUserFromEmail(email) != "unauthorised"){
    
    //Generate and log the key
    var key = makeKey();
    logKey(email, key);
    
    //Email the key to the user
    MailApp.sendEmail({
      to: email,
      name: 'Acorn',
      subject: "Authenticate Yourself!",
      htmlBody: "<!doctype html><html><body>Hi. <br/> Your key is " + key + "</body></html>"
    });
    
    return "Check your inbox.";
  }
  else
  {
   return "You entered an unauthorised email address!"; 
  }
}

function deleteOldKeys (){
  
  
  var sheetName = "Acorn Keys Distributed";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
    file = files.next(); 
  } else {
    return "";
  }
  
  var data = SpreadsheetApp.openById(file.getId()).getActiveSheet().getDataRange().getValues();
  var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  var comparison = formattedDate.substring(0, 14);
  
  
  //Check if the key's expired
  for (var i = 1; i < data.length; i++){
    
     if (data [i][3] == "No"){
          if (data [i][0].substring(0, 14) != comparison){
              SpreadsheetApp.openById(file.getId()).getActiveSheet().deleteRow(i + 1); //rows start at 1 for some reason
          }
     }    

  }
  
}

function makeKey()
{
    var text = "";
    var possible = "1234567890";

    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function checkUserKey (key){
                                                                    
  var sheetName = "Acorn Keys Distributed";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
   file = files.next(); 
  } else {
    logActivity ("Can't Find Keys File!");
    return "invalid";
  }

  var data = SpreadsheetApp.openById(file.getId()).getActiveSheet().getDataRange().getValues();

  //Check if the key's legit
  for (var i = 1; i < data.length; i++){
     if (data [i][2] == key){
        return "valid";
     }
  }
  return "invalid";
                                                                    
}

function checkUserOwnsProject (key, projectId){
                                                                    

  var email = getEmailFromAuth(key);
  
  if (email == "Email"){
   return "invalid"; 
  }
  
  var sheetName = "Projects";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
   file = files.next(); 
  } else {
    logActivity ("Can't Find Projects File!");
    return "invalid";
  }

  data = SpreadsheetApp.openById(file.getId()).getActiveSheet().getDataRange().getValues();
  
  //Check if the email works for project
  for (var i = 1; i < data.length; i++){
     if (data [i][0] == projectId){
       if (data[i][9] == email){
        return "valid"; 
       }
       else
       {
         return "invalid";
       }
     }
  }
  
  return "invalid";
                                                                    
}


function logKey (email, key){

  var sheetName = "Acorn Keys Distributed";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
    file = files.next(); 
  } else {
    return "";
  }
  
  var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  SpreadsheetApp.openById(file.getId()).getActiveSheet().appendRow([formattedDate, email, key, "No"]);
  
  
}

function createPersistentKey (email){

  var sheetName = "Acorn Keys Distributed";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
    file = files.next(); 
  } else {
    return "";
  }
  
  var key = makeKey() + '' + makeKey();
  
  var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  SpreadsheetApp.openById(file.getId()).getActiveSheet().appendRow([formattedDate, email, key, "Yes"]);
  
  return key;
  
}

function createPersistentKeyLogin (key, email){ //Slightly Adapted for Logins

  //Check if the first temp key is correct
  
  
  var sheetName = "Acorn Keys Distributed";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
    file = files.next(); 
  } else {
    return "";
  }
  
  if (checkUserKey(key) == "valid"){
  
    var key = makeKey() + '' + makeKey();
  
    var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
    SpreadsheetApp.openById(file.getId()).getActiveSheet().appendRow([formattedDate, email, key, "Yes"]);
  
    return key;
    
  }
  
  return "invalid";
  
}

function removeKey (key, ignorePersistent){

  var sheetName = "Acorn Keys Distributed";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
    file = files.next(); 
  } else {
    return "";
  }
  
   var data = SpreadsheetApp.openById(file.getId()).getActiveSheet().getDataRange().getValues();
  
  //Check if the key's legit
  for (var i = 1; i < data.length; i++){
     if (data [i][2] == key){
       if (data[i][3] == "No"){
          SpreadsheetApp.openById(file.getId()).getActiveSheet().deleteRow(i + 1); //rows start at 1 for some reason
       }
       else
       {
         if (data[i][3] == "Yes" && !ignorePersistent){
           SpreadsheetApp.openById(file.getId()).getActiveSheet().deleteRow(i + 1); //rows start at 1 for some reason
         }
       }
     }
  }

    
}

function getEmailFromAuth (key){
 
  var sheetName = "Acorn Keys Distributed";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
    file = files.next(); 
  } else {
    return "";
  }
  
   var data = SpreadsheetApp.openById(file.getId()).getActiveSheet().getDataRange().getValues();
  
  //Find it the key and return its associated email
  for (var i = 1; i < data.length; i++){
     if (data [i][2] == key){
          return data[i][1];
     }
  }
  
  return "Email";

  
}

function getNameFromEmail (email){

  
  var sheetName = "Logins";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
    file = files.next(); 
  } else {
    return "";
  }
  
   var data = SpreadsheetApp.openById(file.getId()).getActiveSheet().getDataRange().getValues();
    
  //Find it the email and return its associated name
  for (var i = 1; i < data.length; i++){
     if (data [i][2] == email){
          return data[i][0];
     }
  }

  return "User";
  
}

function getNameFromAuth (key){
  
  //much functional much wow
  return getNameFromEmail(getEmailFromAuth(key));
  
}

function logOut (key){
  
  removeKey (key, false);
  
}


