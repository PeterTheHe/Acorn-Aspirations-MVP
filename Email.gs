function emailCreator (projectId, mentorEmail, message){

  var email = getEmailFromProjectID(projectId);
  var body = "Hi " + getNameFromEmail(email) + ","
              + "<br/><br/>"
              + "A member of our community has taken notice of your project (yay!) and has sent you the following message:"
              + "<br/><br/> <i>"
              + message
              + "</i> <br/><br/>"
              + "Feel free to email back on " + mentorEmail + "! And don't forget to stay safe - don't share addresses or personal info! <br/><br/> Best Wishes <br/>"
              + "Acorn Aspirations"
              + "<br/><br/>"
              + "We are dedicated to your safety - if you feel that this email is abusive, please forward it to hello@acornaspirations.com and we will deal with it.";

  MailApp.sendEmail({
     to: email,
     subject: "Collaboration - " + getProjectFromProjectID(projectId),
     htmlBody: body});
  
  return "success";
  
}