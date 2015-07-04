Project.Models.UserObj = new Project.Classes.Models.User;
    Project.Models.UserObj.fetch().then(function(){
      Project.start();
    });
  
});
});