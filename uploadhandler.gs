var baseUrl = "http://drive.google.com/uc?export=view&id=";

function getImagePermalink(id) {
    return  baseUrl+id; 
}

function createProject(projectName, key, location, category, status, summary, description, photoData, photoFile, skillsRequired, tags, website, facebook, twitter, google, github){
  
  //Important bits of data
  var creatorEmail = getEmailFromAuth(key);
  
  //Create folders to store stuff in 
  var dropbox = "Projects";
  var folder, folders = DriveApp.getFoldersByName(dropbox);
  
  if (folders.hasNext()) { // Checking to see if dropbox exists already.
    folder = folders.next();
  } else {
    folder = DriveApp.createFolder(dropbox);
  } 
    
  //Check if the subject folder (Physics, Chemistry...) exists
  var authorFolder, authorFolders =  folder.getFoldersByName(creatorEmail);
  
  if (authorFolders.hasNext()){ //Check if subject folder exists alread. If not, create a new one.
    authorFolder = authorFolders.next();
  } else {
    authorFolder = folder.createFolder (creatorEmail);
  }
  
  //Create a project folder
  var submittedFolder = authorFolder.createFolder(projectName);// Creates our project's folder within its respective subject folder
  
  //Open the sheet for editing
  
  var sheetName = "Projects";
  var data = findSheet(sheetName);

  var sheetName = "Projects";
  var file, files = DriveApp.getFilesByName(sheetName); //Retrieve the ID
  
  //Check if the doc exists. If it doesn't, return nothing
  if (files.hasNext ()){
    file = files.next(); 
  } else {
    return "";
  }
  
  var sheet = SpreadsheetApp.openById(file.getId()).getActiveSheet();
  var id = sheet.getDataRange().getValues().length;
  
  
  
  //Handle the photo upload
  var contentType = photoData.substring(5,photoData.indexOf(';')), 
    bytes = Utilities.base64Decode(photoData.substr(photoData.indexOf('base64,')+7)), // This bit was totally stolen, who knows what it does
      blob = Utilities.newBlob(bytes, contentType, photoFile); // Grabs metadata then bundles to blob
  var picsFile = {
    title: projectName
  };
  picsFile = Drive.Files.insert(picsFile, blob, { // Uploads the document to Google Drive
    convert: false, // Auto-convert to Google Docs format for collaboration
  });

  var photoFileId = picsFile.id;
  var photoDriveFile = DriveApp.getFileById(photoFileId); // retrieve file in DriveApp scope.
  
  //Move the photo to be with everything else
  submittedFolder.addFile(photoDriveFile);
  DriveApp.removeFile(photoDriveFile);
  
  file = submittedFolder.getFilesByName(projectName).next();
  file.setSharing(DriveApp.Access.ANYONE, DriveApp.Permission.VIEW);
  
  
  //Create a new project
  
  sheet.appendRow([id,
                   projectName, 
                   getNameFromEmail(creatorEmail),
                   category,
                   summary,
                   description,
                   skillsRequired,
                   0,
                   status,
                   creatorEmail,
                   "n/a",
                   website,
                   getImagePermalink(photoFileId),
                   location,
                   tags,
                   facebook,
                   twitter,
                   google,
                   github
                   ]);
  
  return "success";
  
}