// module.exports.actionName=function(req,res){}

module.exports.home = async function (req, res) {
  try {
    return res.render("home", {
      title: "coding ninja | Home",      
    });
  } catch (error) {
    console.log(error);
    return;
  }
};
