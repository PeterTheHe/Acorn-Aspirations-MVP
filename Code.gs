function doGet(e) {
  
  deleteOldKeys(); //get rid of keys older than 1 hour
  
  var keyParam = e.parameters.key; //The key the user provides
  var manageUser = e.parameters.manage; //Are we in management mode?
  var currentproject = e.parameters.currentproject; //the current project we're editing
  var createproject = e.parameters.createproject; //Are we creating a project?
  
  if (keyParam == undefined){ //if no key is provided send them to the auth page
      return HtmlService
         .createTemplateFromFile('login') // Change to login for production, main to disable auth for dev
         .evaluate(); 
  }
  
  if (checkUserKey (keyParam) == "valid"){ // check if the key is valid
    
    removeKey(keyParam, true); //removeKey (keyName, ignorePersistentKeys);
    
    if (createproject != undefined){
       
          //Create a project!
          return HtmlService
          .createTemplateFromFile('createproject')
          .evaluate()
          .setTitle('Create a Project')
        
     }
    
    
    if (manageUser == undefined){
    
    return HtmlService
      .createTemplateFromFile('main')
      .evaluate()
      .setTitle('Acorn'); 
      
    }
    else
    {
      if (currentproject != undefined){
        //Edit a certain project
        if (checkUserOwnsProject (keyParam, currentProject) == "valid"){
          return HtmlService
          .createTemplateFromFile('editproject')
          .evaluate()
          .setTitle('Acorn'); 
        }
      }
      else
      {
       //show general project screen
          return HtmlService
          .createTemplateFromFile('projectmanager')
          .evaluate()
          .setTitle('Acorn'); 
      } 
    }
  }
  else{ //They're using an invalid key
    return HtmlService
      .createTemplateFromFile('unauthorised')
      .evaluate(); 
  }
  
  logActivity ("Logged In");

}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}


function logActivity (activity){
  
  var sheetName = "Acorn Logs";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
   file = files.next(); 
  } else {
    return "";
  }
  
  var formattedDate = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd'T'HH:mm:ss'Z'");
  SpreadsheetApp.openById(file.getId()).getActiveSheet().appendRow([formattedDate, Session.getActiveUser().getEmail(), activity]);
  
}


                                                                    
function getUserFromEmail (email){
                                                                    
  var sheetName = "Logins";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
   file = files.next(); 
  } else {
    return "";
  }

  Logger.log(email);
  var data = findSheet(sheetName);
  for (var i = 1; i < data.length; i++){
     if (data [i][2].toString().toLowerCase().trim() == email.toString().toLowerCase().trim()){
        return data[i][0];
     }
  }
  return "unauthorised";
                                                                    
}

function getProjectsByUser (id){
 
  var email = getEmailFromAuth(id);
  
  var sheetName = "Projects";
  
  var data = findSheet(sheetName);
  var labels=new Array;
  
  for (var i = 1; i < data.length; i++) {
    if (checkUserOwnsProject(id, data[i][0])){
       labels.push( [data[i][0], data[i][1], data[i][7]] ); //return projectid, name and collaborator number
    }
  }
  return labels;
}

function findSheet(sheetname) {
  var file, files = DriveApp.getFilesByName(sheetname); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
   file = files.next(); 
  } else {
    return "";
  }
  
  var data = SpreadsheetApp.openById(file.getId()).getActiveSheet().getDataRange().getValues();
  
  return data;
}

function getEmailFromProjectID (id){
 
  var sheetName = "Projects";
  var data = findSheet(sheetName);
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == id){
      return data[i][9];
    }
  }
  return "Not Found";
  
}

function getProjectFromProjectID (id){
 
  var sheetName = "Projects";
  var data = findSheet(sheetName);
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == id){
      return data[i][1];
    }
  }
  return "Not Found";
  
}

function updateCollaborators (id, number, key){
 
  var sheetName = "Projects";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
   file = files.next(); 
  } else {
    return "";
  }
  
  var sheet = SpreadsheetApp.openById(file.getId()).getActiveSheet();
  
  if (checkUserOwnsProject(key, id) == "invalid"){
    return "Unauthorised";
  }
  
  for (var i = 1; i < data.length; i++) {
    if (data[i][0] == id){
      var cell = sheet.getRange("H" + (i + 1));
      cell.setValue(number);
      return "success"
    }
  }
  
  return "Error";
  
}
